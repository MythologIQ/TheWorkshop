import React, { useEffect } from 'react';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const ensureLocalStorage = () => {
  if (typeof globalThis.localStorage === 'undefined') {
    const store = new Map<string, string>();
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key),
        clear: () => store.clear(),
        key: (index: number) => {
          const keys = Array.from(store.keys());
          return keys[index] ?? null;
        },
        get length() {
          return store.size;
        },
      } as Storage,
      writable: true,
      configurable: true,
    });
  }
};
ensureLocalStorage();

const mockBuildAdaptiveAdjustments = vi.fn(() => ({
  systemPromptAddition: 'adaptive hints',
  maxTokens: 10,
  temperature: 0.5,
}));

vi.mock('../adaptive_engine', () => ({
  buildAdaptiveAdjustments: (...args: unknown[]) => mockBuildAdaptiveAdjustments(...args),
}));

const setPreferences = (adaptiveCoachingEnabled: boolean) => {
  globalThis.localStorage?.setItem(
    'workshop.preferences',
    JSON.stringify({
      locale: 'en',
      largerText: false,
      extraLabels: false,
      adaptiveCoachingEnabled,
    }),
  );
};

describe('AIProvider adaptive coaching toggle', () => {
  beforeEach(() => {
    mockBuildAdaptiveAdjustments.mockClear();
    globalThis.localStorage?.clear();
  });

  afterEach(() => {
    cleanup();
  });

  const renderWithProviders = async () => {
    const { AIProvider, useAI } = await import('../AIProvider');
    const { PreferencesProvider } = await import('../../context/preferencesContext');

    let aiState: ReturnType<typeof useAI> | null = null;
    const Collector: React.FC<{ onReady: (state: ReturnType<typeof useAI>) => void }> = ({ onReady }) => {
      const ai = useAI();
      useEffect(() => {
        onReady(ai);
      }, [ai, onReady]);
      return null;
    };

    render(
      <PreferencesProvider>
        <AIProvider>
          <Collector onReady={(state) => (aiState = state)} />
        </AIProvider>
      </PreferencesProvider>,
    );

    await waitFor(() => expect(aiState).not.toBeNull());
    return aiState as ReturnType<typeof useAI>;
  };

  it('calls the adaptive engine when enabled', async () => {
    setPreferences(true);
    const aiState = await renderWithProviders();
    await act(async () => {
      const stream = aiState.streamWithPersona({ userPrompt: 'hello', stationKey: 'idea' });
      await stream.next();
    });
    expect(mockBuildAdaptiveAdjustments).toHaveBeenCalled();
  });

  it('skips the adaptive engine when disabled', async () => {
    setPreferences(false);
    const aiState = await renderWithProviders();
    await act(async () => {
      const stream = aiState.streamWithPersona({ userPrompt: 'hello again', stationKey: 'idea' });
      await stream.next();
    });
    expect(mockBuildAdaptiveAdjustments).not.toHaveBeenCalled();
  });
});
