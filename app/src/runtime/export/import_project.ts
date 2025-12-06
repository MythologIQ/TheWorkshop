import { newId } from '../../domain/id';
import { ProjectSnapshot, StationMemory, StationReflect, Project, ProjectStatus, StationKey } from '../../domain/project';
import type { Reflection } from '../../domain/reflection';
import type { Step } from '../../domain/step';
import type { TestResult } from '../../domain/test';
import type { ArchiveEntry } from '../../domain/archive';
import { registerImportedProject, selectProject } from '../store/projectStore';
import {
  EXPORT_SCHEMA_VERSION,
  ExportedProject,
  ExportedSnapshot,
  ProjectExportV1,
} from './export_types';

const PROJECT_STATUSES: ProjectStatus[] = ['draft', 'in_progress', 'paused', 'completed', 'archived'];
const STATION_KEYS: StationKey[] = ['idea', 'build', 'test', 'memory', 'reflect', 'share', 'replay'];

export class InvalidProjectFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidProjectFileError';
  }
}

const normalizeDate = (value?: string): string => {
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
    return value;
  }
  return new Date().toISOString();
};

const isProjectStatus = (value: unknown): value is ProjectStatus =>
  typeof value === 'string' && PROJECT_STATUSES.includes(value as ProjectStatus);

const isStationKey = (value: unknown): value is StationKey =>
  typeof value === 'string' && STATION_KEYS.includes(value as StationKey);

const readBlobAsText = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    if (typeof FileReader === 'undefined') {
      reject(new InvalidProjectFileError('Project import requires a browser environment.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new InvalidProjectFileError('Unable to read this project file.'));
      }
    };
    reader.onerror = () => reject(new InvalidProjectFileError('Unable to read this project file.'));
    reader.readAsText(blob);
  });

const importSteps = (entries: ExportedProject['steps'], projectId: string): Step[] =>
  (entries ?? []).map((entry, index) => ({
    id: newId('step'),
    projectId,
    title: entry.title || `Step ${index + 1}`,
    summary: entry.summary,
    status: entry.status,
    order: typeof entry.order === 'number' ? entry.order : index,
    originStation: entry.originStation,
    acceptanceCriteria: entry.acceptanceCriteria,
    notes: entry.notes,
    createdAt: normalizeDate(entry.createdAt),
    updatedAt: normalizeDate(entry.updatedAt),
  }));

const importReflections = (entries: ExportedProject['reflections'], projectId: string): Reflection[] =>
  (entries ?? []).map((entry) => ({
    id: newId('reflection'),
    projectId,
    tag: entry.tag,
    note: entry.note,
    createdAt: normalizeDate(entry.createdAt),
  }));

const importTests = (entries: ExportedProject['tests'], projectId: string): TestResult[] =>
  (entries ?? []).map((entry) => ({
    id: newId('test'),
    projectId,
    question: entry.question,
    outcome: entry.outcome,
    note: entry.note,
    createdAt: normalizeDate(entry.createdAt),
  }));

const importArchives = (entries: ExportedProject['archives'], projectId: string): ArchiveEntry[] =>
  (entries ?? []).map((entry) => ({
    id: newId('archive'),
    projectId,
    label: entry.label,
    summary: entry.summary,
    snapshot: entry.snapshot,
    createdAt: normalizeDate(entry.createdAt),
  }));

const importMemory = (memory: ExportedProject['memory'], projectId: string): StationMemory | undefined => {
  if (!memory || memory.entries.length === 0) return undefined;
  return {
    entries: memory.entries.map((entry) => ({
      id: newId('memory'),
      projectId,
      proudOf: entry.proudOf,
      lesson: entry.lesson,
      nextTime: entry.nextTime,
      createdAt: normalizeDate(entry.createdAt),
    })),
  };
};

const importReflect = (reflect: ExportedProject['reflect']): StationReflect | undefined => {
  if (!reflect || reflect.snapshots.length === 0) return undefined;
  return {
    snapshots: reflect.snapshots.map((entry) => ({
      id: newId('reflect'),
      tags: [...entry.tags],
      notes: entry.notes,
      createdAt: normalizeDate(entry.createdAt),
    })),
  };
};

const importSnapshots = (entries: ExportedSnapshot[]): ProjectSnapshot[] =>
  entries.map((entry) => ({
    id: newId('snapshot'),
    label: entry.label?.trim() || 'Snapshot',
    createdAt: normalizeDate(entry.createdAt),
    projectState: entry.projectState ? { ...entry.projectState } : {},
  }));

const validateExportPayload = (value: unknown): ProjectExportV1 => {
  if (typeof value !== 'object' || value === null) {
    throw new InvalidProjectFileError('This file does not look like a Workshop project.');
  }
  const payload = value as ProjectExportV1;
  if (payload.schemaVersion !== EXPORT_SCHEMA_VERSION) {
    throw new InvalidProjectFileError('Unsupported project file version.');
  }
  if (!payload.project || typeof payload.project.name !== 'string') {
    throw new InvalidProjectFileError('Project name is missing.');
  }
  return payload;
};

const buildProjectFromExport = (exported: ExportedProject): Project => {
  const projectId = newId('project');
  const status = isProjectStatus(exported.status) ? exported.status : 'draft';
  const station = isStationKey(exported.currentStation) ? exported.currentStation : 'idea';
  const createdAt = normalizeDate(exported.createdAt);
  const updatedAt = normalizeDate(exported.updatedAt);

  return {
    id: projectId,
    name: exported.name?.trim() || 'Imported project',
    title: exported.title ?? exported.name,
    description: exported.description ?? '',
    goal: exported.goal,
    idea: exported.idea,
    status,
    currentStation: station,
    steps: importSteps(exported.steps, projectId),
    reflections: importReflections(exported.reflections, projectId),
    tests: importTests(exported.tests, projectId),
    archives: importArchives(exported.archives, projectId),
    memory: importMemory(exported.memory, projectId),
    reflect: importReflect(exported.reflect),
    share: exported.share,
    tags: exported.tags ?? [],
    createdAt,
    updatedAt,
    snapshots: exported.snapshots ? importSnapshots(exported.snapshots) : undefined,
  };
};

export const importProject = async (file: Blob): Promise<Project> => {
  try {
    const text = await readBlobAsText(file);
    const parsed = JSON.parse(text);
    const payload = validateExportPayload(parsed);
    const project = buildProjectFromExport(payload.project);
    const registered = registerImportedProject(project);
    selectProject(registered.id);
    return registered;
  } catch (error) {
    if (error instanceof InvalidProjectFileError) {
      throw error;
    }
    throw new InvalidProjectFileError('Unable to read this project file.');
  }
};
