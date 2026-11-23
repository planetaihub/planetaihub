import React, { useState } from 'react';
import {
  AlertTriangle,
  FileCheck,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { InsuranceEstimatorTool } from './InsuranceEstimatorTool';
import { ContractorRateComparatorTool } from './ContractorRateComparatorTool';
import { ContractTermsCalculatorTool } from './ContractTermsCalculatorTool';
import { LegalInsuranceSeoGuide } from './LegalInsuranceSeoGuide';

export type LegalToolId = 'insurance' | 'w2-vs-1099' | 'contract-terms';

interface LegalToolItem {
  id: LegalToolId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LEGAL_TOOLS: LegalToolItem[] = [
  {
    id: 'insurance',
    label: 'Insurance Coverage Estimator (E&O / CGL / Cyber)',
    shortLabel: 'Insurance Estimator',
    icon: ShieldCheck,
  },
  {
    id: 'w2-vs-1099',
    label: 'W-2 vs. 1099 True-Rate Comparator',
    shortLabel: 'True-Rate Comparator',
    icon: Scale,
  },
  {
    id: 'contract-terms',
    label: 'Contract Late-Fees, Retainers & IP Buyout',
    shortLabel: 'Contract & IP Multiplier',
    icon: FileCheck,
  },
];

export const LegalInsuranceSuite: React.FC = () => {
  const [activeTool, setActiveTool] = useState<LegalToolId>('insurance');

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-8">
      {/* Educational Planning Tool Disclaimer Box */}
      <div
        role="region"
        aria-label="Educational Planning Tool Disclaimer"
        className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-2xs"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
              Educational Planning Tool Disclaimer
            </h4>
            <p className="text-xs leading-relaxed text-amber-900">
              The calculations, benchmarks, and policy estimates provided in this suite are intended strictly for educational, mathematical modeling, and personal financial planning purposes. PlanetAI Hub does not provide legal, tax, accounting, or formal insurance underwriting advice. Values are computed using general commercial formulas and user-entered figures. Actual premiums, policy wording, and contractual enforceability vary by jurisdiction and underwriter. Please consult a certified public accountant (CPA), licensed insurance broker, or qualified attorney before executing binding client contracts or selecting commercial policies.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Switcher Grid */}
      <div className="w-full max-w-full rounded-2xl border border-slate-200 bg-slate-50/90 p-2 shadow-2xs">
        <div
          role="tablist"
          aria-label="Business Insurance and Legal Estimators"
          className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
        >
          {LEGAL_TOOLS.map(({ id, label, shortLabel, icon: Icon }, idx) => {
            const isSelected = activeTool === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTool(id)}
                className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-center text-xs font-semibold leading-snug whitespace-normal transition-all ${
                  idx === LEGAL_TOOLS.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  isSelected
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden">{shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Interactive Tool */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        {activeTool === 'insurance' && <InsuranceEstimatorTool />}
        {activeTool === 'w2-vs-1099' && <ContractorRateComparatorTool />}
        {activeTool === 'contract-terms' && <ContractTermsCalculatorTool />}
      </div>

      {/* 500-Word SEO Guide & FAQ */}
      <LegalInsuranceSeoGuide />
    </div>
  );
};
