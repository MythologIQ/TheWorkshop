import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { loadModel, LoadedModel, StreamChunk, GenerateOptions } from '../llm/webllm_loader';
import { getDefaultModel, ModelEntry } from '../llm/model_config';
import { StationKey } from '../../domain/project';
import { buildStationPrompt } from './prompt_builder';

type StationCallPayload = {
  systemPrompt: string;
  userPrompt: string;
};

type AIState = {
  model: ModelEntry;
  loading: boolean;
  selectModel: (id: string) => Promise<void>;
  stream: (prompt: string, opts?: GenerateOptions) => AsyncGenerator<StreamChunk, void, unknown>;
  callStationModel: (
    stationKey: StationKey,
    payload: StationCallPayload,
  ) => AsyncGenerator<StreamChunk, void, unknown>;
};

const AIContext = createContext<AIState | null>(null);

const MAX_STATION_TOKENS = 512;
const DEFAULT_TEMPERATURE = 0.7;

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [model, setModel] = useState<ModelEntry>(getDefaultModel());
  const [loader, setLoader] = useState<LoadedModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const ensureLoader = useCallback(
    async (id?: string): Promise<LoadedModel> => {
      if (loader && (!id || loader.model.id === id)) return loader;
      setLoading(true);
      const next = await loadModel(id);
      setLoader(next);
      setModel(next.model);
      setLoading(false);
      return next;
    },
    [loader],
  );

  const selectModel = useCallback(
    async (id: string) => {
      await ensureLoader(id);
    },
    [ensureLoader],
  );

  const stream = useCallback(
    async function* (prompt: string, opts?: GenerateOptions): AsyncGenerator<StreamChunk, void, unknown> {
      const active = await ensureLoader(model.id);
      for await (const chunk of active.generate(prompt, opts)) {
        yield chunk;
      }
    },
    [ensureLoader, model.id],
  );

  const callStationModel = useCallback(
    async function* (stationKey: StationKey, payload: StationCallPayload): AsyncGenerator<StreamChunk, void, unknown> {
      const finalPrompt = buildStationPrompt(stationKey, payload.systemPrompt, payload.userPrompt);
      const generator = stream(finalPrompt, {
        maxTokens: MAX_STATION_TOKENS,
        temperature: DEFAULT_TEMPERATURE,
      });
      for await (const chunk of generator) {
        yield chunk;
      }
    },
    [stream],
  );

  const value = useMemo(
    () => ({
      model,
      loading,
      selectModel,
      stream,
      callStationModel,
    }),
    [model, loading, selectModel, stream, callStationModel],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = (): AIState => {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used within AIProvider');
  return ctx;
};
