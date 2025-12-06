import type { TutorialId, TutorialStep } from '../../domain/tutorial';

export const ROBOT_DOG_COMIC_STEPS: TutorialStep[] = [
  {
    id: 'idea',
    title: 'Shape your robot dog story',
    description: 'Think about who the robot dog helps and imagine a little mission brief for Design Dock.',
    targetStationKey: 'idea',
    targetElementId: 'guided-mission-button',
    hintPlacement: 'bottom',
  },
  {
    id: 'build',
    title: 'Pick a warning step in Assembly Bay',
    description: 'Choose a tiny starter step, draw the first panel, and mark it done to keep momentum.',
    targetStationKey: 'build',
    targetElementId: 'nav-build',
    hintPlacement: 'top',
  },
  {
    id: 'test',
    title: 'Check clarity in Diagnostics Corridor',
    description: 'Ask if the robot dog story makes sense, then jot down feedback you can act on.',
    targetStationKey: 'test',
    targetElementId: 'nav-test',
  },
  {
    id: 'memory',
    title: 'Log a win in Stellar Archive',
    description: 'Note what worked, something you learned, and a next idea for another adventure.',
    targetStationKey: 'memory',
    targetElementId: 'nav-memory',
  },
  {
    id: 'share',
    title: 'Share the Robot Dog Comic',
    description: 'Craft a short summary inside Broadcast Deck and get ready to show it to someone you trust.',
    targetStationKey: 'share',
    targetElementId: 'nav-share',
  },
];

export const TUTORIALS: Record<TutorialId, TutorialStep[]> = {
  robot_dog_comic: ROBOT_DOG_COMIC_STEPS,
};
