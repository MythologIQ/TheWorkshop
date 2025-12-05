import { getDefaultModel, findModel, ModelEntry } from './model_config';

export type StreamChunk = { token: string; done: boolean };

export type GenerateOptions = {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
};

// Safety wrapper: strips disallowed content and tags obvious uncertainty.
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
  model: ModelEntry;
  generate: (prompt: string, opts?: GenerateOptions) => AsyncGenerator<StreamChunk, void, unknown>;
};

// Placeholder interface to a WebLLM engine; swap with real import when available.
type WebLLMEngine = {
  generate: (prompt: string, opts?: GenerateOptions) => AsyncGenerator<string, void, unknown>;
};

// TODO: wire to actual WebLLM init; for now, create a stub generator.
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

export const loadModel = async (modelId?: string): Promise<LoadedModel> => {
  const model = findModel(modelId || '') || getDefaultModel();
  const engine = createStubEngine();

  const generate = async function* (
    prompt: string,
    opts?: GenerateOptions,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const systemPrefix = opts?.systemPrompt ? `${opts.systemPrompt}\n` : '';
    const composed = `${systemPrefix}${prompt}`;
    let count = 0;
    for await (const token of engine.generate(composed, opts)) {
      if (opts?.maxTokens && count >= opts.maxTokens) break;
      const safeToken = tagUncertainty(scrub(token));
      yield { token: safeToken, done: false };
      count += 1;
    }
    yield { token: '', done: true };
  };

  return { model, generate };
};
