import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
} from 'lucide-react';
import type { TabId } from '../types';
import { TABS } from './Navigation';
import { Footer, type LegalModalType } from './Footer';

interface SuiteEditorialCopy {
  heading: string;
  tagline: string;
  paragraph1: string;
  paragraph2: string;
}

const SUITE_EDITORIAL_GUIDES: Record<Exclude<TabId, 'jobs'>, SuiteEditorialCopy> = {
  'va-academy': {
    heading: 'Virtual Assistant Academy & Remote Operations Guide',
    tagline: 'Structured Training, Masterclass Modules & Client Retention Playbooks',
    paragraph1:
      'Modern remote virtual assistants act as strategic executive partners who protect founder focus time through disciplined inbox triage, calendar architecture, and async SOP documentation. Mastering these core systems allows independent contractors to transition away from low-rate marketplaces into $25–$50/hr monthly retainers with global startups.',
    paragraph2:
      'Use the 12 curated masterclass modules above to practice executive email workflows, Notion command centers, and discovery-call scripts before pitching prospective founders. Paired with our 6 step-by-step career playbooks, every module is designed for practical execution right from your browser.',
  },
  'career-studio': {
    heading: 'Remote Career Studio & AI Interview Readiness Guide',
    tagline: 'ATS-Formatted Resumes, STAR Scripts & Pre-Submit Rubric Audits',
    paragraph1:
      'Remote AI and software roles rely heavily on automated applicant tracking parsers and structured 5-to-20-minute async screening rounds. Leading with verifiable performance metrics, clear first-person ownership, and clean ATS formatting drastically boosts your pass rate across RLHF, voice AI, and distributed engineering pipelines.',
    paragraph2:
      'Every Career Studio tool runs strictly in your browser without account sign-ups or cloud uploads. Switch seamlessly between the 1-Click Role Prep Hub bundles, instant Resume & Cover Letter PDF export, STAR Mock Interview builder, and Voice Teleprompter to tailor applications in minutes.',
  },
  'ai-assistants': {
    heading: 'AI Assistants Directory & Prompt Engineering Workbench Guide',
    tagline: 'Zero-API Prompt Structuring, Token Budgeting & SOP Templates',
    paragraph1:
      'High-performing remote specialists pair frontier reasoning models with repeatable prompt contracts instead of starting from scratch on each assignment. Clear XML or Markdown delimiters, explicit output schemas, and verified reference constraints transform everyday chatbots into dependable operational assistants.',
    paragraph2:
      'Browse the 15 verified AI portals in the directory or switch directly to the Zero-API Workbench to assemble structured prompts, estimate token footprints across leading model pricing tiers, and copy client-ready workflow SOP blueprints offline.',
  },
  'security-vault': {
    heading: 'Zero-Knowledge Client-Side Cryptography & Security Guide',
    tagline: 'Hardware-Backed Browser Entropy, AES-256-GCM & 2FA TOTP Hygiene',
    paragraph1:
      'Distributed contractors frequently handle sensitive staging environments, client API tokens, and shared admin portals across remote networks. Generating high-entropy random credentials through the native Web Crypto API prevents predictable pattern reuse and keeps sensitive payloads encrypted before leaving your device.',
    paragraph2:
      'UserKey Browser Enclave executes 100% locally in isolated browser memory using PBKDF2 key derivation and AES-256-GCM authenticated encryption, with zero server transmission or external logging. Remember to store master passphrases offline and enable hardware or TOTP two-factor authentication across every employer account.',
  },
  'live-earning': {
    heading: 'Live Remote Earning Platforms & Payout Verification Guide',
    tagline: 'Transparent USD Microtasks, AI Training & Speech Evaluation Tracks',
    paragraph1:
      'Flexible online earning platforms bridge the gap between entry-level remote contributors and specialized long-term AI data contracts. Prioritizing verified companies with published hourly benchmarks, clear hardware requirements, and dependable global payout rails helps safeguard your time against low-yield gig sites.',
    paragraph2:
      'Filter opportunities below by passive recording, AI training, voice capture, or specialized research studies to find roles matching your setup and region. Review payout schedules and bonus instructions carefully before starting your first qualification session.',
  },
  'health-weather': {
    heading: 'Remote Ergonomics, Digital Wellness & Climate Planning Guide',
    tagline: 'Sustainable Desk Habits, Hydration Tracking & Zero-Key Live Forecasts',
    paragraph1:
      'Long hours working asynchronously across global time zones make deliberate movement, posture alignment, and hydration tracking essential for sustained output. Consistent micro-breaks using the 20-20-20 visual rest cadence help prevent eye fatigue and neck strain during intense evaluation or engineering sprints.',
    paragraph2:
      'Log daily vitals and body-mass benchmarks locally in your browser without syncing health records to external servers, or switch to the Live Weather Widget powered by Open-Meteo to monitor local temperature, wind, and weekly storm shifts around your home office.',
  },
  'finance-docs': {
    heading: 'Freelance Contractor Finance, Insurance & True-Rate Guide',
    tagline: 'W-2 vs 1099 Modeling, Commercial Risk & Instant USD Invoicing',
    paragraph1:
      'Pricing remote international contracts requires factoring self-employment taxes, cross-border FX spreads, unpaid PTO buffers, and professional liability overhead into your target hourly rate. Modeling true take-home compensation prevents undercharging when moving from salaried roles into 1099 consulting.',
    paragraph2:
      'Use the Insurance & Legal Estimators above to benchmark Errors & Omissions coverage, compare W-2 vs 1099 net income, and calculate contract late-fee schedules, or toggle to Financial Ops for instant multi-currency conversion and printable client PDF invoices.',
  },
  'dev-tools': {
    heading: 'B2B Cloud Egress & Offline Developer Utilities Guide',
    tagline: 'Client-Side Infrastructure Estimation, JWT Inspection & Cron Validation',
    paragraph1:
      'Unexpected cloud egress fees, malformed configuration files, and misconfigured scheduled jobs are among the most common sources of production surprises in lean remote engineering teams. Modeling bandwidth transfers across providers and validating tokens locally keeps architecture reviews fast and confidential.',
    paragraph2:
      'Inspect JWT claims safely without pasting bearer tokens onto third-party servers, convert cleanly between JSON and YAML payloads, verify cron expressions against upcoming UTC runs, or browse our curated builder launchpad for zero-cost cloud hosting tiers.',
  },
  productivity: {
    heading: 'Deep Work, Time-Blocking & Distraction-Free Focus Guide',
    tagline: 'Pomodoro Intervals, Web Audio Acoustics & Local Knowledge Snippets',
    paragraph1:
      'Working independently from home demands clear boundaries between asynchronous communication checks and uninterrupted deep-work blocks. Pairing structured Pomodoro intervals with consistent acoustic masking helps train focus and reduce context-switching across complex coding or review deliverables.',
    paragraph2:
      'Every utility in this suite—world clock alarms, ambient brown/pink noise synthesis, reusable markdown snippets, offline calendar notes, and quick calculations—persists cleanly in browser local storage so your workspace stays ready even on unstable connections.',
  },
  'video-academy': {
    heading: 'PlanetAI Video Academy & Structured Screening Mastery Guide',
    tagline: 'Interactive Role Walkthroughs, Study Checklists & Companion Briefings',
    paragraph1:
      'Structured behavioral and technical interviews reward candidates who pair clear architectural storytelling with verifiable metrics. Studying concise walkthroughs across STAR interviews, system design trade-offs, and RLHF preference grading equips you to answer screening prompts calmly on the very first take.',
    paragraph2:
      'Watch any workshop inside the theatre above, check off action steps as you rehearse, and jump straight to companion Career Studio templates or long-form Editorial Briefings to convert every video lesson into job-ready application materials.',
  },
};

