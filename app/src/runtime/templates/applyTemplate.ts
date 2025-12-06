import { newId } from '../../domain/id';
import type { Project } from '../../domain/project';
import { createProject, updateProject } from '../store/projectStore';
import templates from '../../data/templates_builtin';
import type { Template } from '../../domain/templates';
import type { Step } from '../../domain/step';
import type { Reflection } from '../../domain/reflection';
import type { TestResult } from '../../domain/test';
import type { ArchiveEntry } from '../../domain/archive';

const now = () => new Date().toISOString();

const buildSteps = (entries: (Template['payload']['steps']) | undefined, projectId: string): Step[] => {
  if (!entries) return [];
  return entries.map((entry, index) => ({
    id: newId('step'),
    projectId,
    title: entry.title || `Step ${index + 1}`,
    summary: entry.summary,
    status: entry.status || 'todo',
    order: typeof entry.order === 'number' ? entry.order : index,
    originStation: entry.originStation,
    acceptanceCriteria: entry.acceptanceCriteria,
    notes: entry.notes,
    createdAt: now(),
    updatedAt: now(),
  }));
};

const buildReflections = (entries: Template['payload']['reflections'], projectId: string): Reflection[] =>
  (entries ?? []).map((entry) => ({
    id: newId('reflection'),
    projectId,
    tag: entry.tag,
    note: entry.note,
    createdAt: now(),
  }));

const buildTests = (entries: Template['payload']['tests'], projectId: string): TestResult[] =>
  (entries ?? []).map((entry) => ({
    id: newId('test'),
    projectId,
    question: entry.question,
    outcome: entry.outcome,
    note: entry.note,
    createdAt: normalizeDate(entry.createdAt),
  }));

const buildArchives = (entries: Template['payload']['archives'], projectId: string): ArchiveEntry[] =>
  (entries ?? []).map((entry) => ({
    id: newId('archive'),
    projectId,
    label: entry.label,
    summary: entry.summary,
    snapshot: entry.snapshot,
    createdAt: normalizeDate(entry.createdAt),
  }));

const normalizeDate = (value?: string): string => {
  if (value && !Number.isNaN(Date.parse(value))) {
    return value;
  }
  return now();
};

const buildMemory = (payload: Template['payload']['memory'], projectId: string) => {
  if (!payload || payload.entries.length === 0) return undefined;
  return {
    entries: payload.entries.map((entry) => ({
      id: newId('memory'),
      projectId,
      proudOf: entry.proudOf,
      lesson: entry.lesson,
      nextTime: entry.nextTime,
      createdAt: now(),
    })),
  };
};

const buildReflect = (payload: Template['payload']['reflect']) => {
  if (!payload || payload.snapshots.length === 0) return undefined;
  return {
    snapshots: payload.snapshots.map((entry) => ({
      id: newId('reflect'),
      tags: entry.tags,
      notes: entry.notes,
      createdAt: now(),
    })),
  };
};

export const applyTemplate = (templateId: string): Project => {
  const template = templates.find((entry) => entry.id === templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const project = createProject(template.displayName);
  const steps = buildSteps(template.payload.steps, project.id);
  const reflections = buildReflections(template.payload.reflections, project.id);
  const tests = buildTests(template.payload.tests, project.id);
  const archives = buildArchives(template.payload.archives, project.id);
  const memory = buildMemory(template.payload.memory, project.id);
  const reflect = buildReflect(template.payload.reflect);

  const updated = updateProject(project.id, {
    description: template.payload.description,
    goal: template.payload.goal,
    idea: template.payload.idea,
    steps: steps.length > 0 ? steps : undefined,
    reflections: reflections.length > 0 ? reflections : undefined,
    tests: tests.length > 0 ? tests : undefined,
    archives: archives.length > 0 ? archives : undefined,
    memory,
    reflect,
    share: template.payload.share,
    tags: template.payload.tags,
    status: template.payload.status,
  });

  return updated ?? project;
};
