import { describe, expect, it, beforeEach } from 'vitest';
import { generateSafeResult, safeStream } from '../safeAIHarness';
import { getDefaultModelChoice } from '../../llm/model_config';
import type { LoadedModel } from '../../llm/webllm_loader';
import { clearAIIncidents, getAIIncidents } from '../../store/aiIncidentStore';

const buildStubLoader = (tokens: string[]): LoadedModel => ({
  model: getDefaultModelChoice(),
  async *generate() {
    for (const token of tokens) {
      yield { token, done: false };
    }
    yield { token: '', done: true };
  },
});

describe('safeAIHarness', () => {
  beforeEach(() => {
    clearAIIncidents();
  });

  it('sanitizes output and streams tokens', async () => {
    const loader = buildStubLoader(['hello', 'kiddo']);
    const result = await generateSafeResult(loader, { prompt: 'test' });
    expect(result.text).toContain('hello');
    expect(result.tokens).toContain('hello');

    const streamed: string[] = [];
    for await (const chunk of safeStream(loader, { prompt: 'test' })) {
      if (chunk.done) continue;
      streamed.push(chunk.token);
    }
    expect(streamed).toEqual(result.tokens);
    expect(getAIIncidents()).toHaveLength(0);
  });

  it('returns fallback when loader errors', async () => {
    const loader: LoadedModel = {
      model: getDefaultModelChoice(),
      generate() {
        const generator = async function* () {
          throw new Error('boom');
          yield { token: '', done: true };
        };
        return generator();
      },
    };
    const result = await generateSafeResult(loader, { prompt: 'fail' });
    expect(result.text).toContain("Let's try again together");
    expect(getAIIncidents()).toHaveLength(1);
    expect(getAIIncidents()[0].category).toBe('timeout');
  });
});
