import manifest from './model_manifest.json';

export type ModelChoice = {
  id: string;
  label: string;
  size: string;
  quantization: string;
  priority: number;
  provider: string;
  maxTokens: number;
};

export type PerformanceMode = {
  id: 'calm' | 'balanced' | 'adventure';
  label: string;
  description: string;
  multiplier: number;
};

export type PerformanceModeId = PerformanceMode['id'];

type Manifest = {
  models: ModelChoice[];
};

const typedManifest = manifest as Manifest;
const MODEL_CHOICES = [...typedManifest.models].sort((a, b) => a.priority - b.priority);

export const PERFORMANCE_MODES: PerformanceMode[] = [
  {
    id: 'calm',
    label: 'Calm mode',
    description: 'Short answers with extra reassurance for younger explorers.',
    multiplier: 0.75,
  },
  {
    id: 'balanced',
    label: 'Balanced mode',
    description: 'The kids-first default for friendly creativity.',
    multiplier: 1.0,
  },
  {
    id: 'adventure',
    label: 'Adventure mode',
    description: 'Extended responses for adult-guided discovery.',
    multiplier: 1.25,
  },
];

export const getModelChoices = (): ModelChoice[] => [...MODEL_CHOICES];

export const getDefaultModelChoice = (): ModelChoice => MODEL_CHOICES[0];

export const findModelChoice = (id: string): ModelChoice | undefined =>
  MODEL_CHOICES.find((model) => model.id === id);

export const getPerformanceModes = (): PerformanceMode[] => [...PERFORMANCE_MODES];

export const getPerformanceMode = (id: string): PerformanceMode | undefined =>
  PERFORMANCE_MODES.find((mode) => mode.id === id);

export const getDefaultPerformanceMode = (): PerformanceMode => PERFORMANCE_MODES[1];

export const calculateTokenCap = (modelId: string, modeId: PerformanceModeId): number => {
  const model = findModelChoice(modelId) ?? getDefaultModelChoice();
  const mode = getPerformanceMode(modeId) ?? getDefaultPerformanceMode();
  const base = model.maxTokens ?? 2048;
  const computed = Math.floor(base * mode.multiplier);
  return Math.max(128, computed);
};
