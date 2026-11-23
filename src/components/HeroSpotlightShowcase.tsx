import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  MessageSquare,
  Play,
  Sparkles,
  Video,
} from 'lucide-react';
import type { SpotlightVideoConfig } from '../types';
import {
  HERO_COMPANY_SPOTLIGHTS,
  type CareerPrepPayload,
  type HeroCompanySpotlight,
} from '../utils/careerPrepTemplates';
import { BrandTile } from './BrandAvatar';

interface HeroSpotlightShowcaseProps {
  customSpotlight?: SpotlightVideoConfig | null;
  onLoadPrepKit: (payload: CareerPrepPayload) => void;
  onOpenFeatureVideoModal: () => void;
}

function extractYouTubeId(url?: string, fallbackId = 'jPKTo1iGQiE'): string {
  const cleanUrl = (url || '').trim();
  if (cleanUrl) {
    const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch?.[1]) {
      return watchMatch[1];
    }
    const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch?.[1]) {
      return shortMatch[1];
    }
    const embedMatch = cleanUrl.match(/youtube\.com\/(?:embed|v)\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch?.[1]) {
      return embedMatch[1];
    }
  }
  return fallbackId;
}

export const HeroSpotlightShowcase: React.FC<HeroSpotlightShowcaseProps> = ({
  customSpotlight,
  onLoadPrepKit,
  onOpenFeatureVideoModal,
}) => {
  const [selectedId, setSelectedId] = useState<'micro1' | 'mercor' | 'outlier'>('micro1');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [selectedId, customSpotlight?.videoUrl]);

  const activePreset: HeroCompanySpotlight =
    HERO_COMPANY_SPOTLIGHTS.find((item) => item.id === selectedId) ||
    HERO_COMPANY_SPOTLIGHTS[0];

  const isCustomActive = Boolean(customSpotlight && customSpotlight.company?.trim());

  const displayCompany = isCustomActive
    ? customSpotlight!.company
    : activePreset.company;
  const displayDomain = isCustomActive
    ? customSpotlight!.domain || 'planetaihub.com'
    : activePreset.domain;
  const displayRoleTitle = isCustomActive
    ? customSpotlight!.tagline || 'Featured Remote AI Opportunity'
    : activePreset.roleTitle;
  const displayPayBand = isCustomActive
    ? customSpotlight!.payRange || '$45 – $90 / hr USD'
    : activePreset.payBand;
  const displayScreeningFocus = isCustomActive
    ? customSpotlight!.summary || activePreset.screeningFocus
    : activePreset.screeningFocus;
  const displayRequirements = activePreset.requirements;
  const displayApplyUrl = activePreset.applyUrl;

  const activeVideoId = isCustomActive
    ? extractYouTubeId(customSpotlight?.videoUrl, activePreset.youtubeId)
    : activePreset.youtubeId;
  const embedUrl = `https://www.youtube.com/embed/${activeVideoId}?rel=0`;
  const thumbnailUrl = `https://img.youtube.com/vi/${activeVideoId}/hqdefault.jpg`;

  const buildPayload = (
    targetTool: 'resume' | 'interview' | 'role-prep'
  ): CareerPrepPayload => ({
    nonce: Date.now(),
    targetTool,
    sourceLabel: `${displayRoleTitle} @ ${displayCompany}`,
    roleBundleId: activePreset.roleBundleId,
    companyDomain: displayDomain,
    applyUrl: displayApplyUrl,
    payBand: displayPayBand,
    customVideoUrl: isCustomActive ? customSpotlight?.videoUrl : undefined,
    resume: {
      targetTitle: displayRoleTitle,
      targetCompany: displayCompany,
      summary: activePreset.resumeTemplate.summary,
      skills: activePreset.resumeTemplate.skills,
      experienceRole: activePreset.resumeTemplate.role,
      experienceBullets: activePreset.resumeTemplate.bullets,
    },
    interview: {
      track: activePreset.interviewTemplate.track,
      questionId: activePreset.interviewTemplate.questionId,
      situation: activePreset.interviewTemplate.situation,
      task: activePreset.interviewTemplate.task,
      action: activePreset.interviewTemplate.action,
      result: activePreset.interviewTemplate.result,
    },
  });

  return (
    <section className="w-full max-w-full overflow-x-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50/90 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="max-w-3xl">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8]">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>1 Click, You Have It All · Remote AI Careers &amp; Prep Kits</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
            Transparent-pay remote AI roles, prepared in one click
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Watch vetted company walkthroughs, launch your tailored resume &amp; mock interview script, and apply direct via verified USD ATS links.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="min-w-0 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
              <div
                role="tablist"
                aria-label="Featured AI companies"
                className="flex max-w-full items-center gap-2 overflow-x-auto scroll-touch pr-4 py-0.5"
              >
                {HERO_COMPANY_SPOTLIGHTS.map((item) => {
                  const active = !isCustomActive && item.id === selectedId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedId(item.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all shrink-0 ${
                        active
                          ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.company}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={onOpenFeatureVideoModal}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <Video className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
                <span>Feature Your Company Video</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
              <div className="relative aspect-video w-full bg-slate-900">
                {isPlaying ? (
                  <iframe
                    src={`${embedUrl}&autoplay=1`}
                    title={`${displayCompany} — ${activePreset.videoLabel}`}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    aria-label={`Play ${displayCompany} walkthrough video`}
                    className="group relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-6 text-center"
                  >
                    <img
                      src={thumbnailUrl}
                      alt={`${displayCompany} walkthrough preview`}
                      className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                        <Play className="ml-0.5 h-6 w-6 fill-current" />
                      </span>
                      <span className="mt-3 rounded-full bg-black/70 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                        {isCustomActive
                          ? `${displayCompany} — Featured Walkthrough`
                          : activePreset.videoLabel}
                      </span>
                    </div>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-300">
                <span className="font-medium text-white">
                  {displayCompany} · {displayRoleTitle}
                </span>
                <span className="text-slate-400">No signup required to watch</span>
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <BrandTile name={displayCompany} size="md" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8]">
                    Tailored Candidate Prep Kit
                  </p>
                  <h2 className="truncate text-lg font-extrabold text-slate-900">
                    {displayCompany}
                  </h2>
                  <p className="text-xs font-medium text-slate-600">
                    {displayRoleTitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  Verified USD Pay
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {displayPayBand}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-900">Screening:</span>{' '}
                {displayScreeningFocus}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Key Role Requirements
              </p>
              <ul className="mt-2 space-y-2">
                {displayRequirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs leading-relaxed text-slate-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => onLoadPrepKit(buildPayload('resume'))}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-center text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span>Load Tailored Resume Template</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </button>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onLoadPrepKit(buildPayload('interview'))}
                  className="inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-100"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />
                  <span>Practice Mock Script</span>
                </button>

                <a
                  href={displayApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <span>Apply Direct</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
