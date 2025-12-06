import React, { useMemo, useState } from 'react';
import { useAI } from '../../runtime/ai/AIProvider';
import { useProjects } from '../../runtime/hooks/useProjects';
import manifest from '../../data/image_manifest_v1.json';

type ManifestEntry = {
  id: string;
  category: string;
  station?: string;
  file_name: string;
};

const assetsBase = '/assets';
const templateAssetId = 'IMG-EXPORT-001';

const audienceOptions = [
  { value: 'family', label: 'Family', hint: 'Share with parents or caretakers.' },
  { value: 'teacher', label: 'Teacher', hint: 'Send it to your mentor or guide.' },
  { value: 'friend', label: 'Friend', hint: 'Let a buddy see your progress.' },
];

const formatOptions: { value: 'page' | 'poster'; label: string; caption: string }[] = [
  { value: 'page', label: 'One-page summary', caption: 'Simple 8.5x11 print, easy to fold.' },
  { value: 'poster', label: 'Celebration poster', caption: 'Tall layout for a wall or clipboard.' },
];

const shareSystemPrompt = `
You are the Broadcast Deck, a kind assistant helping kids celebrate their work.
Speak in short, encouraging sentences that note what happened, what was learned, and a bright next step.
Never mention personal data or labels, and keep the tone supportive and clear.
Return a very short summary that would fit on a one-page showcase.
`;

const resolveAssetUrl = (entry: ManifestEntry): string => {
  if (entry.category === 'export-template' || entry.category === 'template') {
    return `${assetsBase}/templates/${entry.file_name}`;
  }
  return `${assetsBase}/${entry.file_name}`;
};

const clamp = (value = '', max = 200): string => value.trim().slice(0, max);

