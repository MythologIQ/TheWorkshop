import { describe, expect, it, vi } from 'vitest';
import { CREATION_LAB_SIGNATURE, exportProject } from '../export_project';
import { getProject } from '../../store/projectStore';

vi.mock('../../store/projectStore', () => ({
  getProject: vi.fn(),
}));

const mockedGetProject = vi.mocked(getProject);

describe('export_project', () => {
  it('includes the Creation Lab signature in exported payloads', async () => {
    mockedGetProject.mockReturnValue({
      id: 'project-1',
      name: 'mini',
      title: 'mini',
      description: '',
      goal: undefined,
      idea: undefined,
      status: 'draft',
      currentStation: 'idea',
      steps: [],
      reflections: [],
      tests: [],
      archives: [],
      memory: undefined,
      reflect: undefined,
      share: undefined,
      tags: [],
      profileId: 'profile-default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const blob = exportProject('project-1');
    const text = await blob.text();
    const payload = JSON.parse(text);
    expect(payload.creationLabSignature).toBe(CREATION_LAB_SIGNATURE);
  });
});
