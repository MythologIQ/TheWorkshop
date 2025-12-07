import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  logAIIncident,
  getAIIncidents,
  clearAIIncidents,
  subscribeToAIIncidents,
} from '../aiIncidentStore';

describe('aiIncidentStore', () => {
  afterEach(() => {
    clearAIIncidents();
  });

  it('logs and retrieves incidents', () => {
    logAIIncident({ category: 'timeout' });
    const incidents = getAIIncidents();
    expect(incidents).toHaveLength(1);
    expect(incidents[0].category).toBe('timeout');
  });

  it('clears incidents', () => {
    logAIIncident({ category: 'redaction' });
    expect(getAIIncidents()).toHaveLength(1);
    clearAIIncidents();
    expect(getAIIncidents()).toHaveLength(0);
  });

  it('notifies subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToAIIncidents(listener);
    logAIIncident({ category: 'other' });
    expect(listener).toHaveBeenCalled();
    unsubscribe();
    logAIIncident({ category: 'other' });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
