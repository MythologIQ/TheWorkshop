import React, { useMemo, useState } from 'react';
import { useProjects } from '../../runtime/hooks/useProjects';
import { newId } from '../../domain/id';

const MAX_FIELD_LENGTH = 240;
const MAX_ENTRIES = 12;

const clampText = (value: string): string => value.trim().slice(0, MAX_FIELD_LENGTH);

export const MemoryStationPage: React.FC = () => {
  const { selectedProject, updateProject } = useProjects();
  const [proudOf, setProudOf] = useState('');
  const [lesson, setLesson] = useState('');
  const [nextTime, setNextTime] = useState('');
  const [statusMessage, setStatusMessage] = useState(
    'Share a win, a lesson, and a next small intention. All fields are optional but the more you add, the nicer the log.',
  );
  const [isSaving, setIsSaving] = useState(false);

  const entries = selectedProject?.memory?.entries ?? [];
  const visibleEntries = useMemo(() => [...entries].slice(-MAX_ENTRIES).reverse(), [entries]);

  const handleSave = async () => {
    if (!selectedProject) return;
    const proud = clampText(proudOf);
    const learned = clampText(lesson);
    const intent = clampText(nextTime);

    if (!proud && !learned && !intent) {
      setStatusMessage('Add at least one short sentence before saving.');
      return;
    }

    setIsSaving(true);
    const newEntry = {
      id: newId('memory'),
      createdAt: new Date().toISOString(),
      proudOf: proud,
      lesson: learned,
      nextTime: intent,
    };
    const updated = [...entries, newEntry].slice(-MAX_ENTRIES);
    updateProject(selectedProject.id, {
      memory: {
        entries: updated,
      },
    });
    setProudOf('');
    setLesson('');
    setNextTime('');
    setStatusMessage('Reflection saved! It will appear at the top of your timeline.');
    setIsSaving(false);
  };

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
          <h1 className="text-3xl font-semibold">Stellar Archive</h1>
          <p className="mt-3 text-sm text-slate-400">
            Select or create a project so we can save your proud moments and lessons.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/50">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Stellar Archive</p>
            <h1 className="mt-2 text-3xl font-semibold">Capture wins, lessons, and intentions</h1>
            <p className="text-sm text-slate-400">
              Keep each reflection short (≤ {MAX_FIELD_LENGTH} characters) and focused on one feeling or observation.
            </p>
          </header>

          <div className="space-y-3">
            <div>
              <label htmlFor="proud-of" className="text-sm font-medium text-slate-200">
                Something I'm proud of
              </label>
              <textarea
                id="proud-of"
                rows={2}
                value={proudOf}
                onChange={(event) => setProudOf(event.target.value)}
                maxLength={MAX_FIELD_LENGTH}
                className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-sm text-slate-100 focus:border-fuchsia-400 focus:outline-none"
                placeholder="What part of your project feels like a little win?"
              />
            </div>
            <div>
              <label htmlFor="lesson" className="text-sm font-medium text-slate-200">
                Something I learned
              </label>
              <textarea
                id="lesson"
                rows={2}
                value={lesson}
                onChange={(event) => setLesson(event.target.value)}
                maxLength={MAX_FIELD_LENGTH}
                className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-sm text-slate-100 focus:border-fuchsia-400 focus:outline-none"
                placeholder="What surprised you? What worked or didn’t?"
              />
            </div>
            <div>
              <label htmlFor="next-time" className="text-sm font-medium text-slate-200">
                Something I might do next time
              </label>
              <textarea
                id="next-time"
                rows={2}
                value={nextTime}
                onChange={(event) => setNextTime(event.target.value)}
                maxLength={MAX_FIELD_LENGTH}
                className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-sm text-slate-100 focus:border-fuchsia-400 focus:outline-none"
                placeholder="What could you try next time to keep learning?"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full bg-fuchsia-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:bg-fuchsia-600"
            >
              {isSaving ? 'Saving reflection…' : 'Save reflection'}
            </button>
            <p className="text-xs text-slate-400">{statusMessage}</p>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/50">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Timeline</p>
            <h2 className="text-2xl font-semibold">Recent reflections</h2>
          </header>

          {visibleEntries.length === 0 ? (
            <p className="text-sm text-slate-400">
              No reflections saved yet. Share a small win and we’ll keep it safe for later.
            </p>
          ) : (
            <div className="space-y-4">
              {visibleEntries.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  {entry.proudOf && (
                    <p className="mt-2 text-sm text-slate-100">
                      <span className="font-semibold text-slate-200">Proud of:</span> {entry.proudOf}
                    </p>
                  )}
                  {entry.lesson && (
                    <p className="mt-1 text-sm text-slate-100">
                      <span className="font-semibold text-slate-200">Lesson:</span> {entry.lesson}
                    </p>
                  )}
                  {entry.nextTime && (
                    <p className="mt-1 text-sm text-slate-100">
                      <span className="font-semibold text-slate-200">Next time:</span> {entry.nextTime}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MemoryStationPage;
