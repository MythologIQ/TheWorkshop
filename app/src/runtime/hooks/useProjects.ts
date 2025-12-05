import { useCallback, useEffect, useState } from 'react';
import { Project } from '../../domain/project';
import {
  createProject as storeCreateProject,
  getProject,
  getProjects as storeGetProjects,
  getSelectedProject as storeGetSelectedProject,
  selectProject as storeSelectProject,
  subscribe,
  updateProject as storeUpdateProject,
} from '../store/projectStore';

type State = {
  projects: Project[];
  selectedProject?: Project;
};

export const useProjects = () => {
  const [state, setState] = useState<State>(() => ({
    projects: storeGetProjects(),
    selectedProject: storeGetSelectedProject(),
  }));

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setState({
        projects: storeGetProjects(),
        selectedProject: storeGetSelectedProject(),
      });
    });
    return unsubscribe;
  }, []);

  const createProject = useCallback((name: string) => storeCreateProject(name), []);
  const selectProject = useCallback((id: string | null) => storeSelectProject(id), []);
  const updateProject = useCallback((id: string, patch: Partial<Project>) => storeUpdateProject(id, patch), []);

  return {
    projects: state.projects,
    selectedProject: state.selectedProject,
    createProject,
    selectProject,
    updateProject,
    getProject: (id: string) => getProject(id),
  };
};
