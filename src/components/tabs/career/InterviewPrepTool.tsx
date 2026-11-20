import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Shuffle } from 'lucide-react';
import { loadCareerState, saveCareerState } from '../../../utils/storage';

type RoleTrack =
  | 'Frontend & Full-Stack'
  | 'Backend & Systems'
  | 'Product Design'
  | 'Product Management'
  | 'Data & AI'
  | 'Operations & Growth';

interface InterviewQuestion {
  id: string;
  track: RoleTrack;
  focus: 'Behavioral' | 'Technical / Craft' | 'Remote Collaboration';
  prompt: string;
  tip: string;
}

interface StarDraft {
  situation: string;
  task: string;
  action: string;
  result: string;
}

const QUESTION_BANK: InterviewQuestion[] = [
  {
    id: 'fe-1',
    track: 'Frontend & Full-Stack',
    focus: 'Technical / Craft',
    prompt:
      'Tell me about a time you significantly improved perceived load performance or core web vitals in a production app.',
    tip: 'Highlight specific bottlenecks (bundle splitting, hydration, caching) and before/after p95 metrics.',
  },
  {
    id: 'fe-2',
    track: 'Frontend & Full-Stack',
    focus: 'Remote Collaboration',
    prompt:
      'Describe how you aligned a design and backend team on an ambiguous UI architecture while working asynchronously.',
    tip: 'Show how you used written RFCs, prototypes, or schema contracts to prevent rework.',
  },
  {
    id: 'fe-3',
    track: 'Frontend & Full-Stack',
    focus: 'Behavioral',
    prompt:
      'Walk through a complex production bug you shipped and how you changed your testing or review workflow afterward.',
    tip: 'Focus on ownership, calm incident triage, and the systemic safeguard you introduced.',
  },
  {
    id: 'be-1',
    track: 'Backend & Systems',
    focus: 'Technical / Craft',
    prompt:
      'Describe a distributed system failure, race condition, or retry storm you diagnosed and resolved.',
    tip: 'Explain idempotency, backpressure, or database isolation trade-offs clearly.',
  },
  {
    id: 'be-2',
    track: 'Backend & Systems',
    focus: 'Behavioral',
    prompt:
      'Tell me about a time you pushed back on a technical shortcut and advocated for long-term reliability.',
    tip: 'Quantify the operational risk and how you negotiated a pragmatic compromise.',
  },
  {
    id: 'pd-1',
    track: 'Product Design',
    focus: 'Technical / Craft',
    prompt:
      'Walk through a complex multi-step workflow you simplified without removing critical power-user controls.',
    tip: 'Detail user research insights, progressive disclosure choices, and task-completion lift.',
  },
  {
    id: 'pd-2',
    track: 'Product Design',
    focus: 'Remote Collaboration',
    prompt:
      'How do you run asynchronous design critiques across timezones without losing momentum or context?',
    tip: 'Mention recorded walkthroughs, structured feedback prompts, and clear decision deadlines.',
  },
  {
    id: 'pm-1',
    track: 'Product Management',
    focus: 'Behavioral',
    prompt:
      'Describe a time customer data contradicted your initial roadmap hypothesis. What did you change?',
    tip: 'Show intellectual honesty, rapid validation experiments, and measurable retention/adoption impact.',
  },
  {
    id: 'pm-2',
    track: 'Product Management',
    focus: 'Remote Collaboration',
    prompt:
      'How did you keep engineering, marketing, and support aligned ahead of a high-stakes launch in a distributed company?',
    tip: 'Emphasize crisp written briefs, launch readiness checklists, and clear ownership.',
  },
  {
    id: 'da-1',
    track: 'Data & AI',
    focus: 'Technical / Craft',
    prompt:
      'Tell me about an evaluation pipeline or data quality monitor you built that caught silent regressions before users noticed.',
    tip: 'Cover golden datasets, latency/cost budgets, and alerting thresholds.',
  },
  {
    id: 'da-2',
    track: 'Data & AI',
    focus: 'Behavioral',
    prompt:
      'Explain how you communicated a nuanced model limitation or metric caveat to non-technical leadership.',
    tip: 'Focus on clarity, concrete business risk examples, and actionable mitigation options.',
  },
  {
    id: 'og-1',
    track: 'Operations & Growth',
    focus: 'Behavioral',
    prompt:
      'Share an example of a manual cross-team process you automated or documented to scale remote operations.',
    tip: 'Include hours saved per week, error reduction, and adoption by teammates.',
  },
  {
    id: 'og-2',
    track: 'Operations & Growth',
    focus: 'Remote Collaboration',
    prompt:
      'Describe how you prioritized competing stakeholder requests when resources tightened.',
    tip: 'Show your scoring criteria, transparent communication, and measurable outcome.',
  },
];

const TRACKS: RoleTrack[] = [
  'Frontend & Full-Stack',
  'Backend & Systems',
  'Product Design',
  'Product Management',
  'Data & AI',
  'Operations & Growth',
];

const EMPTY_STAR: StarDraft = {
  situation: '',
  task: '',
  action: '',
  result: '',
};

