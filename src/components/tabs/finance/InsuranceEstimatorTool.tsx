import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  DollarSign,
  HelpCircle,
  Info,
  Lock,
  PlusCircle,
  Receipt,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

type ContractorDomain =
  | 'software-ai'
  | 'rlhf-evaluator'
  | 'virtual-assistant'
  | 'ux-design'
  | 'consultant'
  | 'content-writer';

interface DomainConfig {
  id: ContractorDomain;
  label: string;
  baseRisk: 'Moderate' | 'High' | 'Low';
  eoBaseAnnual: [number, number]; // [min, max]
  cglBaseAnnual: [number, number];
  cyberRecommended: boolean;
  notes: string;
}

const DOMAINS: DomainConfig[] = [
  {
    id: 'software-ai',
    label: 'Software, AI & Cloud Engineer',
    baseRisk: 'High',
    eoBaseAnnual: [600, 1450],
    cglBaseAnnual: [350, 600],
    cyberRecommended: true,
    notes: 'High exposure to production outages, API regressions, and cloud billing errors.',
  },
  {
    id: 'rlhf-evaluator',
    label: 'AI Data, RLHF & Model Evaluator',
    baseRisk: 'Moderate',
    eoBaseAnnual: [420, 850],
    cglBaseAnnual: [300, 500],
    cyberRecommended: true,
    notes: 'Handles proprietary model prompts, synthetic training data, and NDA-guarded assets.',
  },
  {
    id: 'virtual-assistant',
    label: 'Virtual Assistant & Executive Ops',
    baseRisk: 'Low',
    eoBaseAnnual: [350, 680],
    cglBaseAnnual: [280, 480],
    cyberRecommended: false,
    notes: 'Administrative scheduling, customer support triage, and invoice management.',
  },
  {
    id: 'ux-design',
    label: 'UX/UI & Product Designer',
    baseRisk: 'Low',
    eoBaseAnnual: [380, 720],
    cglBaseAnnual: [300, 520],
    cyberRecommended: false,
    notes: 'Deliverable milestone approvals, typography licenses, and design system IP.',
  },
  {
    id: 'consultant',
    label: 'Management & Strategy Consultant',
    baseRisk: 'Moderate',
    eoBaseAnnual: [550, 1200],
    cglBaseAnnual: [350, 600],
    cyberRecommended: false,
    notes: 'Strategic advisory, executive financial projections, and corporate restructuring.',
  },
  {
    id: 'content-writer',
    label: 'Technical Writer & Content Creator',
    baseRisk: 'Low',
    eoBaseAnnual: [320, 580],
    cglBaseAnnual: [280, 450],
    cyberRecommended: false,
    notes: 'API documentation, whitepapers, and published promotional copy.',
  },
];

