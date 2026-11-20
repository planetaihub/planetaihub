import React, { useMemo, useState } from 'react';

const FEE_PRESETS = [
  { id: 'direct', label: '0% Direct / ACH', feePct: 0 },
  { id: 'wise', label: '2% Wise / Payoneer', feePct: 2 },
  { id: 'paypal', label: '4.4% PayPal', feePct: 4.4 },
];

export const RateCalculatorsTool: React.FC = () => {
  // Take-Home Calculator state
  const [hourlyRateUsd, setHourlyRateUsd] = useState<number>(45);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [feePct, setFeePct] = useState<number>(2);
  const [exchangeRatePhp, setExchangeRatePhp] = useState<number>(58.5);

  // Reverse Rate Calculator state
  const [desiredMonthlyNetUsd, setDesiredMonthlyNetUsd] =
    useState<number>(6000);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState<number>(32);
  const [monthlyOverheadUsd, setMonthlyOverheadUsd] = useState<number>(350);

  const takeHome = useMemo(() => {
    const grossWeekly = Math.max(0, hourlyRateUsd) * Math.max(0, hoursPerWeek);
    const feeMultiplier = 1 - Math.min(100, Math.max(0, feePct)) / 100;
    const netWeekly = grossWeekly * feeMultiplier;
    const netMonthly = netWeekly * 4.33;
    const netAnnual = netWeekly * 52;
    const safeRate = Math.max(0, exchangeRatePhp);

    return {
      netWeekly,
      netMonthly,
      netAnnual,
      netWeeklyPhp: netWeekly * safeRate,
      netMonthlyPhp: netMonthly * safeRate,
      netAnnualPhp: netAnnual * safeRate,
    };
  }, [hourlyRateUsd, hoursPerWeek, feePct, exchangeRatePhp]);

  const reverseRate = useMemo(() => {
    const totalMonthlyNeeded =
      Math.max(0, desiredMonthlyNetUsd) + Math.max(0, monthlyOverheadUsd);
    const monthlyHours = Math.max(1, billableHoursPerWeek) * 4.33;
    const minHourly = totalMonthlyNeeded / monthlyHours;
    return {
      totalMonthlyNeeded,
      monthlyHours,
      minHourly,
    };
  }, [desiredMonthlyNetUsd, billableHoursPerWeek, monthlyOverheadUsd]);

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

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-wider text-slate-400';
  const numberInputClass =
    'mt-1.5 h-11 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 font-mono text-sm font-semibold text-slate-100 tabular-nums transition-colors focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1. Remote Take-Home Pay Calculator */}
      <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6">
        <div className="space-y-4">
          <div className="border-b border-white/[0.08] pb-3.5">
            <h2 className="font-display text-lg font-bold text-slate-50">
              Remote Take-Home Pay Calculator
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Calculate net USD and PHP earnings after platform transfer fees (4.33 weeks/month).
            </p>
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
                onChange={(e) => setHourlyRateUsd(Number(e.target.value))}
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
                min={1}
                max={80}
                step="1"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
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
                onChange={(e) => setFeePct(Number(e.target.value))}
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
                min={1}
                step="0.1"
                value={exchangeRatePhp}
                onChange={(e) => setExchangeRatePhp(Number(e.target.value))}
                className={numberInputClass}
              />
            </div>
          </div>
        </div>

        {/* High-contrast inset summary with #34D399 emerald highlights */}
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

      {/* 2. Reverse Rate Calculator */}
      <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6">
        <div className="space-y-4">
          <div className="border-b border-white/[0.08] pb-3.5">
            <h2 className="font-display text-lg font-bold text-slate-50">
              Reverse Rate Calculator
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Work backward from your target monthly take-home and overhead to find your floor hourly rate.
            </p>
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
              onChange={(e) => setDesiredMonthlyNetUsd(Number(e.target.value))}
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
                min={1}
                max={80}
                step="1"
                value={billableHoursPerWeek}
                onChange={(e) =>
                  setBillableHoursPerWeek(Number(e.target.value))
                }
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
                onChange={(e) => setMonthlyOverheadUsd(Number(e.target.value))}
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
            Equivalent to{' '}
            {formatPhp(reverseRate.minHourly * Math.max(0, exchangeRatePhp))} /
            hr at {exchangeRatePhp.toFixed(2)} PHP
          </p>
        </div>
      </div>
    </div>
  );
};
