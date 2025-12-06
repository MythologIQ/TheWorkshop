import { describe, expect, it, vi } from 'vitest';

const clearStorage = () => {
  if (typeof globalThis?.localStorage !== 'undefined') {
    globalThis.localStorage.clear();
  }
};

const loadModelModule = async () => {
  vi.resetModules();
  clearStorage();
  return import('../webllm_loader');
};

describe('webllm_loader', () => {
  it('limits tokens based on maxTokens option', async () => {
    const { loadModel } = await loadModelModule();
    const loaded = await loadModel();
    const tokens: string[] = [];
    for await (const chunk of loaded.generate('alpha beta gamma delta', { maxTokens: 2 })) {
      if (chunk.done) break;
      tokens.push(chunk.token);
    }
    expect(tokens).toHaveLength(2);
  });
});
