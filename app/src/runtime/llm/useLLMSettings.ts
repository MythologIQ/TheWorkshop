import { useSyncExternalStore } from 'react';
import { getLLMSettings, subscribeToLLMSettings } from './llmSettingsStore';

export const useLLMSettings = () =>
  useSyncExternalStore(subscribeToLLMSettings, getLLMSettings, () => getLLMSettings());
