import type { StationKey } from './project';

export type TutorialId = 'robot_dog_comic';

export type StepHintPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetStationKey: StationKey;
  targetElementId?: string;
  hintPlacement?: StepHintPlacement;
}

export interface TutorialState {
  activeTutorialId: TutorialId | null;
  currentStepIndex: number;
  completedAt?: string;
}
