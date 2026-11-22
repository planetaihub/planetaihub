import React, { useState } from 'react';
import {
  CalendarClock,
  Cloud,
  FileJson,
  KeyRound,
  Layers,
  Wrench,
} from 'lucide-react';
import { CloudCostEstimatorTool } from './CloudCostEstimatorTool';
import { JwtCodecTool } from './JwtCodecTool';
import { JsonYamlTool } from './JsonYamlTool';
import { CronBuilderTool } from './CronBuilderTool';
import { DevToolsSeoGuide } from './DevToolsSeoGuide';

export type B2BToolId = 'cloud-cost' | 'jwt-codec' | 'json-yaml' | 'cron-builder';

interface B2BToolItem {
  id: B2BToolId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const B2B_TOOLS: B2BToolItem[] = [
  {
    id: 'cloud-cost',
    label: 'Cloud Egress & Storage Estimator',
    shortLabel: 'Cloud Egress',
    icon: Cloud,
  },
  {
    id: 'jwt-codec',
    label: 'JWT Inspector & Base64 Codec',
    shortLabel: 'JWT & Codec',
    icon: KeyRound,
  },
  {
    id: 'json-yaml',
    label: 'JSON / YAML Formatter & Validator',
    shortLabel: 'JSON & YAML',
    icon: FileJson,
  },
  {
    id: 'cron-builder',
    label: 'Cron Expression Builder & Simulator',
    shortLabel: 'Cron Simulator',
    icon: CalendarClock,
  },
];

export const B2BCloudWebSuite: React.FC = () => {
  const [activeTool, setActiveTool] = useState<B2BToolId>('cloud-cost');

  return (
    <div className="space-y-8">
      {/* Horizontally Scrollable Utility Sub-Tab Bar */}
      <div className="w-full max-w-full rounded-2xl border border-slate-200 bg-slate-50/90 shadow-2xs p-1.5">
        <div
          role="tablist"
          aria-label="B2B Cloud and Web utilities"
          className="flex w-full items-center overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade gap-1.5"
        >
          {B2B_TOOLS.map(({ id, label, shortLabel, icon: Icon }) => {
            const isSelected = activeTool === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={(e) => {
                  setActiveTool(id);
                  if (window.innerWidth <= 768) {
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    });
                  }
                }}
                className={`snap-center inline-flex items-center gap-2 shrink-0 whitespace-nowrap min-h-[40px] rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Interactive Tool Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        {activeTool === 'cloud-cost' && <CloudCostEstimatorTool />}
        {activeTool === 'jwt-codec' && <JwtCodecTool />}
        {activeTool === 'json-yaml' && <JsonYamlTool />}
        {activeTool === 'cron-builder' && <CronBuilderTool />}
      </div>

      {/* 500-Word SEO Engineering Guide & FAQ */}
      <DevToolsSeoGuide />
    </div>
  );
};
