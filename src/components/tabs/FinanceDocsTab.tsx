import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Calculator,
  FileCheck,
  FileText,
  Receipt,
  Scale,
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
    <section aria-labelledby="finance-docs-heading" className="space-y-6">
      <div className="no-print flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1D4ED8]">
              <Wallet className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
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

        {/* Clean Primary Sub-Switcher (Wraps cleanly on mobile, non-clipping) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFinanceSection('legal-insurance')}
            className={`inline-flex flex-1 sm:flex-initial justify-center items-center gap-1.5 min-h-[38px] rounded-xl px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              financeSection === 'legal-insurance'
                ? 'bg-[#1D4ED8] text-white shadow-sm'
                : 'text-slate-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Insurance &amp; Legal Estimators</span>
          </button>

          <button
            type="button"
            onClick={() => setFinanceSection('financial-ops')}
            className={`inline-flex flex-1 sm:flex-initial justify-center items-center gap-1.5 min-h-[38px] rounded-xl px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              financeSection === 'financial-ops'
                ? 'bg-[#1D4ED8] text-white shadow-sm'
                : 'text-slate-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <Receipt className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Financial Ops &amp; Invoicing</span>
          </button>
        </div>
      </div>

      {financeSection === 'legal-insurance' ? (
        <LegalInsuranceSuite />
      ) : (
        <div className="space-y-6">
          {/* Horizontally Scrollable Sub-Tab Bar */}
          <div className="no-print w-full max-w-full rounded-2xl border border-slate-200 bg-slate-50 shadow-2xs">
            <div
              role="tablist"
              aria-label="Finance and Document tools"
              className="flex w-full items-center overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade scroll-touch gap-2 px-3 pr-8 py-1.5"
            >
              {FINANCE_TOOLS.map(({ id, label, Icon }) => {
                const isSelected = activeTool === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={(e) => {
                      setActiveTool(id);
                      if (window.innerWidth <= 768) {
                        e.currentTarget.scrollIntoView({
                          behavior: 'smooth',
                          inline: 'center',
                          block: 'nearest',
                        });
                      }
                    }}
                    className={`snap-center inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap min-h-[38px] rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#1D4ED8] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
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
