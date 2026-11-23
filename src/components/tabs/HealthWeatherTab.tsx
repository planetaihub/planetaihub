import React, { useState } from 'react';
import { Activity, CloudSun } from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { BmiVitalsTool } from './health/BmiVitalsTool';
import { WeatherWidgetTool } from './health/WeatherWidgetTool';

type HealthToolId = 'vitals' | 'weather';

const HEALTH_TOOLS: Array<{
  id: HealthToolId;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'vitals', label: 'BMI & Daily Vitals Tracker', Icon: Activity },
  { id: 'weather', label: 'Live Weather Widget', Icon: CloudSun },
];

export const HealthWeatherTab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<HealthToolId>('vitals');

  return (
    <section
      aria-labelledby="health-weather-heading"
      className="w-full max-w-full overflow-x-hidden space-y-6"
    >
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1D4ED8]">
            <CloudSun className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              Wellness &amp; Climate
            </p>
            <h2
              id="health-weather-heading"
              className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
            >
              Health &amp; Lifestyle
            </h2>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Private browser-only BMI, hydration, and daily health vitals tracking paired with a live zero-key Open-Meteo weather forecast.
        </p>
      </div>

      {/* Clean 2-Column Sub-Tab Grid (Zero Horizontal Scroll) */}
      <div className="w-full max-w-full rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-2xs">
        <div
          role="tablist"
          aria-label="Health and Lifestyle tools"
          className="grid grid-cols-2 gap-2.5"
        >
          {HEALTH_TOOLS.map(({ id, label, Icon }) => {
            const isSelected = activeTool === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTool(id)}
                className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-center text-xs font-semibold leading-snug whitespace-normal transition-all ${
                  isSelected
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {activeTool === 'vitals' && <BmiVitalsTool />}
        {activeTool === 'weather' && <WeatherWidgetTool />}
      </div>

      <AdBanner />
    </section>
  );
};
