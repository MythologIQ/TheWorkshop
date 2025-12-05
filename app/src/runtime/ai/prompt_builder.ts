export type StationKey = 'idea' | 'build' | 'test' | 'memory' | 'reflect' | 'share' | 'replay';

export type StationPayload = {
  systemPrompt: string;
  userPrompt: string;
};

const SAFETY_CONTRACT_HIGHLIGHTS = [
  'No self-harm, violence, abuse, or illegal activity; redirect gently if something unsafe appears.',
  'Maintain a warm, encouraging tone and celebrate effort while avoiding shaming or scolding.',
  'Protect privacy by avoiding personal identifiers and refusing to act as a medical, legal, or authoritative expert.',
  'Offer compassionate refusals when required and encourage asking a trusted adult for help when needed.',
];

const CREATIVITY_BOUNDARY_HIGHLIGHTS = [
  'Turn big imaginations into small, finishable slices that a child can actually try today.',
  'Base suggestions on low-tech tools (paper, pencils, basic craft supplies, simple digital tools).',
  'Limit output to a few concrete, actionable steps and avoid branching into long, unfocused narratives.',
  'Encourage honesty about what can be done now and remind children it is ok to revisit ideas later.',
];

const STATION_DESCRIPTIONS: Record<StationKey, string> = {
  idea: 'Idea Station (Design Dock) — turn a vague wish into a small mission with a short title, mission, and goal.',
  build: 'Build Station (Assembly Bay) — focus on one active step, explain tools, celebrate small finishes.',
  test: 'Test Station (Diagnostics Corridor) — ask one question, harvest up to five observations framed as discoveries.',
  memory: 'Memory Station (Stellar Archive) — capture a win, a lesson, and a next-time intention with calm tone.',
  reflect: 'Reflect Station (Orbiter Bridge) — notice patterns with gentle tags and short future-focused notes.',
  share: 'Share Station (Broadcast Deck) — package an artifact for a safe audience in a bounded format.',
  replay: 'Replay Station (Time Tunnels) — revisit one snapshot at a time, create branches deliberately.',
};

export const buildStationPrompt = (stationKey: StationKey, payload: StationPayload): string => {
  const safetySection = [
    '### Safety Contract Reminder',
    'Apply the following rules before answering:',
    ...SAFETY_CONTRACT_HIGHLIGHTS,
  ].join('\n\n');

  const creativitySection = [
    '### Creativity Boundary Reminder',
    'Keep the Workshop constraints in mind for every step:',
    ...CREATIVITY_BOUNDARY_HIGHLIGHTS,
  ].join('\n\n');

  const stationSection = [
    `### Station Context (${stationKey})`,
    STATION_DESCRIPTIONS[stationKey],
    '### Station System Prompt',
    payload.systemPrompt.trim(),
  ].join('\n\n');

  const userSection = [
    '### User Input',
    payload.userPrompt.trim(),
  ].join('\n\n');

  // Compose the sections in a consistent order so future maintainers can quickly see the safety and boundary text before station/user content.
  return [safetySection, creativitySection, stationSection, userSection].join('\n\n');
};
