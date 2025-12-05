import { Project, StationIdea } from '../../domain/project';
import { newId } from '../../domain/id';

const PROJECTS_KEY = 'workshop.projects';
const ACTIVE_KEY = 'workshop.activeProjectId';
const MAX_PROJECTS = 50; // Cap from Creativity Boundary spec to keep history bounded and performant.
const MAX_TEXT_LENGTH = 512;
const MAX_TITLE_LENGTH = 60;
const MAX_MISSION_LENGTH = 400;
const MAX_GOAL_LENGTH = 200;
const MAX_STEP_LENGTH = 140;

const storageAvailable = (): boolean =>
  typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const safeParse = (raw: string | null): Project[] => {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data as Project[];
  } catch {
    return [];
  }
};

const clamp = (value: string | undefined, max: number): string | undefined => {
  if (typeof value !== 'string') return value;
  return value.length > max ? value.slice(0, max) : value;
};

const clampIdea = (idea?: StationIdea): StationIdea | undefined => {
  if (!idea) return undefined;
  const steps = (idea.starterSteps || [])
    .slice(0, 3)
    .map((step) => clamp(step, MAX_STEP_LENGTH) || '')
    .filter((step) => step.length > 0);
  return {
    title: clamp(idea.title, MAX_TITLE_LENGTH) || 'Untitled Idea',
    mission: clamp(idea.mission, MAX_MISSION_LENGTH) || '',
    goal: clamp(idea.goal, MAX_GOAL_LENGTH) || '',
    starterSteps: steps,
  };
};

const sanitizeProject = (project: Project): Project => {
  const sanitizedName = clamp(project.name, MAX_TEXT_LENGTH) || 'Untitled Project';
  const idea = clampIdea(project.idea);
  return {
    ...project,
    id: project.id || generateProjectId(),
    name: sanitizedName,
    idea,
  };
};

const persist = (projects: Project[]) => {
  if (!storageAvailable()) return;
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch {
    // Swallow storage errors to keep the app running on restricted browsers.
  }
};

const pruneProjects = (projects: Project[]): Project[] => {
  if (projects.length <= MAX_PROJECTS) return projects;
  return projects.slice(Math.max(projects.length - MAX_PROJECTS, 0));
};

export const loadAllProjects = async (): Promise<Project[]> => {
  if (!storageAvailable()) return [];
  const projects = safeParse(localStorage.getItem(PROJECTS_KEY));
  return projects;
};

export const loadProject = async (id: string): Promise<Project | null> => {
  const projects = await loadAllProjects();
  return projects.find((project) => project.id === id) || null;
};

export const saveProject = async (project: Project): Promise<void> => {
  const projects = await loadAllProjects();
  const sanitized = sanitizeProject(project);
  const existingIndex = projects.findIndex((entry) => entry.id === sanitized.id);
  if (existingIndex >= 0) {
    projects[existingIndex] = sanitized;
  } else {
    projects.push(sanitized);
  }
  const limited = pruneProjects(projects);
  persist(limited);
};

export const deleteProject = async (id: string): Promise<void> => {
  const projects = await loadAllProjects();
  const updated = projects.filter((project) => project.id !== id);
  persist(updated);
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
    // Ignore failures when storage is blocked.
  }
};

export const generateProjectId = (): string => newId('project');
