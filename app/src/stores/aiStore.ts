import { useEffect, useState } from 'react';
import { getDefaultModel, ModelEntry } from '../runtime/llm/model_config';

const aiBus = new EventTarget();
let aiState: { model: ModelEntry } = { model: getDefaultModel() };

export const setAIModel = (model: ModelEntry) => {
  aiState = { model };
  aiBus.dispatchEvent(new Event('update'));
};

export const useAIStore = () => {
  const [model, setLocalModel] = useState<ModelEntry>(aiState.model);

  useEffect(() => {
    const handler = () => setLocalModel(aiState.model);
    aiBus.addEventListener('update', handler);
    return () => aiBus.removeEventListener('update', handler);
  }, []);

  return { model, setAIModel };
};
