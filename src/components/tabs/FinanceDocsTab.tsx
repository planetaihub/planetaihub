import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { CurrencyConverterTool } from './finance/CurrencyConverterTool';
import { ExpenseTrackerTool } from './finance/ExpenseTrackerTool';
import { InvoiceGeneratorTool } from './finance/InvoiceGeneratorTool';
import { RateCalculatorsTool } from './finance/RateCalculatorsTool';

type FinanceToolId = 'expenses' | 'calculators' | 'invoice' | 'converter';

const FINANCE_TOOLS: Array<{ id: FinanceToolId; label: string }> = [
  { id: 'expenses', label: 'Expense & Budget Tracker' },
  { id: 'calculators', label: 'Take-Home & Reverse Rate' },
  { id: 'invoice', label: 'Invoice & Quote Generator' },
  { id: 'converter', label: 'Currency Converter' },
];

export const FinanceDocsTab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<FinanceToolId>('expenses');

  return (
    <section aria-labelledby="finance-docs-heading" className="space-y-6">
      <div className="no-print border-b border-cyan-500/15 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/25 bg-slate-900/75 text-cyan-400">
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              USD Contractor Desk
            </p>
            <h1
              id="finance-docs-heading"
              className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance"
            >
              Finance & Documents
            </h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          USD-first expense tracking, remote contractor pay calculators, printable PDF/Word/CSV invoicing, and offline currency conversion.
        </p>
      </div>

      {/* Horizontally Scrollable Sub-Tab Bar */}
      <div className="no-print w-full max-w-full rounded-2xl border border-cyan-500/15 bg-slate-900/75 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        <div
          role="tablist"
          aria-label="Finance and Document tools"
          className="flex w-full items-center overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade gap-2 px-3 pr-8 py-1.5"
        >
          {FINANCE_TOOLS.map((tool) => {
            const isSelected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={(e) => {
                  setActiveTool(tool.id);
                  if (window.innerWidth <= 768) {
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    });
                  }
                }}
                className={`snap-center shrink-0 whitespace-nowrap min-h-[40px] rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                {tool.label}
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

      <AdBanner />
    </section>
  );
};
