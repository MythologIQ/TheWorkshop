import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { generateStream, StreamChunk } from '../llm/webllm_loader';
import { buildStationPrompt, StationKey, StationPayload } from './prompt_builder';

export type AIContextValue = {
  streamStationCall: (stationKey: StationKey, payload: StationPayload) => AsyncGenerator<StreamChunk, void, unknown>;
  lastError: string | null;
  lastStationKey: StationKey | null;
  isStreaming: boolean;
};

const AIContext = createContext<AIContextValue | null>(null);

const MAX_TOKEN_BUDGET = 400; // Keep outputs short so the local model stays responsive.
const STREAM_TIMEOUT_MS = 15_000; // Friendly timeout for slow devices (milliseconds).

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastStationKey, setLastStationKey] = useState<StationKey | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const streamStationCall = useCallback(
    (stationKey: StationKey, payload: StationPayload): AsyncGenerator<StreamChunk, void, unknown> => {
      const finalPrompt = buildStationPrompt(stationKey, payload);

      const generator = (async function* () {
        setIsStreaming(true);
        setLastStationKey(stationKey);
        setLastError(null);
        const startTime = Date.now();
        let tokensUsed = 0;

        try {
          const stream = generateStream(finalPrompt, { maxTokens: MAX_TOKEN_BUDGET });

          for await (const chunk of stream) {
            const elapsed = Date.now() - startTime;
            if (elapsed > STREAM_TIMEOUT_MS) {
              const timeoutMessage = `AI request timed out after ${STREAM_TIMEOUT_MS / 1000} seconds.`;
              setLastError(timeoutMessage);
              yield { token: '', done: true };
              break;
            }

            if (tokensUsed >= MAX_TOKEN_BUDGET) {
              const budgetMessage = `Reached the token budget of ${MAX_TOKEN_BUDGET}.`;
              setLastError(budgetMessage);
              yield { token: '', done: true };
              break;
            }

            tokensUsed += chunk.token ? 1 : 0;
            yield chunk;

            if (chunk.done) break;
          }
        } catch (error) {
          const errMessage = error instanceof Error ? error.message : 'Unknown AI error';
          setLastError(errMessage);
          throw error;
        } finally {
          setIsStreaming(false);
        }
      })();

      return generator;
    },
    [],
  );

  const value = useMemo(
    () => ({
      streamStationCall,
      lastError,
      lastStationKey,
      isStreaming,
    }),
    [streamStationCall, lastError, lastStationKey, isStreaming],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = (): AIContextValue => {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used within AIProvider');
  return ctx;
};
