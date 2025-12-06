import { Step } from './step';
import { Reflection } from './reflection';
import { TestResult } from './test';
import { ArchiveEntry } from './archive';
import type { ProfileId } from './profile';

export type ProjectStatus = 'draft' | 'in_progress' | 'paused' | 'completed' | 'archived';
export type StationKey = 'idea' | 'build' | 'test' | 'memory' | 'reflect' | 'share' | 'replay';

// Goal = mission brief summary fields from Design Dock.
export interface Goal {
  audience?: string;
  outcome?: string;
  successPicture?: string;
}

export interface StationIdea {
  title: string;
  mission: string;
  goal: string;
  starterSteps: string[];
}

export interface MemoryEntry {
  id: string;
  createdAt: string;
  proudOf: string;
  lesson: string;
  nextTime: string;
}

export interface StationMemory {
  entries: MemoryEntry[];
}

export interface ReflectSnapshot {
  id: string;
  createdAt: string;
  tags: string[];
  notes: string;
}

export interface StationReflect {
  snapshots: ReflectSnapshot[];
}

export interface StationShare {
  summary?: string;
  artifactUrl?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  title?: string;
  description?: string;
  goal?: Goal;
  idea?: StationIdea;
  status: ProjectStatus;
  currentStation: StationKey;
  steps: Step[];
  reflections: Reflection[];
  tests: TestResult[];
  archives: ArchiveEntry[];
  memory?: StationMemory;
  reflect?: StationReflect;
  share?: StationShare;
  tags?: string[];
  profileId: ProfileId;
  createdAt: string;
  updatedAt: string;
  snapshots?: ProjectSnapshot[];
}

export interface ProjectSnapshot {
  id: string;
  createdAt: string;
  label: string;
  projectState: Partial<Omit<Project, 'snapshots'>>;
}
