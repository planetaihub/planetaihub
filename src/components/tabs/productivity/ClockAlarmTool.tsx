import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Volume2 } from 'lucide-react';
import { readJson, STORAGE_KEYS, writeJson } from '../../../utils/storage';
import { playChime } from '../../../utils/webAudio';

type TzOption = 'local' | 'Asia/Manila' | 'UTC';

interface AlarmConfig {
  time: string; // HH:MM
  label: string;
  enabled: boolean;
}

const DEFAULT_ALARM: AlarmConfig = {
  time: '09:00',
  label: 'Daily Standup / Deep Work',
  enabled: false,
};

function formatClock(date: Date, tz: TzOption) {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    ...(tz === 'local' ? {} : { timeZone: tz }),
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
}

function formatDateLine(date: Date, tz: TzOption) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(tz === 'local' ? {} : { timeZone: tz }),
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export const ClockAlarmTool: React.FC = () => {
  const [now, setNow] = useState<Date>(() => new Date());
  const [activeTz, setActiveTz] = useState<TzOption>('local');
  const [alarm, setAlarm] = useState<AlarmConfig>(() =>
    readJson<AlarmConfig>(STORAGE_KEYS.PRODUCTIVITY_ALARM, DEFAULT_ALARM)
  );
  const [isRinging, setIsRinging] = useState(false);
  const [lastTriggeredMinute, setLastTriggeredMinute] = useState<string>('');

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    writeJson(STORAGE_KEYS.PRODUCTIVITY_ALARM, alarm);
  }, [alarm]);

  useEffect(() => {
    if (!alarm.enabled) return;
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentHm = `${hh}:${mm}`;

    if (currentHm === alarm.time && lastTriggeredMinute !== currentHm) {
      setLastTriggeredMinute(currentHm);
      setIsRinging(true);
      playChime('alarm');
    }
  }, [now, alarm.enabled, alarm.time, lastTriggeredMinute]);

  useEffect(() => {
    if (!isRinging) return;
    const chimeLoop = window.setInterval(() => {
      playChime('alarm');
    }, 4000);
    return () => window.clearInterval(chimeLoop);
  }, [isRinging]);

  const handleSnooze = () => {
    setIsRinging(false);
    const snoozeTarget = new Date(Date.now() + 5 * 60000);
    const hh = String(snoozeTarget.getHours()).padStart(2, '0');
    const mm = String(snoozeTarget.getMinutes()).padStart(2, '0');
    setAlarm((prev) => ({ ...prev, time: `${hh}:${mm}`, enabled: true }));
  };

  const localTzName =
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';

  return (
    <div className="space-y-6">
      {isRinging && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-cyan-400" aria-hidden="true" />
            <div>
              <p className="font-serif text-sm font-bold text-cyan-200">
                Alarm: {alarm.label || 'Scheduled Reminder'} ({alarm.time})
              </p>
              <p className="text-xs text-cyan-300/80">
                Chime active via Web Audio API.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSnooze}
              className="min-h-[44px] rounded-xl border border-cyan-400/35 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:bg-slate-800"
            >
              Snooze 5m
            </button>
            <button
              type="button"
              onClick={() => setIsRinging(false)}
              className="min-h-[44px] rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md hover:bg-cyan-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Live Digital Clock */}
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/75 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar rounded-xl border border-white/[0.08] bg-[#060913]/85 p-1">
              {(
                [
                  { id: 'local', label: `Local (${localTzName})` },
                  { id: 'Asia/Manila', label: 'Asia/Manila' },
                  { id: 'UTC', label: 'UTC' },
                ] as const
              ).map((tz) => (
                <button
                  key={tz.id}
                  type="button"
                  onClick={() => setActiveTz(tz.id)}
                  className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTz === tz.id
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {tz.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="font-mono text-5xl font-bold tracking-tight text-slate-50 tabular-nums sm:text-6xl">
              {formatClock(now, activeTz)}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {formatDateLine(now, activeTz)}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Local
              </p>
              <p className="mt-0.5 font-mono text-base font-semibold text-slate-200 tabular-nums">
                {formatClock(now, 'local')}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Asia/Manila (PHT)
              </p>
              <p className="mt-0.5 font-mono text-base font-semibold text-slate-200 tabular-nums">
                {formatClock(now, 'Asia/Manila')}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                UTC Reference
              </p>
              <p className="mt-0.5 font-mono text-base font-semibold text-slate-200 tabular-nums">
                {formatClock(now, 'UTC')}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Alarm Clock */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/75 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-50">
                  Alarm Clock
                </h2>
                <p className="text-xs text-slate-400">
                  Triggers in your local browser timezone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => playChime('alarm')}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
              >
                <Volume2 className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                <span>Test Chime</span>
              </button>
            </div>

            <div>
              <label
                htmlFor="alarm-time-input"
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
                Alarm Time (24-hour local)
              </label>
              <input
                id="alarm-time-input"
                type="time"
                value={alarm.time}
                onChange={(e) =>
                  setAlarm((p) => ({ ...p, time: e.target.value }))
                }
                className="mt-1.5 h-12 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3.5 font-mono text-lg font-bold text-slate-50 tabular-nums focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="alarm-label-input"
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
                Reminder Label
              </label>
              <input
                id="alarm-label-input"
                type="text"
                value={alarm.label}
                onChange={(e) =>
                  setAlarm((p) => ({ ...p, label: e.target.value }))
                }
                placeholder="e.g. Client Call or Break"
                className="mt-1.5 h-11 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setAlarm((p) => ({ ...p, enabled: !p.enabled }))
            }
            className={`mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              alarm.enabled
                ? 'border border-emerald-500/35 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                : 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-300'
            }`}
          >
            {alarm.enabled ? (
              <>
                <Bell className="h-4 w-4" aria-hidden="true" />
                <span>Alarm Armed for {alarm.time} (Click to Disable)</span>
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4" aria-hidden="true" />
                <span>Arm Alarm for {alarm.time}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
