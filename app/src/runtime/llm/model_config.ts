import manifest from './model_manifest.json';

export type ModelEntry = {
  id: string;
  label: string;
  size: string;
  quantization: string;
  priority: number;
  provider: string;
};

type Manifest = {
  models: ModelEntry[];
};

const typedManifest = manifest as Manifest;

export const getModels = (): ModelEntry[] =>
  [...typedManifest.models].sort((a, b) => a.priority - b.priority);

export const getDefaultModel = (): ModelEntry => getModels()[0];

export const findModel = (id: string): ModelEntry | undefined =>
  getModels().find((m) => m.id === id);
