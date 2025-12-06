import React, { useMemo, useState } from 'react';
import { useAI } from '../../runtime/ai/AIProvider';
import { useProjects } from '../../runtime/hooks/useProjects';
import { newId } from '../../domain/id';
import { StepStatus } from '../../domain/step';

const REFLECT_TAG_LIMIT = 3;
const MAX_NOTES_LENGTH = 240;
const MAX_SNAPSHOTS = 12;
const TAG_SUGGESTIONS = ['brave', 'patient', 'curious', 'persistent', 'kind', 'focused'];

const REFLECT_SYSTEM_PROMPT = `
You are Orbiter Bridge, the Reflect Station on The Workshop starship.
Your job is to notice small patterns, celebrate effort, and keep the tone kind and future-focused.
You never psychoanalyze a child or diagnose behavior; you only describe what the project work already shows.
Offer short, gentle observations about learning, bravery, or focus, and suggest one or two small next steps.
`;

const userPromptFromProject = (title: string, memoryCount: number, testCount: number, buildStatus: string): string => `
Project title: ${title}
Memory entries saved: ${memoryCount}
Test checkpoints logged: ${testCount}
Build status: ${buildStatus}

Please summarize the patterns you notice in plain, kid-friendly language. Keep it kind, encouraging, and focused on what the child has already done or could try next.
`;

const clampNotes = (value: string): string => value.trim().slice(0, MAX_NOTES_LENGTH);

