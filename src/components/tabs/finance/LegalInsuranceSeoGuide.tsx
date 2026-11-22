import React, { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  HelpCircle,
  Scale,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Why do remote technical contractors need Errors & Omissions (E&O) insurance?',
    answer:
      'Errors & Omissions (also termed Professional Liability) covers defense costs and settlement liabilities if a client alleges that your code defect, API migration error, data pipeline bug, or missed deadline caused substantial business downtime or financial damages. Even when claims are frivolous, retaining corporate litigation counsel can cost tens of thousands of dollars out of pocket without commercial E&O coverage.',
  },
  {
    question: 'Why is a 1.5x multiplier required to match a W-2 salary as a 1099 contractor?',
    answer:
      'W-2 employees receive unseen compensation subsidies: the employer pays half of Social Security and Medicare taxes (FICA 7.65%), covers 70% to 90% of healthcare premiums, offers paid vacation and holidays (typically 25 to 30 days of paid downtime), and provides retirement matching. Independent contractors must pay the entire 15.3% Self-Employment Tax (SECA), fund their own healthcare, absorb all non-working days without pay, and spend non-billable time on administrative tasks.',
  },
  {
    question: 'Are contractual late payment interest charges legally enforceable?',
    answer:
      'Yes, in most jurisdictions contractual late fees and prompt payment interest clauses (typically 1.0% to 1.5% per month, or 12% to 18% per annum) are fully enforceable provided they are explicitly specified in the signed Master Services Agreement (MSA) or Statement of Work (SOW) prior to commencement of work. Setting clear net-15 or net-30 terms and invoicing on time establishes clear legal standing.',
  },
  {
    question: 'What is the distinction between work-for-hire copyright transfer and licensing?',
    answer:
      'Under standard copyright law, independent contractors retain legal ownership of original intellectual property unless explicitly transferred in writing. A "work-for-hire" or full copyright assignment transfers complete ownership and title to the client forever, preventing the contractor from reusing proprietary modules or code blocks for other clients. In contrast, an exclusive or non-exclusive commercial license permits the client to exploit the software while the creator retains core codebase assets.',
  },
];

export const LegalInsuranceSeoGuide: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <article
      aria-labelledby="legal-guide-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-8"
    >
      {/* Article Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <span>Independent Contractor Legal &amp; Financial Handbook</span>
        </div>
        <h3
          id="legal-guide-heading"
          className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
        >
          Remote Contractor Protection: Commercial Insurance, True-Rate Math &amp; Contract Terms
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          A field guide for remote software engineers, AI evaluators, virtual operations leaders, and solo founders navigating USD contracting economics.
        </p>
      </div>

      {/* Section 1: Commercial Insurance */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
          <h4 className="font-display text-lg font-bold text-slate-900">
            1. Navigating Commercial Insurance: Errors &amp; Omissions (E&amp;O) vs. General Liability
          </h4>
        </div>
        <div className="text-xs leading-relaxed text-slate-700 space-y-3 font-normal">
          <p>
            When transitioning to remote independent contracting, solo knowledge workers often assume that working from a home office eliminates business liability risks. In reality, commercial risk shifts from physical premises to digital liabilities. Enterprise clients routinely mandate proof of insurance—documented via a Certificate of Insurance (COI)—naming the client as an additional insured before releasing production database credentials or signing Master Services Agreements (MSAs).
          </p>
          <p>
            Understanding the distinction between policy classes is vital. Commercial General Liability (CGL) covers bodily injury and physical property damage. While CGL is a baseline contractual requirement for enterprise onboarding, Errors &amp; Omissions (E&amp;O) is the true shield for knowledge workers. E&amp;O defends against claims of negligent software architecture, algorithmic data bias, catastrophic infrastructure downtime, or inadvertent breach of intellectual property warranties. Adding a Cyber &amp; Privacy rider ensures that forensic investigation costs and mandatory customer notification expenses are covered if customer PII is leaked.
          </p>
        </div>
      </section>

      {/* Section 2: True Rate Comparator Math */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
          <h4 className="font-display text-lg font-bold text-slate-900">
            2. The Real Math of W-2 vs. 1099: Why the 1.5x Multiplier is Non-Negotiable
          </h4>
        </div>
        <div className="text-xs leading-relaxed text-slate-700 space-y-3 font-normal">
          <p>
            One of the most dangerous financial pitfalls for remote professionals is dividing an annual W-2 salary by 2,080 hours to determine an hourly consulting rate. For example, a $120,000 W-2 software engineer earning $57.69 per hour will experience an effective 35% reduction in net take-home pay if they bill the same nominal rate as a 1099 contractor.
          </p>
          <p>
            This deficit stems from four structural burdens:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>
              <strong>Unpaid PTO &amp; Holiday Realities:</strong> Unlike salaried employees who receive 25 to 30 paid days off, contractors only generate revenue during active billable hours. Taking four weeks of vacation and holidays reduces available billing capacity from 2,080 hours down to ~1,500 realistic billable hours.
            </li>
            <li>
              <strong>Self-Employment Tax (SECA):</strong> Independent contractors must absorb the employer’s 7.65% share of Social Security and Medicare taxes, elevating total payroll tax liability to 15.3%.
            </li>
            <li>
              <strong>Unsubsidized Benefits:</strong> Private health, vision, and dental insurance premiums require $6,000 to $10,000 in post-tax cash outlays annually.
            </li>
            <li>
              <strong>Overhead &amp; Unpaid Administrative Hours:</strong> Marketing, invoicing, legal compliance, and hardware depreciation must be amortized across active client billing hours.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 3: Contractual Enforcement & Retainers */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
          <h4 className="font-display text-lg font-bold text-slate-900">
            3. Enforceable Contracts: Late-Fee Penalties, Retainer Governance &amp; IP Buyouts
          </h4>
        </div>
        <div className="text-xs leading-relaxed text-slate-700 space-y-3 font-normal">
          <p>
            Cash flow volatility is the primary threat to independent practice. Standardizing commercial contract clauses eliminates friction before engagements begin. Invoicing with net-15 terms accompanied by a statutory 1.5% monthly late payment interest penalty creates a financial incentive for corporate accounts payable departments to process your invoices on schedule.
          </p>
          <p>
            For recurring advisory or engineering work, transitioning clients from ad-hoc hourly billing to monthly upfront retainers stabilizes cash flow. In exchange for a 10% to 15% volume discount, the contractor secures guaranteed monthly recurring revenue (ARR), while enforcing strict "use-it-or-lose-it" rollover boundaries. Finally, when clients request full copyright assignment ("work-for-hire"), contractors should apply a 1.5x to 2.0x IP buyout multiplier to compensate for the permanent loss of codebase licensing rights.
          </p>
        </div>
      </section>

      {/* Section 4: FAQ Accordion */}
      <section className="border-t border-slate-100 pt-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
          <h4 className="font-display text-base font-bold text-slate-900">
            Frequently Asked Contractor Legal &amp; Financial Questions
          </h4>
        </div>

        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={faq.question} className="p-4 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between text-left text-xs font-bold text-slate-900 gap-4"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
};
