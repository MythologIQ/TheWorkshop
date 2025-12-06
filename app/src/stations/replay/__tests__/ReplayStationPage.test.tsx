import React from 'react';
import { render, screen } from '@testing-library/react';
import { PreferencesProvider } from '../../../runtime/context/preferencesContext';
import ReplayStationPage from '../ReplayStationPage';

const mockProject = {
  id: 'project-1',
  name: 'Creation',
  title: 'Creation',
  description: '',
  goal: undefined,
  idea: undefined,
  status: 'draft',
  currentStation: 'replay',
  steps: [],
  reflections: [],
  tests: [],
  archives: [],
  profileId: 'profile-default',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tags: [],
  snapshots: [],
};

vi.mock('../../../runtime/hooks/useProjects', () => ({
  useProjects: () => ({
    selectedProject: mockProject,
    addSnapshot: vi.fn(() => null),
    updateProject: vi.fn(),
    createProject: vi.fn(() => mockProject),
    selectProject: vi.fn(),
  }),
}));

describe('ReplayStationPage', () => {
  it('renders the Creation Lab stamp', () => {
    render(
      <PreferencesProvider>
        <ReplayStationPage />
      </PreferencesProvider>,
    );
    expect(screen.getByText(/Created in the MythologIQ Creation Lab/i)).toBeTruthy();
  });
});
