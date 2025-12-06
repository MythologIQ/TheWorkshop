import { useSyncExternalStore } from 'react';
import {
  addSnapshot,
  createProject,
  getProjects,
  getSelectedProject,
  selectProject,
  subscribe,
  updateProject,
} from '../store/projectStore';
export const useProjects = () => {
  const projects = useSyncExternalStore(subscribe, getProjects, () => []);
  const selectedProject = useSyncExternalStore(subscribe, getSelectedProject, () => undefined);

  return {
    projects,
    selectedProject,
    createProject,
    selectProject,
    updateProject,
    addSnapshot,
  };
};
