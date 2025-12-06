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
    diagnostics: string;
    projects: string;
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
  ai: {
    heading: string;
    description: string;
    modelLabel: string;
    modelHint: string;
    modeLabel: string;
    modeHint: string;
    tokenCap: string;
    adaptiveToggleLabel: string;
    adaptiveToggleHelp: string;
  };
  projectTools: {
    heading: string;
    description: string;
    exportLabel: string;
    importLabel: string;
    safetyReminder: string;
    statusNeedsProject: string;
    statusExport: string;
    statusImportSuccess: string;
    statusImportFailure: string;
  };
  insights: {
    heading: string;
    description: string;
    privacyNote: string;
    totalProjectsLabel: string;
    completedProjectsLabel: string;
    reflectionLabel: string;
    tutorialCompletionsLabel: string;
    stationBalanceHeading: string;
    exportLabel: string;
    drillInLabel: string;
    linkLabel: string;
    linkDescription: string;
  };
  diagnostics: {
    heading: string;
    description: string;
    sessionsLabel: string;
    projectsLabel: string;
    tutorialsLabel: string;
    stationVisitsHeading: string;
    privacyStatement: string;
    resetButton: string;
    toggleOn: string;
    toggleOff: string;
    lastResetLabel: string;
    viewLink: string;
  };
  templates: {
    heading: string;
    description: string;
    startButton: string;
    existingHeading: string;
    noProjects: string;
    recommended: string;
    statusApplied: string;
  };
  profiles: {
    selectionHeading: string;
    selectionDescription: string;
    createHeading: string;
    createNameLabel: string;
    createColorLabel: string;
    createColorHelp: string;
    createButton: string;
    continueButton: string;
    suggestionLabel: string;
    activeLabel: string;
    switcherLabel: string;
    switcherAria: string;
    managementHeading: string;
    managementDescription: string;
    renameLabel: string;
    renameHelp: string;
    renameButton: string;
    renameSuccess: string;
    deleteHeading: string;
    deleteWarning: string;
    deleteConfirmLabel: string;
    deletePlaceholder: string;
    deleteButton: string;
    deleteDisabled: string;
    deleteSuccess: string;
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
    diagnostics: 'Diagnostics',
    projects: 'Projects',
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
    settingsTheme: 'Theme & skins',
    settingsThemeHelp: 'Pick a skin to change colors, icons, and background flair while the stations stay the same.',
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
  ai: {
    heading: 'Advanced AI settings',
    description: 'For adults: pick a model and performance mode that match the child safe mission.',
    modelLabel: 'Model choice',
    modelHint: 'Each model balances friendly tone, length, and responsiveness.',
    modeLabel: 'Performance mode',
    modeHint: 'Balanced keeps the experience gentle while calm shortens replies and adventure stretches the story.',
    tokenCap: 'Token budget',
    adaptiveToggleLabel: 'Adaptive coaching',
    adaptiveToggleHelp: 'Let the Workshop tailor prompts to the profile and recent station visits.',
  },
  projectTools: {
    heading: 'Project tools',
    description:
      'Export a safe copy or import a file with a trusted adult so your story can travel between devices.',
    exportLabel: 'Save a copy of this project to a file',
    importLabel: 'Open a project file from this device',
    safetyReminder: 'These files contain creative work. Keep them with a trusted adult and do not share widely.',
    statusNeedsProject: 'Select a project to use these tools.',
    statusExport: 'Preparing your download...',
    statusImportSuccess: 'Project imported and selected.',
    statusImportFailure: 'Unable to read that file. Try a different .workshop.json export.',
  },
  insights: {
    heading: 'Adult insights',
    description: 'High-level engagement data for adults; only summaries appear here, no detailed story text.',
    privacyNote: 'Only counts and visit totals are shown unless an adult opens a project.',
    totalProjectsLabel: 'Projects started',
    completedProjectsLabel: 'Completed projects',
    reflectionLabel: 'Reflection visits',
    tutorialCompletionsLabel: 'Tutorial completions',
    stationBalanceHeading: 'Station balance',
    exportLabel: 'Download insights report',
    drillInLabel: 'Open the projects list',
    linkLabel: 'Adult insights dashboard',
    linkDescription: 'View aggregated data for this profile without showing creative content.',
  },
  diagnostics: {
    heading: 'Diagnostics',
    description: 'Local metrics that stay on this device and help adults tune the Workshop.',
    sessionsLabel: 'Session count',
    projectsLabel: 'Projects created',
    tutorialsLabel: 'Guided tutorials completed',
    stationVisitsHeading: 'Station visits',
    privacyStatement: 'This information is stored locally and is never sent anywhere.',
    resetButton: 'Reset metrics',
    toggleOn: 'Disable telemetry',
    toggleOff: 'Enable telemetry',
    lastResetLabel: 'Last reset',
    viewLink: 'View diagnostics',
  },
  templates: {
    heading: 'Start from a template',
    description: 'Choose a friendly starter and the Workshop will open a fresh project with guided steps.',
    startButton: 'Use this template',
    existingHeading: 'Your projects',
    noProjects: 'No projects yet. Create one or pick a template.',
    recommended: 'Recommended station',
    statusApplied: 'Ready to explore your new project.',
  },
  profiles: {
    selectionHeading: 'Choose a profile',
    selectionDescription: 'Switch between creators, pick colors, and keep each child’s work separate.',
    createHeading: 'Add a new profile',
    createNameLabel: 'Profile name',
    createColorLabel: 'Accent color',
    createColorHelp: 'Colors help you spot each profile quickly in the app.',
    createButton: 'Create profile',
    continueButton: 'Continue as this profile',
    suggestionLabel: 'Profiles',
    activeLabel: 'Active',
    switcherLabel: 'Switch profile',
    switcherAria: 'Open the profile selection panel',
    managementHeading: 'Profile management',
    managementDescription:
      'Rename the current profile or delete unused ones. Adults keep a caution flag before removing a profile.',
    renameLabel: 'Profile name',
    renameHelp: 'Pick a friendly name so the child knows whose profile is active.',
    renameButton: 'Save name',
    renameSuccess: 'Profile name saved.',
    deleteHeading: 'Delete profile',
    deleteWarning: 'Deleting a profile removes its projects and telemetry. Export any stories first.',
    deleteConfirmLabel: 'Type the profile name to confirm',
    deletePlaceholder: 'Enter profile name',
    deleteButton: 'Delete profile',
    deleteDisabled: 'Default profile cannot be removed.',
    deleteSuccess: 'Profile deleted. Switching back to another profile.',
  },
};

export const TRANSLATIONS: Record<Locale, Translation> = {
  en: englishTranslation,
  es: englishTranslation,
  fr: englishTranslation,
};
