import type { TutorialId, TutorialState } from '../../domain/tutorial';

const STORAGE_KEY = 'workshop.tutorial';

const defaultState: TutorialState = {
  activeTutorialId: null,
  currentStepIndex: 0,
};

const storageAvailable = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const loadState = (): TutorialState => {
  if (!storageAvailable()) return defaultState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
    };
  } catch {
    return defaultState;
  }
};

const persistState = (state: TutorialState) => {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors to keep the experience running.
  }
};

let currentState: TutorialState = loadState();
const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const updateState = (state: TutorialState) => {
  currentState = state;
  persistState(state);
  notify();
};

export const getTutorialState = (): TutorialState => currentState;

export const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const startTutorial = (tutorialId: TutorialId): void => {
  updateState({
    activeTutorialId: tutorialId,
    currentStepIndex: 0,
    completedAt: undefined,
  });
};

export const resetTutorial = (tutorialId: TutorialId): void => {
  startTutorial(tutorialId);
};

export const completeTutorial = (): void => {
  updateState({
    activeTutorialId: null,
    currentStepIndex: 0,
    completedAt: new Date().toISOString(),
  });
};

export const nextStep = (totalSteps: number): void => {
  if (!currentState.activeTutorialId) return;
  const nextIndex = currentState.currentStepIndex + 1;
  if (nextIndex >= totalSteps) {
    completeTutorial();
    return;
  }
  updateState({
    ...currentState,
    currentStepIndex: nextIndex,
  });
};

export const prevStep = (): void => {
  if (!currentState.activeTutorialId) return;
  const prevIndex = Math.max(currentState.currentStepIndex - 1, 0);
  updateState({
    ...currentState,
    currentStepIndex: prevIndex,
  });
};
