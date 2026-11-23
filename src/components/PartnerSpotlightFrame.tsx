import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { MICRO1_COMPANY_REFERRAL_URL } from '../utils/referralLinks';

interface VettingTrack {
  code: string;
  title: string;
  rate: string;
  detail: string;
}

interface PartnerSpotlightFrameProps {
  company: string;
  roleTitle: string;
  payBand: string;
  applyUrl: string;
  screeningFocus?: string;
}

function getPartnerMark(company: string): string {
  const lower = company.trim().toLowerCase();
  if (lower.includes('micro1')) return 'm.';
  const clean = company.trim().replace(/[^a-zA-Z0-9]/g, '');
  if (!clean) return 'P.';
  return `${clean[0].toLowerCase()}.`;
}

function getPartnerTracks(
  company: string,
  screeningFocus?: string
): VettingTrack[] {
  const lower = company.trim().toLowerCase();

  if (lower.includes('mercor')) {
    return [
      {
        code: 'TRACK 01',
        title: 'AI Code & System Evaluation',
        rate: '$75 – $120 / hr',
        detail:
          screeningFocus ||
          '20-min structured technical screen scoring quantified architecture & debugging impact.',
      },
      {
        code: 'TRACK 02',
        title: 'Reasoning & Rubric Calibration',
        rate: '$65 – $105 / hr',
        detail:
          'Multi-step boundary case audits and frontier research model preference grading.',
      },
      {
        code: 'TRACK 03',
        title: 'Direct Research Lab Placement',
        rate: 'Async USD Contracts',
        detail:
          'Direct matching with vetted frontier AI engineering and evaluation teams.',
      },
    ];
  }

  if (lower.includes('outlier')) {
    return [
      {
        code: 'TRACK 01',
        title: 'Coding & STEM Evaluation',
        rate: '$40 – $65 / hr',
        detail:
          screeningFocus ||
          'Baseline domain qualifier in TypeScript, Python, SQL, or applied mathematics.',
      },
      {
        code: 'TRACK 02',
        title: 'SxS Factuality & Rubric Review',
        rate: '$35 – $55 / hr',
        detail:
          'Side-by-side LLM response ranking with rigorous citation and logic checks.',
      },
      {
        code: 'TRACK 03',
        title: 'Flexible Weekly USD Payouts',
        rate: 'Self-Paced Global',
        detail:
          'Asynchronous global queues with senior reviewer advancement tiers.',
      },
    ];
  }

  return [
    {
      code: 'TRACK 01',
      title: 'AI Coding & RLHF Benchmarking',
      rate: '$50 – $85 / hr',
      detail:
        screeningFocus ||
        '5-min async technical walkthrough evaluating Python, TypeScript & API trade-offs.',
    },
    {
      code: 'TRACK 02',
      title: 'Full-Stack & LLM Systems Engineering',
      rate: '$60 – $95 / hr',
      detail:
        'Production React, Node.js, RAG architecture & latency optimization for AI product teams.',
    },
    {
      code: 'TRACK 03',
      title: 'Domain Expert Model Evaluation',
      rate: '$45 – $75 / hr',
      detail:
        'High-signal code audits, reasoning verification & structured preference grading.',
    },
  ];
}

