import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { AmbientSoundTool } from './productivity/AmbientSoundTool';
import { CalculatorTool } from './productivity/CalculatorTool';
import { ClockAlarmTool } from './productivity/ClockAlarmTool';
import { NotesCalendarTool } from './productivity/NotesCalendarTool';
import { PomodoroTool } from './productivity/PomodoroTool';
import { SnippetsTool } from './productivity/SnippetsTool';

type ProductivityToolId =
  | 'clock'
  | 'pomodoro'
  | 'snippets'
  | 'notes'
  | 'ambient'
  | 'calculator';

const PRODUCTIVITY_TOOLS: Array<{ id: ProductivityToolId; label: string }> = [
  { id: 'clock', label: 'Clock & Alarm' },
  { id: 'pomodoro', label: 'Pomodoro Timer' },
  { id: 'snippets', label: 'Quick Snippets' },
  { id: 'notes', label: 'Notes & Calendar' },
  { id: 'ambient', label: 'Ambient Sound Machine' },
  { id: 'calculator', label: 'Calculator' },
];

export const ProductivityTab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ProductivityToolId>('clock');

  return (
    <section aria-labelledby="productivity-heading" className="space-y-6">
      <div className="border-b border-cyan-500/15 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/25 bg-slate-900/75 text-cyan-400">
            <CheckSquare className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Deep Work Suite
            </p>
            <h1
              id="productivity-heading"
              className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance"
            >
              Daily Productivity
            </h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Six offline-capable focus tools—world clock & alarm, Pomodoro intervals, clipboard snippets, notes calendar, Web Audio ambient synthesizer, and scientific calculator.
        </p>
      </div>

      {/* Horizontally Scrollable Sub-Tab Bar */}
      <div className="w-full max-w-full rounded-2xl border border-cyan-500/15 bg-slate-900/75 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        <div
          role="tablist"
          aria-label="Daily Productivity tools"
          className="flex w-full items-center overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade gap-2 px-3 pr-8 py-1.5"
        >
          {PRODUCTIVITY_TOOLS.map((tool) => {
            const isSelected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={(e) => {
                  setActiveTool(tool.id);
                  if (window.innerWidth <= 768) {
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    });
                  }
                }}
                className={`snap-center shrink-0 whitespace-nowrap min-h-[40px] rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                {tool.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {activeTool === 'clock' && <ClockAlarmTool />}
        {activeTool === 'pomodoro' && <PomodoroTool />}
        {activeTool === 'snippets' && <SnippetsTool />}
        {activeTool === 'notes' && <NotesCalendarTool />}
        {activeTool === 'ambient' && <AmbientSoundTool />}
        {activeTool === 'calculator' && <CalculatorTool />}
      </div>

      <AdBanner />
    </section>
  );
};
