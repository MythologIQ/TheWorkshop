import React, { useEffect, useMemo, useState } from 'react';
import { Project, Step, StationState } from '../domain/project';
import { loadProjects, upsertProject } from '../storage/localProjectStore';

type DiagnosticsCorridorProps = {
  focusProjectId?: string;
  onBackToBuild?: (projectId?: string) => void;
  onGoToMemory?: (projectId?: string) => void;
};

type TestResult = {
  question: string;
  outcome: 'pass' | 'needs_work' | 'skip';
  note?: string;
};

const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

export const DiagnosticsCorridor: React.FC<DiagnosticsCorridorProps> = ({ focusProjectId, onBackToBuild, onGoToMemory }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [observations, setObservations] = useState<Record<string, TestResult['outcome']>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [issueText, setIssueText] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const questions = [
    'Can you tell what this should do or say without confusion?',
    'Do the steps or panels flow in the right order?',
    'Is there anything missing or that feels off?',
  ];

  useEffect(() => {
    const stored = loadProjects();
    setProjects(stored);
    if (focusProjectId) {
      setSelectedProjectId(focusProjectId);
    } else if (stored[0]) {
      setSelectedProjectId(stored[0].id);
    }
  }, [focusProjectId]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [projects, selectedProjectId],
  );

  const handleSave = () => {
    if (!selectedProject) return;
    const now = new Date().toISOString();

    // Build test results list
    const testResults: TestResult[] = questions.map((q) => ({
      question: q,
      outcome: observations[q] || 'skip',
      note: notes[q],
    }));

    // Create a test StationState entry
    const stationState: StationState = {
      id: generateId('state_test'),
      projectId: selectedProject.id,
      stationKey: 'test',
      outputs: {
        testResults,
        summary: 'Diagnostics run in-app; see outcomes.',
      },
      reflections: testResults
        .filter((t) => t.note)
        .map((t) => ({ note: `${t.question} -> ${t.note}`, createdAt: now })),
      lastVisitedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    // Optionally add a fix step if provided
    const newSteps: Step[] = [];
    if (issueText.trim().length > 0) {
      newSteps.push({
        id: generateId('step'),
        projectId: selectedProject.id,
        title: `Fix: ${issueText.trim()}`,
        status: 'todo',
        order: selectedProject.steps.length + 1,
        originStation: 'test',
        createdAt: now,
        updatedAt: now,
      });
    }

    const updatedProject: Project = {
      ...selectedProject,
      steps: [...selectedProject.steps, ...newSteps],
      stationStates: {
        ...(selectedProject.stationStates || {}),
        test: stationState,
      },
      currentStation: 'test',
      updatedAt: now,
    };

    const stored = upsertProject(updatedProject);
    setProjects(stored);
    setMessage('Test results saved. Any fixes were added to the steps.');
    if (newSteps.length && onBackToBuild) {
      onBackToBuild(selectedProject.id);
    } else if (onGoToMemory) {
      onGoToMemory(selectedProject.id);
    }
  };

  if (!projects.length) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1>Diagnostics Corridor (Test Station)</h1>
        <p>No projects found. Start in Design Dock and Build Station first.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>Diagnostics Corridor (Test Station)</h1>
      <p style={{ background: '#f5f7ff', padding: 12, borderRadius: 6 }}>
        Goal: ask, test, and record what works and what needs fixing. Tone stays calm and curious; never shame. If something seems unsafe, stop, redirect to a safe idea, and ask an adult for help.
      </p>

      <label style={{ display: 'block', marginTop: 8 }}>
        Choose a project
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title || 'Untitled Project'}
            </option>
          ))}
        </select>
      </label>

      {selectedProject && (
        <div style={{ marginTop: 16 }}>
          <div style={{ border: '1px solid #dce3f5', borderRadius: 6, padding: 12 }}>
            <h2>{selectedProject.title || 'Untitled Project'}</h2>
            {selectedProject.audience && <p><strong>Audience:</strong> {selectedProject.audience}</p>}
            <p>{selectedProject.description}</p>
          </div>

          <div style={{ marginTop: 16 }}>
            <h3>Quick tests</h3>
            <p>Mark what passes and what needs work. Keep answers short.</p>
            {questions.map((q) => (
              <div key={q} style={{ marginBottom: 12, padding: 10, border: '1px solid #e5e7ee', borderRadius: 6 }}>
                <p style={{ margin: 0 }}>{q}</p>
                <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                  <label>
                    <input
                      type="radio"
                      name={q}
                      value="pass"
                      checked={observations[q] === 'pass'}
                      onChange={() => setObservations((prev) => ({ ...prev, [q]: 'pass' }))}
                    />
                    Pass
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={q}
                      value="needs_work"
                      checked={observations[q] === 'needs_work'}
                      onChange={() => setObservations((prev) => ({ ...prev, [q]: 'needs_work' }))}
                    />
                    Needs work
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={q}
                      value="skip"
                      checked={!observations[q] || observations[q] === 'skip'}
                      onChange={() => setObservations((prev) => ({ ...prev, [q]: 'skip' }))}
                    />
                    Skip
                  </label>
                </div>
                <textarea
                  value={notes[q] || ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [q]: e.target.value }))}
                  placeholder="Observation or note (optional)"
                  rows={2}
                  style={{ width: '100%', padding: 8, marginTop: 6 }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <h3>Issue to fix (optional)</h3>
            <textarea
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder="Describe one thing to fix. A new step will be added."
              rows={3}
              style={{ width: '100%', padding: 8 }}
            />
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button onClick={handleSave} style={{ padding: '10px 14px' }}>
              Save test results
            </button>
            {onBackToBuild && (
              <button onClick={() => onBackToBuild(selectedProjectId)} style={{ padding: '10px 14px' }}>
                Back to Assembly Bay
              </button>
            )}
            {onGoToMemory && (
              <button onClick={() => onGoToMemory(selectedProjectId)} style={{ padding: '10px 14px' }}>
                Go to Stellar Archive
              </button>
            )}
          </div>

          {message && <p style={{ marginTop: 12, color: '#0b7a1b' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default DiagnosticsCorridor;
