import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { EmailDrafterTool } from './career/EmailDrafterTool';
import { InterviewPrepTool } from './career/InterviewPrepTool';
import { ResumeBuilderTool } from './career/ResumeBuilderTool';
import { RubricSimulatorTool } from './career/RubricSimulatorTool';
import { VoiceSampleTool } from './career/VoiceSampleTool';

type CareerToolId =
  | 'resume'
  | 'email'
  | 'interview'
  | 'rubric'
  | 'voice';

const CAREER_TOOLS: Array<{ id: CareerToolId; label: string }> = [
  { id: 'resume', label: 'Resume & Cover Letter' },
  { id: 'email', label: 'Quick Email Drafter' },
  { id: 'interview', label: 'AI Interview Prep' },
  { id: 'rubric', label: 'Rubric Simulator' },
  { id: 'voice', label: 'Voice Sample Prep' },
];

export const CareerStudioTab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<CareerToolId>('resume');

  return (
    <section aria-labelledby="career-studio-heading" className="space-y-6">
      <div className="no-print border-b border-cyan-500/15 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/25 bg-slate-900/75 text-cyan-400">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Application Suite
            </p>
            <h1
              id="career-studio-heading"
              className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance"
            >
              Career Studio
            </h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Five local-first career preparation tools—resume & PDF export, outreach templates, STAR interview builder, application rubric, and voice teleprompter.
        </p>
      </div>

      {/* Horizontally Scrollable 5-Tool Sub-Tab Bar */}
      <div className="no-print w-full max-w-full rounded-2xl border border-cyan-500/15 bg-slate-900/75 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        <div
          role="tablist"
          aria-label="Career Studio tools"
          className="flex w-full items-center overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade gap-2 px-3 pr-8 py-1.5"
        >
          {CAREER_TOOLS.map((tool) => {
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

      {/* Active Tool Workspace */}
      <div>
        {activeTool === 'resume' && <ResumeBuilderTool />}
        {activeTool === 'email' && <EmailDrafterTool />}
        {activeTool === 'interview' && <InterviewPrepTool />}
        {activeTool === 'rubric' && <RubricSimulatorTool />}
        {activeTool === 'voice' && <VoiceSampleTool />}
      </div>

      {/* AdBanner strictly below main output section */}
      <AdBanner />
    </section>
  );
};
