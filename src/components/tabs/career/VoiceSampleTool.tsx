import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { loadCareerState, saveCareerState } from '../../../utils/storage';

interface ScriptPreset {
  id: string;
  label: string;
  targetSeconds: number;
  text: string;
}

const SCRIPT_PRESETS: ScriptPreset[] = [
  {
    id: 'intro-pitch',
    label: '30s Remote Intro Pitch',
    targetSeconds: 30,
    text: `Hi, I'm Jordan Reyes, a senior product engineer based in UTC minus five. Over the last six years, I have helped distributed teams ship faster, more reliable web software—most recently unifying four frontends into a single accessible design system and cutting UI regressions by thirty-eight percent. I thrive in async environments where clear writing and thoughtful architecture keep teams aligned. I'd love to bring that same ownership to your engineering team.`,
  },
  {
    id: 'commercial-read',
    label: '45s Warm Commercial Read',
    targetSeconds: 45,
    text: `Great work doesn't always happen in a crowded office. Sometimes your best thinking starts at a quiet desk, with clear goals and tools that stay out of your way. PlanetAI Hub brings transparent remote roles, calm daily planning, and practical offline utilities into one focused space—with zero signups and zero clutter. Wherever you log in from today, open your workspace and build something meaningful.`,
  },
  {
    id: 'technical-narration',
    label: '60s Technical Demo Narration',
    targetSeconds: 60,
    text: `Welcome to this quick walkthrough of our local-first sync engine. Notice how changes made offline immediately update the interface with zero spinner delay. Every edit is written to browser storage first, queued deterministically, and reconciled automatically once connectivity returns. In the next thirty seconds, we'll inspect the conflict resolver, verify schema validation, and export a clean audit log ready for your team.`,
  },
];

function formatTimer(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const VoiceSampleTool: React.FC = () => {
  const [scriptText, setScriptText] = useState<string>(() =>
    loadCareerState<string>('voice', SCRIPT_PRESETS[0].text)
  );
  const [targetSeconds, setTargetSeconds] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1.0);
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('lg');
  const [darkStage, setDarkStage] = useState(true);

  const prompterRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  useEffect(() => {
    saveCareerState('voice', scriptText);
  }, [scriptText]);

  // Elapsed timer interval
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  // Smooth teleprompter auto-scroll loop
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = timestamp;
      }
      const deltaMs = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;

      const el = prompterRef.current;
      if (el) {
        const pxPerSecond = 28 * scrollSpeed;
        el.scrollTop += (pxPerSecond * deltaMs) / 1000;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
          setIsPlaying(false);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, scrollSpeed]);

  const wordCount = useMemo(() => {
    const trimmed = scriptText.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [scriptText]);

  const estimatedSeconds = Math.max(1, Math.round((wordCount / 140) * 60));

  const handleSelectPreset = (preset: ScriptPreset) => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    setTargetSeconds(preset.targetSeconds);
    setScriptText(preset.text);
    if (prompterRef.current) prompterRef.current.scrollTop = 0;
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    if (prompterRef.current) {
      prompterRef.current.scrollTop = 0;
    }
  };

  const fontSizeClass =
    fontSize === 'xl'
      ? 'text-2xl sm:text-3xl leading-relaxed'
      : fontSize === 'lg'
        ? 'text-xl sm:text-2xl leading-relaxed'
        : 'text-base sm:text-lg leading-relaxed';

  return (
    <div className="space-y-5">
      {/* Presets & Stage Controls */}
      <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-slate-900/80 p-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {SCRIPT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="min-h-[38px] rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300 whitespace-nowrap shrink-0"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-1 font-mono text-xs text-indigo-300 tabular-nums">
            <span>{wordCount} words</span>
            <span aria-hidden="true">·</span>
            <span>~{estimatedSeconds}s @ 140 WPM</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-3.5">
          {/* Play / Pause / Reset & Timer */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-300 whitespace-nowrap"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" aria-hidden="true" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" aria-hidden="true" />
                  <span>Start Read</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>Reset</span>
            </button>

            <div className="rounded-xl border border-white/[0.08] bg-[#060913]/85 px-3.5 py-2 font-mono text-sm font-bold text-slate-50 tabular-nums">
              <span className={isPlaying ? 'text-emerald-400' : 'text-slate-50'}>
                {formatTimer(elapsedSeconds)}
              </span>{' '}
              <span className="font-normal text-slate-500">
                / {formatTimer(targetSeconds)}
              </span>
            </div>
          </div>

          {/* Speed, Font Size & Contrast Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span>Speed</span>
              <input
                type="range"
                min={0.5}
                max={2.5}
                step={0.25}
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="w-24 accent-cyan-400"
              />
              <span className="w-9 font-mono text-cyan-300 tabular-nums">
                {scrollSpeed.toFixed(2)}x
              </span>
            </label>

            <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#060913]/85 p-0.5">
              {(['md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontSize(sz)}
                  className={`min-h-[34px] rounded-lg px-2.5 text-xs font-semibold uppercase transition-all ${
                    fontSize === sz
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setDarkStage((d) => !d)}
              className="min-h-[38px] rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] whitespace-nowrap"
            >
              {darkStage ? 'Midnight Stage' : 'Deep Slate Stage'}
            </button>
          </div>
        </div>
      </div>

      {/* Teleprompter Viewport & Script Editor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div
          className={`relative rounded-2xl border p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-7 ${
            darkStage
              ? 'border-cyan-500/20 bg-[#060913]/95 text-slate-50'
              : 'border-white/[0.12] bg-slate-800/85 text-white'
          }`}
        >
          <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-300">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${
                  isPlaying ? 'bg-emerald-400' : 'bg-cyan-400/60'
                }`}
              />
              Teleprompter Reader
            </span>
            <span>Scrolls smoothly on Start Read</span>
          </div>

          <div
            ref={prompterRef}
            className={`h-72 overflow-y-auto pr-2 font-display font-medium ${fontSizeClass}`}
          >
            <p className="whitespace-pre-line py-8">{scriptText}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-5">
          <label
            htmlFor="voice-script-editor"
            className="block font-display text-sm font-bold text-slate-50"
          >
            Edit Audition or Pitch Script
          </label>
          <p className="mt-1 text-xs text-slate-400">
            Updates the teleprompter immediately and saves locally in your browser.
          </p>
          <textarea
            id="voice-script-editor"
            rows={10}
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 p-3.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 transition-colors focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
