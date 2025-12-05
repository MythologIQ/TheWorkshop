import { Project, StationIdea } from '../../domain/project';
import { newId } from '../../domain/id';

const PROJECTS_KEY = 'workshop.projects';
const ACTIVE_KEY = 'workshop.activeProjectId';
const MAX_PROJECTS = 50;
const MAX_PROJECT_TEXT = 512;
const MAX_IDEA_TITLE = 60;
const MAX_IDEA_MISSION = 400;
const MAX_IDEA_GOAL = 200;
const MAX_IDEA_STEPS = 3;
const MAX_IDEA_STEP = 140;

const storageAvailable = (): boolean => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const clampText = (text: string | undefined, max: number): string | undefined => {
  if (typeof text !== 'string') return text;
  return text.length > max ? text.slice(0, max) : text;
};

const clampIdea = (idea?: StationIdea): StationIdea | undefined => {
  if (!idea) return undefined;
  const starterSteps = (idea.starterSteps || [])
    .slice(0, MAX_IDEA_STEPS)
    .map((step) => clampText(step, MAX_IDEA_STEP) || '')
    .filter((step) => step.length > 0);
  return {
    title: clampText(idea.title, MAX_IDEA_TITLE) || 'Untitled Idea',
    mission: clampText(idea.mission, MAX_IDEA_MISSION) || '',
    goal: clampText(idea.goal, MAX_IDEA_GOAL) || '',
    starterSteps,
  };
};

const safeParse = (raw: string | null): Project[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const persist = (projects: Project[]) => {
  if (!storageAvailable()) return;
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch {
    // Ignore storage errors to keep the UI running.
  }
};

const pruneProjects = (projects: Project[]): Project[] => {
  if (projects.length <= MAX_PROJECTS) return projects;
  return projects.slice(Math.max(projects.length - MAX_PROJECTS, 0));
};

export const generateProjectId = (): string => newId('project');

export const loadAllProjects = async (): Promise<Project[]> => {
  if (!storageAvailable()) return [];
  const raw = localStorage.getItem(PROJECTS_KEY);
  return safeParse(raw);
};

export const saveProject = async (project: Project): Promise<void> => {
  const projects = await loadAllProjects();
  const idea = clampIdea(project.idea);
  const sanitized: Project = {
    ...project,
    name: clampText(project.name, MAX_PROJECT_TEXT) || 'Untitled Project',
    idea,
  };
  const existingIndex = projects.findIndex((entry) => entry.id === sanitized.id);
  if (existingIndex >= 0) {
    projects[existingIndex] = sanitized;
  } else {
    projects.push(sanitized);
  }
  const trimmed = pruneProjects(projects);
  persist(trimmed);
};

export const deleteProject = async (id: string): Promise<void> => {
  const projects = await loadAllProjects();
  const remaining = projects.filter((project) => project.id !== id);
  persist(remaining);
};

export const getActiveProjectId = async (): Promise<string | null> => {
  if (!storageAvailable()) return null;
  return localStorage.getItem(ACTIVE_KEY);
};

export const setActiveProjectId = async (id: string | null): Promise<void> => {
  if (!storageAvailable()) return;
  try {
    if (id) {
      localStorage.setItem(ACTIVE_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_KEY);
    }
  } catch {
    // Ignore storage failures.
  }
};
