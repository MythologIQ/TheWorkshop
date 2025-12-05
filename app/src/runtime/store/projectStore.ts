import { Project, StationIdea, BuildSlice, BuildStep, BuildStepStatus } from '../../domain/project';
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
const MAX_BUILD_STEPS = 12;
const MAX_BUILD_STEP_LENGTH = 180;
const MAX_BUILD_NOTES = 300;

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

const clampBuildStatus = (status?: string): BuildStepStatus =>
  status === 'active' ? 'active' : status === 'done' ? 'done' : 'todo';

const clampBuildSteps = (steps?: BuildStep[]): BuildStep[] => {
  if (!steps) return [];
  const limited = steps.slice(0, MAX_BUILD_STEPS);
  return limited
    .map((step) => ({
      id: step.id || generateProjectId(),
      text: clamp(step.text, MAX_BUILD_STEP_LENGTH) || '',
      status: clampBuildStatus(step.status),
      notes: clamp(step.notes, MAX_BUILD_NOTES) || '',
    }))
    .filter((step) => step.text.length > 0);
};

const applyBuildConstraints = (build?: BuildSlice): BuildSlice | undefined => {
  if (!build) return undefined;
  const sanitizedSteps = clampBuildSteps(build.steps);
  if (sanitizedSteps.length === 0) return undefined;
  const preferredActive =
    sanitizedSteps.find((step) => step.id === build.activeStepId && step.status !== 'done') ??
    sanitizedSteps.find((step) => step.status === 'active') ??
    sanitizedSteps.find((step) => step.status === 'todo');
  const resolvedActiveId = preferredActive?.id ?? null;
  const steps = sanitizedSteps.map((step) => {
    if (step.status === 'done') return step;
    if (step.id === resolvedActiveId) {
      return { ...step, status: 'active' };
    }
    return { ...step, status: 'todo' };
  });
  return {
    steps,
    activeStepId: resolvedActiveId,
  };
};

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
  const build =
    Object.prototype.hasOwnProperty.call(patch, 'build')
      ? applyBuildConstraints(patch.build)
      : applyBuildConstraints(current.build);

  const updated: Project = {
    ...current,
    ...patch,
    idea,
    build,
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
