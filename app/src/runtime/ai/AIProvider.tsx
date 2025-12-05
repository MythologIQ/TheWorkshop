import React, { createContext, useContext, useMemo, useState } from 'react';
import { loadModel, LoadedModel, StreamChunk } from '../llm/webllm_loader';
import { getDefaultModel, ModelEntry } from '../llm/model_config';

type AIState = {
  model: ModelEntry;
  loading: boolean;
  selectModel: (id: string) => Promise<void>;
  stream: (prompt: string) => AsyncGenerator<StreamChunk, void, unknown>;
};

const AIContext = createContext<AIState | null>(null);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [model, setModel] = useState<ModelEntry>(getDefaultModel());
  const [loader, setLoader] = useState<LoadedModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const ensureLoader = async (id?: string): Promise<LoadedModel> => {
    if (loader && (!id || loader.model.id === id)) return loader;
    setLoading(true);
    const next = await loadModel(id);
    setLoader(next);
    setModel(next.model);
    setLoading(false);
    return next;
  };

  const selectModel = async (id: string) => {
    await ensureLoader(id);
  };

  const stream = async function* (prompt: string): AsyncGenerator<StreamChunk, void, unknown> {
    const active = await ensureLoader(model.id);
    for await (const chunk of active.generate(prompt, { systemPrompt: 'Follow Workshop safety.' })) {
      yield chunk;
    }
  };

  const value = useMemo(
    () => ({
      model,
      loading,
      selectModel,
      stream,
    }),
    [model, loading],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = (): AIState => {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used within AIProvider');
  return ctx;
};
