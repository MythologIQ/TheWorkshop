import { DEFAULT_MODEL_ID } from './model_manifest';
import {
  ChatCompletionChunk,
  ChatCompletionRequestStreaming,
  CreateWebWorkerMLCEngine,
  WebWorkerMLCEngine,
  MLCEngineConfig,
} from '@mlc-ai/web-llm';

export type StreamChunk = { token: string; done: boolean };

export type GenerateOptions = {
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
};

const DEFAULT_MAX_TOKENS = 512;
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_TEMPERATURE = 0.6;

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

const sanitizeToken = (token: string): string => tagUncertainty(scrub(token));

const workerUrl = new URL('./webllm_worker.ts', import.meta.url);

const ENGINE_CONFIG: MLCEngineConfig = {
  logLevel: 'warn',
};

let worker: Worker | null = null;
let enginePromise: Promise<WebWorkerMLCEngine> | null = null;

const resetEngine = () => {
  worker?.terminate();
  worker = null;
  enginePromise = null;
};

const createWorker = (): Worker => {
  if (!worker) {
    worker = new Worker(workerUrl, { type: 'module' });
  }
  return worker;
};

const getEngine = async (): Promise<WebWorkerMLCEngine> => {
  if (!enginePromise) {
    const workerInstance = createWorker();
    enginePromise = CreateWebWorkerMLCEngine(workerInstance, DEFAULT_MODEL_ID, ENGINE_CONFIG).catch(
      (error) => {
        console.error('Failed to initialize WebLLM engine', error);
        resetEngine();
        throw error;
      },
    );
  }
  return enginePromise;
};

export const generateStream = async function* (
  prompt: string,
  opts: GenerateOptions = {},
): AsyncGenerator<StreamChunk, void, unknown> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxTokens = Math.min(opts.maxTokens ?? DEFAULT_MAX_TOKENS, DEFAULT_MAX_TOKENS);
  const temperature = opts.temperature ?? DEFAULT_TEMPERATURE;
  const startTime = Date.now();
  let tokensUsed = 0;
  let doneEmitted = false;

  try {
    const engine = await getEngine();
    const request: ChatCompletionRequestStreaming = {
      model: DEFAULT_MODEL_ID,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: maxTokens,
      temperature,
    };
    const stream = (await engine.chatCompletion(request)) as AsyncIterable<ChatCompletionChunk>;

    for await (const chunk of stream) {
      // Timeout guard keeps low-end devices responsive instead of hanging forever.
      if (Date.now() - startTime > timeoutMs) {
        console.warn('WebLLM request exceeded timeout guard', timeoutMs);
        yield { token: '', done: true };
        doneEmitted = true;
        break;
      }

      const choice = chunk.choices?.[0];
      if (!choice) {
        continue;
      }

      const text = choice.delta?.content;
      if (typeof text === 'string' && text.length > 0) {
        tokensUsed += 1;
        yield { token: sanitizeToken(text), done: false };
      }

      if (choice.finish_reason) {
        if (!doneEmitted) {
          yield { token: '', done: true };
          doneEmitted = true;
        }
        break;
      }

      // Token budget guard keeps outputs short, matching the Creativity Boundary spec.
      if (tokensUsed >= maxTokens) {
        console.warn('WebLLM reached configured token budget');
        if (!doneEmitted) {
          yield { token: '', done: true };
          doneEmitted = true;
        }
        break;
      }
    }
  } catch (error) {
    // Surface a friendly apology so the UI has something to show even if the engine fails.
    const friendly = 'The Workshop AI hit a hiccup. Please try again in a moment.';
    console.error('WebLLM generateStream error', error);
    yield { token: friendly, done: true };
    return;
  }

  if (!doneEmitted) {
    yield { token: '', done: true };
  }
};