interface DedicatedSuitePageProps {
  activeTab: Exclude<TabId, 'jobs'>;
  onBackToHub: () => void;
  onSelectTab: (tab: TabId) => void;
  onScrollToBriefings: () => void;
  onOpenPostJob: () => void;
  legalModal: LegalModalType;
  onChangeLegalModal: (modal: LegalModalType) => void;
  children: React.ReactNode;
}

export const DedicatedSuitePage: React.FC<DedicatedSuitePageProps> = ({
  activeTab,
  onBackToHub,
  onSelectTab,
  onScrollToBriefings,
  onOpenPostJob,
  legalModal,
  onChangeLegalModal,
  children,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const activeMeta = TABS.find((t) => t.id === activeTab);
  const guide = SUITE_EDITORIAL_GUIDES[activeTab];
  const ActiveIcon = activeMeta?.icon;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] text-slate-900">
      {/* Clean Sticky Single Top Bar */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Left: Back to PlanetAI Hub */}
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
            <span>Back to PlanetAI Hub</span>
          </button>

          {/* Center: Active Dedicated Suite Title */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-700">
            {ActiveIcon && (
              <ActiveIcon className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
            )}
            <span className="font-display text-sm font-bold text-slate-900">
              {activeMeta?.label}
            </span>
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-500">
              /{activeTab}
            </span>
          </div>

          {/* Right: Quick Suite Switcher & Browse USD Roles */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsSwitcherOpen((prev) => !prev)}
              aria-expanded={isSwitcherOpen}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 whitespace-nowrap"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
              <span>Suites</span>
              {isSwitcherOpen ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={onBackToHub}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#1D4ED8] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
            >
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Browse USD Roles</span>
            </button>
          </div>
        </div>

        {/* Clean 2-Column Expandable Suite Drawer (Zero Horizontal Scrolling) */}
        {isSwitcherOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg sm:px-6">
            <div className="mx-auto max-w-7xl">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Switch Dedicated Workspace Suite
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isCurrent = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setIsSwitcherOpen(false);
                        onSelectTab(tab.id);
                      }}
                      className={`inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors text-center ${
                        isCurrent
                          ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#1D4ED8]/40 hover:bg-white hover:text-[#1D4ED8]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{tab.desktopLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacious Dedicated Breathing Canvas */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        <div className="w-full max-w-full">{children}</div>

        {/* Concise 2-Paragraph Editorial Overview & Practitioner Guide (Educational & AdSense Crawler Value) */}
        <article
          aria-labelledby="suite-editorial-guide-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>PlanetAI Hub Editorial Overview &amp; Workflow Guide</span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {guide.tagline}
            </span>
          </div>

          <h2
            id="suite-editorial-guide-heading"
            className="mt-4 font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl text-balance"
          >
            {guide.heading}
          </h2>

          <div className="mt-3 grid grid-cols-1 gap-5 text-sm leading-relaxed text-slate-600 md:grid-cols-2">
            <p>{guide.paragraph1}</p>
            <p>{guide.paragraph2}</p>
          </div>
        </article>
      </main>

      <Footer
        onSelectTab={onSelectTab}
        onScrollToBriefings={onScrollToBriefings}
        onOpenPostJob={onOpenPostJob}
        legalModal={legalModal}
        onChangeLegalModal={onChangeLegalModal}
      />
    </div>
  );
};
