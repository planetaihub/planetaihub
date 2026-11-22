import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CalendarClock,
  Check,
  Clock,
  Copy,
  Info,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface CronPreset {
  label: string;
  expression: string;
  explanation: string;
}

const PRESETS: CronPreset[] = [
  {
    label: 'Every minute',
    expression: '* * * * *',
    explanation: 'Runs once every single minute',
  },
  {
    label: 'Every 5 minutes',
    expression: '*/5 * * * *',
    explanation: 'Runs every 5 minutes',
  },
  {
    label: 'Every 15 minutes',
    expression: '*/15 * * * *',
    explanation: 'Runs every 15 minutes',
  },
  {
    label: 'Every hour on the hour',
    expression: '0 * * * *',
    explanation: 'Runs at minute 0 of every hour',
  },
  {
    label: 'Daily at midnight (00:00 UTC)',
    expression: '0 0 * * *',
    explanation: 'Runs once a day at 12:00 AM midnight',
  },
  {
    label: 'Every weekday morning (Mon-Fri 09:00)',
    expression: '0 9 * * 1-5',
    explanation: 'Runs at 09:00 AM, Monday through Friday',
  },
  {
    label: 'Twice daily (12:00 AM & 12:00 PM)',
    expression: '0 0,12 * * *',
    explanation: 'Runs twice a day at 12:00 AM and 12:00 PM',
  },
  {
    label: 'Weekly on Sunday at midnight',
    expression: '0 0 * * 0',
    explanation: 'Runs once a week at Sunday 12:00 AM midnight',
  },
  {
    label: 'Monthly on the 1st at 00:00',
    expression: '0 0 1 * *',
    explanation: 'Runs on the 1st of every month at midnight',
  },
];

const DAYS_OF_WEEK = [
  { value: '0', label: 'Sun' },
  { value: '1', label: 'Mon' },
  { value: '2', label: 'Tue' },
  { value: '3', label: 'Wed' },
  { value: '4', label: 'Thu' },
  { value: '5', label: 'Fri' },
  { value: '6', label: 'Sat' },
];

