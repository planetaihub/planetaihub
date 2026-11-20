import React, { useEffect, useMemo, useState } from 'react';
import { Check, Droplets, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import type { VitalEntry } from '../../../types';
import {
  loadVitals,
  readJson,
  saveVitals,
  STORAGE_KEYS,
  writeJson,
} from '../../../utils/storage';

type UnitSystem = 'metric' | 'imperial';

const VITAL_METRICS = [
  'Calories (kcal)',
  'Blood Sugar (mg/dL)',
  'Cholesterol (mg/dL)',
  'BP / Heart Rate',
  'Weight',
] as const;

interface WaterState {
  date: string;
  ml: number;
}

const STARTER_VITALS: VitalEntry[] = [
  {
    id: 'vit-seed-1',
    metric: 'BP / Heart Rate',
    value: '118/76 mmHg · 66 bpm',
    recordedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  },
  {
    id: 'vit-seed-2',
    metric: 'Blood Sugar (mg/dL)',
    value: '92 mg/dL (Fasting)',
    recordedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  },
];

export const BmiVitalsTool: React.FC = () => {
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [weightKg, setWeightKg] = useState<number>(68);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightLbs, setWeightLbs] = useState<number>(150);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(8);

  const todayIso = new Date().toISOString().slice(0, 10);
  const [water, setWater] = useState<WaterState>(() => {
    const saved = readJson<WaterState>(STORAGE_KEYS.HEALTH_WATER, {
      date: todayIso,
      ml: 750,
    });
    return saved.date === todayIso ? saved : { date: todayIso, ml: 0 };
  });

  const [vitals, setVitals] = useState<VitalEntry[]>(() => {
    const existing = loadVitals();
    return existing.length > 0 ? existing : STARTER_VITALS;
  });
  const [metric, setMetric] = useState<string>(VITAL_METRICS[0]);
  const [valueInput, setValueInput] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    writeJson(STORAGE_KEYS.HEALTH_WATER, water);
  }, [water]);

  useEffect(() => {
    saveVitals(vitals);
  }, [vitals]);

  const bmiData = useMemo(() => {
    let meters = 0;
    let kg = 0;

    if (unit === 'metric') {
      meters = Math.max(0.5, heightCm / 100);
      kg = Math.max(10, weightKg);
    } else {
      const totalInches = Math.max(24, heightFt * 12 + heightIn);
      meters = totalInches * 0.0254;
      kg = Math.max(10, weightLbs * 0.45359237);
    }

    const bmi = kg / (meters * meters);
    const minHealthyKg = 18.5 * meters * meters;
    const maxHealthyKg = 24.9 * meters * meters;

    let category = 'Healthy Weight';
    let toneClass = 'text-emerald-400';
    if (bmi < 18.5) {
      category = 'Underweight';
      toneClass = 'text-cyan-300';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      toneClass = 'text-indigo-300';
    } else if (bmi >= 30) {
      category = 'Obesity';
      toneClass = 'text-rose-400';
    }

    // Clamp gauge position across 14..38 BMI range
    const gaugePct = Math.min(98, Math.max(2, ((bmi - 14) / (38 - 14)) * 100));

    return {
      bmi,
      category,
      toneClass,
      gaugePct,
      healthyRange:
        unit === 'metric'
          ? `${minHealthyKg.toFixed(1)} – ${maxHealthyKg.toFixed(1)} kg`
          : `${(minHealthyKg * 2.20462).toFixed(0)} – ${(
              maxHealthyKg * 2.20462
            ).toFixed(0)} lbs`,
    };
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const addWaterMl = (delta: number) => {
    setWater((prev) => ({
      date: todayIso,
      ml: Math.max(0, prev.ml + delta),
    }));
  };

  const waterTargetMl = 2000;
  const waterPct = Math.min(100, Math.round((water.ml / waterTargetMl) * 100));
  const waterOz = Math.round(water.ml / 29.5735);

  const handleVitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valueInput.trim()) return;
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');

    if (editingId) {
      setVitals((prev) =>
        prev.map((v) =>
          v.id === editingId
            ? { ...v, metric, value: valueInput.trim(), recordedAt: timestamp }
            : v
        )
      );
      setEditingId(null);
    } else {
      const next: VitalEntry = {
        id: `vit-${Date.now()}`,
        metric,
        value: valueInput.trim(),
        recordedAt: timestamp,
      };
      setVitals((prev) => [next, ...prev]);
    }
    setValueInput('');
  };

  const startEditVital = (item: VitalEntry) => {
    setEditingId(item.id);
    setMetric(item.metric);
    setValueInput(item.value);
  };

  const cancelEditVital = () => {
    setEditingId(null);
    setValueInput('');
  };

  const deleteVital = (id: string) => {
    if (editingId === id) cancelEditVital();
    setVitals((prev) => prev.filter((v) => v.id !== id));
  };

  const valuePlaceholder =
    metric === 'Calories (kcal)'
      ? 'e.g. 1,850 kcal'
      : metric === 'Blood Sugar (mg/dL)'
        ? 'e.g. 96 mg/dL (Fasting)'
        : metric === 'Cholesterol (mg/dL)'
          ? 'e.g. 178 mg/dL Total'
          : metric === 'BP / Heart Rate'
            ? 'e.g. 118/76 mmHg · 68 bpm'
            : 'e.g. 68.2 kg';

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-wider text-slate-400';
  const numberInputClass =
    'mt-1.5 h-11 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 font-mono text-sm font-semibold text-slate-100 tabular-nums transition-colors focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Interactive BMI Calculator with Visual Scale Gauge */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6 lg:col-span-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-50">
                  BMI Calculator
                </h2>
                <p className="text-xs text-slate-400">
                  Switch seamlessly between Metric and Imperial units.
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#060913]/85 p-1">
                {(['metric', 'imperial'] as const).map((sys) => (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => setUnit(sys)}
                    className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all ${
                      unit === sys
                        ? 'bg-cyan-400 text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    {sys}
                  </button>
                ))}
              </div>
            </div>

            {unit === 'metric' ? (
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="bmi-weight-kg" className={labelClass}>
                    Weight (kg)
                  </label>
                  <input
                    id="bmi-weight-kg"
                    type="number"
                    min={20}
                    max={300}
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className={numberInputClass}
                  />
                </div>
                <div>
                  <label htmlFor="bmi-height-cm" className={labelClass}>
                    Height (cm)
                  </label>
                  <input
                    id="bmi-height-cm"
                    type="number"
                    min={90}
                    max={250}
                    step="1"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className={numberInputClass}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="bmi-weight-lbs" className={labelClass}>
                    Weight (lbs)
                  </label>
                  <input
                    id="bmi-weight-lbs"
                    type="number"
                    min={50}
                    max={660}
                    step="1"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className={numberInputClass}
                  />
                </div>
                <div>
                  <label htmlFor="bmi-height-ft" className={labelClass}>
                    Feet
                  </label>
                  <input
                    id="bmi-height-ft"
                    type="number"
                    min={3}
                    max={8}
                    value={heightFt}
                    onChange={(e) => setHeightFt(Number(e.target.value))}
                    className={numberInputClass}
                  />
                </div>
                <div>
                  <label htmlFor="bmi-height-in" className={labelClass}>
                    Inches
                  </label>
                  <input
                    id="bmi-height-in"
                    type="number"
                    min={0}
                    max={11}
                    value={heightIn}
                    onChange={(e) => setHeightIn(Number(e.target.value))}
                    className={numberInputClass}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-4 rounded-xl border border-white/[0.08] bg-[#060913]/75 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className={labelClass}>Your BMI</p>
                <p className="mt-0.5 font-mono text-3xl font-bold text-slate-50 tabular-nums">
                  {bmiData.bmi.toFixed(1)}
                </p>
                <p className={`text-xs font-semibold ${bmiData.toneClass}`}>
                  {bmiData.category}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className={labelClass}>Healthy Range for Height</p>
                <p className="mt-0.5 font-mono text-sm font-bold text-slate-50 tabular-nums">
                  {bmiData.healthyRange}
                </p>
              </div>
            </div>

            {/* Visual Segmented BMI Gauge */}
            <div>
              <div className="relative h-3 w-full overflow-visible rounded-full bg-slate-900">
                <div className="flex h-full w-full overflow-hidden rounded-full">
                  <div
                    className="h-full bg-cyan-400/75"
                    style={{ width: '18.75%' }}
                    title="Underweight (<18.5)"
                  />
                  <div
                    className="h-full bg-emerald-400/85"
                    style={{ width: '26.67%' }}
                    title="Healthy (18.5–24.9)"
                  />
                  <div
                    className="h-full bg-indigo-400/80"
                    style={{ width: '20.83%' }}
                    title="Overweight (25–29.9)"
                  />
                  <div
                    className="h-full bg-rose-400/80"
                    style={{ width: '33.75%' }}
                    title="Obesity (30+)"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-950 bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)] transition-all duration-300"
                  style={{ left: `${bmiData.gaugePct}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-500 tabular-nums">
                <span>14</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>38+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Water Intake Tracker */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6 lg:col-span-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
              <div className="flex items-center gap-2.5">
                <Droplets className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-50">
                    Daily Water Intake
                  </h2>
                  <p className="text-xs text-slate-400">
                    Target: 2,000 ml (68 oz) · Saved for {todayIso}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWater({ date: todayIso, ml: 0 })}
                className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>

            <div className="mt-5 flex items-baseline justify-between">
              <p className="font-mono text-3xl font-bold text-slate-50 tabular-nums">
                {water.ml.toLocaleString()}{' '}
                <span className="text-base font-normal text-slate-400">ml</span>
                <span className="ml-2 text-sm font-medium text-slate-400">
                  ({waterOz} oz)
                </span>
              </p>
              <span className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                {waterPct}% of daily goal
              </span>
            </div>

            <div className="mt-3 h-3 w-full overflow-hidden rounded-full border border-white/[0.06] bg-[#060913]/90">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-300"
                style={{ width: `${waterPct}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => addWaterMl(250)}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-300 whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>+250 ml</span>
            </button>
            <button
              type="button"
              onClick={() => addWaterMl(237)}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25 whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>+8 oz</span>
            </button>
            <button
              type="button"
              onClick={() => addWaterMl(-250)}
              disabled={water.ml <= 0}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] disabled:opacity-40 whitespace-nowrap"
            >
              -250 ml
            </button>
          </div>
        </div>
      </div>

      {/* Daily Vitals Log */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form
          onSubmit={handleVitalSubmit}
          className="space-y-4 rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-5"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h2 className="font-display text-lg font-bold text-slate-50">
              {editingId ? 'Edit Vital Entry' : 'Log Health Vital'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={cancelEditVital}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-50"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <div>
            <label className={labelClass}>Metric Type</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 text-sm font-medium text-slate-100 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
            >
              {VITAL_METRICS.map((m) => (
                <option key={m} value={m} className="bg-slate-900">
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Reading / Value</label>
            <input
              type="text"
              required
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              placeholder={valuePlaceholder}
              className="mt-1.5 h-11 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-300"
          >
            {editingId ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>Update Vital</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Save Reading Locally</span>
              </>
            )}
          </button>
        </form>

        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-7">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
            <h2 className="font-display text-lg font-bold text-slate-50">
              Vitals History ({vitals.length})
            </h2>
            <span className="text-xs text-slate-500">Stored in browser</span>
          </div>

          {vitals.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              No health readings logged yet.
            </p>
          ) : (
            <div className="mt-2 divide-y divide-white/[0.06]">
              {vitals.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-50">
                      {entry.metric}
                    </p>
                    <p className="font-mono text-xs text-slate-500 tabular-nums">
                      {entry.recordedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                      {entry.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => startEditVital(entry)}
                      aria-label={`Edit ${entry.metric}`}
                      className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-cyan-300"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteVital(entry.id)}
                      aria-label={`Delete ${entry.metric}`}
                      className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
