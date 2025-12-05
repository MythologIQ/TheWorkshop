import { Project, StationIdea } from '../../domain/project';
import {
  generateProjectId,
  getActiveProjectId,
  loadAllProjects,
  saveProject as persistProject,
  setActiveProjectId,
} from '../storage/local_project_store';

const MAX_PROJECT_NAME = 512;
const MAX_IDEA_TITLE = 60;
const MAX_IDEA_MISSION = 400;
const MAX_IDEA_GOAL = 200;
const MAX_IDEA_STEPS = 3;
const MAX_IDEA_STEP_LENGTH = 140;

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

  // Creativity Boundary spec (Idea Station section) guides these truncations.
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
const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const applyIdeaConstraints = (idea?: StationIdea): StationIdea | undefined => clampIdea(idea);

const registerProject = (project: Project) => {
  projects.set(project.id, project);
  notify();
  void persistProject(project).catch((error) => {
    console.error('Failed to save project', error);
  });
};

const initialize = async () => {
  const stored = await loadAllProjects();
  for (const project of stored) {
    projects.set(project.id, project);
  }
  selectedProjectId = await getActiveProjectId();
  notify();
};

void initialize();

export const getProjects = (): Project[] => Array.from(projects.values());

export const getProject = (id: string): Project | undefined => projects.get(id);

export const getSelectedProject = (): Project | undefined =>
  selectedProjectId ? projects.get(selectedProjectId) : undefined;

export const selectProject = (id: string | null): void => {
  selectedProjectId = id;
  void setActiveProjectId(id).catch((error) => {
    console.error('Failed to persist selected project', error);
  });
  notify();
};

export const selectProject = (id: string | null): void => {
  selectedProjectId = id;
  void setActiveProjectId(id).catch((error) => {
    console.error('Failed to persist selected project', error);
  });
  notify();
};

export const createProject = (name: string): Project => {
  const id = generateProjectId();
  const now = new Date().toISOString();
  const project: Project = {
    id,
    name: clampProjectName(name),
    createdAt: now,
    updatedAt: now,
  };
  registerProject(project);
  selectProject(id);
  return project;
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
