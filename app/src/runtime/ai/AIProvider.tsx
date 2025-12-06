import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { StationKey } from '../../domain/project';
import { loadModel, LoadedModel, StreamChunk } from '../llm/webllm_loader';
import {
  ModelChoice,
  PerformanceModeId,
  calculateTokenCap,
  findModelChoice,
  getDefaultModelChoice,
} from '../llm/model_config';
import { setLLMModelChoice, setLLMPerformanceMode } from '../llm/llmSettingsStore';
import { useLLMSettings } from '../llm/useLLMSettings';
import { usePreferences } from '../context/preferencesContext';
import { getActiveProfile } from '../store/profileStore';
import { getTelemetryState } from '../store/telemetryStore';
import { buildAdaptiveAdjustments } from './adaptive_engine';
import { buildPersonaSystemPrompt, getPersonaForStation } from './ai_personas';

type GenerateOptions = {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
};

export type StreamChunk = { token: string; done: boolean };

const AIContext = createContext<AIState | null>(null);

type AIState = {
  model: ModelChoice;
  loading: boolean;
  performanceModeId: PerformanceModeId;
  selectModel: (id: string) => Promise<void>;
  selectPerformanceMode: (modeId: PerformanceModeId) => void;
  stream: (prompt: string, opts?: GenerateOptions) => AsyncGenerator<StreamChunk, void, unknown>;
  streamWithPersona: (payload: PersonaStreamArgs) => AsyncGenerator<StreamChunk, void, unknown>;
};

type PersonaStreamArgs = {
  userPrompt: string;
  stationKey?: StationKey;
  action?: string;
  opts?: GenerateOptions;
};

const scrub = (text: string): string => {
  const DISALLOWED_PATTERNS = [/suicide/i, /self-harm/i, /violence/i, /kill/i, /weapon/i];
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

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = useLLMSettings();
  const { preferences } = usePreferences();
  const adaptiveEnabled = preferences.adaptiveCoachingEnabled;
  const [model, setModel] = useState<ModelChoice>(() => findModelChoice(settings.modelId) ?? getDefaultModelChoice());
  const [loader, setLoader] = useState<LoadedModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      setLoader(null);
      setLoading(true);
      const next = await loadModel(settings.modelId);
      if (!active) return;
      setLoader(next);
      setModel(next.model);
      setLoading(false);
    };
    refresh();
    return () => {
      active = false;
    };
  }, [settings.modelId, settings.performanceModeId]);

  const ensureLoader = useCallback(async (): Promise<LoadedModel> => {
    if (loader) return loader;
    const next = await loadModel(settings.modelId);
    setLoader(next);
    setModel(next.model);
    return next;
  }, [loader, settings.modelId]);

  const selectModel = useCallback(
    async (id: string) => {
      if (settings.modelId === id) return;
      setLLMModelChoice(id);
    },
    [settings.modelId],
  );

  const selectPerformanceMode = useCallback(
    (modeId: PerformanceModeId) => {
      if (settings.performanceModeId === modeId) return;
      setLLMPerformanceMode(modeId);
    },
    [settings.performanceModeId],
  );

  const stream = useMemo(
    () => async function* (prompt: string, opts?: GenerateOptions): AsyncGenerator<StreamChunk, void, unknown> {
      const active = await ensureLoader();
      const tokenCap = calculateTokenCap(active.model.id, settings.performanceModeId);
      const systemPrefix = opts?.systemPrompt ? `${opts.systemPrompt}\n` : '';
      const composed = `${systemPrefix}${prompt}`;
      let count = 0;
      const allowedTokens = opts?.maxTokens ? Math.min(opts.maxTokens, tokenCap) : tokenCap;
      for await (const chunk of active.generate(composed, opts)) {
        if (count >= allowedTokens) break;
        const safeToken = tagUncertainty(scrub(chunk.token));
        yield { token: safeToken, done: chunk.done };
        count += 1;
      }
      yield { token: '', done: true };
    },
    [ensureLoader, settings.performanceModeId],
  );

  const streamWithPersona = useMemo(
    () =>
      async function* ({
        userPrompt,
        stationKey,
        action,
        opts,
      }: PersonaStreamArgs): AsyncGenerator<StreamChunk, void, unknown> {
        const persona = getPersonaForStation(stationKey);
        const personaPrompt = buildPersonaSystemPrompt({ stationKey, action });
        const adjustments = adaptiveEnabled
          ? buildAdaptiveAdjustments({
              persona,
              profile: getActiveProfile(),
              telemetry: getTelemetryState(),
            })
          : undefined;
        const systemPromptPieces = [opts?.systemPrompt, personaPrompt, adjustments?.systemPromptAddition].filter(
          Boolean,
        );
        const mergedOpts: GenerateOptions = { ...(opts ?? {}) };
        if (adjustments?.maxTokens !== undefined && mergedOpts.maxTokens == null) {
          mergedOpts.maxTokens = adjustments.maxTokens;
        }
        if (adjustments?.temperature !== undefined && mergedOpts.temperature == null) {
          mergedOpts.temperature = adjustments.temperature;
        }
        const combinedSystemPrompt = systemPromptPieces.join('\n\n');
        yield* stream(userPrompt, { ...mergedOpts, systemPrompt: combinedSystemPrompt });
      },
    [adaptiveEnabled, stream],
  );

  const value = useMemo(
    () => ({
      model,
      loading,
      performanceModeId: settings.performanceModeId,
      selectModel,
      selectPerformanceMode,
      stream,
      streamWithPersona,
    }),
    [model, loading, selectModel, selectPerformanceMode, settings.performanceModeId, stream, streamWithPersona],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = (): AIState => {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used within AIProvider');
  return ctx;
};
