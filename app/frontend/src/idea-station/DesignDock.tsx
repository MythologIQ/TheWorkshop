import React, { useState } from 'react';
import { Project, Step } from '../domain/project';
import { upsertProject } from '../storage/localProjectStore';

const generateId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as { randomUUID: () => string }).randomUUID();
  }
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const parseSteps = (stepsText: string, projectId: string): Step[] => {
  return stepsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((title, index) => {
      const now = new Date().toISOString();
      return {
        id: generateId('step'),
        projectId,
        title,
        status: 'todo',
        order: index + 1,
        originStation: 'idea',
        createdAt: now,
        updatedAt: now,
      };
    });
};

export const DesignDock: React.FC = () => {
  const [projectId, setProjectId] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [audience, setAudience] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [stepsText, setStepsText] = useState<string>('Sketch the main character\nWrite the opening scene\nList 2 things to test');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSave = () => {
    const id = projectId || generateId('proj');
    const now = new Date().toISOString();
    const firstCreatedAt = createdAt || now;
    const steps = parseSteps(stepsText, id);

    const project: Project = {
      id,
      ownerId: 'local_user',
      title: projectName || 'Untitled Project',
      description,
      audience,
      status: 'draft',
      currentStation: 'idea',
      steps,
      createdAt: firstCreatedAt,
      updatedAt: now,
    };

    upsertProject(project);
    setProjectId(id);
    setCreatedAt(firstCreatedAt);
    setMessage('Project saved to local storage.');
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16, fontFamily: 'sans-serif' }}>
      <h1>Design Dock (Idea Station)</h1>
      <p style={{ background: '#f4f6fb', padding: 12, borderRadius: 6 }}>
        Mission brief: This is where you decide what you want to make, who it is for, and the first few steps to start.
      </p>

      <label style={{ display: 'block', marginTop: 12 }}>
        Project name
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Robot Dog Comic"
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginTop: 12 }}>
        Who is it for?
        <input
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="My friends"
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginTop: 12 }}>
        Project summary
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A comic where a robot dog rescues a kite for friends."
          rows={3}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginTop: 12 }}>
        Starter steps (one per line, aim for 2-4)
        <textarea
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </label>

      <button onClick={handleSave} style={{ marginTop: 16, padding: '10px 16px' }}>
        Save project
      </button>

      {message && <p style={{ marginTop: 12, color: '#0b7a1b' }}>{message}</p>}
    </div>
  );
};

export default DesignDock;
