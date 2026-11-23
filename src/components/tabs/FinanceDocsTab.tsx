import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Calculator,
  FileText,
  Receipt,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { CurrencyConverterTool } from './finance/CurrencyConverterTool';
import { ExpenseTrackerTool } from './finance/ExpenseTrackerTool';
import { InvoiceGeneratorTool } from './finance/InvoiceGeneratorTool';
import { RateCalculatorsTool } from './finance/RateCalculatorsTool';
import { LegalInsuranceSuite } from './finance/LegalInsuranceSuite';

type FinanceSectionId = 'legal-insurance' | 'financial-ops';
type FinanceToolId = 'expenses' | 'calculators' | 'invoice' | 'converter';

const FINANCE_TOOLS: Array<{
  id: FinanceToolId;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'expenses', label: 'Expense & Budget Tracker', Icon: Receipt },
  { id: 'calculators', label: 'Take-Home & Reverse Rate', Icon: Calculator },
  { id: 'invoice', label: 'Invoice & Quote Generator', Icon: FileText },
  { id: 'converter', label: 'Currency Converter', Icon: ArrowLeftRight },
];

export const FinanceDocsTab: React.FC = () => {
  const [financeSection, setFinanceSection] =
    useState<FinanceSectionId>('legal-insurance');
  const [activeTool, setActiveTool] = useState<FinanceToolId>('expenses');

  return (
    <section
      aria-labelledby="finance-docs-heading"
      className="w-full max-w-full overflow-x-hidden space-y-6"
    >
      <div className="no-print flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl min-w-0">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1D4ED8]">
              <Wallet className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                USD Contractor Desk &amp; Legal Suite
              </p>
              <h2
                id="finance-docs-heading"
                className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
              >
                Finance &amp; Legal Desk
              </h2>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Freelance business insurance estimators, W-2 vs 1099 true-rate modeling, contract late fees, and client-side invoice generation.
          </p>
        </div>

        {/* Clean Primary Sub-Switcher (2-column grid on mobile, zero horizontal scrolling) */}
        <div
          role="tablist"
          aria-label="Finance and Legal workspace mode"
          className="grid w-full max-w-full grid-cols-2 gap-2.5 rounded-2xl border border-slate-200 bg-slate-100/90 p-2 lg:w-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={financeSection === 'legal-insurance'}
            onClick={() => setFinanceSection('legal-insurance')}
            className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-center text-xs font-semibold leading-snug whitespace-normal transition-all ${
              financeSection === 'legal-insurance'
                ? 'bg-[#1D4ED8] text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Insurance &amp; Legal Estimators</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={financeSection === 'financial-ops'}
            onClick={() => setFinanceSection('financial-ops')}
            className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-center text-xs font-semibold leading-snug whitespace-normal transition-all ${
              financeSection === 'financial-ops'
                ? 'bg-[#1D4ED8] text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Receipt className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Financial Ops &amp; Invoicing</span>
          </button>
        </div>
      </div>

      {financeSection === 'legal-insurance' ? (
        <LegalInsuranceSuite />
      ) : (
        <div className="space-y-6">
          {/* 2-Column Mobile / 4-Column Desktop Sub-Tab Grid (Zero Horizontal Scroll) */}
          <div className="no-print w-full max-w-full rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-2xs">
            <div
              role="tablist"
              aria-label="Finance and Document tools"
              className="grid grid-cols-2 gap-2.5 lg:grid-cols-4"
            >
              {FINANCE_TOOLS.map(({ id, label, Icon }) => {
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
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
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
            {activeTool === 'expenses' && <ExpenseTrackerTool />}
            {activeTool === 'calculators' && <RateCalculatorsTool />}
            {activeTool === 'invoice' && <InvoiceGeneratorTool />}
            {activeTool === 'converter' && <CurrencyConverterTool />}
          </div>
        </div>
      )}

      <AdBanner />
    </section>
  );
};
