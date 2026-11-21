import React, { useMemo, useState } from 'react';
import { Calculator, RotateCcw, TrendingUp } from 'lucide-react';

const FEE_PRESETS = [
  { id: 'direct', label: '0% Direct / ACH', feePct: '0' },
  { id: 'wise', label: '2% Wise / Payoneer', feePct: '2' },
  { id: 'paypal', label: '4.4% PayPal', feePct: '4.4' },
];

function parsePositive(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export const RateCalculatorsTool: React.FC = () => {
  // Take-Home Calculator state (empty inputs with placeholder hints)
  const [hourlyRateUsd, setHourlyRateUsd] = useState<string>('');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('');
  const [feePct, setFeePct] = useState<string>('0');
  const [exchangeRatePhp, setExchangeRatePhp] = useState<string>('58.5');

  // Reverse Rate Calculator state
  const [desiredMonthlyNetUsd, setDesiredMonthlyNetUsd] = useState<string>('');
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState<string>('');
  const [monthlyOverheadUsd, setMonthlyOverheadUsd] = useState<string>('');

  const takeHome = useMemo(() => {
    const rate = parsePositive(hourlyRateUsd);
    const hours = parsePositive(hoursPerWeek);
    const fee = Math.min(100, parsePositive(feePct));
    const fx = parsePositive(exchangeRatePhp);

    const grossWeekly = rate * hours;
    const feeMultiplier = 1 - fee / 100;
    const netWeekly = grossWeekly * feeMultiplier;
    const netMonthly = netWeekly * 4.33;
    const netAnnual = netWeekly * 52;

    return {
      netWeekly,
      netMonthly,
      netAnnual,
      netWeeklyPhp: netWeekly * fx,
      netMonthlyPhp: netMonthly * fx,
      netAnnualPhp: netAnnual * fx,
    };
  }, [hourlyRateUsd, hoursPerWeek, feePct, exchangeRatePhp]);

  const reverseRate = useMemo(() => {
    const targetNet = parsePositive(desiredMonthlyNetUsd);
    const overhead = parsePositive(monthlyOverheadUsd);
    const weeklyHours = parsePositive(billableHoursPerWeek);
    const fx = parsePositive(exchangeRatePhp);

    const totalMonthlyNeeded = targetNet + overhead;
    const monthlyHours = weeklyHours * 4.33;
    const minHourly = monthlyHours > 0 ? totalMonthlyNeeded / monthlyHours : 0;

    return {
      totalMonthlyNeeded,
      monthlyHours,
      minHourly,
      minHourlyPhp: minHourly * fx,
      fx,
    };
  }, [
    desiredMonthlyNetUsd,
    billableHoursPerWeek,
    monthlyOverheadUsd,
    exchangeRatePhp,
  ]);

  const formatUsd = (n: number) =>
    `$${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatPhp = (n: number) =>
    `₱${n.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const clearTakeHome = () => {
    setHourlyRateUsd('');
    setHoursPerWeek('');
    setFeePct('0');
    setExchangeRatePhp('');
  };

  const clearReverse = () => {
    setDesiredMonthlyNetUsd('');
    setBillableHoursPerWeek('');
    setMonthlyOverheadUsd('');
  };

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-wider text-slate-400';
  const numberInputClass =
    'mt-1.5 h-11 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 font-mono text-sm font-semibold text-slate-100 placeholder:text-slate-500 tabular-nums transition-colors focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1. Remote Take-Home Pay Calculator */}
      <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/75 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500" />
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3.5">
              <div>
                <div className="inline-flex items-center gap-2 text-cyan-300">
                  <Calculator className="h-4 w-4" aria-hidden="true" />
                  <h2 className="font-display text-lg font-bold text-slate-50">
                    Remote Take-Home Pay
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Estimate net USD &amp; PHP earnings after platform transfer fees (4.33 weeks/month).
                </p>
              </div>
              <button
                type="button"
                onClick={clearTakeHome}
                className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/[0.08] whitespace-nowrap"
              >
                <RotateCcw className="h-3 w-3 text-slate-400" aria-hidden="true" />
                <span>Clear</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="takehome-hourly" className={labelClass}>
                  Hourly Rate (USD)
                </label>
                <input
                  id="takehome-hourly"
                  type="number"
                  min={0}
                  step="1"
                  value={hourlyRateUsd}
                  onChange={(e) => setHourlyRateUsd(e.target.value)}
                  placeholder="e.g. 45"
                  className={numberInputClass}
                />
              </div>

              <div>
                <label htmlFor="takehome-hours" className={labelClass}>
                  Hours / Week
                </label>
                <input
                  id="takehome-hours"
                  type="number"
                  min={0}
                  max={100}
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  placeholder="e.g. 40"
                  className={numberInputClass}
                />
              </div>
            </div>

            <div>
              <span className={labelClass}>Platform Fee Preset</span>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {FEE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFeePct(preset.feePct)}
                    className={`min-h-[38px] rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                      feePct === preset.feePct
                        ? 'border-cyan-400/50 bg-cyan-400 text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.28)]'
                        : 'border-white/[0.08] bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="takehome-custom-fee" className={labelClass}>
                  Custom Fee (%)
                </label>
                <input
                  id="takehome-custom-fee"
                  type="number"
                  min={0}
                  max={50}
                  step="0.1"
                  value={feePct}
                  onChange={(e) => setFeePct(e.target.value)}
                  placeholder="0"
                  className={numberInputClass}
                />
              </div>

              <div>
                <label htmlFor="takehome-fx" className={labelClass}>
                  Exchange Rate (1 USD to PHP)
                </label>
                <input
                  id="takehome-fx"
                  type="number"
                  min={0}
                  step="0.1"
                  value={exchangeRatePhp}
                  onChange={(e) => setExchangeRatePhp(e.target.value)}
                  placeholder="e.g. 58.5"
                  className={numberInputClass}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-emerald-500/20 bg-[#060913]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Net Weekly
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-emerald-400 tabular-nums">
                {formatUsd(takeHome.netWeekly)}
              </p>
              <p className="font-mono text-xs text-slate-300 tabular-nums">
                {formatPhp(takeHome.netWeeklyPhp)}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Net Monthly (4.33w)
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-emerald-400 tabular-nums">
                {formatUsd(takeHome.netMonthly)}
              </p>
              <p className="font-mono text-xs text-slate-300 tabular-nums">
                {formatPhp(takeHome.netMonthlyPhp)}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Net Annual
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-emerald-400 tabular-nums">
                {formatUsd(takeHome.netAnnual)}
              </p>
              <p className="font-mono text-xs text-slate-300 tabular-nums">
                {formatPhp(takeHome.netAnnualPhp)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Reverse Rate Calculator */}
      <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/75 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3.5">
              <div>
                <div className="inline-flex items-center gap-2 text-indigo-300">
                  <TrendingUp className="h-4 w-4" aria-hidden="true" />
                  <h2 className="font-display text-lg font-bold text-slate-50">
                    Reverse Rate Calculator
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Work backward from your target monthly net income and overhead to find your floor hourly rate.
                </p>
              </div>
              <button
                type="button"
                onClick={clearReverse}
                className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/[0.08] whitespace-nowrap"
              >
                <RotateCcw className="h-3 w-3 text-slate-400" aria-hidden="true" />
                <span>Clear</span>
              </button>
            </div>

            <div>
              <label htmlFor="reverse-net-income" className={labelClass}>
                Desired Monthly Net Income (USD)
              </label>
              <input
                id="reverse-net-income"
                type="number"
                min={0}
                step="100"
                value={desiredMonthlyNetUsd}
                onChange={(e) => setDesiredMonthlyNetUsd(e.target.value)}
                placeholder="e.g. 5000"
                className={numberInputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="reverse-hours" className={labelClass}>
                  Billable Hours / Week
                </label>
                <input
                  id="reverse-hours"
                  type="number"
                  min={0}
                  max={100}
                  step="1"
                  value={billableHoursPerWeek}
                  onChange={(e) => setBillableHoursPerWeek(e.target.value)}
                  placeholder="e.g. 32"
                  className={numberInputClass}
                />
              </div>

              <div>
                <label htmlFor="reverse-overhead" className={labelClass}>
                  Monthly Overhead (USD)
                </label>
                <input
                  id="reverse-overhead"
                  type="number"
                  min={0}
                  step="25"
                  value={monthlyOverheadUsd}
                  onChange={(e) => setMonthlyOverheadUsd(e.target.value)}
                  placeholder="e.g. 300"
                  className={numberInputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5 rounded-xl border border-white/[0.08] bg-[#060913]/65 p-4 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Gross Monthly Target (Net + Overhead)</span>
                <span className="font-mono font-semibold text-slate-50 tabular-nums">
                  {formatUsd(reverseRate.totalMonthlyNeeded)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Monthly Billable Capacity (4.33 wks)</span>
                <span className="font-mono font-semibold text-slate-50 tabular-nums">
                  {reverseRate.monthlyHours.toFixed(1)} hrs
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-[#060913]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Minimum Hourly Rate Required
            </p>
            <p className="mt-1 font-mono text-3xl font-bold text-emerald-400 tabular-nums">
              {formatUsd(reverseRate.minHourly)}{' '}
              <span className="text-sm font-normal text-slate-400">/ hr</span>
            </p>
            <p className="mt-1 font-mono text-xs text-slate-300 tabular-nums">
              Equivalent to {formatPhp(reverseRate.minHourlyPhp)} / hr
              {reverseRate.fx > 0 ? ` at ${reverseRate.fx.toFixed(2)} PHP` : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
