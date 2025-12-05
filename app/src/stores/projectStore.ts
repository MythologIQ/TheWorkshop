import { useEffect, useState } from 'react';
import { newId } from '../domain/id';
import { Project, StationKey } from '../domain/project';
import { Step } from '../domain/step';
import { Reflection } from '../domain/reflection';
import { TestResult } from '../domain/test';
import {
  loadAllProjects,
  loadProject,
  saveProject as persistProject,
  deleteProject as removeProject,
  getActiveProjectId,
  setActiveProjectId,
} from '../runtime/storage/local_project_store';

type StoreState = {
  projects: Project[];
  activeProjectId: string | null;
  loading: boolean;
};

const projectBus = new EventTarget();
let storeState: StoreState = { projects: [], activeProjectId: null, loading: true };

const notify = () => projectBus.dispatchEvent(new Event('update'));

const setState = (next: Partial<StoreState>) => {
  storeState = { ...storeState, ...next };
  notify();
};

const init = async () => {
  const [projects, activeId] = await Promise.all([loadAllProjects(), getActiveProjectId()]);
  setState({ projects, activeProjectId: activeId, loading: false });
};

// Kick off initial load
void init();

export const useProjectStore = () => {
  const [state, setLocal] = useState<StoreState>(storeState);
  useEffect(() => {
    const handler = () => setLocal({ ...storeState });
    projectBus.addEventListener('update', handler);
    return () => projectBus.removeEventListener('update', handler);
  }, []);
  return { ...state, actions: projectActions };
};

const clamp = (text: string, max = 2048) => (text.length > max ? `${text.slice(0, max)}…` : text);

const autosave = async (project: Project) => {
  await persistProject(project);
  const projects = await loadAllProjects();
  setState({ projects });
};

const createProject = async (title: string, description: string): Promise<Project> => {
  const now = new Date().toISOString();
  const project: Project = {
    id: newId('proj'),
    title: clamp(title || 'Untitled Project', 256),
    description: clamp(description || '', 2048),
    status: 'draft',
    currentStation: 'idea',
    steps: [],
    reflections: [],
    tests: [],
    archives: [],
    createdAt: now,
    updatedAt: now,
  };
  await autosave(project);
  await setActiveProjectId(project.id);
  setState({ activeProjectId: project.id });
  return project;
};

const updateProject = async (project: Project): Promise<void> => {
  const updated = { ...project, updatedAt: new Date().toISOString() };
  await autosave(updated);
};

const setActive = async (id: string | null) => {
  await setActiveProjectId(id);
  setState({ activeProjectId: id });
};

const deleteProject = async (id: string) => {
  await removeProject(id);
  const projects = await loadAllProjects();
  const activeProjectId = storeState.activeProjectId === id ? null : storeState.activeProjectId;
  setState({ projects, activeProjectId });
  if (activeProjectId === null) {
    await setActiveProjectId(null);
  }
};

const upsertStep = async (projectId: string, step: Step) => {
  const project = await loadProject(projectId);
  if (!project) return;
  const steps = project.steps.filter((s) => s.id !== step.id);
  steps.push(step);
  steps.sort((a, b) => a.order - b.order);
  await updateProject({ ...project, steps });
};

const upsertReflection = async (projectId: string, reflection: Reflection) => {
  const project = await loadProject(projectId);
  if (!project) return;
  const reflections = project.reflections.filter((r) => r.id !== reflection.id);
  reflections.push(reflection);
  await updateProject({ ...project, reflections });
};

const upsertTestResult = async (projectId: string, test: TestResult) => {
  const project = await loadProject(projectId);
  if (!project) return;
  const tests = project.tests.filter((t) => t.id !== test.id);
  tests.push(test);
  await updateProject({ ...project, tests });
};

const projectActions = {
  createProject,
  updateProject,
  deleteProject,
  setActive,
  upsertStep,
  upsertReflection,
  upsertTestResult,
  setCurrentStation: async (projectId: string, station: StationKey) => {
    const project = await loadProject(projectId);
    if (!project) return;
    await updateProject({ ...project, currentStation: station });
  },
};
