import {
  calculateTokenCap,
  getDefaultModelChoice,
  getDefaultPerformanceMode,
  getPerformanceMode,
  findModelChoice,
  PerformanceModeId,
} from './model_config';

const STORAGE_KEY = 'workshop.llm.settings';

export type LLMSettingsState = {
  modelId: string;
  performanceModeId: PerformanceModeId;
  tokenCap: number;
};

const DEFAULT_MODEL = getDefaultModelChoice();
const DEFAULT_PERFORMANCE_MODE = getDefaultPerformanceMode();

const DEFAULT_STATE: LLMSettingsState = {
  modelId: DEFAULT_MODEL.id,
  performanceModeId: DEFAULT_PERFORMANCE_MODE.id,
  tokenCap: calculateTokenCap(DEFAULT_MODEL.id, DEFAULT_PERFORMANCE_MODE.id),
};

const normalizeState = (raw?: Partial<LLMSettingsState>): LLMSettingsState => {
  const modelId = raw?.modelId ?? DEFAULT_STATE.modelId;
  const modeId = raw?.performanceModeId ?? DEFAULT_STATE.performanceModeId;
  const validatedModel = findModelChoice(modelId) ?? DEFAULT_MODEL;
  const validatedMode = getPerformanceMode(modeId) ?? DEFAULT_PERFORMANCE_MODE;
  return {
    modelId: validatedModel.id,
    performanceModeId: validatedMode.id,
    tokenCap: calculateTokenCap(validatedModel.id, validatedMode.id),
  };
};

const loadState = (): LLMSettingsState => {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_STATE;
  try {
    const parsed = JSON.parse(raw) as Partial<LLMSettingsState>;
    return normalizeState(parsed);
  } catch {
    return DEFAULT_STATE;
  }
};

const listeners = new Set<() => void>();

let state: LLMSettingsState = loadState();

const persistState = () => {
  if (typeof window === 'undefined') return;
  const payload = {
    modelId: state.modelId,
    performanceModeId: state.performanceModeId,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

const updateState = (next: LLMSettingsState) => {
  state = next;
  persistState();
  notify();
};

export const getLLMSettings = (): LLMSettingsState => state;

export const subscribeToLLMSettings = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const commit = (patch: Partial<LLMSettingsState>) => {
  const next = normalizeState({ ...state, ...patch });
  updateState(next);
};

export const setLLMModelChoice = (modelId: string) => {
  commit({ modelId });
};

export const setLLMPerformanceMode = (modeId: PerformanceModeId) => {
  commit({ performanceModeId: modeId });
};