export const PartnerSpotlightFrame: React.FC<PartnerSpotlightFrameProps> = ({
  company,
  roleTitle,
  payBand,
  applyUrl,
  screeningFocus,
}) => {
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);

  const isMicro1 = company.trim().toLowerCase().includes('micro1');
  const partnerMark = getPartnerMark(company);
  const partnerTracks = getPartnerTracks(company, screeningFocus);

  const primaryCtaHref = isMicro1 ? MICRO1_COMPANY_REFERRAL_URL : applyUrl;
  const primaryCtaLabel = isMicro1
    ? 'Hiring AI Talent? Source Pre-Vetted Engineers via micro1 →'
    : `Explore & Apply via ${company} Partner Link →`;

  useEffect(() => {
    if (!isOverviewOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOverviewOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOverviewOpen]);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-3">
      {/* Crisp Partner Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-gradient-to-br from-neutral-50/90 via-white to-zinc-100/80 px-3.5 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black font-display text-lg font-bold tracking-tight text-white shadow-sm">
            {partnerMark}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-display text-sm font-bold text-slate-900 sm:text-base">
                {company}
              </p>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                VERIFIED PARTNER
              </span>
            </div>
            <p className="truncate text-[11px] font-medium text-slate-600">
              PlanetAI Hub × {company} Partner Spotlight
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700 tabular-nums">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
          <span>{payBand}</span>
        </span>
      </div>

      {/* Flexible Branded Partner Spotlight Showcase Frame */}
      <div className="relative flex min-h-[210px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/70 px-4 py-5 text-slate-900 shadow-sm sm:min-h-[260px] sm:px-6 sm:py-6">
        {/* Ambient Studio Spotlight Accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl"
        />

        <div className="relative z-10 flex w-full flex-1 flex-col justify-between gap-4">
          {/* Top Stage Tag Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#1D4ED8] sm:text-[11px]">
              <Sparkles className="h-3 w-3 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
              <span>PlanetAI Hub Official Employer Spotlight</span>
            </span>

            <span className="hidden items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <span>Vetted Remote Tracks</span>
            </span>
          </div>

          {/* Center Branded Spotlight Stage */}
          <div className="my-auto flex flex-col items-center text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#1D4ED8] sm:text-xs">
              PlanetAI Hub × {company}
            </p>
            <h4 className="mt-1 max-w-lg line-clamp-2 font-display text-sm font-bold leading-snug text-slate-900 sm:mt-1.5 sm:text-xl">
              {roleTitle}
            </h4>

            <button
              type="button"
              onClick={() => setIsOverviewOpen(true)}
              className="mt-3 inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#1E40AF] sm:mt-4 sm:min-h-[42px] sm:px-5 sm:py-2 sm:text-sm"
            >
              <PlayCircle className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
              <span>Preview Partner Overview</span>
            </button>
          </div>

          {/* Sleek Video Player Progress-Style Footer Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-[10px] font-medium text-slate-600 sm:text-[11px]">
              <span className="truncate">
                {company} Official Partner Showcase
              </span>
              <span className="shrink-0 font-mono font-semibold text-[#1D4ED8]">HD Partner Brief</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#1D4ED8] to-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Job-Card Styled Partner CTA Card with Subtle Bottom-Right Vertical Bar Watermark */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-neutral-50/90 via-white to-zinc-100/80 p-3.5 shadow-2xs">
        <svg
          aria-hidden="true"
          viewBox="0 0 112 68"
          className="pointer-events-none absolute -right-1 -bottom-1 h-16 w-28 text-neutral-900 opacity-[0.07]"
          fill="currentColor"
        >
          <rect x="8" y="22" width="15" height="46" rx="3.5" />
          <rect x="34" y="10" width="15" height="58" rx="3.5" />
          <rect x="60" y="16" width="15" height="52" rx="3.5" />
          <rect x="86" y="28" width="15" height="40" rx="3.5" />
        </svg>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black font-display text-lg font-bold tracking-tight text-white shadow-sm">
              {partnerMark}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-xs font-bold text-slate-900">
                  {company}
                </span>
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  VERIFIED PARTNER
                </span>
              </div>
              <p className="truncate text-[11px] font-medium text-slate-500">
                Featured Company Spotlight
              </p>
            </div>
          </div>

          <a
            href={primaryCtaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] sm:text-sm"
          >
            <span>{primaryCtaLabel}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden="true" />
          </a>

          <div className="flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>100% Transparent Pay Standard</span>
          </div>
        </div>
      </div>

      {/* Interactive Partner Overview Modal */}
      {isOverviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-overview-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setIsOverviewOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black font-display text-lg font-bold text-white shadow-sm">
                  {partnerMark}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      id="partner-overview-modal-title"
                      className="truncate font-display text-base font-bold text-slate-900 sm:text-lg"
                    >
                      PlanetAI Hub × {company}
                    </h3>
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      VERIFIED PARTNER
                    </span>
                  </div>
                  <p className="truncate text-xs font-medium text-slate-600">
                    Vetted Remote AI &amp; Engineering Tracks
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOverviewOpen(false)}
                aria-label="Close partner overview"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Body: Vetted Remote AI & Engineering Tracks */}
            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {partnerTracks.map((track) => (
                  <div
                    key={track.code}
                    className="rounded-xl border border-slate-200 bg-slate-50/75 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#1D4ED8]">
                        {track.code}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-emerald-700 tabular-nums">
                        {track.rate}
                      </span>
                    </div>
                    <p className="mt-1.5 font-display text-xs font-bold text-slate-900">
                      {track.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                      {track.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-[#1D4ED8] transition-colors hover:bg-blue-100"
                >
                  <span>Candidate Track: Apply via {company}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>

                {isMicro1 && (
                  <a
                    href={MICRO1_COMPANY_REFERRAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF]"
                  >
                    <span>Source Engineers via micro1</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
