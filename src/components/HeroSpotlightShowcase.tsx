import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Video,
} from 'lucide-react';
import type { SpotlightVideoConfig } from '../types';
import {
  HERO_COMPANY_SPOTLIGHTS,
  type CareerPrepPayload,
  type HeroCompanySpotlight,
  resolveSpotlightApplyUrl,
} from '../utils/careerPrepTemplates';
import { parsePlayableVideoSource } from '../utils/videoUrl';
import { BrandAvatar } from './BrandAvatar';

interface HeroSpotlightShowcaseProps {
  customSpotlight?: SpotlightVideoConfig | null;
  onLoadPrepKit: (payload: CareerPrepPayload) => void;
  onOpenFeatureVideoModal: () => void;
}

export const HeroSpotlightShowcase: React.FC<HeroSpotlightShowcaseProps> = ({
  customSpotlight,
  onLoadPrepKit,
  onOpenFeatureVideoModal,
}) => {
  const [selectedId, setSelectedId] = useState<'micro1' | 'mercor' | 'outlier' | 'custom'>(() =>
    customSpotlight?.videoUrl ? 'custom' : 'micro1'
  );

  const customPlayable = useMemo(
    () => (customSpotlight?.videoUrl ? parsePlayableVideoSource(customSpotlight.videoUrl) : null),
    [customSpotlight?.videoUrl]
  );

  const selectedPreset: HeroCompanySpotlight = useMemo(() => {
    return HERO_COMPANY_SPOTLIGHTS.find((c) => c.id === selectedId) ?? HERO_COMPANY_SPOTLIGHTS;
  }, [selectedId]);

  const isCustomActive = selectedId === 'custom' && Boolean(customSpotlight && customPlayable);

  const displayCompany = isCustomActive && customSpotlight ? customSpotlight.company : selectedPreset.company;
  const displayDomain = isCustomActive && customSpotlight ? customSpotlight.domain : selectedPreset.domain;
  const displayRole = isCustomActive && customSpotlight ? customSpotlight.tagline : selectedPreset.roleTitle;
  const displayPayBand = isCustomActive && customSpotlight ? customSpotlight.payRange : selectedPreset.payBand;
  const displayRequirements = isCustomActive && customSpotlight
    ? [
        customSpotlight.summary,
        `Verified transparent USD compensation (${customSpotlight.payRange})`,
        'Direct employer ATS link with async remote screening',
      ]
    : selectedPreset.requirements;

  const activeVideoUrl = isCustomActive && customSpotlight ? customSpotlight.videoUrl : selectedPreset.videoUrl;
  const playableSource = useMemo(
    () => (activeVideoUrl ? parsePlayableVideoSource(activeVideoUrl) : null),
    [activeVideoUrl]
  );

  const directApplyHref = isCustomActive && customSpotlight
    ? `https://${customSpotlight.domain.replace(/^https?:\/\//, '')}`
    : resolveSpotlightApplyUrl(selectedPreset);

  const buildPayload = (targetTool: 'resume' | 'interview'): CareerPrepPayload => ({
    nonce: Date.now(),
    targetTool,
    sourceLabel: targetTool === 'resume' ? `${displayCompany} · ${displayRole}` : `${displayCompany} · Mock Interview Script`,
    roleBundleId: selectedPreset.roleBundleId,
    companyDomain: displayDomain,
    applyUrl: directApplyHref,
    payBand: displayPayBand,
    customVideoUrl: isCustomActive && customSpotlight ? customSpotlight.videoUrl : undefined,
    resume: {
      targetTitle: isCustomActive ? displayRole : selectedPreset.resumeTemplate.targetTitle,
      targetCompany: displayCompany,
      summary: isCustomActive && customSpotlight ? customSpotlight.summary : selectedPreset.resumeTemplate.summary,
      skills: selectedPreset.resumeTemplate.skills,
      experienceRole: selectedPreset.resumeTemplate.role,
      experienceBullets: selectedPreset.resumeTemplate.bullets,
    },
    interview: selectedPreset.interviewTemplate,
  });
  return (
    <section className="no-print bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pt-7 pb-9 sm:px-6 sm:pt-10 sm:pb-12">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1D4ED8]">
              1 Click, You Have It All · Remote AI Careers &amp; Prep Kits
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] text-balance">
              Transparent-pay remote AI roles, prepared in one click
            </h1>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
            Watch vetted company walkthroughs, launch your tailored resume &amp; mock interview script, and apply direct via verified USD ATS links.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-7">
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-md lg:col-span-7 sm:p-6">
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div role="tablist" aria-label="Featured company spotlights" className="flex flex-wrap items-center gap-2">
                  {HERO_COMPANY_SPOTLIGHTS.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setSelectedId(item.id)}
                        className={`inline-flex min-h-[36px] items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                          isSelected
                            ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span>{item.company}</span>
                      </button>
                    );
                  })}

                  {customSpotlight && customPlayable && (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selectedId === 'custom'}
                      onClick={() => setSelectedId('custom')}
                      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                        selectedId === 'custom'
                          ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-xs'
                          : 'border-blue-200 bg-blue-50 text-[#1D4ED8] hover:bg-blue-100'
                      }`}
                    >
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      <span>{customSpotlight.company}</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onOpenFeatureVideoModal}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap"
                >
                  <Video className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Feature Your Video</span>
                </button>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-inner">
                {playableSource?.type === 'iframe' ? (
                  <iframe
                    key={playableSource.embedUrl}
                    src={playableSource.embedUrl}
                    title={`${displayCompany} Role Walkthrough`}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : playableSource?.type === 'video' ? (
                  <video
                    key={playableSource.embedUrl}
                    src={playableSource.embedUrl}
                    controls
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                    <Video className="h-9 w-9 text-blue-400" aria-hidden="true" />
                    <p className="mt-2.5 text-sm font-semibold text-white">
                      {displayCompany} · Role &amp; Screening Overview
                    </p>
                    <p className="mt-1 max-w-md text-xs text-slate-400">
                      Review verified compensation, async onboarding steps, and launch your instant prep kit on the right.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                Verified USD Pay Range &amp; Direct Employer ATS
              </span>
              <span>No account required to download kits</span>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-md lg:col-span-5 sm:p-6">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BrandAvatar name={displayCompany} domain={displayDomain} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 sm:text-lg">{displayCompany}</h2>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                        {displayPayBand}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 sm:text-sm">{displayRole}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Role &amp; Screening Highlights
                </p>
                <ul className="mt-2.5 space-y-2">
                  {displayRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 sm:text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-slate-200/80 pt-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onLoadPrepKit(buildPayload('resume'))}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs transition-all hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
                >
                  <FileText className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                  <span>1-Click Resume Kit</span>
                </button>

                <button
                  type="button"
                  onClick={() => onLoadPrepKit(buildPayload('interview'))}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs transition-all hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
                >
                  <MessageSquare className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Mock Interview Script</span>
                </button>
              </div>

              <a
                href={directApplyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-800 sm:text-sm"
              >
                <span>Apply Direct on {displayCompany}</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
