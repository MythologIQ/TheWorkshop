import type { Locale } from './types';

export interface Translation {
  nav: {
    designDock: string;
    assemblyBay: string;
    diagnosticsCorridor: string;
    stellarArchive: string;
    orbiterBridge: string;
    broadcastDeck: string;
    timeTunnels: string;
    settings: string;
  };
  stationNames: {
    idea: string;
    build: string;
    test: string;
    memory: string;
    reflect: string;
    share: string;
    replay: string;
    settings: string;
  };
  headings: {
    settingsTitle: string;
    settingsSubtitle: string;
    settingsLanguage: string;
    settingsLanguageHelp: string;
    settingsAccessibility: string;
    settingsAccessibilityHelp: string;
    settingsExtraLabels: string;
    settingsLargerFont: string;
    timeTunnelsTitle: string;
    timeTunnelsSubtitle: string;
    snapshotsTitle: string;
    snapshotsHeading: string;
    snapshotsEmpty: string;
    statusLabel: string;
    focusTip: string;
  };
  cta: {
    saveSnapshot: string;
    restore: string;
    branch: string;
    inspectSnapshot: string;
    createBranch: string;
  };
  descriptions: {
    idea: string;
    build: string;
    test: string;
    memory: string;
    reflect: string;
    share: string;
    replay: string;
    settings: string;
  };
  hints: {
    timeTunnels: string;
    snapshotCap: string;
    replayReminder: string;
  };
  tutorial: {
    title: string;
    stationLabel: string;
    next: string;
    back: string;
    skip: string;
    done: string;
    buttonLabel: string;
  };
}

const englishTranslation: Translation = {
  nav: {
    designDock: 'Design Dock',
    assemblyBay: 'Assembly Bay',
    diagnosticsCorridor: 'Diagnostics Corridor',
    stellarArchive: 'Stellar Archive',
    orbiterBridge: 'Orbiter Bridge',
    broadcastDeck: 'Broadcast Deck',
    timeTunnels: 'Time Tunnels',
    settings: 'Settings',
  },
  stationNames: {
    idea: 'Design Dock',
    build: 'Assembly Bay',
    test: 'Diagnostics Corridor',
    memory: 'Stellar Archive',
    reflect: 'Orbiter Bridge',
    share: 'Broadcast Deck',
    replay: 'Replay Station',
    settings: 'Settings',
  },
  headings: {
    settingsTitle: 'Settings',
    settingsSubtitle: 'Choose a language and accessibility helpers that feel right for you.',
    settingsLanguage: 'Language',
    settingsLanguageHelp: 'English is active now; other languages are coming soon.',
    settingsAccessibility: 'Accessibility options',
    settingsAccessibilityHelp: 'Track the Workshop using extra labels or a larger base font.',
    settingsExtraLabels: 'Show extra helper labels',
    settingsLargerFont: 'Use a larger base font',
    timeTunnelsTitle: 'Replay Station',
    timeTunnelsSubtitle: 'Save a snapshot whenever you have a moment worth remembering.',
    snapshotsTitle: 'Snapshots',
    snapshotsHeading: 'Explore earlier versions',
    snapshotsEmpty: 'No snapshots yet. Save one to see a timeline of your past choices.',
    statusLabel: 'Status',
    focusTip: 'Use Tab or Shift+Tab to move through these controls.',
  },
  cta: {
    saveSnapshot: 'Save snapshot',
    restore: 'Restore',
    branch: 'Branch',
    inspectSnapshot: 'Inspect snapshot',
    createBranch: 'Create branch',
  },
  descriptions: {
    idea: 'Kick off a project by describing who it is for and drafting a tiny mission.',
    build: 'Plan and ship one small step at a time inside the Assembly Bay.',
    test: 'Check clarity in the Diagnostics Corridor and note what you learn.',
    memory: 'Log wins and lessons above the timeline inside the Stellar Archive.',
    reflect: 'Notice patterns and gentle insights on the Orbiter Bridge.',
    share: 'Craft a short, safe shareable story inside the Broadcast Deck.',
    replay: 'Explore earlier versions in the Time Tunnels and branch safely.',
    settings: 'Update language and accessibility helpers that guide your journey.',
  },
  hints: {
    timeTunnels: 'Keep this area as a gentle time tunnel of earlier project versions.',
    snapshotCap: 'Snapshots are capped at 10 entries and store only the essentials.',
    replayReminder: 'Replay is about learning from past ideas, not regret. Every action is reversible.',
  },
  tutorial: {
    title: 'Guided mission',
    stationLabel: 'Next stop:',
    next: 'Next',
    back: 'Back',
    skip: 'Skip tutorial',
    done: 'Done',
    buttonLabel: 'Try a guided mission',
  },
};

export const TRANSLATIONS: Record<Locale, Translation> = {
  en: englishTranslation,
  es: englishTranslation,
  fr: englishTranslation,
};