export const ReflectStationPage: React.FC = () => {
  const { selectedProject, updateProject } = useProjects();
  const { callStationModel } = useAI();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState('Collect a few supportive tags, jot a short note, and snapshot your reflection.');
  const [aiResponse, setAIResponse] = useState('');
  const [aiStatus, setAIStatus] = useState('Optional: ask the AI for a warm summary of what you noticed.');
  const [aiRunning, setAIRunning] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  const memoryEntries = selectedProject?.memory?.entries ?? [];
  const testSessions = selectedProject?.test?.sessions ?? [];
  const snapshots = selectedProject?.reflect?.snapshots ?? [];
  const visibleSnapshots = useMemo(() => [...snapshots].slice(-MAX_SNAPSHOTS).reverse(), [snapshots]);

  const buildStatusCounts = useMemo(() => {
    const counts: Record<StepStatus, number> = {
      todo: 0,
      in_progress: 0,
      blocked: 0,
      done: 0,
    };
    selectedProject?.steps.forEach((step) => {
      counts[step.status] = (counts[step.status] ?? 0) + 1;
    });
    return counts;
  }, [selectedProject]);

  const totalFindings = testSessions.reduce((acc, session) => acc + session.findings.length, 0);

  const buildSummary = `Build progress: ${buildStatusCounts.done} done, ${buildStatusCounts.in_progress} in progress, ${buildStatusCounts.todo} todo`;

  const topWords = useMemo(() => {
    const words: string[] = [];
    memoryEntries.forEach((entry) => {
      [entry.proudOf, entry.lesson, entry.nextTime].forEach((text) => {
        if (!text) return;
        text
          .split(/\W+/)
          .map((word) => word.toLowerCase().trim())
          .filter((word) => word.length > 3)
          .forEach((word) => words.push(word));
      });
    });
    const counts: Record<string, number> = {};
    words.forEach((word) => {
      counts[word] = (counts[word] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);
  }, [memoryEntries]);

  const patternSummaries = [
    `Memory log holds ${memoryEntries.length} reflection${memoryEntries.length === 1 ? '' : 's'} and celebrates ${topWords[0] ?? 'curiosity'}.`,
    `Diagnostics Corridor noted ${testSessions.length} question${testSessions.length === 1 ? '' : 's'} with ${totalFindings} total finding${totalFindings === 1 ? '' : 's'}.`,
    buildSummary,
    topWords.length > 0
      ? `You keep circling around ideas like ${topWords.join(', ')}—that’s where your focus energy is.`
      : 'You keep shining a light on kindness, creativity, and steady effort.',
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags((current) => {
      if (current.includes(tag)) return current.filter((t) => t !== tag);
      if (current.length >= REFLECT_TAG_LIMIT) return current;
      return [...current, tag];
    });
  };

  const handleSaveSnapshot = () => {
    if (!selectedProject) return;
    const trimmedNotes = clampNotes(notes);
    if (!trimmedNotes && selectedTags.length === 0) {
      setStatusMessage('Add a tag or a short note to capture what matters to you.');
      return;
    }
    const newSnapshot = {
      id: newId('reflect'),
      createdAt: new Date().toISOString(),
      tags: selectedTags,
      notes: trimmedNotes,
    };
    const updated = [...snapshots, newSnapshot].slice(-MAX_SNAPSHOTS);
    updateProject(selectedProject.id, {
      reflect: {
        snapshots: updated,
      },
    });
    setSelectedTags([]);
    setNotes('');
    setStatusMessage('Snapshot saved! It will be there when you revisit Orbiter Bridge.');
  };

  const handleAskAI = async () => {
    if (!selectedProject) return;
    setAIRunning(true);
    setAIStatus('Collecting gentle patterns from Orbiter Bridge...');
    setAIResponse('');
    setAIError(null);
    const prompt = userPromptFromProject(selectedProject.title, memoryEntries.length, testSessions.length, buildSummary);
    try {
      const generator = callStationModel('reflect', {
        systemPrompt: REFLECT_SYSTEM_PROMPT,
        userPrompt: prompt,
        maxTokens: 220,
      });
      let buffer = '';
      for await (const chunk of generator) {
        if (chunk.token) {
          buffer += chunk.token;
          setAIResponse(buffer);
        }
        if (chunk.done) {
          break;
        }
      }
      setAIStatus('AI summary ready.');
    } catch {
      setAIError('AI could not respond just now. Try again later.');
      setAIStatus('AI unavailable at the moment.');
    } finally {
      setAIRunning(false);
    }
  };

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
          <h1 className="text-3xl font-semibold">Orbiter Bridge</h1>
          <p className="mt-3 text-sm text-slate-400">
            Choose or create a project first so Reflect Station can notice your patterns.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/50">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Orbiter Bridge</p>
            <h1 className="mt-2 text-3xl font-semibold">Notice the story you're building</h1>
            <p className="text-sm text-slate-400">These gently-observed patterns keep the focus on effort, not perfection.</p>
          </header>

          <ul className="space-y-2">
            {patternSummaries.map((summary, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-200">
                <span className="mt-0.5 text-fuchsia-400">•</span>
                <span>{summary}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/50">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Tag a feeling</p>
            <h2 className="text-2xl font-semibold">Choose up to {REFLECT_TAG_LIMIT} tags</h2>
          </header>

          <div className="flex flex-wrap gap-2">
            {TAG_SUGGESTIONS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={`rounded-full px-4 py-1 text-xs font-semibold ${
                    selected
                      ? 'bg-fuchsia-500 text-white'
                      : 'border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-fuchsia-400'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div>
            <label htmlFor="reflect-notes" className="text-sm font-medium text-slate-200">
              Notes (keep it short, ≤ {MAX_NOTES_LENGTH} chars)
            </label>
            <textarea
              id="reflect-notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value.slice(0, MAX_NOTES_LENGTH))}
              className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-sm text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              placeholder="What did you notice about the project or yourself? What might be different next time?"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSaveSnapshot}
              className="rounded-full bg-fuchsia-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-400"
            >
              Save snapshot
            </button>
            <p className="text-xs text-slate-400">{statusMessage}</p>
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/50">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">AI summary (optional)</p>
              <h2 className="text-2xl font-semibold">Ask Orbiter Bridge for gentle patterns</h2>
            </div>
            <button
              type="button"
              onClick={handleAskAI}
              disabled={aiRunning}
              className="rounded-full border border-slate-700 bg-slate-900/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 hover:border-fuchsia-400 disabled:cursor-not-allowed disabled:border-slate-600"
            >
              {aiRunning ? 'Listening…' : 'Ask AI'}
            </button>
          </header>
          <p className="text-xs text-slate-400">{aiStatus}</p>

          <div className="min-h-[120px] rounded-2xl border border-dashed border-slate-800/70 bg-slate-950/80 p-4 text-sm text-slate-100">
            {aiError && <p className="text-xs text-rose-300">{aiError}</p>}
            {aiResponse ? (
              <p className="whitespace-pre-wrap">{aiResponse}</p>
            ) : (
              <p className="text-xs text-slate-500">
                The AI summary will appear here after Orbiter Bridge finishes thinking.
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/50">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Snapshots</p>
            <h2 className="text-2xl font-semibold">Saved reflections</h2>
          </header>

          {visibleSnapshots.length === 0 ? (
            <p className="text-sm text-slate-400">
              No snapshots yet. Save one after a session so you can compare what you notice later.
            </p>
          ) : (
            <div className="space-y-3">
              {visibleSnapshots.map((snapshot) => (
                <div key={snapshot.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {new Date(snapshot.createdAt).toLocaleString()}
                  </p>
                  {snapshot.tags.length > 0 && (
                    <p className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                      {snapshot.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-slate-700 px-3 py-1">
                          {tag}
                        </span>
                      ))}
                    </p>
                  )}
                  {snapshot.notes && <p className="mt-2 text-sm text-slate-100">{snapshot.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReflectStationPage;
