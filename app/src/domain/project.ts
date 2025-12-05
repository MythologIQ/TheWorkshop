import { Step } from './step';
import { Reflection } from './reflection';
import { TestResult } from './test';
import { ArchiveEntry } from './archive';

/** Shared station keys across the Workshop learning loop. */
export type StationKey = 'idea' | 'build' | 'test' | 'memory' | 'reflect' | 'share' | 'replay';

/** Project lifecycle status labels for UI badges and filtering. */
export type ProjectStatus = 'draft' | 'in_progress' | 'paused' | 'completed' | 'archived';

/**
 * Captures the Idea Station inputs.
 * Creativity Boundary spec limits the title (≈60 chars), mission (≈400), and goal (≈200); enforce those limits before persisting.
 */
export interface StationIdea {
  title: string;
  mission: string;
  goal: string;
  starterSteps: string[]; // Up to three steps, each short and actionable.
}

/**
 * A modest Project shape for v1.
 * Keep the core metadata small so localStorage stays lightweight and future stations can mount their slices safely.
 */
export interface Project {
  id: string;
  name: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  idea?: StationIdea;
  build?: unknown; // Placeholder for future Build Station slice
  test?: unknown; // Placeholder for Diagnostics Corridor data
  memory?: unknown; // Placeholder for Stellar Archive entries
  reflect?: unknown; // Placeholder for Orbiter Bridge snapshots
  share?: unknown; // Placeholder for Broadcast Deck exports
  replay?: unknown; // Placeholder for Time Tunnels history

  // Legacy helpers ('first-wave' store wires) remain optional for future migrations.
  title?: string;
  description?: string;
  status?: ProjectStatus;
  currentStation?: StationKey;
  steps?: Step[];
  reflections?: Reflection[];
  tests?: TestResult[];
  archives?: ArchiveEntry[];
  tags?: string[];
}