export const CronBuilderTool: React.FC = () => {
  const [cronExpression, setCronExpression] = useState<string>('0 9 * * 1-5');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Parse 5 fields
  const fields = useMemo(() => {
    const parts = cronExpression.trim().split(/\s+/);
    return {
      minute: parts[0] ?? '*',
      hour: parts[1] ?? '*',
      dom: parts[2] ?? '*',
      month: parts[3] ?? '*',
      dow: parts[4] ?? '*',
      validLength: parts.length === 5,
    };
  }, [cronExpression]);

  // Plain-English Translator
  const humanTranslation = useMemo(() => {
    if (!fields.validLength) {
      return 'Expression must have exactly 5 fields (Minute, Hour, Day-of-Month, Month, Day-of-Week)';
    }

    const { minute, hour, dom, month, dow } = fields;

    // Check common presets or rules
    if (minute === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*') {
      return 'Runs every minute, every hour, every day';
    }

    let timeStr = '';
    if (minute === '0' && hour === '0') {
      timeStr = 'at 12:00 AM (midnight)';
    } else if (minute.startsWith('*/')) {
      timeStr = `every ${minute.replace('*/', '')} minutes`;
    } else if (hour === '*' && minute === '0') {
      timeStr = 'at the top of every hour';
    } else if (hour !== '*' && !hour.includes(',') && !hour.includes('-')) {
      const hNum = parseInt(hour, 10);
      const mNum = parseInt(minute, 10) || 0;
      if (!isNaN(hNum)) {
        const period = hNum >= 12 ? 'PM' : 'AM';
        const displayH = hNum % 12 === 0 ? 12 : hNum % 12;
        const displayM = mNum.toString().padStart(2, '0');
        timeStr = `at ${displayH}:${displayM} ${period}`;
      } else {
        timeStr = `at hour ${hour}, minute ${minute}`;
      }
    } else if (hour.includes(',')) {
      timeStr = `at hours [${hour}] past minute ${minute}`;
    } else {
      timeStr = `at minute ${minute}, hour ${hour}`;
    }

    let dowStr = '';
    if (dow === '1-5') {
      dowStr = 'Monday through Friday';
    } else if (dow === '0,6' || dow === '6,0') {
      dowStr = 'on Saturday and Sunday (weekends)';
    } else if (dow === '0' || dow === '7') {
      dowStr = 'on Sunday';
    } else if (dow !== '*') {
      const dayNames = dow.split(',').map((d) => {
        const map: Record<string, string> = {
          '0': 'Sunday',
          '1': 'Monday',
          '2': 'Tuesday',
          '3': 'Wednesday',
          '4': 'Thursday',
          '5': 'Friday',
          '6': 'Saturday',
          '7': 'Sunday',
        };
        return map[d] || d;
      });
      dowStr = `on ${dayNames.join(', ')}`;
    }

    let domStr = '';
    if (dom !== '*') {
      domStr = `on day ${dom} of the month`;
    }

    let monthStr = '';
    if (month !== '*') {
      monthStr = `in month ${month}`;
    }

    const conditions = [timeStr, dowStr, domStr, monthStr].filter(Boolean);
    return `Runs ${conditions.join(', ')}`;
  }, [fields]);

  // Next 5 Runs Simulator
  const nextRuns = useMemo(() => {
    if (!fields.validLength) return [];

    const runs: Date[] = [];
    const now = new Date();
    // Simulate up to 60 days ahead
    const cursor = new Date(now.getTime() + 60 * 1000); // start 1 minute ahead
    cursor.setSeconds(0, 0);

    const matchField = (val: number, expr: string): boolean => {
      if (expr === '*') return true;
      if (expr.startsWith('*/')) {
        const step = parseInt(expr.replace('*/', ''), 10);
        return !isNaN(step) && step > 0 && val % step === 0;
      }
      if (expr.includes(',')) {
        return expr.split(',').some((item) => parseInt(item, 10) === val);
      }
      if (expr.includes('-')) {
        const [start, end] = expr.split('-').map((s) => parseInt(s, 10));
        return !isNaN(start) && !isNaN(end) && val >= start && val <= end;
      }
      return parseInt(expr, 10) === val;
    };

    let iterations = 0;
    while (runs.length < 5 && iterations < 100_000) {
      iterations++;
      const minute = cursor.getMinutes();
      const hour = cursor.getHours();
      const dom = cursor.getDate();
      const month = cursor.getMonth() + 1; // 1-12
      const dow = cursor.getDay(); // 0-6

      const minuteMatches = matchField(minute, fields.minute);
      const hourMatches = matchField(hour, fields.hour);
      const domMatches = matchField(dom, fields.dom);
      const monthMatches = matchField(month, fields.month);
      const dowMatches = matchField(dow, fields.dow);

      if (minuteMatches && hourMatches && domMatches && monthMatches && dowMatches) {
        runs.push(new Date(cursor.getTime()));
      }

      // Step by 1 minute
      cursor.setTime(cursor.getTime() + 60 * 1000);
    }

    return runs;
  }, [fields]);

  const copySnippet = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSnippet(id);
      setTimeout(() => setCopiedSnippet(null), 2000);
    } catch {
      // Ignore
    }
  };

  const getRelativeTime = (target: Date) => {
    const diffMs = target.getTime() - Date.now();
    if (diffMs <= 0) return 'Just now';
    const mins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      const remainingHours = hours % 24;
      return `in ${days}d ${remainingHours}h`;
    }
    if (hours > 0) {
      const remainingMins = mins % 60;
      return `in ${hours}h ${remainingMins}m`;
    }
    return `in ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Automation &amp; Task Scheduling
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl text-balance">
            Cron Schedule Expression Builder &amp; Next-Run Simulator
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Build, validate, translate into human prose, and preview the next 5 execution timestamps in real-time.
          </p>
        </div>

        {/* Quick Copy Expression */}
        <button
          type="button"
          onClick={() => copySnippet(cronExpression, 'expr')}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 shrink-0 self-start"
        >
          {copiedSnippet === 'expr' ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-500" />
              <span>Copy Expression</span>
            </>
          )}
        </button>
      </div>

      {/* Main Expression Input & Human Translation Banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <label htmlFor="cron-expr-input" className="text-xs font-bold text-slate-700">
              Cron Expression (5-part):
            </label>
            <input
              id="cron-expr-input"
              type="text"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              placeholder="0 9 * * 1-5"
              className="mt-1 font-mono text-base font-bold text-[#1D4ED8] bg-white border border-blue-300 rounded-xl px-4 py-2 w-full shadow-2xs focus:ring-2 focus:ring-[#1D4ED8] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-end">
            <span className="text-[11px] text-slate-500 font-mono">
              [Min] [Hour] [DoM] [Mo] [DoW]
            </span>
          </div>
        </div>

        {/* Human Translation */}
        <div className="mt-3 flex items-start gap-2 text-xs text-blue-950 bg-white/80 border border-blue-200 rounded-xl p-3">
          <Sparkles className="h-4 w-4 shrink-0 text-[#1D4ED8] mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold text-slate-900">Plain English Translation: </span>
            <span className="text-blue-900 font-medium">{humanTranslation}</span>
          </div>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700">Common Automation Presets:</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.expression}
              type="button"
              onClick={() => setCronExpression(preset.expression)}
              className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                cronExpression === preset.expression
                  ? 'border-[#1D4ED8] bg-blue-50/40 text-blue-950 ring-1 ring-[#1D4ED8]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{preset.label}</span>
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-[#1D4ED8]">
                  {preset.expression}
                </code>
              </div>
              <span className="mt-1 text-[11px] text-slate-500">{preset.explanation}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Next 5 Execution Simulation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <CalendarClock className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
          <h4 className="text-sm font-bold text-slate-900">
            Next 5 Scheduled Execution Timestamps (Browser Local Timezone)
          </h4>
        </div>

        {nextRuns.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {nextRuns.map((run, idx) => (
              <div
                key={run.toISOString()}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 gap-1.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {run.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="ml-2 font-mono text-xs text-slate-600">
                      {run.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-700 self-start sm:self-center">
                  {getRelativeTime(run)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-rose-600">
            Could not calculate upcoming execution runs. Please verify that all 5 cron fields contain valid intervals.
          </p>
        )}
      </div>

      {/* Production Integration Snippets */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-700">Copy Ready-to-Deploy Configs:</span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Linux Crontab */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-slate-500" />
                <span>Linux Crontab</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  copySnippet(
                    `${cronExpression} /usr/local/bin/worker.sh >> /var/log/worker.log 2>&1`,
                    'crontab'
                  )
                }
                className="text-[11px] font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
              >
                {copiedSnippet === 'crontab' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-slate-50 p-2 font-mono text-[11px] text-slate-700">
              {`${cronExpression} /usr/local/bin/worker.sh >> /var/log/worker.log 2>&1`}
            </pre>
          </div>

          {/* GitHub Actions */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-slate-500" />
                <span>GitHub Actions Schedule</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  copySnippet(
                    `on:\n  schedule:\n    - cron: '${cronExpression}'`,
                    'gha'
                  )
                }
                className="text-[11px] font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
              >
                {copiedSnippet === 'gha' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-slate-50 p-2 font-mono text-[11px] text-slate-700">
              {`on:\n  schedule:\n    - cron: '${cronExpression}'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
