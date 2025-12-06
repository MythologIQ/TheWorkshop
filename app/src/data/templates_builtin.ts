import type { Template } from '../domain/templates';

export const CONTENT_PACKS: Record<string, { name: string; description: string }> = {
  story_pack: {
    name: 'Story Pack',
    description: 'Whimsical narrative starters for guided dramas.',
  },
  adventure_pack: {
    name: 'Adventure Pack',
    description: 'Playful quests that pair idea prompts with simple steps.',
  },
  science_pack: {
    name: 'Science Pack',
    description: 'Curated experiments that keep curiosity safe and grounded.',
  },
};

const templates: Template[] = [
  {
    id: 'robot_dog_comic',
    packId: 'story_pack',
    displayName: 'Robot Dog Comic',
    description: 'Build a friendly robot dog comic that introduces a new hero.',
    recommendedStations: ['idea', 'build'],
    payload: {
      description: 'A short comic idea about a robot dog who learns your favorite snacks.',
      idea: {
        title: 'Robot Dog Comic',
        mission: 'Design a robot dog hero and imagine one mini adventure.',
        goal: 'Help the robot dog solve a problem using kindness and curiosity.',
        starterSteps: ['Sketch your robot dog hero.', 'Write a mission for the robot dog.', 'Plan three panels for your story.'],
      },
      steps: [
        {
          title: 'Draw the robot dog',
          summary: 'Create a sketch of the hero using bold shapes.',
          status: 'todo',
          order: 0,
        },
        {
          title: 'Write the storyline',
          summary: 'Dream up a short adventure with a clear beginning and end.',
          status: 'todo',
          order: 1,
        },
        {
          title: 'Color and share',
          summary: 'Add color or stickers, then show the comic to a friend or adult.',
          status: 'todo',
          order: 2,
        },
      ],
      tags: ['story', 'robot', 'comic'],
    },
  },
  {
    id: 'tiny_game_concept',
    packId: 'adventure_pack',
    displayName: 'Tiny Game Concept',
    description: 'Design a tiny game or play scene with one fun rule.',
    recommendedStations: ['idea', 'build'],
    payload: {
      description: 'A small game idea with one challenge and one victory.',
      idea: {
        title: 'Tiny Game Concept',
        mission: 'Explain how a player wins and what makes the game fun.',
        goal: 'Outline a simple set of rules that keeps the game safe and friendly.',
        starterSteps: ['Think of a goal for the player.', 'List one simple rule.', 'Add a win celebration twist.'],
      },
      steps: [
        {
          title: 'Define the challenge',
          summary: 'Describe the mini quest the player will accomplish.',
          status: 'todo',
          order: 0,
        },
        {
          title: 'Clarify the rules',
          summary: 'Set a calm, friendly rule so everyone can play safely.',
          status: 'todo',
          order: 1,
        },
      ],
      tags: ['game', 'play', 'tiny'],
    },
  },
  {
    id: 'science_experiment_log',
    packId: 'science_pack',
    displayName: 'Science Experiment Log',
    description: 'Capture a simple science experiment with observations and questions.',
    recommendedStations: ['test', 'memory'],
    payload: {
      description: 'Plan a short experiment by recording materials, steps, and what you notice.',
      idea: {
        title: 'Science Experiment Log',
        mission: 'Pick one safe experiment and write down what you expect to see.',
        goal: 'Observe carefully, note what changes, and wonder why things happen.',
        starterSteps: ['Choose a safe material (water, paper, magnets).', 'Predict what will change.', 'Set up the experiment and watch.'],
      },
      tests: [
        {
          question: 'What did you notice after the experiment?',
          outcome: 'needs_work',
          note: 'Remember to describe the small changes.',
          createdAt: '2025-01-01T00:00:00.000Z',
        },
      ],
      memory: {
        entries: [
          {
            proudOf: 'Staying safe with the setup.',
            lesson: 'Small changes can still be interesting.',
            nextTime: 'Try a different object and compare.',
          },
        ],
      },
      tags: ['science', 'experiment', 'log'],
    },
  },
];

export default templates;
