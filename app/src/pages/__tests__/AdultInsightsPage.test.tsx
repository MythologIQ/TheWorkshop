import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdultInsightsPage from '../AdultInsightsPage';
import { PreferencesProvider } from '../../runtime/context/preferencesContext';
import type { Project } from '../../domain/project';
import type { TelemetryState } from '../../domain/telemetry';
import type { Profile } from '../../domain/profile';

const DEFAULT_TELEMETRY: TelemetryState = {
  totalProjectsCreated: 0,
  totalSessions: 0,
  stationVisitCounts: {
    idea: 0,
    build: 0,
    test: 0,
    memory: 0,
    reflect: 0,
    share: 0,
    replay: 0,
  },
  completedTutorials: 0,
  enabled: true,
  lastResetAt: null,
};

const DEFAULT_PROFILE: Profile = {
  id: 'profile-default',
  displayName: 'First Creator',
  ageBand: 'young_creators',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

let projectState: Project[] = [];
let telemetryState: TelemetryState = DEFAULT_TELEMETRY;
let profileState: Profile = DEFAULT_PROFILE;

vi.mock('../../runtime/store/projectStore', () => ({
  getProjects: () => projectState,
  subscribe: (listener: () => void) => {
    listener();
    return () => {};
  },
  setMockProjects: (items: Project[]) => {
    projectState = items;
  },
}));

vi.mock('../../runtime/store/telemetryStore', () => ({
  getTelemetryState: () => telemetryState,
  subscribe: (listener: () => void) => {
    listener();
    return () => {};
  },
  setMockTelemetry: (state: TelemetryState) => {
    telemetryState = state;
  },
}));

vi.mock('../../runtime/store/profileStore', () => ({
  getActiveProfile: () => profileState,
  subscribe: (listener: () => void) => {
    listener();
    return () => {};
  },
  setMockProfile: (value: Profile) => {
    profileState = value;
  },
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <PreferencesProvider>
        <AdultInsightsPage />
      </PreferencesProvider>
    </MemoryRouter>,
  );

describe('AdultInsightsPage', () => {
  beforeEach(() => {
    projectState = [];
    telemetryState = DEFAULT_TELEMETRY;
    profileState = DEFAULT_PROFILE;
  });

  it('renders zero metrics when no data exists', () => {
    renderPage();
    expect(screen.getByTestId('insights-total-projects').textContent).toBe('0');
    expect(screen.getByTestId('insights-completed-projects').textContent).toBe('0');
    expect(screen.getByTestId('insights-reflection-visits').textContent).toBe('0');
    expect(screen.getByTestId('insights-tutorials').textContent).toBe('0');
  });

  it('renders populated metrics derived from stores', () => {
    const now = new Date().toISOString();
    projectState = [
      {
        id: 'project-1',
        profileId: DEFAULT_PROFILE.id,
        name: 'First',
        title: 'First',
        description: '',
        goal: undefined,
        idea: undefined,
        status: 'completed',
        currentStation: 'reflect',
        steps: [],
        reflections: [],
        tests: [],
        archives: [],
        tags: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'project-2',
        profileId: DEFAULT_PROFILE.id,
        name: 'Second',
        title: 'Second',
        description: '',
        goal: undefined,
        idea: undefined,
        status: 'draft',
        currentStation: 'idea',
        steps: [],
        reflections: [],
        tests: [],
        archives: [],
        tags: [],
        createdAt: now,
        updatedAt: now,
      },
    ];
    telemetryState = {
      totalProjectsCreated: 2,
      totalSessions: 4,
      stationVisitCounts: {
        idea: 1,
        build: 2,
        test: 3,
        memory: 1,
        reflect: 2,
        share: 0,
        replay: 0,
      },
      completedTutorials: 1,
      enabled: true,
      lastResetAt: null,
    };
    renderPage();
    expect(screen.getByTestId('insights-total-projects').textContent).toBe('2');
    expect(screen.getByTestId('insights-completed-projects').textContent).toBe('1');
    expect(screen.getByTestId('insights-reflection-visits').textContent).toBe('2');
    expect(screen.getByTestId('insights-tutorials').textContent).toBe('1');
    expect(screen.getByText('Station balance')).toBeTruthy();
  });
});
