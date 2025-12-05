# Core data model types for the Workshop frontend (matches docs/DATA_MODEL.md)

export type UserRole = 'kid' | 'mentor' | 'admin';
export type ProjectStatus = 'draft' | 'in_progress' | 'paused' | 'completed' | 'archived';
export type StationKey = 'idea' | 'build' | 'test' | 'memory' | 'reflect' | 'share' | 'replay';
export type StepStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

export interface User {
  id: string;
  displayName: string;
  role?: UserRole;
  createdAt: string;
  lastActiveAt?: string;
}

export interface Step {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  status: StepStatus;
  order: number;
  originStation?: StationKey;
  acceptanceCriteria?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StationStateReflection {
  note: string;
  createdAt: string;
}

export interface StationState {
  id: string;
  projectId: string;
  stationKey: StationKey;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  activeStepIds?: string[];
  reflections?: StationStateReflection[];
  lastVisitedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  audience?: string;
  status: ProjectStatus;
  currentStation: StationKey;
  steps: Step[];
  stationStates?: Record<StationKey, StationState>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
