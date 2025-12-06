import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROFILE_ID } from '../../../domain/profile';
import { DEFAULT_PROFILE_ID } from '../../../domain/profile';

const clearStorage = () => {
  if (typeof globalThis?.localStorage !== 'undefined') {
    globalThis.localStorage.clear();
  }
};

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

const loadProjectStore = async (options?: { skipClear?: boolean }) => {
  vi.resetModules();
  if (!options?.skipClear) {
    clearStorage();
  }
  const projectStore = await import('../projectStore');
  const profileStore = await import('../profileStore');
  return { ...projectStore, profileStore };
};

describe('projectStore', () => {
  it('creates, selects, and updates a project', async () => {
    const { createProject, getProjects, getSelectedProject, updateProject } = await loadProjectStore();
    const project = createProject('Story Lab');
    expect(getProjects()).toHaveLength(1);
    expect(getSelectedProject()?.id).toBe(project.id);
    const updated = updateProject(project.id, { description: 'Fresh idea' });
    expect(updated?.description).toBe('Fresh idea');
    expect(updated?.profileId).toBe(DEFAULT_PROFILE_ID);
  });

  it('can add a snapshot for the selected project', async () => {
    const { createProject, addSnapshot, getSelectedProject } = await loadProjectStore();
    const project = createProject('Snapshot Test');
    const snapshot = addSnapshot(project.id, 'First snapshot');
    expect(snapshot).not.toBeNull();
    expect(getSelectedProject()?.snapshots?.length).toBe(1);
  });

  it('migrates legacy projects into the default profile', async () => {
    const legacyProject = {
      id: 'legacy-project',
      name: 'Legacy Story',
      status: 'draft',
      currentStation: 'idea',
      steps: [],
      reflections: [],
      tests: [],
      archives: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    clearStorage();
    globalThis.localStorage?.setItem('workshop.projects', JSON.stringify([legacyProject]));
    const { getProjects } = await loadProjectStore({ skipClear: true });
    const projects = getProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0].profileId).toBe(DEFAULT_PROFILE_ID);
  });

  it('loads projects per profile when switching active profile', async () => {
    const { createProject, getProjects, profileStore } = await loadProjectStore();
    createProject('Story Alpha');
    expect(getProjects()).toHaveLength(1);

    const childProfile = profileStore.createProfile({ displayName: 'Kiddo', ageBand: 'young_creators' });
    profileStore.setActiveProfileId(childProfile.id);
    await flushPromises();
    expect(getProjects()).toHaveLength(0);

    const childProject = createProject('Story Beta');
    expect(getProjects()).toHaveLength(1);
    expect(childProject.profileId).toBe(childProfile.id);

    profileStore.setActiveProfileId(DEFAULT_PROFILE_ID);
    await flushPromises();
    expect(getProjects()).toHaveLength(1);
    expect(getProjects().some((entry) => entry.name === 'Story Alpha')).toBe(true);
  });
});
