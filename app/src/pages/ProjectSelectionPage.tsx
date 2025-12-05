import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../runtime/hooks/useProjects';

const ProjectSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, selectedProject, createProject, selectProject } = useProjects();
  const [name, setName] = useState('');

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    createProject(trimmed);
    setName('');
  };

  const handleSelect = (projectId: string) => {
    selectProject(projectId);
    navigate('/dock/idea');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome to The Workshop</h1>
          <p className="mt-2 text-slate-600">
            Start a new adventure or pick up where you left off. Projects are stored locally right here in your browser.
          </p>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label htmlFor="project-name" className="text-sm font-semibold text-slate-700">
            New project name
          </label>
          <div className="flex gap-2">
            <input
              id="project-name"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none"
              placeholder="My creative mission"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 active:bg-indigo-800"
            >
              New
            </button>
          </div>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Your projects</h2>
            <span className="text-sm text-slate-500">{projects.length} saved</span>
          </div>
          {projects.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              No projects yet—start by naming a new mission above.
            </p>
          )}
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => handleSelect(project.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selectedProject?.id === project.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900">{project.name}</span>
                  <span className="text-xs uppercase tracking-wide text-slate-400">Select</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {project.updatedAt ? new Date(project.updatedAt).toLocaleString() : 'Just created'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelectionPage;
