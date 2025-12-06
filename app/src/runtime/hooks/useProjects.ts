import { useSyncExternalStore } from 'react';
import { createProject, getProjects, getSelectedProject, selectProject, subscribe, updateProject } from '../store/projectStore';
import { Project } from '../../domain/project';

export interface ProjectHook {
  projects: Project[];
  selectedProject: Project | undefined;
  createProject: typeof createProject;
  selectProject: typeof selectProject;
  updateProject: typeof updateProject;
}

export const useProjects = (): ProjectHook => {
  const projects = useSyncExternalStore(subscribe, getProjects, () => []);
  const selectedProject = useSyncExternalStore(subscribe, getSelectedProject, () => undefined);

  return {
    projects,
    selectedProject,
    createProject,
    selectProject,
    updateProject,
  };
};
