import type { StationKey } from '../../domain/project';
import type { LoadedModel, StreamChunk } from '../llm/webllm_loader';
import { clampReadingLevel, enforceChildTone, redactDisallowedContent } from '../safety/child_mode_governor';
import { logAIIncident, AIIncidentCategory } from '../store/aiIncidentStore';

export type SafeAIRequest = {
  prompt: string;
  stationKey?: StationKey;
  intent?: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
};

export type SafeAIResult = {
  text: string;
  tokens: string[];
};

const FALLBACK_MESSAGE = "Let's try again together. Can you describe that another way?";
const MAX_RESPONSE_LENGTH = 1024;

const chunkText = (text: string): string[] => text.split(/\s+/).filter(Boolean);

const composePrompt = (request: SafeAIRequest): string => {
  const system = request.systemPrompt?.trim();
  if (system) {
    return `${system}\n\n${request.prompt}`;
  }
  return request.prompt;
};

const sanitizeText = (text: string): string => {
  const limited = clampReadingLevel(text);
  const toned = enforceChildTone(limited);
  return redactDisallowedContent(toned).trim();
};

const createFallback = (
  stationKey: StationKey | undefined,
  category: AIIncidentCategory,
  description?: string,
): SafeAIResult => {
  logAIIncident({ station: stationKey, category, description });
  const tokens = chunkText(FALLBACK_MESSAGE);
  return { text: FALLBACK_MESSAGE, tokens };
};

export const generateSafeResult = async (
  loader: LoadedModel,
  request: SafeAIRequest,
): Promise<SafeAIResult> => {
  try {
    const prompt = composePrompt(request);
    const tokens: string[] = [];
    for await (const chunk of loader.generate(prompt, {
      maxTokens: request.maxTokens,
      temperature: request.temperature,
    })) {
      if (chunk.done || !chunk.token) continue;
      tokens.push(chunk.token);
    }
    const aggregated = tokens.join(' ').trim();
    if (!aggregated) {
      return createFallback(request.stationKey, 'invalid_shape', 'Model returned empty output');
    }
    const sanitized = sanitizeText(aggregated);
    if (!sanitized) {
      return createFallback(request.stationKey, 'redaction', 'Governor removed all content');
    }
    const truncated =
      sanitized.length > MAX_RESPONSE_LENGTH ? `${sanitized.slice(0, MAX_RESPONSE_LENGTH).trim()}...` : sanitized;
    const outputTokens = chunkText(truncated);
    if (outputTokens.length === 0) {
      return createFallback(request.stationKey, 'invalid_shape', 'Sanitized response contained no tokens');
    }
    return { text: truncated, tokens: outputTokens };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return createFallback(request.stationKey, 'timeout', message);
  }
};

export async function* safeStream(
  loader: LoadedModel,
  request: SafeAIRequest,
): AsyncGenerator<StreamChunk, void, unknown> {
  const result = await generateSafeResult(loader, request);
  for (const token of result.tokens) {
    yield { token, done: false };
  }
  yield { token: '', done: true };
}
