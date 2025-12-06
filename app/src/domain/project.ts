import { Step } from './step';
import { Reflection } from './reflection';
import { TestResult } from './test';
import { ArchiveEntry } from './archive';

export type ProjectStatus = 'draft' | 'in_progress' | 'paused' | 'completed' | 'archived';
export type StationKey = 'idea' | 'build' | 'test' | 'memory' | 'reflect' | 'share' | 'replay';

export interface ShareSlice {
  lastExportAt?: string;
  lastFormat?: 'page' | 'poster';
}

// Goal = mission brief summary fields from Design Dock.
export interface Goal {
  audience?: string;
  outcome?: string;
  successPicture?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  goal?: Goal;
  status: ProjectStatus;
  currentStation: StationKey;
  steps: Step[];
  reflections: Reflection[];
  tests: TestResult[];
  archives: ArchiveEntry[];
  tags?: string[];
  share?: ShareSlice;
  createdAt: string;
  updatedAt: string;
}
