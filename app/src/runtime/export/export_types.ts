import type { Goal, Project, ProjectStatus, StationIdea, StationKey, StationShare } from '../../domain/project';
import type { StepStatus } from '../../domain/step';
import type { ReflectionTag } from '../../domain/reflection';
import type { TestOutcome } from '../../domain/test';

export const EXPORT_SCHEMA_VERSION = '1.0' as const;

export type ExportedStep = {
  sourceId?: string;
  title: string;
  summary?: string;
  status: StepStatus;
  order: number;
  originStation?: StationKey;
  acceptanceCriteria?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ExportedReflection = {
  tag: ReflectionTag;
  note: string;
  createdAt: string;
};

export type ExportedTest = {
  question: string;
  outcome: TestOutcome;
  note?: string;
  createdAt: string;
};

export type ExportedArchive = {
  label: string;
  summary?: string;
  snapshot?: unknown;
  createdAt: string;
};

export type ExportedMemoryEntry = {
  proudOf: string;
  lesson: string;
  nextTime: string;
  createdAt: string;
};

export type ExportedReflectSnapshot = {
  tags: string[];
  notes: string;
  createdAt: string;
};

export type ExportedStationMemory = {
  entries: ExportedMemoryEntry[];
};

export type ExportedStationReflect = {
  snapshots: ExportedReflectSnapshot[];
};

export type ExportedSnapshot = {
  label?: string;
  createdAt: string;
  projectState: Partial<Omit<Project, 'snapshots'>>;
};

export interface ExportedProject {
  id: string;
  name: string;
  title?: string;
  description?: string;
  goal?: Goal;
  idea?: StationIdea;
  status: ProjectStatus;
  currentStation: StationKey;
  steps: ExportedStep[];
  reflections: ExportedReflection[];
  tests: ExportedTest[];
  archives: ExportedArchive[];
  memory?: ExportedStationMemory;
  reflect?: ExportedStationReflect;
  share?: StationShare;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  snapshots?: ExportedSnapshot[];
}

export interface ProjectExportV1 {
  schemaVersion: typeof EXPORT_SCHEMA_VERSION;
  exportedAt: string;
  creationLabSignature: string;
  project: ExportedProject;
}
