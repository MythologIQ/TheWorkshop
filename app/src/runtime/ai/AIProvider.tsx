import React, { createContext, useContext, useMemo, useState } from 'react';
import { loadModel, LoadedModel, StreamChunk } from '../llm/webllm_loader';
import { getDefaultModel, ModelEntry } from '../llm/model_config';

const SAFETY_REMINDERS = [
  'Safety Contract: protect kids with warmth, refuse anything unsafe, and spotlight trustworthy help.',
  'Kind tone, no judgment, and no personal data or adult-only topics.',
];

const CREATIVITY_BOUNDARY_REMINDERS = [
  'Creativity Boundary: keep suggestions concrete, short, and doable with simple tools.',
  'Focus on one question, avoid technical jargon, and keep responses under five key findings.',
];

type CallStationPayload = {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
};

type AIState = {
  model: ModelEntry;
  loading: boolean;
  selectModel: (id: string) => Promise<void>;
  stream: (prompt: string) => AsyncGenerator<StreamChunk, void, unknown>;
  callStationModel: (stationKey: string, payload: CallStationPayload) => AsyncGenerator<StreamChunk, void, unknown>;
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

  const callStationModel = async function* (
    stationKey: string,
    payload: CallStationPayload,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const active = await ensureLoader(model.id);
    const composedSystemPrompt = [
      `Station: ${stationKey}.`,
      'You are a friendly assistant inside The Workshop focused on clarity, kindness, and small wins.',
      ...SAFETY_REMINDERS,
      ...CREATIVITY_BOUNDARY_REMINDERS,
      payload.systemPrompt,
    ]
      .filter(Boolean)
      .join('\n\n');
    for await (const chunk of active.generate(payload.userPrompt, { systemPrompt: composedSystemPrompt, maxTokens: payload.maxTokens, temperature: payload.temperature })) {
      yield chunk;
    }
  };

  const value = useMemo(
    () => ({
      model,
      loading,
      selectModel,
      stream,
      callStationModel,
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