const ShareStationPage: React.FC = () => {
  const { selectedProject, updateProject } = useProjects();
  const { callStationModel } = useAI();
  const [audience, setAudience] = useState(audienceOptions[0].value);
  const [format, setFormat] = useState<'page' | 'poster'>(formatOptions[0].value);
  const [statusMessage, setStatusMessage] = useState('Choose who you are sharing with and what format you'd like.');
  const [aiResponse, setAIResponse] = useState('');
  const [aiStatus, setAIStatus] = useState('Optional: ask for a kind, kid-friendly summary.');
  const [aiRunning, setAIRunning] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  const templateEntry = (manifest as ManifestEntry[]).find((entry) => entry.id === templateAssetId);
  const templateUrl = templateEntry
    ? resolveAssetUrl(templateEntry)
    : `${assetsBase}/templates/template-share-page-a4-2480x3508.png`;

  const selectedAudienceLabel = audienceOptions.find((entry) => entry.value === audience)?.label ?? 'Family';

  const previewSegments = useMemo(() => {
    if (!selectedProject) return [];
    const mission = clamp(selectedProject.description || 'A new idea is starting to bloom.', 160);
    const goal = clamp(selectedProject.goal?.outcome || 'Bring kindness and creativity to the Workshop.', 160);
    const steps = selectedProject.steps.slice(0, 3);
    const stepText = steps
      .map((step, index) => `${index + 1}. ${clamp(step.title || step.summary || 'Step details', 80)}`)
      .join('  ');
    const tests = selectedProject.tests.slice(-2);
    const testNotes = tests
      .map((test) => {
        const question = clamp(test.question, 80);
        const note = test.note ? clamp(test.note, 100) : '';
        return note ? `${question} • ${note}` : question;
      })
      .join('  ');
    const reflections = selectedProject.reflections.slice(-2);
    const reflectionNotes = reflections
      .map((reflection) => clamp(reflection.note, 100))
      .filter(Boolean)
      .join('  ');

    const segments = [
      `Project: ${clamp(selectedProject.title || 'Untitled project', 60)}`,
      `Audience: ${selectedAudienceLabel}`,
      `Mission: ${mission}`,
      `Goal: ${goal}`,
    ];
    if (stepText) segments.push(`Key steps: ${stepText}`);
    if (testNotes) segments.push(`Test checks: ${testNotes}`);
    if (reflectionNotes) segments.push(`Reflection notes: ${reflectionNotes}`);
    return segments;
  }, [selectedProject, selectedAudienceLabel]);

  const previewText = useMemo(() => previewSegments.join('\n'), [previewSegments]);

  const stepsForPreview = selectedProject?.steps.slice(0, 3) ?? [];
  const testsForPreview = selectedProject?.tests.slice(-2) ?? [];
  const reflectionsForPreview = selectedProject?.reflections.slice(-2) ?? [];

  const shareText = () => `${previewText}\nShared with: ${selectedAudienceLabel}\nFormat: ${format}`;

  const markShare = (chosenFormat: 'page' | 'poster') => {
    if (!selectedProject) return;
    updateProject(selectedProject.id, {
      share: {
        lastExportAt: new Date().toISOString(),
        lastFormat: chosenFormat,
      },
    });
  };

  const handlePrint = () => {
    markShare(format);
    setStatusMessage('Opening the print dialog—check with an adult before you share.');
    if (typeof window !== 'undefined' && window.print) {
      window.print();
    }
  };

  const handleDownload = () => {
    markShare(format);
    const summary = shareText();
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'workshop-share-summary.txt';
    anchor.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Summary downloaded. Ask a trusted adult before sharing it.');
  };

  const handleAskAI = async () => {
    if (!selectedProject) return;
    setAIRunning(true);
    setAIStatus('Asking the Workshop AI for a warm summary…');
    setAIResponse('');
    setAIError(null);
    try {
      const generator = callStationModel('share', {
        systemPrompt: shareSystemPrompt,
        userPrompt: shareText(),
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
    } catch (error) {
      setAIError('The AI could not respond right now. Please try again later.');
      setAIStatus('AI unavailable.');
    } finally {
      setAIRunning(false);
    }
  };

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
          <h1 className="text-3xl font-semibold">Broadcast Deck</h1>
          <p className="mt-3 text-sm text-slate-400">Select a project to capture your journey and share it safely.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/50">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Broadcast Deck</p>
            <h1 className="mt-2 text-3xl font-semibold">Share a one-page story of your work</h1>
            <p className="text-sm text-slate-400">
              Pick a kind audience, choose the format, and watch the live preview update. Everything stays
              short, safe, and ready to celebrate your effort.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Share with</p>
              <div className="flex flex-wrap gap-2">
                {audienceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAudience(option.value)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                      option.value === audience
                        ? 'bg-fuchsia-500 text-white'
                        : 'border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-fuchsia-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">{audienceOptions.find((opt) => opt.value === audience)?.hint}</p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Format</p>
              <div className="flex flex-wrap gap-2">
                {formatOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormat(option.value)}
                    className={`rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                      option.value === format
                        ? 'bg-slate-100/90 text-slate-900'
                        : 'border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-fuchsia-400'
                    }`}
                  >
                    <div>{option.label}</div>
                    <div className="text-[10px] font-normal tracking-tight text-slate-400">{option.caption}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url(${templateUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Live preview</p>
                <h2 className="text-2xl font-semibold text-slate-100">{selectedProject.title || 'Untitled project'}</h2>
                <p className="text-sm text-slate-300">{selectedProject.description || 'A friendly project in progress.'}</p>

                <div className="space-y-2 text-sm text-slate-200">
                  <p>
                    <span className="font-semibold text-slate-100">Mission:</span> {clamp(selectedProject.description || 'Bring your idea to life', 140)}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-100">Goal:</span> {clamp(selectedProject.goal?.outcome || 'Create something proud and safe', 140)}
                  </p>
                </div>

                {stepsForPreview.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Key steps</p>
                    <ul className="mt-2 space-y-2">
                      {stepsForPreview.map((step) => (
                        <li key={step.id} className="flex items-start gap-2">
                          <span className="text-fuchsia-400">•</span>
                          <span>{clamp(step.title || step.summary || 'Step detail', 120)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {testsForPreview.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recent tests</p>
                    <ul className="mt-2 space-y-2">
                      {testsForPreview.map((test) => (
                        <li key={test.id} className="text-xs text-slate-300">
                          <span className="font-semibold text-slate-100">{clamp(test.question, 70)}</span>
                          <br />
                          <span>{clamp(test.note || 'No extra note', 110)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {reflectionsForPreview.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Kid reflections</p>
                    <ul className="mt-2 space-y-2">
                      {reflectionsForPreview.map((reflection) => (
                        <li key={reflection.id}>{clamp(reflection.note, 120)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Summary text</p>
                <p className="mt-3 whitespace-pre-wrap text-xs text-slate-300">{previewText || 'Add more steps or reflections to see richer content.'}</p>
                {selectedProject.share?.lastExportAt && (
                  <p className="mt-3 text-[11px] text-slate-500">
                    Last exported {new Date(selectedProject.share.lastExportAt).toLocaleString()} as{' '}
                    {selectedProject.share.lastFormat}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 rounded-full bg-fuchsia-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-fuchsia-400"
                  >
                    Print summary
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 rounded-full border border-slate-700 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:border-fuchsia-400"
                  >
                    Download text
                  </button>
                </div>
                <p className="mt-3 text-[11px] text-slate-400">
                  Always check with a trusted adult before sharing this summary outside the Workshop.
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{statusMessage}</p>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
                <header className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AI summary</p>
                    <h3 className="text-lg font-semibold text-slate-100">Ask for a friendly rewording</h3>
                  </div>
                  <button
                    type="button"
                    disabled={aiRunning}
                    onClick={handleAskAI}
                    className="rounded-full border border-slate-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-200 hover:border-fuchsia-500 disabled:border-slate-600 disabled:text-slate-500"
                  >
                    {aiRunning ? 'Thinking…' : 'Ask AI'}
                  </button>
                </header>
                <p className="text-[11px] text-slate-500">{aiStatus}</p>
                <div className="min-h-[96px] rounded-2xl border border-dashed border-slate-800/70 bg-slate-950/80 p-3 text-xs text-slate-300">
                  {aiError && <p className="text-rose-300">{aiError}</p>}
                  {aiResponse ? (
                    <p className="whitespace-pre-wrap">{aiResponse}</p>
                  ) : (
                    <p>The AI response will appear here after it finishes.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShareStationPage;
