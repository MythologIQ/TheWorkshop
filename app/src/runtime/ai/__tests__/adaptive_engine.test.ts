import { describe, expect, it } from 'vitest';
import { getPersonaForStation } from '../ai_personas';
import { buildAdaptiveAdjustments } from '../adaptive_engine';
import { buildProfile } from '../../../domain/profile';
import type { StationKey } from '../../../domain/project';
import type { TelemetryState } from '../../../domain/telemetry';

const STATION_KEYS: StationKey[] = ['idea', 'build', 'test', 'memory', 'reflect', 'share', 'replay'];

const buildTelemetry = (overrides?: Partial<TelemetryState>): TelemetryState => {
  const stationVisitCounts = STATION_KEYS.reduce<Record<StationKey, number>>((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Record<StationKey, number>);

  const base: TelemetryState = {
    totalProjectsCreated: 0,
    totalSessions: 0,
    stationVisitCounts,
    completedTutorials: 0,
    enabled: true,
    lastResetAt: null,
  };

  return {
    ...base,
    ...overrides,
    stationVisitCounts: {
      ...stationVisitCounts,
      ...overrides?.stationVisitCounts,
    },
  };
};

describe('adaptive_engine', () => {
  it('boosts the token budget and hints for seasoned creators', () => {
    const profile = buildProfile({ displayName: 'Explorer', ageBand: 'young_creators' });
    const telemetry = buildTelemetry({
      totalProjectsCreated: 5,
      totalSessions: 4,
      stationVisitCounts: {
        idea: 1,
        build: 5,
        test: 2,
        memory: 0,
        reflect: 3,
        share: 1,
        replay: 2,
      },
    });
    const persona = getPersonaForStation('build');
    const adjustments = buildAdaptiveAdjustments({ persona, profile, telemetry });

    expect(adjustments.maxTokens).toBe(140);
    expect(adjustments.temperature).toBe(0.7);
    expect(adjustments.systemPromptAddition).toContain('Stay encouraging');
    expect(adjustments.systemPromptAddition).toContain('Link the response to what they already explored here.');
    expect(adjustments.systemPromptAddition).toContain('Invite them to mention a recent reflection insight.');
  });

  it('uses toddler-friendly guidance and reflection encouragement when visits are low', () => {
    const profile = buildProfile({ displayName: 'Mini', ageBand: 'toddlers' });
    const telemetry = buildTelemetry({
      totalProjectsCreated: 0,
      totalSessions: 1,
      stationVisitCounts: {
        idea: 1,
        build: 8,
        test: 8,
        memory: 8,
        reflect: 0,
        share: 8,
        replay: 8,
      },
    });
    const persona = getPersonaForStation('idea');
    const adjustments = buildAdaptiveAdjustments({ persona, profile, telemetry });

    expect(adjustments.maxTokens).toBe(110);
    expect(adjustments.temperature).toBe(0.65);
    expect(adjustments.systemPromptAddition).toContain('Use playful, concrete language');
    expect(adjustments.systemPromptAddition).toContain('Start with a quick reminder of this station\'s purpose.');
    expect(adjustments.systemPromptAddition).toContain('Suggest a gentle reflection before moving on.');
  });
});