export const InsuranceEstimatorTool: React.FC = () => {
  const [annualRevenue, setAnnualRevenue] = useState<number>(110_000);
  const [maxContractValue, setMaxContractValue] = useState<number>(30_000);
  const [domainId, setDomainId] = useState<ContractorDomain>('software-ai');
  const [clientRegion, setClientRegion] = useState<'us' | 'eu-uk' | 'global'>('us');
  const [handlesProductionData, setHandlesProductionData] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  const selectedDomain = useMemo(() => {
    return DOMAINS.find((d) => d.id === domainId) ?? DOMAINS[0];
  }, [domainId]);

  // Mathematical Calculation Engine
  const estimate = useMemo(() => {
    // 1. E&O Limit Determination
    // If single contract > $50k or revenue > $125k, corporate clients demand $2,000,000 aggregate.
    const eoLimit =
      maxContractValue >= 50_000 || annualRevenue >= 125_000
        ? '$2,000,000 / $2,000,000'
        : '$1,000,000 / $1,000,000';

    const limitMultiplier = eoLimit.startsWith('$2,000,000') ? 1.35 : 1.0;
    const regionMultiplier = clientRegion === 'us' ? 1.15 : clientRegion === 'eu-uk' ? 1.0 : 0.95;

    // E&O Premium
    const [eoMinBase, eoMaxBase] = selectedDomain.eoBaseAnnual;
    const eoAnnualMin = Math.round(eoMinBase * limitMultiplier * regionMultiplier);
    const eoAnnualMax = Math.round(eoMaxBase * limitMultiplier * regionMultiplier);
    const eoMonthlyMid = Math.round((eoAnnualMin + eoAnnualMax) / 2 / 12);

    // 2. General Liability (CGL)
    const cglLimit = '$1,000,000 / $2,000,000';
    const [cglMinBase, cglMaxBase] = selectedDomain.cglBaseAnnual;
    const cglAnnualMin = Math.round(cglMinBase * regionMultiplier);
    const cglAnnualMax = Math.round(cglMaxBase * regionMultiplier);
    const cglMonthlyMid = Math.round((cglAnnualMin + cglAnnualMax) / 2 / 12);

    // 3. Cyber Liability Rider
    const isCyberNeeded = handlesProductionData || selectedDomain.cyberRecommended;
    const cyberLimit = isCyberNeeded ? '$1,000,000' : 'Optional';
    const cyberAnnualMin = isCyberNeeded ? 420 : 0;
    const cyberAnnualMax = isCyberNeeded ? 880 : 0;
    const cyberMonthlyMid = isCyberNeeded ? Math.round((cyberAnnualMin + cyberAnnualMax) / 2 / 12) : 0;

    // Total Package Annual Range
    const totalAnnualMin = eoAnnualMin + cglAnnualMin + cyberAnnualMin;
    const totalAnnualMax = eoAnnualMax + cglAnnualMax + cyberAnnualMax;
    const totalMonthlyMid = eoMonthlyMid + cglMonthlyMid + cyberMonthlyMid;

    // Hourly Rate Buffer Impact (assuming 1,500 billable hours/year = 30 hrs/wk * 50 weeks)
    const hourlyBufferMin = (totalAnnualMin / 1500).toFixed(2);
    const hourlyBufferMax = (totalAnnualMax / 1500).toFixed(2);

    // Income Protection / Disability Reserve
    const monthlyGross = Math.round(annualRevenue / 12);
    const monthlyIncomeBuffer = Math.round(monthlyGross * 0.6); // 60% standard disability target
    const emergencyReserveMonths = 6;
    const recommendedEmergencyFund = Math.round(monthlyGross * 0.45 * emergencyReserveMonths);

    return {
      eoLimit,
      eoAnnualMin,
      eoAnnualMax,
      eoMonthlyMid,
      cglLimit,
      cglAnnualMin,
      cglAnnualMax,
      cglMonthlyMid,
      isCyberNeeded,
      cyberLimit,
      cyberAnnualMin,
      cyberAnnualMax,
      cyberMonthlyMid,
      totalAnnualMin,
      totalAnnualMax,
      totalMonthlyMid,
      hourlyBufferMin,
      hourlyBufferMax,
      monthlyGross,
      monthlyIncomeBuffer,
      recommendedEmergencyFund,
    };
  }, [annualRevenue, maxContractValue, selectedDomain, clientRegion, handlesProductionData]);

  const handleCopySummary = async () => {
    const text = `PlanetAI Hub — Remote Business Insurance Coverage Estimate
Contractor Domain: ${selectedDomain.label}
Annual Revenue: $${annualRevenue.toLocaleString()} USD | Largest Client Contract: $${maxContractValue.toLocaleString()} USD
Primary Jurisdiction: ${clientRegion.toUpperCase()} | Access to Production/PII: ${handlesProductionData ? 'Yes' : 'No'}

Recommended Commercial Policies:
1. Professional Liability (E&O): ${estimate.eoLimit}
   - Estimated Premium: $${estimate.eoAnnualMin} - $${estimate.eoAnnualMax}/yr (~$${estimate.eoMonthlyMid}/mo)
2. Commercial General Liability (CGL): ${estimate.cglLimit}
   - Estimated Premium: $${estimate.cglAnnualMin} - $${estimate.cglAnnualMax}/yr (~$${estimate.cglMonthlyMid}/mo)
3. Cyber & Privacy Liability: ${estimate.cyberLimit}
   - Estimated Premium: $${estimate.cyberAnnualMin} - $${estimate.cyberAnnualMax}/yr (~$${estimate.cyberMonthlyMid}/mo)

Total Annual Commercial Insurance Budget: $${estimate.totalAnnualMin.toLocaleString()} - $${estimate.totalAnnualMax.toLocaleString()} USD (~$${estimate.totalMonthlyMid}/mo)
Required Rate Buffer: Add +$${estimate.hourlyBufferMin} to +$${estimate.hourlyBufferMax}/hour to your client billing rate.
Emergency Liquid Reserve Buffer: $${estimate.recommendedEmergencyFund.toLocaleString()} USD (6-month runway).`;

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
            Remote Contractor Risk Management
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl text-balance">
            Freelance &amp; Remote Business Insurance Coverage Estimator
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Calculate recommended Professional Liability (E&amp;O), General Liability, and Cyber riders. Discover the exact dollar-per-hour rate buffer required to cover 100% of your commercial policy costs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 shrink-0 self-start"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700">Copied Summary</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-500" />
              <span>Copy Policy Breakdown</span>
            </>
          )}
        </button>
      </div>

      {/* Input Form Controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Financial & Domain Inputs */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Scale className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
            <h4 className="text-sm font-bold text-slate-900">Contractor Profile &amp; Scale</h4>
          </div>

          {/* Domain Selector */}
          <div>
            <label htmlFor="domain-select" className="text-xs font-semibold text-slate-700">
              Contractor Specialization &amp; Role:
            </label>
            <select
              id="domain-select"
              value={domainId}
              onChange={(e) => setDomainId(e.target.value as ContractorDomain)}
              className="input-obsidian mt-1.5 h-10 w-full px-3 text-xs font-medium"
            >
              {DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} ({d.baseRisk} Risk)
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-500">{selectedDomain.notes}</p>
          </div>

          {/* Annual Revenue Slider */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="revenue-slider" className="font-semibold text-slate-700">
                Annual Gross Contracting Revenue (USD)
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                ${annualRevenue.toLocaleString()} / yr
              </span>
            </div>
            <input
              id="revenue-slider"
              type="range"
              min={20_000}
              max={350_000}
              step={5_000}
              value={annualRevenue}
              onChange={(e) => setAnnualRevenue(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$20K</span>
              <span>$100K</span>
              <span>$200K</span>
              <span>$350K+</span>
            </div>
          </div>

          {/* Largest Client Contract */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="contract-slider" className="font-semibold text-slate-700">
                Largest Single Client Contract Size
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                ${maxContractValue.toLocaleString()}
              </span>
            </div>
            <input
              id="contract-slider"
              type="range"
              min={2_500}
              max={150_000}
              step={2_500}
              value={maxContractValue}
              onChange={(e) => setMaxContractValue(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$2.5K</span>
              <span>$50K</span>
              <span>$100K</span>
              <span>$150K</span>
            </div>
          </div>
        </div>

        {/* Right: Jurisdiction & Exposure Switches */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
            <h4 className="text-sm font-bold text-slate-900">Legal Jurisdiction &amp; Data Exposure</h4>
          </div>

          {/* Region */}
          <div>
            <label className="text-xs font-semibold text-slate-700">Primary Client Headquarters:</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setClientRegion('us')}
                className={`rounded-xl border p-2.5 text-center transition-all ${
                  clientRegion === 'us'
                    ? 'border-[#1D4ED8] bg-blue-50/50 font-bold text-[#1D4ED8] shadow-2xs'
                    : 'border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">United States</div>
                <div className="text-[10px] text-slate-500 font-normal">$1M-$2M Standard</div>
              </button>
              <button
                type="button"
                onClick={() => setClientRegion('eu-uk')}
                className={`rounded-xl border p-2.5 text-center transition-all ${
                  clientRegion === 'eu-uk'
                    ? 'border-[#1D4ED8] bg-blue-50/50 font-bold text-[#1D4ED8] shadow-2xs'
                    : 'border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">UK &amp; Europe</div>
                <div className="text-[10px] text-slate-500 font-normal">£1M-€1M Standard</div>
              </button>
              <button
                type="button"
                onClick={() => setClientRegion('global')}
                className={`rounded-xl border p-2.5 text-center transition-all ${
                  clientRegion === 'global'
                    ? 'border-[#1D4ED8] bg-blue-50/50 font-bold text-[#1D4ED8] shadow-2xs'
                    : 'border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">Global / Other</div>
                <div className="text-[10px] text-slate-500 font-normal">Remote Contracts</div>
              </button>
            </div>
          </div>

          {/* Infrastructure & PII Toggle */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                <span className="text-xs font-bold text-slate-900">
                  Access to Production Systems or Customer Data?
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={handlesProductionData}
                onClick={() => setHandlesProductionData(!handlesProductionData)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  handlesProductionData ? 'bg-[#1D4ED8]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    handlesProductionData ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Enable if you possess SSH keys, database credentials, API secrets, or process customer emails. Adds Cyber &amp; Breach coverage rider.
            </p>
          </div>

          {/* Pricing Rate Buffer Highlight Card */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  Hourly Rate Impact: Add +${estimate.hourlyBufferMin} to +${estimate.hourlyBufferMax}/hr
                </p>
                <p className="mt-0.5 text-xs text-emerald-800 leading-relaxed">
                  Based on 1,500 billable hours per year, adding just <strong className="font-semibold">+${estimate.hourlyBufferMax}/hr</strong> to your client quotes fully finances your entire annual commercial insurance suite!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Coverage Policy Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Policy 1: E&O */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-[#1D4ED8]" />
              <span>Errors &amp; Omissions (E&amp;O)</span>
            </span>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#1D4ED8]">
              Primary
            </span>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Recommended Policy Limit
            </div>
            <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
              {estimate.eoLimit}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2.5 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Est. Annual Premium:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                ${estimate.eoAnnualMin} - ${estimate.eoAnnualMax}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Monthly Budget:</span>
              <span className="font-mono font-semibold text-slate-700 tabular-nums">
                ~${estimate.eoMonthlyMid}/mo
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Protects against allegations of software bugs, delayed milestones, code regressions, and contract breach.
          </p>
        </div>

        {/* Policy 2: General Liability */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>General Liability (CGL)</span>
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              Standard
            </span>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Recommended Policy Limit
            </div>
            <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
              {estimate.cglLimit}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2.5 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Est. Annual Premium:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                ${estimate.cglAnnualMin} - ${estimate.cglAnnualMax}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Monthly Budget:</span>
              <span className="font-mono font-semibold text-slate-700 tabular-nums">
                ~${estimate.cglMonthlyMid}/mo
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Covers bodily injury, commercial property damage, and advertising injury. Mandatory in most enterprise MSAs.
          </p>
        </div>

        {/* Policy 3: Cyber Rider */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Lock className="h-4 w-4 text-purple-600" />
              <span>Cyber Liability &amp; Privacy</span>
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                estimate.isCyberNeeded
                  ? 'bg-purple-50 text-purple-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {estimate.isCyberNeeded ? 'Recommended' : 'Optional'}
            </span>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Recommended Policy Limit
            </div>
            <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
              {estimate.cyberLimit}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2.5 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Est. Annual Premium:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {estimate.isCyberNeeded
                  ? `$${estimate.cyberAnnualMin} - $${estimate.cyberAnnualMax}`
                  : '$0 (Excluded)'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Monthly Budget:</span>
              <span className="font-mono font-semibold text-slate-700 tabular-nums">
                ~${estimate.cyberMonthlyMid}/mo
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Covers forensic investigation, breach notification, and legal defense costs if customer or client data is compromised.
          </p>
        </div>
      </div>
    </div>
  );
};
