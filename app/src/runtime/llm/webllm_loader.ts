import {
  calculateTokenCap,
  findModelChoice,
  getDefaultModelChoice,
  ModelChoice,
} from './model_config';
import { getLLMSettings, subscribeToLLMSettings } from './llmSettingsStore';

export type StreamChunk = { token: string; done: boolean };

type GenerateOptions = {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
};

const DISALLOWED_PATTERNS = [/suicide/i, /self-harm/i, /violence/i, /kill/i, /weapon/i];
const scrub = (text: string): string => {
  let cleaned = text;
  DISALLOWED_PATTERNS.forEach((pat) => {
    cleaned = cleaned.replace(pat, '[filtered]');
  });
  return cleaned;
};

const tagUncertainty = (text: string): string => {
  const uncertain = /\b(maybe|perhaps|not sure|guess)\b/i.test(text);
  return uncertain ? `${text} (?)` : text;
};

export type LoadedModel = {
  model: ModelChoice;
  generate: (prompt: string, opts?: GenerateOptions) => AsyncGenerator<StreamChunk, void, unknown>;
};

type WebLLMEngine = {
  generate: (prompt: string, opts?: GenerateOptions) => AsyncGenerator<string, void, unknown>;
};

const createStubEngine = (): WebLLMEngine => ({
  async *generate(prompt: string) {
    const tokens = scrub(prompt)
      .split(/\s+/)
      .slice(0, 64);
    for (const token of tokens) {
      yield token;
    }
  },
});

let cachedSettings = getLLMSettings();
let cachedLoader: LoadedModel | null = null;

subscribeToLLMSettings(() => {
  cachedSettings = getLLMSettings();
  cachedLoader = null;
});

export const loadModel = async (modelId?: string): Promise<LoadedModel> => {
  const specimenId = modelId ?? cachedSettings.modelId;
  const model = findModelChoice(specimenId) ?? getDefaultModelChoice();
  if (cachedLoader && cachedLoader.model.id === model.id) {
    return cachedLoader;
  }

  const engine = createStubEngine();
  const tokenCap = calculateTokenCap(model.id, cachedSettings.performanceModeId);

  const generate = async function* (
    prompt: string,
    opts?: GenerateOptions,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const systemPrefix = opts?.systemPrompt ? `${opts.systemPrompt}\n` : '';
    const composed = `${systemPrefix}${prompt}`;
    let count = 0;
    const allowedTokens = opts?.maxTokens
      ? Math.min(opts.maxTokens, tokenCap)
      : tokenCap;
    for await (const token of engine.generate(composed, opts)) {
      if (count >= allowedTokens) break;
      const safeToken = tagUncertainty(scrub(token));
      yield { token: safeToken, done: false };
      count += 1;
    }
    yield { token: '', done: true };
  };

  cachedLoader = { model, generate };
  return cachedLoader;
};
