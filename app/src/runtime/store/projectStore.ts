import { Project, ProjectSnapshot, StationIdea } from '../../domain/project';
import { newId } from '../../domain/id';
import type { ProfileId } from '../../domain/profile';
import { DEFAULT_PROFILE_ID } from '../../domain/profile';
import {
  generateProjectId,
  getActiveProjectId,
  loadProjectsForProfile,
  saveProject,
  setActiveProjectId,
} from '../storage/local_project_store';
import { recordProjectCreated } from './telemetryStore';
import { getActiveProfileId, subscribe as subscribeToProfileChanges } from './profileStore';

const MAX_PROJECT_NAME = 512;
const MAX_IDEA_TITLE = 60;
const MAX_IDEA_MISSION = 400;
const MAX_IDEA_GOAL = 200;
const MAX_IDEA_STEPS = 3;
const MAX_IDEA_STEP_LENGTH = 140;
const MAX_SNAPSHOTS = 10;

const clamp = (value: string | undefined, max: number): string | undefined => {
  if (typeof value !== 'string') return value;
  return value.length > max ? value.slice(0, max) : value;
};

const clampIdea = (idea?: StationIdea): StationIdea | undefined => {
  if (!idea) return undefined;
  const starterSteps = (idea.starterSteps || [])
    .slice(0, MAX_IDEA_STEPS)
    .map((step) => clamp(step, MAX_IDEA_STEP_LENGTH) || '')
    .filter((step) => step.length > 0);

  return {
    title: clamp(idea.title, MAX_IDEA_TITLE) || 'Untitled Idea',
    mission: clamp(idea.mission, MAX_IDEA_MISSION) || '',
    goal: clamp(idea.goal, MAX_IDEA_GOAL) || '',
    starterSteps,
  };
};

const clampProjectName = (name?: string): string => clamp(name, MAX_PROJECT_NAME) || 'Untitled Project';

const projects = new Map<string, Project>();
let selectedProjectId: string | null = null;
let currentProfileId: ProfileId = getActiveProfileId() ?? DEFAULT_PROFILE_ID;
const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const applyIdeaConstraints = (idea?: StationIdea): StationIdea | undefined => clampIdea(idea);

const loadForProfile = async (profileId: ProfileId) => {
  projects.clear();
  const stored = await loadProjectsForProfile(profileId);
  for (const project of stored) {
    projects.set(project.id, project);
  }
  selectedProjectId = await getActiveProjectId(profileId);
  notify();
};

const initialize = async () => {
  await loadForProfile(currentProfileId);
};

void initialize();
subscribeToProfileChanges(() => {
  const nextProfile = getActiveProfileId() ?? DEFAULT_PROFILE_ID;
  if (nextProfile === currentProfileId) return;
  currentProfileId = nextProfile;
  void loadForProfile(currentProfileId);
});

const registerProject = (project: Project) => {
  projects.set(project.id, project);
  notify();
  void saveProject(currentProfileId, project).catch((error) => {
    console.error('Failed to save project', error);
  });
};

export const registerImportedProject = (project: Project): Project => {
  registerProject(project);
  return project;
};

export const getProjects = (): Project[] => Array.from(projects.values());

export const getProject = (id: string): Project | undefined => projects.get(id);

export const getSelectedProject = (): Project | undefined =>
  selectedProjectId ? projects.get(selectedProjectId) : undefined;

export const selectProject = (id: string | null): void => {
  selectedProjectId = id;
  void setActiveProjectId(currentProfileId, id).catch((error) => {
    console.error('Failed to persist selected project', error);
  });
  notify();
};

export const createProject = (name: string): Project => {
  const id = generateProjectId();
  const now = new Date().toISOString();
  const project: Project = {
    id,
    profileId: currentProfileId,
    name: clampProjectName(name),
    title: clampProjectName(name),
    description: '',
    goal: undefined,
    idea: undefined,
    status: 'draft',
    currentStation: 'idea',
    steps: [],
    reflections: [],
    tests: [],
    archives: [],
    memory: undefined,
    reflect: undefined,
    share: undefined,
    tags: [],
    createdAt: now,
    updatedAt: now,
  };
  registerProject(project);
  recordProjectCreated();
  selectProject(id);
  return project;
};

const cloneEntries = <T extends object>(items?: readonly T[]): T[] => (items ?? []).map((item) => ({ ...item }));

const snapshotStateFromProject = (project: Project): Partial<Omit<Project, 'snapshots'>> => ({
  name: project.name,
  title: project.title,
  description: project.description,
  idea: applyIdeaConstraints(project.idea),
  goal: project.goal,
  status: project.status,
  currentStation: project.currentStation,
  steps: cloneEntries(project.steps),
  reflections: cloneEntries(project.reflections),
  tests: cloneEntries(project.tests),
  archives: cloneEntries(project.archives),
  tags: project.tags ? [...project.tags] : undefined,
  memory: project.memory
    ? {
        entries: cloneEntries(project.memory.entries),
      }
    : undefined,
  reflect: project.reflect
    ? {
        snapshots: cloneEntries(project.reflect.snapshots),
      }
    : undefined,
  share: project.share ? { ...project.share } : undefined,
  updatedAt: project.updatedAt,
  createdAt: project.createdAt,
});

export const addSnapshot = (projectId: string, label: string): ProjectSnapshot | null => {
  const project = projects.get(projectId);
  if (!project) return null;

  const snapshot: ProjectSnapshot = {
    id: newId('snapshot'),
    createdAt: new Date().toISOString(),
    label,
    projectState: snapshotStateFromProject(project),
  };

  const updatedSnapshots = [...(project.snapshots ?? []), snapshot].slice(-MAX_SNAPSHOTS);
  const updatedProject: Project = {
    ...project,
    snapshots: updatedSnapshots,
  };
  registerProject(updatedProject);
  return snapshot;
};

export const updateProject = (id: string, patch: Partial<Project>): Project | undefined => {
  const current = projects.get(id);
  if (!current) return undefined;

  const idea =
    Object.prototype.hasOwnProperty.call(patch, 'idea') ? applyIdeaConstraints(patch.idea) : applyIdeaConstraints(current.idea);

  const updated: Project = {
    ...current,
    ...patch,
    idea,
    profileId: currentProfileId,
    name: clampProjectName(patch.name ?? current.name),
    updatedAt: new Date().toISOString(),
  };

  registerProject(updated);
  return updated;
};

export const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
