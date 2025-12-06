import type { PersonaDefinition } from './ai_personas';
import type { Profile } from '../../domain/profile';
import type { TelemetryState } from '../../domain/telemetry';

export interface AdaptiveInput {
  persona: PersonaDefinition;
  profile: Profile;
  telemetry: TelemetryState;
}

export interface AdaptiveAdjustments {
  systemPromptAddition?: string;
  maxTokens?: number;
  temperature?: number;
}

const determineMaxTokens = (telemetry: TelemetryState): number => {
  const experienceScore = telemetry.totalProjectsCreated * 3 + telemetry.totalSessions;
  if (experienceScore >= 25) return 150;
  if (experienceScore >= 15) return 140;
  if (experienceScore >= 8) return 130;
  return 110;
};

const determineTemperature = (ageBand: Profile['ageBand']): number => {
  if (ageBand === 'teens') return 0.8;
  if (ageBand === 'tweens') return 0.75;
  if (ageBand === 'young_creators') return 0.7;
  return 0.65;
};

export const buildAdaptiveAdjustments = ({
  persona,
  profile,
  telemetry,
}: AdaptiveInput): AdaptiveAdjustments => {
  const stationVisits = telemetry.stationVisitCounts[persona.stationKey] ?? 0;
  const stationCounts = Object.values(telemetry.stationVisitCounts);
  const stationCount = stationCounts.length || 1;
  const averageVisits = Math.max(
    1,
    stationCounts.reduce((sum, count) => sum + (count ?? 0), 0) / stationCount,
  );
  const reflectionVisits = telemetry.stationVisitCounts.reflect ?? 0;

  const hints: string[] = [];
  switch (profile.ageBand) {
    case 'toddlers':
      hints.push('Use playful, concrete language and keep suggestions very brief.');
      break;
    case 'young_creators':
      hints.push('Stay encouraging with one clear next step and a calm tone.');
      break;
    default:
      hints.push('Balance friendly storytelling with optional deeper prompts.');
      break;
  }

  if (stationVisits < averageVisits * 0.75) {
    hints.push('Start with a quick reminder of this station\'s purpose.');
  } else {
    hints.push('Link the response to what they already explored here.');
  }

  if (reflectionVisits >= 3) {
    hints.push('Invite them to mention a recent reflection insight.');
  } else {
    hints.push('Suggest a gentle reflection before moving on.');
  }

  const systemPromptAddition = `Adaptive coaching: ${hints.join(' ')}`;

  return {
    systemPromptAddition,
    maxTokens: determineMaxTokens(telemetry),
    temperature: determineTemperature(profile.ageBand),
  };
};
