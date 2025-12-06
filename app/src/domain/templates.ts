import type { Project } from './project';
import type { StationKey } from './project';
import type { ReflectionTag } from './reflection';
import type { TestOutcome } from './test';

export type TemplateId = string;
export type ContentPackId = string;

export type TemplateStep = {
  title: string;
  summary?: string;
  status?: 'todo' | 'in_progress' | 'done';
  order?: number;
  originStation?: StationKey;
  acceptanceCriteria?: string;
  notes?: string;
};

export type TemplateMemoryEntry = {
  proudOf: string;
  lesson: string;
  nextTime: string;
};

export type TemplateReflectSnapshot = {
  tags: string[];
  notes: string;
};

export type TemplatePayload = {
  description?: string;
  goal?: Project['goal'];
  idea?: Project['idea'];
  steps?: TemplateStep[];
  reflections?: {
    tag: ReflectionTag;
    note: string;
  }[];
  tests?: {
    question: string;
    outcome: TestOutcome;
    note?: string;
    createdAt?: string;
  }[];
  archives?: {
    label: string;
    summary?: string;
    snapshot?: unknown;
    createdAt?: string;
  }[];
  memory?: { entries: TemplateMemoryEntry[] };
  reflect?: { snapshots: TemplateReflectSnapshot[] };
  share?: Project['share'];
  tags?: string[];
  status?: Project['status'];
};

export type Template = {
  id: TemplateId;
  packId: ContentPackId;
  displayName: string;
  description: string;
  recommendedStations: StationKey[];
  payload: TemplatePayload;
};
