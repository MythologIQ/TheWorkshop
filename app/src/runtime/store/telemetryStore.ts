import type { StationKey } from '../../domain/project';
import type { TelemetryState, StationTelemetryCounts } from '../../domain/telemetry';
import type { ProfileId } from '../../domain/profile';
import { DEFAULT_PROFILE_ID } from '../../domain/profile';
import { getActiveProfileId, subscribe as subscribeToProfileChanges } from './profileStore';

const STORAGE_KEY = 'workshop.telemetry';
const STATION_KEYS: StationKey[] = ['idea', 'build', 'test', 'memory', 'reflect', 'share', 'replay'];

const buildDefaultCounts = (): StationTelemetryCounts =>
  STATION_KEYS.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as StationTelemetryCounts);

const DEFAULT_STATE: TelemetryState = {
  totalProjectsCreated: 0,
  totalSessions: 0,
  stationVisitCounts: buildDefaultCounts(),
  completedTutorials: 0,
  enabled: true,
  lastResetAt: null,
};

type ProfileTelemetry = Record<ProfileId, TelemetryState>;

const storageAvailable = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const sanitizeCounts = (counts?: Partial<StationTelemetryCounts>): StationTelemetryCounts => {
  const normalized = buildDefaultCounts();
  if (!counts) return normalized;
  for (const key of STATION_KEYS) {
    const value = counts[key];
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      normalized[key] = value;
    }
  }
  return normalized;
};

const looksLikeTelemetryState = (value: unknown): value is TelemetryState => {
  if (!value || typeof value !== 'object') return false;
  return (
    typeof (value as TelemetryState).totalProjectsCreated === 'number' &&
    typeof (value as TelemetryState).totalSessions === 'number'
  );
};

const safeParse = (raw: string | null): ProfileTelemetry => {
  const normalized: ProfileTelemetry = {};
  if (!raw) return normalized;
  try {
    const parsed = JSON.parse(raw);
    if (looksLikeTelemetryState(parsed)) {
      normalized[DEFAULT_PROFILE_ID] = {
        ...DEFAULT_STATE,
        ...parsed,
        stationVisitCounts: sanitizeCounts(parsed.stationVisitCounts),
      };
      return normalized;
    }
    if (parsed && typeof parsed === 'object') {
      for (const [key, value] of Object.entries(parsed)) {
        if (looksLikeTelemetryState(value)) {
          normalized[key] = {
            ...DEFAULT_STATE,
            ...value,
            stationVisitCounts: sanitizeCounts(value.stationVisitCounts),
          };
        }
      }
    }
  } catch {
    // Fall back to empty telemetry.
  }
  return normalized;
};

const persistState = (state: ProfileTelemetry) => {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors.
  }
};

const loadInitialTelemetry = (): ProfileTelemetry => {
  const stored = safeParse(storageAvailable() ? window.localStorage.getItem(STORAGE_KEY) : null);
  if (!stored[DEFAULT_PROFILE_ID]) {
    stored[DEFAULT_PROFILE_ID] = { ...DEFAULT_STATE };
  }
  persistState(stored);
  return stored;
};

let telemetryByProfile: ProfileTelemetry = loadInitialTelemetry();
let activeProfileId: ProfileId = getActiveProfileId() ?? DEFAULT_PROFILE_ID;
const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const cloneState = (state: TelemetryState): TelemetryState => ({
  ...state,
  stationVisitCounts: { ...state.stationVisitCounts },
});

const ensureProfileState = (profileId: ProfileId): TelemetryState => {
  if (!telemetryByProfile[profileId]) {
    telemetryByProfile = {
      ...telemetryByProfile,
      [profileId]: { ...DEFAULT_STATE },
    };
    persistState(telemetryByProfile);
  }
  return telemetryByProfile[profileId]!;
};

const updateProfileState = (profileId: ProfileId, next: TelemetryState) => {
  telemetryByProfile = {
    ...telemetryByProfile,
    [profileId]: next,
  };
  persistState(telemetryByProfile);
  notify();
};

subscribeToProfileChanges(() => {
  activeProfileId = getActiveProfileId() ?? DEFAULT_PROFILE_ID;
  ensureProfileState(activeProfileId);
  notify();
});

const withTelemetry = (mutator: (state: TelemetryState) => TelemetryState): void => {
  const current = ensureProfileState(activeProfileId);
  if (!current.enabled) return;
  const next = mutator(cloneState(current));
  updateProfileState(activeProfileId, next);
};

export const getTelemetryState = (): TelemetryState => ensureProfileState(activeProfileId);

export const getAggregatedTelemetryState = (): TelemetryState => {
  const aggregate: TelemetryState = {
    ...DEFAULT_STATE,
    stationVisitCounts: buildDefaultCounts(),
    enabled: false,
    lastResetAt: null,
  };
  for (const state of Object.values(telemetryByProfile)) {
    aggregate.totalProjectsCreated += state.totalProjectsCreated;
    aggregate.totalSessions += state.totalSessions;
    aggregate.completedTutorials += state.completedTutorials;
    aggregate.enabled = aggregate.enabled || state.enabled;
    aggregate.lastResetAt = aggregate.lastResetAt ?? state.lastResetAt;
    for (const key of STATION_KEYS) {
      aggregate.stationVisitCounts[key] += state.stationVisitCounts[key] ?? 0;
    }
  }
  return aggregate;
};

export const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const recordProjectCreated = () => {
  withTelemetry((state) => ({
    ...state,
    totalProjectsCreated: state.totalProjectsCreated + 1,
  }));
};

export const recordSession = () => {
  withTelemetry((state) => ({
    ...state,
    totalSessions: state.totalSessions + 1,
  }));
};

export const recordStationVisit = (station: StationKey) => {
  withTelemetry((state) => ({
    ...state,
    stationVisitCounts: {
      ...state.stationVisitCounts,
      [station]: (state.stationVisitCounts[station] ?? 0) + 1,
    },
  }));
};

export const recordTutorialCompleted = () => {
  withTelemetry((state) => ({
    ...state,
    completedTutorials: state.completedTutorials + 1,
  }));
};

export const resetTelemetry = () => {
  const prev = ensureProfileState(activeProfileId);
  updateProfileState(activeProfileId, {
    ...DEFAULT_STATE,
    enabled: prev.enabled,
    lastResetAt: new Date().toISOString(),
  });
};

export const setTelemetryEnabled = (enabled: boolean) => {
  const prev = ensureProfileState(activeProfileId);
  if (prev.enabled === enabled) return;
  updateProfileState(activeProfileId, {
    ...prev,
    enabled,
  });
};
