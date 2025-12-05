import { StationKey } from '../../domain/project';

const SAFETY_REMINDERS = `
Safety Contract (docs/SAFETY_CONTRACT.md):
- refuse or redirect any request that mentions self-harm, violence, harassment, illegal activities, or expert-level advice.
- stay kind, young-friendly, and privacy-safe; offer gentle alternatives when something feels unsafe.
`.trim();

const CREATIVITY_BOUNDARY = `
Creativity Boundary (docs/CREATIVITY_BOUNDARY_SPEC.md):
- Title: 60 chars max. Mission: 400 chars max. Goal: 200 chars max.
- Starter steps: 1-3 entries, each no more than 140 chars, focused on small, finishable actions.
- Frame every suggestion within the Ask → Reflect → Plan → Act → Review learning loop.
`.trim();

export const buildStationPrompt = (
  stationKey: StationKey,
  systemPrompt: string,
  userPrompt: string,
): string => {
  const safeSystem = systemPrompt.trim();
  const safeUser = userPrompt.trim();
  return [
    `Station: ${stationKey} (Design Dock for idea station, Assembly Bay for build, etc.)`,
    SAFETY_REMINDERS,
    CREATIVITY_BOUNDARY,
    safeSystem ? `System instructions:\n${safeSystem}` : 'System instructions: (none provided)',
    safeUser ? `User prompt:\n${safeUser}` : 'User prompt: (empty)',
  ].join('\n\n');
};
