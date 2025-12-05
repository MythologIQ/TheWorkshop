import { Step } from './step';
import { Reflection } from './reflection';
import { TestResult } from './test';
import { ArchiveEntry } from './archive';

export type ProjectStatus = 'draft' | 'in_progress' | 'paused' | 'completed' | 'archived';
export type StationKey = 'idea' | 'build' | 'test' | 'memory' | 'reflect' | 'share' | 'replay';

// Goal = mission brief summary fields from Design Dock.
export interface Goal {
  audience?: string;
  outcome?: string;
  successPicture?: string;
}

// Idea Station slice follows the Creativity Boundary spec (docs/CREATIVITY_BOUNDARY_SPEC.md).
export interface StationIdea {
  title: string;
  mission: string;
  goal: string;
  starterSteps: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  goal?: Goal;
  idea?: StationIdea;
  status: ProjectStatus;
  currentStation: StationKey;
  steps: Step[];
  reflections: Reflection[];
  tests: TestResult[];
  archives: ArchiveEntry[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
