import { Project } from '../../domain/project';

const STORAGE_KEY = 'workshop.projects';
const ACTIVE_KEY = 'workshop.activeProjectId';
const MAX_TEXT = 2048; // clamp text fields to keep storage safe (Creativity Boundary guard).
const MAX_STEPS = 200; // prevent runaway growth.

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

const clampText = (text: string | undefined): string | undefined => {
  if (!text) return text;
  return text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}…` : text;
};

const sanitizeProject = (project: Project): Project => {
  const trimmed = {
    ...project,
    title: clampText(project.title) || 'Untitled Project',
    description: clampText(project.description) || '',
    steps: project.steps.slice(0, MAX_STEPS).map((s, idx) => ({
      ...s,
      title: clampText(s.title) || 'Step',
      summary: clampText(s.summary),
      notes: clampText(s.notes),
      order: idx + 1,
    })),
    reflections: project.reflections.map((r) => ({
      ...r,
      note: clampText(r.note) || '',
    })),
    tests: project.tests.map((t) => ({
      ...t,
      question: clampText(t.question) || '',
      note: clampText(t.note),
    })),
    archives: project.archives.map((a) => ({
      ...a,
      label: clampText(a.label) || 'Snapshot',
      summary: clampText(a.summary),
    })),
  };
  return trimmed;
};

const persist = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // ignore write errors to avoid breaking the app
  }
};

export const listProjects = async (): Promise<Project[]> => {
  if (typeof localStorage === 'undefined') return [];
  const projects = safeParse(localStorage.getItem(STORAGE_KEY));
  return projects;
};

export const loadProject = async (id: string): Promise<Project | null> => {
  const projects = await listProjects();
  return projects.find((p) => p.id === id) || null;
};

export const saveProject = async (project: Project): Promise<void> => {
  const projects = await listProjects();
  const sanitized = sanitizeProject(project);
  const idx = projects.findIndex((p) => p.id === sanitized.id);
  if (idx >= 0) {
    projects[idx] = sanitized;
  } else {
    projects.push(sanitized);
  }
  persist(projects);
};

export const deleteProject = async (id: string): Promise<void> => {
  const projects = await listProjects();
  const remaining = projects.filter((p) => p.id !== id);
  persist(remaining);
};

export const getActiveProjectId = async (): Promise<string | null> => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(ACTIVE_KEY);
};

export const setActiveProjectId = async (id: string | null): Promise<void> => {
  if (typeof localStorage === 'undefined') return;
  try {
    if (id) {
      localStorage.setItem(ACTIVE_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_KEY);
    }
  } catch {
    // ignore storage errors
  }
};
