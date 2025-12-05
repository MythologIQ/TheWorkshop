// TestResult logs quick checks from Diagnostics Corridor.
export type TestOutcome = 'pass' | 'needs_work' | 'skip';

export interface TestResult {
  id: string;
  projectId: string;
  question: string;
  outcome: TestOutcome;
  note?: string;
  createdAt: string;
}
