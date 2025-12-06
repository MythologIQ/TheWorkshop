import { useSyncExternalStore } from 'react';
import {
  completeTutorial,
  getTutorialState,
  nextStep,
  prevStep,
  resetTutorial,
  startTutorial,
  subscribe,
} from '../store/tutorialStore';

export const useTutorial = () => {
  const tutorialState = useSyncExternalStore(subscribe, getTutorialState, () => ({
    activeTutorialId: null,
    currentStepIndex: 0,
  }));

  return {
    tutorialState,
    startTutorial,
    nextStep,
    prevStep,
    completeTutorial,
    resetTutorial,
  };
};
