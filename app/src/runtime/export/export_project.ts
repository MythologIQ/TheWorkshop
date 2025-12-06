import { getProject } from '../store/projectStore';
import type { ArchiveEntry } from '../../domain/archive';
import type { Project, ProjectSnapshot } from '../../domain/project';
import type { Reflection } from '../../domain/reflection';
import type { Step } from '../../domain/step';
import type { TestResult } from '../../domain/test';
import {
  EXPORT_SCHEMA_VERSION,
  ExportedArchive,
  ExportedSnapshot,
  ExportedStep,
  ExportedReflection,
  ExportedStationMemory,
  ExportedStationReflect,
  ExportedTest,
  ExportedProject,
  ProjectExportV1,
} from './export_types';

export const CREATION_LAB_SIGNATURE = 'Created in the MythologIQ Creation Lab';

const ensureSlug = (value: string): string => {
  const sanitized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return sanitized || 'project';
};

const exportStep = (step: Step): ExportedStep => ({
  sourceId: step.id,
  title: step.title,
  summary: step.summary,
  status: step.status,
  order: typeof step.order === 'number' ? step.order : 0,
  originStation: step.originStation,
  acceptanceCriteria: step.acceptanceCriteria,
  notes: step.notes,
  createdAt: step.createdAt,
  updatedAt: step.updatedAt,
});

const exportReflection = (entry: Reflection): ExportedReflection => ({
  tag: entry.tag,
  note: entry.note,
  createdAt: entry.createdAt,
});

const exportTest = (entry: TestResult): ExportedTest => ({
  question: entry.question,
  outcome: entry.outcome,
  note: entry.note,
  createdAt: entry.createdAt,
});

const exportArchive = (entry: ArchiveEntry): ExportedArchive => ({
  label: entry.label,
  summary: entry.summary,
  snapshot: entry.snapshot,
  createdAt: entry.createdAt,
});

const stripSnapshotsFromState = (
  state: ProjectSnapshot['projectState'],
): Partial<Omit<Project, 'snapshots'>> => {
  if (!state) return {};
  const sanitized: Partial<Omit<Project, 'snapshots'>> = { ...state };
  delete sanitized.snapshots;
  return sanitized;
};

const exportSnapshot = (snapshot: ProjectSnapshot): ExportedSnapshot => ({
  label: snapshot.label,
  createdAt: snapshot.createdAt,
  projectState: stripSnapshotsFromState(snapshot.projectState),
});

const buildExportedProject = (project: Project): ExportedProject => {
  const memory: ExportedStationMemory | undefined =
    project.memory && project.memory.entries.length > 0
      ? {
          entries: project.memory.entries.map((entry) => ({
            proudOf: entry.proudOf,
            lesson: entry.lesson,
            nextTime: entry.nextTime,
            createdAt: entry.createdAt,
          })),
        }
      : undefined;

  const reflect: ExportedStationReflect | undefined =
    project.reflect && project.reflect.snapshots.length > 0
      ? {
          snapshots: project.reflect.snapshots.map((snapshot) => ({
            tags: snapshot.tags,
            notes: snapshot.notes,
            createdAt: snapshot.createdAt,
          })),
        }
      : undefined;

  const snapshots = project.snapshots?.map(exportSnapshot);

  return {
    id: project.id,
    name: project.name,
    title: project.title,
    description: project.description,
    goal: project.goal,
    idea: project.idea,
    status: project.status,
    currentStation: project.currentStation,
    steps: project.steps.map(exportStep),
    reflections: project.reflections.map(exportReflection),
    tests: project.tests.map(exportTest),
    archives: project.archives.map(exportArchive),
    memory,
    reflect,
    share: project.share,
    tags: project.tags,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    snapshots,
  };
};

const startDownload = (blob: Blob, filename: string) => {
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const exportProject = (projectId: string): Blob => {
  const project = getProject(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  const payload: ProjectExportV1 = {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    creationLabSignature: CREATION_LAB_SIGNATURE,
    project: buildExportedProject(project),
  };
  const serialized = JSON.stringify(payload, null, 2);
  const blob = new Blob([serialized], { type: 'application/json' });
  startDownload(blob, `${ensureSlug(project.name)}.workshop.json`);
  return blob;
};
