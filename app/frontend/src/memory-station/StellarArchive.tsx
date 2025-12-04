import React, { useEffect, useMemo, useState } from 'react';
import { Project, StationState } from '../domain/project';
import { loadProjects, upsertProject } from '../storage/localProjectStore';

type StellarArchiveProps = {
  focusProjectId?: string;
  onBackToBuild?: (projectId?: string) => void;
};

const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

export const StellarArchive: React.FC<StellarArchiveProps> = ({ focusProjectId, onBackToBuild }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [winText, setWinText] = useState<string>('');
  const [lessonText, setLessonText] = useState<string>('');
  const [reminderText, setReminderText] = useState<string>('');
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

  const handleSave = () => {
    if (!selectedProject) return;
    const now = new Date().toISOString();
    const recapParts = [
      winText.trim() ? `Win: ${winText.trim()}` : null,
      lessonText.trim() ? `Lesson: ${lessonText.trim()}` : null,
    ].filter(Boolean);
    const recap = recapParts.length ? recapParts.join(' | ') : 'Session logged.';
    const reminder = reminderText.trim();

    const reflections = [
      winText.trim() && { note: `Win: ${winText.trim()}`, createdAt: now },
      lessonText.trim() && { note: `Lesson: ${lessonText.trim()}`, createdAt: now },
      reminder && { note: `Reminder: ${reminder}`, createdAt: now },
    ].filter(Boolean) as StationState['reflections'];

    const outputs: Record<string, unknown> = {
      recap,
      reminder,
    };

    const stationState: StationState = {
      id: generateId('state_memory'),
      projectId: selectedProject.id,
      stationKey: 'memory',
      outputs,
      reflections,
      lastVisitedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const updatedProject: Project = {
      ...selectedProject,
      stationStates: {
        ...(selectedProject.stationStates || {}),
        memory: stationState,
      },
      currentStation: 'memory',
      updatedAt: now,
    };

    const stored = upsertProject(updatedProject);
    setProjects(stored);
    setMessage('Reflection saved to the Stellar Archive.');
    setWinText('');
    setLessonText('');
    setReminderText('');
  };

  if (!projects.length) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1>Stellar Archive (Memory Station)</h1>
        <p>No projects found. Visit Design Dock and Assembly Bay first.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>Stellar Archive (Memory Station)</h1>
      <p style={{ background: '#f5f7ff', padding: 12, borderRadius: 6 }}>
        Capture what happened, highlight wins, and set a gentle reminder. Keep personal details minimal. Tone stays warm and blame-free. If something feels unsafe, skip it or ask an adult.
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
            <h3>Reflection</h3>
            <label style={{ display: 'block', marginTop: 8 }}>
              What went well? (Win)
              <textarea
                value={winText}
                onChange={(e) => setWinText(e.target.value)}
                placeholder="e.g., Fixed the panel order and story flows well."
                rows={2}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>

            <label style={{ display: 'block', marginTop: 8 }}>
              What did you learn or would change? (Lesson)
              <textarea
                value={lessonText}
                onChange={(e) => setLessonText(e.target.value)}
                placeholder="e.g., Keep speech bubbles short and clear."
                rows={2}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>

            <label style={{ display: 'block', marginTop: 8 }}>
              Reminder for next time (optional)
              <textarea
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                placeholder='e.g., "Check bubble size before final inking."'
                rows={2}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button onClick={handleSave} style={{ padding: '10px 14px' }}>
              Save to Stellar Archive
            </button>
            {onBackToBuild && (
              <button onClick={() => onBackToBuild(selectedProjectId)} style={{ padding: '10px 14px' }}>
                Back to Assembly Bay
              </button>
            )}
          </div>

          {message && <p style={{ marginTop: 12, color: '#0b7a1b' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default StellarArchive;
