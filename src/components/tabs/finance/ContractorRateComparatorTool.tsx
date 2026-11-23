import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Check,
  CheckCircle2,
  Copy,
  DollarSign,
  HelpCircle,
  Info,
  Percent,
  Scale,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const ContractorRateComparatorTool: React.FC = () => {
  const [w2Salary, setW2Salary] = useState<number>(120_000);
  const [daysOffPerYear, setDaysOffPerYear] = useState<number>(25); // Vacation + Holidays + Sick
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState<number>(32); // remaining for non-billable admin
  const [monthlyHealthCost, setMonthlyHealthCost] = useState<number>(550);
  const [employer401kMatch, setEmployer401kMatch] = useState<number>(4); // 4% match
  const [annualTechOverhead, setAnnualTechOverhead] = useState<number>(4_200); // laptop, SaaS, accountant
  const [riskProfitBuffer, setRiskProfitBuffer] = useState<number>(15); // 15% risk buffer
  const [copied, setCopied] = useState(false);

  // Financial Math Engine
  const comparison = useMemo(() => {
    // 1. W-2 Nominal Hourly (Standard 2,080 hours = 52 weeks * 40 hours)
    const nominalW2Hourly = w2Salary / 2080;

    // 2. Contractor Billable Hours per Year
    // Total weeks: 52 - (daysOffPerYear / 5)
    const weeksWorked = Math.max(30, 52 - daysOffPerYear / 5);
    const totalBillableHours = Math.round(weeksWorked * billableHoursPerWeek);

    // 3. Costs borne by W-2 Employer that Contractor must pay out of pocket:
    // A. Employer Half of FICA (Social Security & Medicare): 7.65%
    const employerFicaCost = w2Salary * 0.0765;

    // B. Health / Dental / Vision Insurance
    const annualHealthCost = monthlyHealthCost * 12;

    // C. Lost 401(k) Employer Contribution
    const lost401kMatch = w2Salary * (employer401kMatch / 100);

    // D. Tech, Hardware Depreciation, Accountant, SaaS
    const overheadCost = annualTechOverhead;

    // Total extra cash required for contractor break-even
    const totalAddedOverhead =
      employerFicaCost + annualHealthCost + lost401kMatch + overheadCost;

    // Target Gross Contractor Revenue needed to equal W-2 Take-Home
    const breakEvenGrossRevenue = w2Salary + totalAddedOverhead;

    // Break-even hourly rate
    const breakEvenHourly =
      totalBillableHours > 0 ? breakEvenGrossRevenue / totalBillableHours : 0;

    // Recommended Target Rate with Risk / Profit buffer (15%)
    const targetHourly = breakEvenHourly * (1 + riskProfitBuffer / 100);
    const targetGrossRevenue = targetHourly * totalBillableHours;

    // Multiplier relative to nominal W-2
    const multiplier = nominalW2Hourly > 0 ? targetHourly / nominalW2Hourly : 1.5;

    return {
      nominalW2Hourly,
      weeksWorked: Math.round(weeksWorked),
      totalBillableHours,
      employerFicaCost,
      annualHealthCost,
      lost401kMatch,
      overheadCost,
      totalAddedOverhead,
      breakEvenGrossRevenue,
      breakEvenHourly,
      targetHourly,
      targetGrossRevenue,
      multiplier,
    };
  }, [
    w2Salary,
    daysOffPerYear,
    billableHoursPerWeek,
    monthlyHealthCost,
    employer401kMatch,
    annualTechOverhead,
    riskProfitBuffer,
  ]);

  const handleCopyNegotiationNote = async () => {
    const text = `Contractor Rate Calculation & Justification (PlanetAI Hub Benchmark)
Benchmark W-2 Equivalent Salary: $${w2Salary.toLocaleString()} USD
Billable Hours Capacity: ${comparison.totalBillableHours} hrs/yr (${comparison.weeksWorked} active weeks @ ${billableHoursPerWeek} billable hrs/wk)

Overhead & Benefit Equivalence Breakdown:
- Extra Self-Employment Tax (SECA 7.65% employer share): $${Math.round(comparison.employerFicaCost).toLocaleString()}/yr
- Out-of-Pocket Health & Dental Insurance: $${comparison.annualHealthCost.toLocaleString()}/yr ($${monthlyHealthCost}/mo)
- Unfunded Retirement Match (${employer401kMatch}%): $${Math.round(comparison.lost401kMatch).toLocaleString()}/yr
- Hardware, Software Subscriptions & Legal/CPA Ops: $${comparison.overheadCost.toLocaleString()}/yr
Total Contractor Added Burden: $${Math.round(comparison.totalAddedOverhead).toLocaleString()}/yr

Rate Outputs:
- Nominal W-2 Wage: $${comparison.nominalW2Hourly.toFixed(2)}/hr
- Absolute Break-Even Contractor Rate: $${comparison.breakEvenHourly.toFixed(2)}/hr
- Recommended Market Target Rate (+${riskProfitBuffer}% risk buffer): $${comparison.targetHourly.toFixed(2)}/hr (${comparison.multiplier.toFixed(2)}x Multiplier)`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Contractor Rate Structuring
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl text-balance">
            Independent Contractor vs. W-2 Employee True-Rate Comparator
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Determine the exact hourly USD contractor rate needed to match a full-time W-2 salary after self-employment taxes (SECA), health insurance, unpaid PTO, and business overhead.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyNegotiationNote}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 shrink-0 self-start"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700">Copied Calculation</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-500" />
              <span>Copy Rate Justification</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Spotlight Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Nominal W-2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Nominal W-2 Base Rate
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-700 tabular-nums">
            ${comparison.nominalW2Hourly.toFixed(2)}
            <span className="text-xs font-normal text-slate-500">/hr</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">On $ {w2Salary.toLocaleString()} (2,080 hrs)</p>
        </div>

        {/* Break-Even Contractor */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Break-Even Contractor Rate
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            ${comparison.breakEvenHourly.toFixed(2)}
            <span className="text-xs font-normal text-slate-500">/hr</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Zero margin / net zero parity</p>
        </div>

        {/* Recommended Target Rate */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-[#1D4ED8] uppercase tracking-wider">
            Recommended Target Rate
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-[#1D4ED8] tabular-nums">
            ${comparison.targetHourly.toFixed(2)}
            <span className="text-xs font-normal text-blue-700">/hr</span>
          </div>
          <p className="mt-1 text-[11px] text-blue-900 font-medium">
            Includes {riskProfitBuffer}% safety buffer
          </p>
        </div>

        {/* Multiplier */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
            Contractor Multiplier
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-emerald-700 tabular-nums">
            {comparison.multiplier.toFixed(2)}x
          </div>
          <p className="mt-1 text-[11px] text-emerald-900 font-medium">
            Rule of thumb: 1.50x to 1.75x
          </p>
        </div>
      </div>

      {/* Interactive Controls Split Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Salary & PTO */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
            <h4 className="text-sm font-bold text-slate-900">W-2 Baseline &amp; Time Allocation</h4>
          </div>

          {/* W-2 Salary Slider */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="w2-slider" className="font-semibold text-slate-700">
                W-2 Benchmark Salary (USD)
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                ${w2Salary.toLocaleString()}
              </span>
            </div>
            <input
              id="w2-slider"
              type="range"
              min={40_000}
              max={250_000}
              step={5_000}
              value={w2Salary}
              onChange={(e) => setW2Salary(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$40K</span>
              <span>$100K</span>
              <span>$180K</span>
              <span>$250K</span>
            </div>
          </div>

          {/* Unpaid Days Off / PTO */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="pto-slider" className="font-semibold text-slate-700">
                Desired Annual Non-Working Days (Vacation + Holidays + Sick)
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                {daysOffPerYear} days ({Math.round(daysOffPerYear / 5)} weeks)
              </span>
            </div>
            <input
              id="pto-slider"
              type="range"
              min={10}
              max={45}
              step={1}
              value={daysOffPerYear}
              onChange={(e) => setDaysOffPerYear(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10 days (2 wks)</span>
              <span>25 days (5 wks)</span>
              <span>45 days (9 wks)</span>
            </div>
          </div>

          {/* Billable Hours per Week */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="billable-slider" className="font-semibold text-slate-700">
                Target Billable Hours per Week (Rest is unpaid admin / proposals)
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                {billableHoursPerWeek} hrs/wk ({comparison.totalBillableHours} hrs/yr)
              </span>
            </div>
            <input
              id="billable-slider"
              type="range"
              min={20}
              max={40}
              step={1}
              value={billableHoursPerWeek}
              onChange={(e) => setBillableHoursPerWeek(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>20 hrs (Part-time)</span>
              <span>30-32 hrs (Realistic)</span>
              <span>40 hrs (Maximum)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Overhead & Benefits Burden */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Scale className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
            <h4 className="text-sm font-bold text-slate-900">Benefits &amp; Business Expenses</h4>
          </div>

          {/* Monthly Health Insurance */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="health-slider" className="font-semibold text-slate-700">
                Monthly Private Health &amp; Dental Insurance Premium
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                ${monthlyHealthCost}/mo (${monthlyHealthCost * 12}/yr)
              </span>
            </div>
            <input
              id="health-slider"
              type="range"
              min={250}
              max={1_200}
              step={25}
              value={monthlyHealthCost}
              onChange={(e) => setMonthlyHealthCost(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$250/mo</span>
              <span>$550/mo</span>
              <span>$900/mo</span>
              <span>$1,200/mo</span>
            </div>
          </div>

          {/* Annual Tech & Overhead */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="overhead-slider" className="font-semibold text-slate-700">
                Annual Tech, Hardware &amp; Accountant Overhead
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                ${annualTechOverhead.toLocaleString()}/yr
              </span>
            </div>
            <input
              id="overhead-slider"
              type="range"
              min={1_000}
              max={12_000}
              step={200}
              value={annualTechOverhead}
              onChange={(e) => setAnnualTechOverhead(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$1,000</span>
              <span>$4,000 (Standard)</span>
              <span>$8,000</span>
              <span>$12,000</span>
            </div>
          </div>

          {/* Profit & Risk Buffer */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="risk-slider" className="font-semibold text-slate-700">
                Risk &amp; Bench Gap Premium Margin
              </label>
              <span className="font-mono font-bold text-emerald-700 tabular-nums">
                +{riskProfitBuffer}% Buffer
              </span>
            </div>
            <input
              id="risk-slider"
              type="range"
              min={0}
              max={30}
              step={5}
              value={riskProfitBuffer}
              onChange={(e) => setRiskProfitBuffer(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Break-even)</span>
              <span>15% (Recommended)</span>
              <span>30% (High Volatility)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Equivalence Breakdown Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-3.5">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            W-2 Employee vs. 1099 Contractor Economic Balance Sheet
          </span>
        </div>

        <div className="overflow-x-auto scroll-touch">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 font-semibold">
                <th scope="col" className="px-5 py-3">Financial Category</th>
                <th scope="col" className="px-4 py-3 text-right">W-2 Full-Time Employee</th>
                <th scope="col" className="px-4 py-3 text-right">1099 Remote Contractor</th>
                <th scope="col" className="px-5 py-3 text-right">Contractor Burden / Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              <tr>
                <td className="px-5 py-3 font-sans font-medium text-slate-900">Gross Baseline Pay</td>
                <td className="px-4 py-3 text-right tabular-nums">${w2Salary.toLocaleString()}</td>
                <td className="px-4 py-3 text-right tabular-nums font-bold text-slate-900">
                  ${Math.round(comparison.targetGrossRevenue).toLocaleString()}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-emerald-700 font-bold">
                  +${Math.round(comparison.targetGrossRevenue - w2Salary).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-sans font-medium text-slate-900">Employer FICA Tax Match (7.65%)</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-500">Paid by Employer</td>
                <td className="px-4 py-3 text-right tabular-nums text-rose-700">
                  -${Math.round(comparison.employerFicaCost).toLocaleString()} (SECA)
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-rose-700 font-semibold">
                  +${Math.round(comparison.employerFicaCost).toLocaleString()} out-of-pocket
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-sans font-medium text-slate-900">Health &amp; Dental Insurance</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-500">Subsidized (~80%)</td>
                <td className="px-4 py-3 text-right tabular-nums text-rose-700">
                  -${comparison.annualHealthCost.toLocaleString()}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-rose-700 font-semibold">
                  +${comparison.annualHealthCost.toLocaleString()} out-of-pocket
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-sans font-medium text-slate-900">Retirement 401(k) Match ({employer401kMatch}%)</td>
                <td className="px-4 py-3 text-right tabular-nums text-emerald-700">
                  +${Math.round(comparison.lost401kMatch).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-500">Self-funded Solo 401(k)</td>
                <td className="px-5 py-3 text-right tabular-nums text-rose-700 font-semibold">
                  +${Math.round(comparison.lost401kMatch).toLocaleString()} missed benefit
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-sans font-medium text-slate-900">Hardware &amp; Professional Tools</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-500">Company Laptop &amp; SaaS</td>
                <td className="px-4 py-3 text-right tabular-nums text-rose-700">
                  -${comparison.overheadCost.toLocaleString()}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-rose-700 font-semibold">
                  +${comparison.overheadCost.toLocaleString()} overhead
                </td>
              </tr>
              <tr className="bg-slate-50/70 font-bold">
                <td className="px-5 py-3.5 font-sans text-slate-900">Effective Hourly Billing Rate</td>
                <td className="px-4 py-3.5 text-right tabular-nums text-slate-700">
                  ${comparison.nominalW2Hourly.toFixed(2)}/hr
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums text-[#1D4ED8] text-sm">
                  ${comparison.targetHourly.toFixed(2)}/hr
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums text-[#1D4ED8]">
                  {comparison.multiplier.toFixed(2)}x Multiplier
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
