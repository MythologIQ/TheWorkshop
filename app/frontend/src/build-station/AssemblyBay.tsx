import React, { useEffect, useMemo, useState } from 'react';
import { Project, Step } from '../domain/project';
import { loadProjects, upsertProject } from '../storage/localProjectStore';

type AssemblyBayProps = {
  focusProjectId?: string;
  onGoToTest?: (projectId?: string) => void;
};

const generateHint = (step: Step, project?: Project) => {
  const audience = project?.audience || 'your reader';
  return `Keep it tiny: "${step.title}" should take ~5 minutes. Explain it to ${audience}, then do a simple version. If stuck, break it smaller or sketch a quick outline.`;
};

export const AssemblyBay: React.FC<AssemblyBayProps> = ({ focusProjectId, onGoToTest }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [message, setMessage] = useState<string>('');

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

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setHint('');
    setMessage('');
  };

  const handleToggleStep = (stepId: string, isDone: boolean) => {
    if (!selectedProject) return;
    const now = new Date().toISOString();
    const updatedSteps = selectedProject.steps.map((step) =>
      step.id === stepId
        ? { ...step, status: isDone ? 'done' : 'todo', updatedAt: now }
        : step,
    );
    const updatedProject: Project = {
      ...selectedProject,
      steps: updatedSteps,
      updatedAt: now,
    };
    const stored = upsertProject(updatedProject);
    setProjects(stored);
    setMessage(isDone ? 'Step marked done.' : 'Step marked todo.');
  };

  const handleHint = () => {
    const targetStep =
      selectedProject?.steps.find((s) => s.status !== 'done') ||
      selectedProject?.steps[0];
    if (targetStep) {
      setHint(generateHint(targetStep, selectedProject));
    } else {
      setHint('No steps to hint on. Try adding steps in the Design Dock.');
    }
  };

  if (!projects.length) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1>Assembly Bay (Build Station)</h1>
        <p>No projects found. Start in the Design Dock to create a mission and starter steps.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>Assembly Bay (Build Station)</h1>
      <p style={{ background: '#f5f7ff', padding: 12, borderRadius: 6 }}>
        Guide one small task at a time. Tone stays calm, encouraging, and safe. If a task feels risky, pause and pick a safer approach or ask an adult.
      </p>

      <label style={{ display: 'block', marginTop: 8 }}>
        Choose a project
        <select
          value={selectedProjectId}
          onChange={(e) => handleSelectProject(e.target.value)}
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
            <h3>Steps</h3>
            {selectedProject.steps.length === 0 && <p>No steps yet. Add some in Design Dock.</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {selectedProject.steps.map((step) => (
                <li key={step.id} style={{ marginBottom: 8, padding: 8, border: '1px solid #e5e7ee', borderRadius: 6 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={step.status === 'done'}
                      onChange={(e) => handleToggleStep(step.id, e.target.checked)}
                    />
                    <span style={{ textDecoration: step.status === 'done' ? 'line-through' : 'none' }}>
                      {step.title}
                    </span>
                  </label>
                  {step.originStation && (
                    <small style={{ color: '#556' }}>Origin: {step.originStation}</small>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 16, padding: 12, border: '1px dashed #c8d2f2', borderRadius: 6 }}>
            <h3>Guidance</h3>
            <p>Need a nudge? Keep tasks tiny, celebrate progress, and ask for help if something feels unsafe.</p>
            <button onClick={handleHint} style={{ padding: '8px 12px' }}>
              Get a safe hint
            </button>
            {hint && <p style={{ marginTop: 8 }}>{hint}</p>}
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => onGoToTest && onGoToTest(selectedProjectId)}
              style={{ padding: '10px 14px' }}
            >
              Go to Diagnostics Corridor
            </button>
          </div>

          {message && <p style={{ marginTop: 12, color: '#0b7a1b' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default AssemblyBay;