export const InterviewPrepTool: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<RoleTrack>(
    'Frontend & Full-Stack'
  );
  const trackQuestions = useMemo(
    () => QUESTION_BANK.filter((q) => q.track === selectedTrack),
    [selectedTrack]
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [starMap, setStarMap] = useState<Record<string, StarDraft>>(() =>
    loadCareerState<Record<string, StarDraft>>('star', {})
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    saveCareerState('star', starMap);
  }, [starMap]);

  const activeQuestion =
    trackQuestions[questionIndex % trackQuestions.length] || QUESTION_BANK[0];
  const currentDraft = starMap[activeQuestion.id] || EMPTY_STAR;

  const updateStarField = (field: keyof StarDraft, value: string) => {
    setStarMap((prev) => ({
      ...prev,
      [activeQuestion.id]: {
        ...(prev[activeQuestion.id] || EMPTY_STAR),
        [field]: value,
      },
    }));
  };

  const handleTrackChange = (track: RoleTrack) => {
    setSelectedTrack(track);
    setQuestionIndex(0);
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => (prev + 1) % trackQuestions.length);
  };

  const totalWords = useMemo(() => {
    const combined = [
      currentDraft.situation,
      currentDraft.task,
      currentDraft.action,
      currentDraft.result,
    ]
      .join(' ')
      .trim();
    if (!combined) return 0;
    return combined.split(/\s+/).length;
  }, [currentDraft]);

  const copyStarAnswer = async () => {
    const formatted = [
      `Question: ${activeQuestion.prompt}`,
      '',
      `Situation: ${currentDraft.situation}`,
      `Task: ${currentDraft.task}`,
      `Action: ${currentDraft.action}`,
      `Result: ${currentDraft.result}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked
    }
  };

  const clearCurrentDraft = () => {
    setStarMap((prev) => {
      const next = { ...prev };
      delete next[activeQuestion.id];
      return next;
    });
  };

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-wider text-slate-400';
  const textareaClass =
    'mt-1.5 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 py-2.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 transition-colors focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none';

  return (
    <div className="space-y-5">
      {copied && (
        <div
          role="status"
          className="fixed right-5 bottom-20 z-50 inline-flex items-center gap-2 rounded-xl border border-emerald-400/35 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-emerald-300 shadow-[0_12px_32px_rgba(0,0,0,0.65)] backdrop-blur-xl md:bottom-6"
        >
          <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <span>Copied ✓</span>
        </div>
      )}

      {/* Floating Role Track Selector */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-slate-900/80 px-4 py-2.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {TRACKS.map((track) => (
            <button
              key={track}
              type="button"
              onClick={() => handleTrackChange(track)}
              className={`min-h-[38px] rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                selectedTrack === track
                  ? 'border-cyan-400/50 bg-cyan-400 text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.28)]'
                  : 'border-white/[0.08] bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {track}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNextQuestion}
          className="inline-flex min-h-[40px] items-center gap-1.5 self-start rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-300 sm:self-center whitespace-nowrap shrink-0"
        >
          <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Next Question</span>
        </button>
      </div>

      {/* Active Question Prompt */}
      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-400/30 bg-indigo-500/20 px-2.5 py-1 font-medium text-indigo-300">
            {activeQuestion.track}
            <span aria-hidden="true">·</span>
            {activeQuestion.focus}
          </span>
          <span className="font-mono text-slate-400 tabular-nums">
            Prompt {(questionIndex % trackQuestions.length) + 1} of{' '}
            {trackQuestions.length}
          </span>
        </div>

        <h2 className="mt-3 font-display text-xl font-bold text-slate-50 text-balance">
          {activeQuestion.prompt}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          <span className="font-semibold text-cyan-300">Interviewer lens:</span>{' '}
          {activeQuestion.tip}
        </p>
      </div>

      {/* STAR Answer Builder */}
      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="font-display text-base font-bold text-slate-50">
              STAR Answer Builder
            </h3>
            <p className="text-xs text-slate-400">
              Target 150–250 words (~60–90 seconds spoken). Saved locally per question.
            </p>
          </div>
          <span
            className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold tabular-nums ${
              totalWords >= 150 && totalWords <= 250
                ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-400'
                : 'border-white/[0.08] bg-[#060913]/75 text-slate-200'
            }`}
          >
            {totalWords} words
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              S — Situation (Context &amp; stakes)
            </label>
            <textarea
              rows={3}
              value={currentDraft.situation}
              onChange={(e) => updateStarField('situation', e.target.value)}
              placeholder="Set the scene concisely in 1–2 sentences..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              T — Task (Your specific responsibility)
            </label>
            <textarea
              rows={3}
              value={currentDraft.task}
              onChange={(e) => updateStarField('task', e.target.value)}
              placeholder="What outcome were you personally accountable for?"
              className={textareaClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              A — Action (Concrete steps &amp; trade-offs)
            </label>
            <textarea
              rows={4}
              value={currentDraft.action}
              onChange={(e) => updateStarField('action', e.target.value)}
              placeholder="Detail the decisions you made, tools used, and collaboration..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              R — Result (Quantified impact &amp; learning)
            </label>
            <textarea
              rows={4}
              value={currentDraft.result}
              onChange={(e) => updateStarField('result', e.target.value)}
              placeholder="Share metrics, time saved, or systemic improvements..."
              className={textareaClass}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={clearCurrentDraft}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Clear Draft</span>
          </button>

          <button
            type="button"
            onClick={copyStarAnswer}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-300"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-slate-950" aria-hidden="true" />
                <span>Copied ✓</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                <span>Copy STAR Answer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
