import type { Project, StationIdea } from '../../domain/project';
import type { ProfileId } from '../../domain/profile';
import { DEFAULT_PROFILE_ID } from '../../domain/profile';
import { newId } from '../../domain/id';

const PROJECTS_KEY = 'workshop.projects';
const ACTIVE_KEY_PREFIX = 'workshop.activeProjectId';
const MAX_PROJECTS = 50;
const MAX_PROJECT_TEXT = 512;
const MAX_IDEA_TITLE = 60;
const MAX_IDEA_MISSION = 400;
const MAX_IDEA_GOAL = 200;
const MAX_IDEA_STEPS = 3;
const MAX_IDEA_STEP = 140;

type ProjectsByProfile = Record<ProfileId, Project[]>;

const storageAvailable = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

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

const safeParse = (raw: string | null): ProjectsByProfile => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { [DEFAULT_PROFILE_ID]: parsed };
    }
    if (parsed && typeof parsed === 'object') {
      const normalized: ProjectsByProfile = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (Array.isArray(value)) {
          normalized[key] = value;
        }
      }
      return normalized;
    }
  } catch {
    // Fall back to empty storage.
  }
  return {};
};

const persist = (payload: ProjectsByProfile) => {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors to avoid crashing the UI.
  }
};

const pruneProjects = (projects: Project[]): Project[] => {
  if (projects.length <= MAX_PROJECTS) return projects;
  return projects.slice(Math.max(projects.length - MAX_PROJECTS, 0));
};

const activeKeyForProfile = (profileId: ProfileId): string => `${ACTIVE_KEY_PREFIX}.${profileId}`;

const sanitizeProject = (project: Project): Project => ({
  ...project,
  name: clampText(project.name, MAX_PROJECT_TEXT) || 'Untitled Project',
  idea: clampIdea(project.idea),
});

export const generateProjectId = (): string => newId('project');

export const loadProjectsForProfile = async (profileId: ProfileId): Promise<Project[]> => {
  if (!storageAvailable()) return [];
  const raw = window.localStorage.getItem(PROJECTS_KEY);
  const bucket = safeParse(raw);
  const subset = bucket[profileId] ?? [];
  return subset.map((project) => ({ ...project, profileId }));
};

export const saveProject = async (profileId: ProfileId, project: Project): Promise<void> => {
  const bucket = safeParse(storageAvailable() ? window.localStorage.getItem(PROJECTS_KEY) : null);
  const sanitized = sanitizeProject(project);
  const entry: Project = { ...sanitized, profileId };
  const records = bucket[profileId] ? [...bucket[profileId]] : [];
  const existingIndex = records.findIndex((entry) => entry.id === project.id);
  if (existingIndex >= 0) {
    records[existingIndex] = entry;
  } else {
    records.push(entry);
  }
  bucket[profileId] = pruneProjects(records);
  persist(bucket);
};

export const deleteProject = async (profileId: ProfileId, id: string): Promise<void> => {
  const bucket = safeParse(storageAvailable() ? window.localStorage.getItem(PROJECTS_KEY) : null);
  const records = (bucket[profileId] ?? []).filter((project) => project.id !== id);
  bucket[profileId] = records;
  persist(bucket);
};

export const loadAllProjects = loadProjectsForProfile;

export const getActiveProjectId = async (profileId: ProfileId): Promise<string | null> => {
  if (!storageAvailable()) return null;
  return window.localStorage.getItem(activeKeyForProfile(profileId));
};

export const setActiveProjectId = async (profileId: ProfileId, id: string | null): Promise<void> => {
  if (!storageAvailable()) return;
  try {
    const key = activeKeyForProfile(profileId);
    if (id) {
      window.localStorage.setItem(key, id);
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage errors.
  }
};
