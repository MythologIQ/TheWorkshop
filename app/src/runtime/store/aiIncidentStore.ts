import { newId } from '../../domain/id';
import type { StationKey } from '../../domain/project';

export type AIIncidentCategory = 'timeout' | 'invalid_shape' | 'redaction' | 'other';

export type AIIncidentEntry = {
  id: string;
  station?: StationKey;
  category: AIIncidentCategory;
  timestamp: string;
  description?: string;
};

type IncidentListener = () => void;

let incidents: AIIncidentEntry[] = [];
const listeners = new Set<IncidentListener>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const logAIIncident = (entry: Omit<AIIncidentEntry, 'id' | 'timestamp'>): AIIncidentEntry => {
  const record: AIIncidentEntry = {
    id: newId('aiincident'),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  incidents = [...incidents, record];
  notify();
  return record;
};

export const getAIIncidents = (): AIIncidentEntry[] => [...incidents];

export const clearAIIncidents = () => {
  incidents = [];
  notify();
};

export const subscribeToAIIncidents = (listener: IncidentListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
