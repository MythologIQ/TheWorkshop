import React, { useState } from 'react';
import { useAI } from '../runtime/ai/AIProvider';
import { useProjects } from '../runtime/hooks/useProjects';
import { newId } from '../domain/id';

const MAX_FINDINGS = 5;
const MAX_HISTORY = 12;

const SYSTEM_PROMPT = `
You are the Diagnostics Corridor, a calm test station guiding students to clear, concise understanding checks.
Focus on whether the idea, step, or UI is easy to follow, and celebrate what already looks good.
Be kind, refuse unsafe topics, and keep responses within the Creativity Boundary limits: short, concrete, and positive.
Answer with up to five bullet points describing the clearest findings about the question.
`;

const parseFindings = (text: string): string[] => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const extracted: string[] = [];
  for (const line of lines) {
    if (extracted.length >= MAX_FINDINGS) break;
    const match = line.match(/^[\-\*\•\d\.\)\s]+(.+)$/);
    const candidate = match ? match[1].trim() : line;
    if (candidate.length) {
      extracted.push(candidate);
    }
  }

  if (extracted.length === 0) {
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    for (const sentence of sentences) {
      if (extracted.length >= MAX_FINDINGS) break;
      extracted.push(sentence.replace(/^[\-\*\•\d\.\)\s]+/, '').trim());
    }
  }

  return extracted.slice(0, MAX_FINDINGS);
};

export const DiagnosticsCorridorPage: React.FC = () => {
  const { selectedProject, updateProject } = useProjects();
  const { callStationModel } = useAI();
  const [question, setQuestion] = useState('');
  const [responseText, setResponseText] = useState('');
  const [findings, setFindings] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('Press "Run a test" to ask about one clear question.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessions = selectedProject?.test?.sessions ?? [];
  const recentSessions = [...sessions].slice(-MAX_HISTORY).reverse();

  const handleRunTest = async () => {
    if (!selectedProject) return;
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setLoading(true);
    setResponseText('');
    setFindings([]);
    setError(null);
    setStatusMessage('Running clarity check—wait for the AI to respond.');

    try {
      const generator = callStationModel('test', {
        systemPrompt: SYSTEM_PROMPT,
        userPrompt: `
Project name: ${selectedProject.title || 'Untitled project'}
Current question: ${trimmedQuestion}
Answer with short bullet points (one sentence each) that highlight clarity, what works, and what can be improved.
`,
        maxTokens: 220,
      });
      let buffer = '';
      for await (const chunk of generator) {
        if (chunk.token) {
          buffer += chunk.token;
          setResponseText(buffer);
        }
        if (chunk.done) {
          break;
        }
      }

      const parsed = parseFindings(buffer);
      const finalFindings = parsed.length ? parsed : ['No clear findings yet—try rephrasing the question.'];
      setFindings(finalFindings);
      setStatusMessage('Findings received. The session was saved to the project log.');

      const newSession = {
        id: newId('test'),
        createdAt: new Date().toISOString(),
        question: trimmedQuestion,
        findings: finalFindings,
      };
      const existingSessions = sessions.slice();
      const trimmed = [...existingSessions, newSession].slice(-MAX_HISTORY);
      updateProject(selectedProject.id, {
        test: {
          sessions: trimmed,
        },
      });
    } catch (runError) {
      setError('Something went wrong while running the test. Please try again.');
      setStatusMessage('Waiting for a new question.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-700 bg-slate-900 p-6 text-center">
          <h1 className="text-2xl font-semibold">Diagnostics Corridor</h1>
          <p className="mt-3 text-slate-400">
            Choose or create a project so the test station can keep track of questions and findings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/40">
          <header>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Diagnostics Corridor</p>
            <h1 className="mt-1 text-3xl font-semibold">Check for clarity</h1>
            <p className="text-sm text-slate-400">
              Ask one focused question about your current idea or step. The corridor will keep the tone kind and
              the answers short.
            </p>
          </header>

          <div className="space-y-3">
            <label htmlFor="clarity-question" className="text-sm font-medium text-slate-200">
              What are you wondering about?
            </label>
            <textarea
              id="clarity-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={3}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
              placeholder="Is step 1 easy to follow? Is the story clear? Can someone read this idea and understand it?"
            />
            <p className="text-xs text-slate-500">One question at a time keeps the findings focused (≤ 5 points).</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleRunTest}
              disabled={loading || !question.trim()}
              className="rounded-full bg-fuchsia-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:bg-fuchsia-600"
            >
              {loading ? 'Running clarity check…' : 'Run a test'}
            </button>
            <span className="text-xs text-slate-400">{statusMessage}</span>
          </div>

          {error && <p className="rounded-xl bg-rose-500/20 px-3 py-2 text-xs text-rose-200">{error}</p>}

          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">AI response stream</p>
            <div className="min-h-[120px] rounded-xl border border-dashed border-slate-800/70 bg-slate-900/80 p-3">
              {responseText ? (
                <p className="whitespace-pre-wrap">{responseText}</p>
              ) : (
                <p className="text-xs text-slate-500">
                  The answer will stream here once the model finishes. Streaming helps keep things gentle and
                  manageable.
                </p>
              )}
            </div>
          </div>

          {findings.length > 0 && (
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Findings (saved)</p>
              <ul className="space-y-2 text-sm text-slate-100">
                {findings.map((finding, index) => (
                  <li key={`${finding}-${index}`} className="flex items-start gap-2">
                    <span className="text-fuchsia-400">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <header>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recent sessions</p>
            <h2 className="text-2xl font-semibold">Clarity log</h2>
          </header>

          {recentSessions.length === 0 ? (
            <p className="text-sm text-slate-500">No tests have run yet. Try asking a small question to start a log.</p>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {new Date(session.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-base font-medium text-slate-100">"{session.question}"</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {session.findings.length
                      ? session.findings.slice(0, 3).join(' · ')
                      : 'No findings captured yet.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DiagnosticsCorridorPage;
