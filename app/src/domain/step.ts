// Step represents a tiny, doable action in the Plan/Act parts of the loop.
export type StepStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

export interface Step {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  status: StepStatus;
  order: number;
  originStation?: 'idea' | 'build' | 'test' | 'memory' | 'reflect' | 'share' | 'replay';
  acceptanceCriteria?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
