import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROFILE_ID } from '../../../domain/profile';

const clearStorage = () => {
  if (typeof globalThis?.localStorage !== 'undefined') {
    globalThis.localStorage.clear();
  }
};

const loadStores = async () => {
  vi.resetModules();
  const profileStore = await import('../profileStore');
  const telemetryStore = await import('../telemetryStore');
  return { profileStore, telemetryStore };
};

describe('telemetryStore', () => {
  it('tracks telemetry per profile and aggregates', async () => {
    clearStorage();
    const { profileStore, telemetryStore } = await loadStores();
    expect(telemetryStore.getTelemetryState().totalProjectsCreated).toBe(0);
    telemetryStore.recordProjectCreated();
    expect(telemetryStore.getTelemetryState().totalProjectsCreated).toBe(1);

    const secondProfile = profileStore.createProfile({ displayName: 'Kiddo', ageBand: 'young_creators' });
    expect(profileStore.getActiveProfileId()).toBe(secondProfile.id);
    expect(telemetryStore.getTelemetryState().totalProjectsCreated).toBe(0);
    telemetryStore.recordProjectCreated();
    expect(telemetryStore.getTelemetryState().totalProjectsCreated).toBe(1);

    profileStore.setActiveProfileId(DEFAULT_PROFILE_ID);
    expect(telemetryStore.getTelemetryState().totalProjectsCreated).toBe(1);

    const aggregate = telemetryStore.getAggregatedTelemetryState();
    expect(aggregate.totalProjectsCreated).toBe(2);
  });

  it('migrates legacy telemetry data into the default profile', async () => {
    clearStorage();
    const legacy = {
      totalProjectsCreated: 3,
      totalSessions: 2,
      completedTutorials: 1,
      stationVisitCounts: {
        idea: 1,
        build: 1,
        test: 0,
        memory: 0,
        reflect: 0,
        share: 0,
        replay: 0,
      },
      enabled: true,
      lastResetAt: null,
    };
    globalThis.localStorage?.setItem('workshop.telemetry', JSON.stringify(legacy));
    const { telemetryStore } = await loadStores();
    const state = telemetryStore.getTelemetryState();
    expect(state.totalProjectsCreated).toBe(3);
    expect(state.stationVisitCounts.idea).toBe(1);
    expect(state.stationVisitCounts.build).toBe(1);
    expect(state.stationVisitCounts.test).toBe(0);
  });
});
