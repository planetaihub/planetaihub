import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  DollarSign,
  FileCheck,
  FileText,
  HelpCircle,
  Layers,
  Lock,
  Percent,
  Scale,
  Sparkles,
} from 'lucide-react';

export const ContractTermsCalculatorTool: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'late-fee' | 'retainer' | 'ip-buyout'>('late-fee');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Late Fee State
  const [invoiceAmount, setInvoiceAmount] = useState<number>(4_500);
  const [daysOverdue, setDaysOverdue] = useState<number>(28);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState<number>(1.5); // 1.5% / month = 18% APR
  const [adminLateFee, setAdminLateFee] = useState<number>(50);

  // Retainer State
  const [hourlyRate, setHourlyRate] = useState<number>(95);
  const [retainerHours, setRetainerHours] = useState<number>(40);
  const [volumeDiscount, setVolumeDiscount] = useState<number>(10); // 10%
  const [rolloverDays, setRolloverDays] = useState<number>(30); // 30 day rollover limit

  // IP Buyout State
  const [deliverableFee, setDeliverableFee] = useState<number>(5_000);
  const [ipScope, setIpScope] = useState<'limited' | 'exclusive' | 'full-buyout'>('exclusive');
  const [isWorldwide, setIsWorldwide] = useState<boolean>(true);

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  // 1. Late Fee Calculation
  const lateFeeCalc = useMemo(() => {
    // Standard commercial formula: Daily Interest = (APR / 365) * Principal * Days
    const annualRate = (monthlyInterestRate * 12) / 100;
    const accruedInterest = invoiceAmount * (annualRate / 365) * Math.max(0, daysOverdue);
    const totalBalance = invoiceAmount + accruedInterest + adminLateFee;

    const noticeLetter = `Subject: Overdue Notice — Invoice #${invoiceAmount > 0 ? 'INV-2026' : '001'} (${daysOverdue} Days Past Due)

Dear Accounts Payable & Project Team,

We are writing regarding Invoice #${invoiceAmount > 0 ? 'INV-2026' : '001'} for $${invoiceAmount.toLocaleString()} USD, which is currently ${daysOverdue} days past the agreed payment terms.

In accordance with Section 4.2 of our Master Services Agreement (Late Payment Terms):
- Original Invoice Principal: $${invoiceAmount.toLocaleString()} USD
- Contractual Late Payment Interest (${monthlyInterestRate}% / month): $${accruedInterest.toFixed(2)} USD
- Administrative Late Fee: $${adminLateFee.toFixed(2)} USD
- Current Total Outstanding Balance: $${totalBalance.toFixed(2)} USD

Please arrange wire/ACH transfer for $${totalBalance.toFixed(2)} USD by end of week to maintain active support schedules.

Thank you for your prompt attention to this matter.`;

    return {
      annualRate: (annualRate * 100).toFixed(1),
      accruedInterest,
      totalBalance,
      noticeLetter,
    };
  }, [invoiceAmount, daysOverdue, monthlyInterestRate, adminLateFee]);

  // 2. Retainer Calculation
  const retainerCalc = useMemo(() => {
    const rawMonthly = hourlyRate * retainerHours;
    const discountedHourly = hourlyRate * (1 - volumeDiscount / 100);
    const monthlyRetainerFee = discountedHourly * retainerHours;
    const clientMonthlySavings = rawMonthly - monthlyRetainerFee;
    const annualContractorArr = monthlyRetainerFee * 12;

    const retainerClause = `MONTHLY DEDICATED RETAINER CLAUSE:
1. Retainer Commitment: Client reserves ${retainerHours} dedicated hours per calendar month at the preferential rate of $${discountedHourly.toFixed(2)}/hour ($${monthlyRetainerFee.toLocaleString()} USD / month, paid in advance on the 1st of each month).
2. Priority Scheduling: Retainer hours receive priority queue turnaround over ad-hoc hourly requests.
3. Rollover Policy: Unused retainer hours expire at the end of each billing cycle, with a maximum of ${rolloverDays === 0 ? 'zero (0)' : 'up to 15% of unused hours rolling over for exactly 30 days'}. Hours are non-refundable.`;

    return {
      rawMonthly,
      discountedHourly,
      monthlyRetainerFee,
      clientMonthlySavings,
      annualContractorArr,
      retainerClause,
    };
  }, [hourlyRate, retainerHours, volumeDiscount, rolloverDays]);

  // 3. IP Buyout Calculation
  const ipCalc = useMemo(() => {
    let multiplier = 1.0;
    let label = 'Limited Non-Exclusive License';

    if (ipScope === 'exclusive') {
      multiplier = 1.4;
      label = 'Exclusive Commercial License';
    } else if (ipScope === 'full-buyout') {
      multiplier = 1.95;
      label = 'Full Copyright Assignment & All-Rights Buyout';
    }

    if (isWorldwide && ipScope !== 'limited') {
      multiplier += 0.2;
    }

    const totalContractFee = deliverableFee * multiplier;
    const buyoutSurcharge = totalContractFee - deliverableFee;

    const ipClause = `INTELLECTUAL PROPERTY & TRANSFER OF RIGHTS CLAUSE:
1. Ownership & License: Upon receipt of full payment of $${totalContractFee.toLocaleString()} USD (incorporating a ${multiplier.toFixed(2)}x IP transfer multiplier), Contractor hereby grants and conveys to Client a ${isWorldwide ? 'worldwide, perpetual, irrevocable' : 'territorial, perpetual'} ${label.toLowerCase()} in and to all final deliverable files.
2. Moral Rights & Credit: ${
      ipScope === 'full-buyout'
        ? 'Contractor waives moral rights to the fullest extent permitted by law while retaining the right to display non-confidential deliverables in private professional portfolios.'
        : 'Contractor retains nominal authorship credit and the right to display deliverables in professional showcases.'
    }`;

    return {
      multiplier,
      label,
      totalContractFee,
      buyoutSurcharge,
      ipClause,
    };
  }, [deliverableFee, ipScope, isWorldwide]);

  return (
    <div className="space-y-6">
      {/* Intro Header & Sub-Tab Switcher */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Contract Terms &amp; Enforcement
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl text-balance">
            Contract Late-Fee, Retainer &amp; IP Buyout Calculator
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Calculate statutory late payment interest, monthly retainer volume discounts, and intellectual property transfer multipliers with copy-ready contract clauses.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div
          role="tablist"
          aria-label="Contract terms calculator views"
          className="grid w-full grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1.5 sm:inline-flex sm:w-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'late-fee'}
            onClick={() => setActiveSubTab('late-fee')}
            className={`min-h-[38px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold transition-all ${
              activeSubTab === 'late-fee'
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            Late-Fee Interest
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'retainer'}
            onClick={() => setActiveSubTab('retainer')}
            className={`min-h-[38px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold transition-all ${
              activeSubTab === 'retainer'
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            Monthly Retainer
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'ip-buyout'}
            onClick={() => setActiveSubTab('ip-buyout')}
            className={`col-span-2 sm:col-span-1 min-h-[38px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold transition-all ${
              activeSubTab === 'ip-buyout'
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            IP Buyout Multiplier
          </button>
        </div>
      </div>

      {/* 1. LATE-FEE CALCULATOR */}
      {activeSubTab === 'late-fee' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Input Controls */}
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                <h4 className="text-sm font-bold text-slate-900">Overdue Invoice Parameters</h4>
              </div>

              {/* Invoice Principal */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label htmlFor="inv-slider">Invoice Principal (USD)</label>
                  <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                    ${invoiceAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  id="inv-slider"
                  type="range"
                  min={500}
                  max={30_000}
                  step={250}
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                  className="mt-2 w-full accent-[#1D4ED8]"
                />
              </div>

              {/* Days Overdue */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label htmlFor="overdue-slider">Days Past Due Date</label>
                  <span className="font-mono font-bold text-rose-700 tabular-nums">
                    {daysOverdue} days overdue
                  </span>
                </div>
                <input
                  id="overdue-slider"
                  type="range"
                  min={1}
                  max={120}
                  step={1}
                  value={daysOverdue}
                  onChange={(e) => setDaysOverdue(Number(e.target.value))}
                  className="mt-2 w-full accent-rose-600"
                />
              </div>

              {/* Monthly Interest Rate */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label htmlFor="interest-slider">Contractual Monthly Interest Rate</label>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {monthlyInterestRate}% / mo ({lateFeeCalc.annualRate}% APR)
                  </span>
                </div>
                <input
                  id="interest-slider"
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.25}
                  value={monthlyInterestRate}
                  onChange={(e) => setMonthlyInterestRate(Number(e.target.value))}
                  className="mt-2 w-full accent-[#1D4ED8]"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Commercial standard is 1.5% per month (18% annualized) or statutory prompt payment rate.
                </p>
              </div>

              {/* Admin Late Fee */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label htmlFor="admin-slider">Fixed Administrative Late Fee</label>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    ${adminLateFee}
                  </span>
                </div>
                <input
                  id="admin-slider"
                  type="range"
                  min={0}
                  max={150}
                  step={25}
                  value={adminLateFee}
                  onChange={(e) => setAdminLateFee(Number(e.target.value))}
                  className="mt-2 w-full accent-[#1D4ED8]"
                />
              </div>
            </div>

            {/* Late Fee Financial Breakdown & Total Due */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <AlertCircle className="h-4 w-4 text-rose-600" aria-hidden="true" />
                <h4 className="text-sm font-bold text-slate-900">Total Outstanding Balance</h4>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                <span className="text-[11px] font-semibold text-rose-900 uppercase tracking-wider">
                  Updated Total Owed by Client
                </span>
                <div className="mt-1 font-mono text-3xl font-bold text-rose-700 tabular-nums">
                  ${lateFeeCalc.totalBalance.toFixed(2)} USD
                </div>
                <p className="mt-1 text-xs text-rose-800">
                  Includes original principal + accrued daily statutory interest + admin charge.
                </p>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Original Invoice Amount:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${invoiceAmount.toLocaleString()} USD
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Accrued Interest ({daysOverdue} days):</span>
                  <span className="font-mono font-bold text-rose-700">
                    +${lateFeeCalc.accruedInterest.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Fixed Administrative Late Fee:</span>
                  <span className="font-mono font-bold text-slate-900">
                    +${adminLateFee.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Copy Overdue Notice Letter */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    Formal Notice Template:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(lateFeeCalc.noticeLetter, 'lateLetter')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                  >
                    {copiedKey === 'lateLetter' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="max-h-40 overflow-y-auto rounded-xl bg-slate-50 p-3 font-mono text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {lateFeeCalc.noticeLetter}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RETAINER & VOLUME DISCOUNT CALCULATOR */}
      {activeSubTab === 'retainer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Input Controls */}
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Coins className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                <h4 className="text-sm font-bold text-slate-900">Retainer Volume &amp; Pricing</h4>
              </div>

              {/* Base Hourly */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label htmlFor="rate-slider">Standard Ad-Hoc Hourly Rate</label>
                  <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                    ${hourlyRate}/hr
                  </span>
                </div>
                <input
                  id="rate-slider"
                  type="range"
                  min={30}
                  max={250}
                  step={5}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="mt-2 w-full accent-[#1D4ED8]"
                />
              </div>

              {/* Dedicated Hours */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label htmlFor="ret-hours-slider">Committed Reserved Hours / Month</label>
                  <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                    {retainerHours} hrs/mo (~{Math.round(retainerHours / 4)} hrs/wk)
                  </span>
                </div>
                <input
                  id="ret-hours-slider"
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={retainerHours}
                  onChange={(e) => setRetainerHours(Number(e.target.value))}
                  className="mt-2 w-full accent-[#1D4ED8]"
                />
              </div>

              {/* Volume Discount */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label htmlFor="disc-slider">Retainer Volume Incentive Discount</label>
                  <span className="font-mono font-bold text-emerald-700 tabular-nums">
                    {volumeDiscount}% Discount
                  </span>
                </div>
                <input
                  id="disc-slider"
                  type="range"
                  min={0}
                  max={25}
                  step={2.5}
                  value={volumeDiscount}
                  onChange={(e) => setVolumeDiscount(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>
            </div>

            {/* Retainer Economics & Terms Clause */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileCheck className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                <h4 className="text-sm font-bold text-slate-900">Guaranteed Recurring Yield</h4>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                <span className="text-[11px] font-semibold text-[#1D4ED8] uppercase tracking-wider">
                  Guaranteed Monthly Retainer Fee
                </span>
                <div className="mt-1 font-mono text-3xl font-bold text-[#1D4ED8] tabular-nums">
                  ${retainerCalc.monthlyRetainerFee.toLocaleString()} / mo
                </div>
                <p className="mt-1 text-xs text-blue-900">
                  Effective Rate: <strong className="font-mono font-semibold">${retainerCalc.discountedHourly.toFixed(2)}/hr</strong> (Guaranteed Annual ARR: <strong className="font-mono">${retainerCalc.annualContractorArr.toLocaleString()}/yr</strong>)
                </p>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Standard Non-Retainer Cost:</span>
                  <span className="font-mono text-slate-700">${retainerCalc.rawMonthly.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Client Monthly Savings:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    -${retainerCalc.clientMonthlySavings.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Contractor Predictable ARR:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${retainerCalc.annualContractorArr.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Ready Contract Clause */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    Contract Retainer Clause:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(retainerCalc.retainerClause, 'retClause')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                  >
                    {copiedKey === 'retClause' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Clause</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="max-h-40 overflow-y-auto rounded-xl bg-slate-50 p-3 font-mono text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {retainerCalc.retainerClause}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. IP BUYOUT MULTIPLIER CALCULATOR */}
      {activeSubTab === 'ip-buyout' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Input Controls */}
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Scale className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                <h4 className="text-sm font-bold text-slate-900">Intellectual Property Scope</h4>
              </div>

              {/* Base Deliverable Fee */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label htmlFor="del-slider">Base Creation / Deliverable Fee</label>
                  <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                    ${deliverableFee.toLocaleString()}
                  </span>
                </div>
                <input
                  id="del-slider"
                  type="range"
                  min={1_000}
                  max={40_000}
                  step={500}
                  value={deliverableFee}
                  onChange={(e) => setDeliverableFee(Number(e.target.value))}
                  className="mt-2 w-full accent-[#1D4ED8]"
                />
              </div>

              {/* IP Scope Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700">Rights Conveyance Tier:</label>
                <div className="mt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => setIpScope('limited')}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      ipScope === 'limited'
                        ? 'border-[#1D4ED8] bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        1. Limited Non-Exclusive License (1.0x)
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700">
                        Standard
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Client receives right to use for the specified project. Creator retains all code/design IP.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIpScope('exclusive')}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      ipScope === 'exclusive'
                        ? 'border-[#1D4ED8] bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        2. Exclusive Commercial License (1.4x)
                      </span>
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[#1D4ED8]">
                        Commercial
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Client gets sole commercial exploitation rights. Creator retains portfolio showcasing rights.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIpScope('full-buyout')}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      ipScope === 'full-buyout'
                        ? 'border-[#1D4ED8] bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        3. Full Copyright Assignment &amp; Work-for-Hire (1.95x)
                      </span>
                      <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-purple-800">
                        Total Transfer
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Complete transfer of all title, copyright, patents, and moral rights waiver worldwide.
                    </p>
                  </button>
                </div>
              </div>

              {/* Worldwide Distribution Scope Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs font-semibold text-slate-800">
                  Worldwide Perpetual Distribution (+0.2x)
                </span>
                <input
                  type="checkbox"
                  checked={isWorldwide}
                  onChange={(e) => setIsWorldwide(e.target.checked)}
                  aria-label="Worldwide Perpetual Distribution"
                  className="h-4 w-4 rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                />
              </div>
            </div>

            {/* Total Contract Yield & Contract Clause */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                <h4 className="text-sm font-bold text-slate-900">Total IP Value &amp; Contract Surcharge</h4>
              </div>

              <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4">
                <span className="text-[11px] font-semibold text-purple-900 uppercase tracking-wider">
                  Total Recommended Deliverable Fee
                </span>
                <div className="mt-1 font-mono text-3xl font-bold text-purple-950 tabular-nums">
                  ${ipCalc.totalContractFee.toLocaleString()} USD
                </div>
                <p className="mt-1 text-xs text-purple-800">
                  Applied Multiplier: <strong className="font-mono font-semibold">{ipCalc.multiplier.toFixed(2)}x</strong> (+${ipCalc.buyoutSurcharge.toLocaleString()} IP surcharge)
                </p>
              </div>

              {/* Ready Contract Clause */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    Contract IP Assignment Clause:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(ipCalc.ipClause, 'ipClause')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                  >
                    {copiedKey === 'ipClause' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Clause</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="max-h-52 overflow-y-auto rounded-xl bg-slate-50 p-3 font-mono text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {ipCalc.ipClause}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
