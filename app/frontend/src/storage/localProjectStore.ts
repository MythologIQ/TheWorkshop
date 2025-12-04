import { Project } from '../domain/project';

const STORAGE_KEY = 'workshop_projects';

const safeParse = (raw: string | null): Project[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const loadProjects = (): Project[] => {
  if (typeof localStorage === 'undefined') return [];
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

export const saveProjects = (projects: Project[]): void => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const upsertProject = (project: Project): Project[] => {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  saveProjects(projects);
  return projects;
};
