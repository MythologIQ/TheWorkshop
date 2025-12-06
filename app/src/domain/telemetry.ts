import type { StationKey } from './project';

export type StationTelemetryCounts = Record<StationKey, number>;

export interface TelemetryState {
  totalProjectsCreated: number;
  totalSessions: number;
  stationVisitCounts: StationTelemetryCounts;
  completedTutorials: number;
  enabled: boolean;
  lastResetAt: string | null;
}
