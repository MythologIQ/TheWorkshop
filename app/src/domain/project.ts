import { Step } from './step';
import { Reflection } from './reflection';
import { TestResult } from './test';
import { ArchiveEntry } from './archive';

export interface MemoryEntry {
  id: string;
  createdAt: string;
  proudOf: string;
  lesson: string;
  nextTime: string;
}

export interface MemorySlice {
  entries: MemoryEntry[];
}

export interface ReflectSnapshot {
  id: string;
  createdAt: string;
  tags: string[];
  notes: string;
}

export interface ReflectSlice {
  snapshots: ReflectSnapshot[];
}

export interface TestSession {
  id: string;
  createdAt: string;
  question: string;
  findings: string[];
}

export interface TestSlice {
  sessions: TestSession[];
}

export type ProjectStatus = 'draft' | 'in_progress' | 'paused' | 'completed' | 'archived';
export type StationKey = 'idea' | 'build' | 'test' | 'memory' | 'reflect' | 'share' | 'replay';

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
  test?: TestSlice;
  memory?: MemorySlice;
  reflect?: ReflectSlice;
  createdAt: string;
  updatedAt: string;
}
