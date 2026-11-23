/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FileText,
  PlayCircle,
  Wallet,
} from 'lucide-react';
import { AdBanner } from './components/AdBanner';
import { CompanyMarquee } from './components/CompanyMarquee';
import { DedicatedSuitePage } from './components/DedicatedSuitePage';
import { EditorialBriefings } from './components/EditorialBriefings';
import { FocusedPrepWorkspace } from './components/FocusedPrepWorkspace';
import { Footer, type LegalModalType } from './components/Footer';
import { HeroSpotlightShowcase } from './components/HeroSpotlightShowcase';
import { InstallAppModal } from './components/InstallAppModal';
import { Navigation, TABS } from './components/Navigation';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PostJobModal, type PostJobTier } from './components/PostJobModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ShareToast } from './components/ShareToast';
import { AIAssistantsTab } from './components/tabs/AIAssistantsTab';
import { CareerStudioTab } from './components/tabs/CareerStudioTab';
import { DevToolsTab } from './components/tabs/DevToolsTab';
import { FinanceDocsTab } from './components/tabs/FinanceDocsTab';
import { HealthWeatherTab } from './components/tabs/HealthWeatherTab';
import { JobsBoard } from './components/tabs/JobsBoard';
import { LiveEarningTab } from './components/tabs/LiveEarningTab';
import { ProductivityTab } from './components/tabs/ProductivityTab';
import { VideoAcademyTab } from './components/tabs/VideoAcademyTab';
import { VaAcademyTab } from './components/tabs/VaAcademyTab';
import { SecurityVaultTab } from './components/tabs/SecurityVaultTab';
import type { JobListing, SpotlightVideoConfig, TabId } from './types';
import {
  buildJobPrepPayload,
  type CareerPrepPayload,
  type CareerToolId,
} from './utils/careerPrepTemplates';
import {
  STORAGE_KEYS,
  loadJobNotes,
  loadSavedJobIds,
  readJson,
  saveJobNote,
  saveSavedJobIds,
  writeJson,
} from './utils/storage';

const SUITE_SEO_DATA: Record<TabId, { title: string; description: string }> = {
  jobs: {
    title: 'PlanetAI Hub — Remote AI Jobs & USD Tech Careers',
    description:
      'Curated remote AI, RLHF, prompt engineering, voice AI, and software engineering roles with transparent USD pay bands and direct ATS links.',
  },
  'career-studio': {
    title: 'Remote Career Studio — Resume Builder & Interview Prep | PlanetAI Hub',
    description:
      'Free ATS-friendly resume builder with photo upload, STAR method interview prep, AI rubric scoring, and custom email drafter.',
  },
  'ai-assistants': {
    title: 'Curated AI Assistants & Developer Copilots | PlanetAI Hub',
    description:
      'Explore cutting-edge AI assistants, coding copilots, and voice synthesis utilities for remote workflows.',
  },
  'dev-tools': {
    title: 'B2B Cloud Egress Estimator & Developer Utilities | PlanetAI Hub',
    description:
      'Free cloud egress and storage cost estimator, offline JWT token inspector, JSON/YAML formatter, and visual cron schedule simulator.',
  },
  'finance-docs': {
    title: 'Freelance Finance Desk & Remote Insurance Estimator | PlanetAI Hub',
    description:
      'USD contractor business insurance estimator, W-2 vs 1099 true-rate comparator, contract late-fee calculator, and printable invoices.',
  },
  productivity: {
    title: 'Remote Productivity Workspace & Focus Suite | PlanetAI Hub',
    description:
      'Pomodoro focus timer, ambient workspace background audio, offline notes, calendar events, and contractor calculators.',
  },
  'health-weather': {
    title: 'Remote Ergonomics & Digital Wellness Hub | PlanetAI Hub',
    description:
      'Desk ergonomics guide, 20-20-20 screen break timers, BMI vitals tracker, and real-time local weather forecasts.',
  },
  'live-earning': {
    title: 'Live Remote Earning Opportunities & Microtasks | PlanetAI Hub',
    description:
      'Verified remote microtasking, AI data labeling contracts, voice recording jobs, and daily payout opportunities worldwide.',
  },
  'video-academy': {
    title: 'PlanetAI Video Academy — Remote AI Interview Masterclasses | PlanetAI Hub',
    description:
      'Curated video masterclasses on passing AI screening rounds, STAR behavioral interviews, and RLHF grading benchmarks.',
  },
  'va-academy': {
    title: 'Virtual Assistant Academy & Remote Ops Certification | PlanetAI Hub',
    description:
      'Comprehensive training pathways, SOP templates, and toolkits for remote virtual assistants and operations specialists.',
  },
  'security-vault': {
    title: 'Client-Side Security Vault & Password Generator | PlanetAI Hub',
    description:
      'Zero-knowledge password generator, cryptographic entropy meter, and AES-encrypted local storage for remote credentials.',
  },
  'editorial-briefings': {
    title: '18 Editorial AI Briefings & Remote Work Field Notes | PlanetAI Hub',
    description:
      'Deep-dive editorial guides covering RLHF evaluation rubrics, studio voice acoustics, structured prompt schemas, and remote USD contractor math.',
  },
};

interface RouteResolution {
  tab: TabId;
  isBriefing?: boolean;
}

const normalizeRouteToTab = (routeCandidate: string): RouteResolution => {
  const clean = routeCandidate
    .replace(/^#\/?/, '')
    .replace(/^\/+/, '')
    .toLowerCase()
    .split('?')[0];

  if (clean === 'editorial-briefings' || clean === 'briefings') {
    return { tab: 'editorial-briefings', isBriefing: true };
  }

  if (
    clean.startsWith('dev-tools') ||
    clean === 'b2b-utilities' ||
    clean === 'cloud-cost' ||
    clean === 'jwt-codec' ||
    clean === 'json-yaml' ||
    clean === 'cron-builder'
  ) {
    return { tab: 'dev-tools' };
  }

  if (
    clean.startsWith('finance-docs') ||
    clean === 'insurance' ||
    clean === 'w2-vs-1099' ||
    clean === 'contract-terms'
  ) {
    return { tab: 'finance-docs' };
  }

  if (clean.startsWith('career-studio') || clean === 'career') {
    return { tab: 'career-studio' };
  }

  if (clean.startsWith('ai-assistants') || clean === 'ai') {
    return { tab: 'ai-assistants' };
  }

  if (clean.startsWith('video-academy') || clean === 'academy') {
    return { tab: 'video-academy' };
  }

  if (clean.startsWith('va-academy')) {
    return { tab: 'va-academy' };
  }

  if (clean.startsWith('security-vault') || clean === 'security') {
    return { tab: 'security-vault' };
  }

  if (clean.startsWith('productivity')) {
    return { tab: 'productivity' };
  }

  if (clean.startsWith('health-weather') || clean === 'health') {
    return { tab: 'health-weather' };
  }

  if (clean.startsWith('live-earning') || clean === 'earning') {
    return { tab: 'live-earning' };
  }

  return { tab: 'jobs' };
};

const resolveInitialTab = (): TabId => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('briefing')) {
      return 'editorial-briefings';
    }
    const path = window.location.pathname.replace(/^\/+/, '');
    const hash = window.location.hash.replace(/^#\/?/, '');
    const queryTab = params.get('tab');
    const candidate = path || queryTab || hash;
    return normalizeRouteToTab(candidate).tab;
  }
  return 'jobs';
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>(resolveInitialTab);
  const [jobViewMode, setJobViewMode] = useState<'all' | 'saved'>('all');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() =>
    loadSavedJobIds()
  );
  const [postedJobs, setPostedJobs] = useState<JobListing[]>(() =>
    readJson<JobListing[]>(STORAGE_KEYS.POSTED_JOBS, [])
  );
  const [jobNotes, setJobNotes] = useState<Record<string, string>>(() =>
    loadJobNotes()
  );
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [postJobInitialTier, setPostJobInitialTier] =
    useState<PostJobTier>('featured');
  const [spotlightConfig, setSpotlightConfig] =
    useState<SpotlightVideoConfig | null>(() =>
      readJson<SpotlightVideoConfig | null>(STORAGE_KEYS.SPOTLIGHT_VIDEO, null)
    );
  const [careerPrepPayload, setCareerPrepPayload] =
    useState<CareerPrepPayload | null>(null);
  const [focusedPrep, setFocusedPrep] = useState<CareerPrepPayload | null>(null);
  const [academySessionTrigger, setAcademySessionTrigger] = useState<{
    id: string;
    nonce: number;
  } | null>(null);
  const [briefingTrigger, setBriefingTrigger] = useState<{
    id: string;
    nonce: number;
  } | null>(null);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  // Synchronize document title, meta descriptions, and clean canonical links per active suite
  useEffect(() => {
    const seo = SUITE_SEO_DATA[activeTab];
    if (!seo) return;

    document.title = seo.title;

    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('name', 'description', seo.description);
    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.description);
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.description);

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      const origin =
        typeof window !== 'undefined' &&
        window.location.origin &&
        window.location.origin !== 'null'
          ? window.location.origin
          : 'https://planetaihub.com';

      const currentPath =
        typeof window !== 'undefined' && window.location.pathname !== '/'
          ? window.location.pathname
          : activeTab === 'jobs'
          ? '/'
          : `/${activeTab}`;

      canonicalEl.setAttribute('href', `${origin}${currentPath}`);
    }
  }, [activeTab]);

  // Listen to browser navigation (back/forward & clean path / legacy hash routing)
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.replace(/^\/+/, '');
      const hash = window.location.hash.replace(/^#\/?/, '');
      const candidate = path || hash;

      const routeInfo = normalizeRouteToTab(candidate);
      if (routeInfo.isBriefing) {
        setActiveTab('editorial-briefings');
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else if (routeInfo.tab !== activeTab) {
        setActiveTab(routeInfo.tab);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    // Initial check: if user visited with a legacy hash, normalize URL to clean path without reloading
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\/+/, '');
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash && !path) {
        const routeInfo = normalizeRouteToTab(hash);
        if (routeInfo.isBriefing) {
          window.history.replaceState(null, '', '/editorial-briefings');
          setActiveTab('editorial-briefings');
          window.scrollTo({ top: 0, behavior: 'auto' });
        } else {
          window.history.replaceState(null, '', `/${routeInfo.tab}`);
        }
      }
    }

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, [activeTab]);

  const handleOpenPostJob = (initialTier: PostJobTier = 'featured') => {
    setPostJobInitialTier(initialTier);
    setIsPostJobOpen(true);
  };

  const handleSaveSpotlightVideo = (config: SpotlightVideoConfig) => {
    setSpotlightConfig(config);
    writeJson(STORAGE_KEYS.SPOTLIGHT_VIDEO, config);
  };

  const scrollToElement = (elementId: string, headerOffset = 64) => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const el = document.getElementById(elementId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetTop = Math.max(0, window.scrollY + rect.top - headerOffset);
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      const next = exists
        ? prev.filter((id) => id !== jobId)
        : [jobId, ...prev];
      saveSavedJobIds(next);
      return next;
    });
  };

  const handleUpdateJobNote = (jobId: string, note: string) => {
    const updated = saveJobNote(jobId, note);
    setJobNotes(updated);
  };

  const handlePublishJob = (newJob: JobListing) => {
    setPostedJobs((prev) => {
      const next = [newJob, ...prev];
      writeJson(STORAGE_KEYS.POSTED_JOBS, next);
      return next;
    });
    setActiveTab('jobs');
    setJobViewMode('all');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/jobs');
    }
    setTimeout(() => scrollToElement('workspace-showcase'), 80);
  };

  const handleOpenSavedJobs = () => {
    setActiveTab('jobs');
    setJobViewMode('saved');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/jobs');
    }
    setTimeout(() => scrollToElement('workspace-showcase'), 80);
  };

  const handleSelectTab = (tab: TabId, shouldScroll = true) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const nextUrl = tab === 'jobs' ? '/jobs' : `/${tab}`;
      window.history.pushState(null, '', nextUrl);
      if (tab !== 'jobs') {
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }
    }
    if (shouldScroll) {
      setTimeout(() => scrollToElement('workspace-showcase'), 80);
    }
  };

  const handleBackToHub = () => {
    setActiveTab('jobs');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleScrollToWorkspace = () => {
    if (activeTab !== 'jobs') {
      setActiveTab('jobs');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/');
      }
      setTimeout(() => scrollToElement('workspace-showcase'), 80);
      return;
    }
    scrollToElement('workspace-showcase');
  };

  const handleScrollToBriefings = () => {
    setActiveTab('editorial-briefings');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/editorial-briefings');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleLoadCareerPrep = (payload: CareerPrepPayload) => {
    setCareerPrepPayload(payload);
    setActiveTab('career-studio');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/career-studio');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleOpenFocusedPrep = (payload: CareerPrepPayload) => {
    setFocusedPrep(payload);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleOpenJobPrepKit = (job: JobListing) => {
    const payload = buildJobPrepPayload(job, 'resume');
    handleOpenFocusedPrep(payload);
  };

  const handleOpenVideoAcademy = (sessionId?: string) => {
    if (sessionId) {
      setAcademySessionTrigger({ id: sessionId, nonce: Date.now() });
    }
    setActiveTab('video-academy');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/video-academy');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleOpenBriefingById = (briefingId: string) => {
    setBriefingTrigger({ id: briefingId, nonce: Date.now() });
    setActiveTab('editorial-briefings');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/editorial-briefings');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleOpenCareerStudioTool = (tool: CareerToolId = 'role-prep') => {
    setCareerPrepPayload((prev) =>
      prev
        ? { ...prev, targetTool: tool, nonce: Date.now() }
        : {
            nonce: Date.now(),
            targetTool: tool,
            sourceLabel: 'Editorial Training Path',
          }
    );
    setActiveTab('career-studio');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/career-studio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderDedicatedSuiteContent = () => {
    switch (activeTab) {
      case 'career-studio':
        return (
          <CareerStudioTab
            prepPayload={careerPrepPayload}
            onLoadPrepPayload={handleLoadCareerPrep}
            onClearPrepPayload={() => setCareerPrepPayload(null)}
          />
        );
      case 'ai-assistants':
        return <AIAssistantsTab />;
      case 'dev-tools':
        return <DevToolsTab />;
      case 'finance-docs':
        return <FinanceDocsTab />;
      case 'productivity':
        return <ProductivityTab />;
      case 'health-weather':
        return <HealthWeatherTab />;
      case 'live-earning':
        return <LiveEarningTab />;
      case 'video-academy':
        return (
          <VideoAcademyTab
            externalSessionTrigger={academySessionTrigger}
            onOpenBriefing={handleOpenBriefingById}
            onOpenCareerStudio={handleOpenCareerStudioTool}
          />
        );
      case 'va-academy':
        return <VaAcademyTab />;
      case 'security-vault':
        return <SecurityVaultTab />;
      case 'editorial-briefings':
        return (
          <div className="space-y-8">
            <EditorialBriefings
              externalBriefingTrigger={briefingTrigger}
              onOpenVideoAcademy={handleOpenVideoAcademy}
              onOpenCareerStudio={handleOpenCareerStudioTool}
            />
            <AdBanner variant="light" />
          </div>
        );
      default:
        return null;
    }
  };

  const capabilityCards: Array<{
    title: string;
    description: string;
    ctaLabel: string;
    icon: typeof Briefcase;
    onClick: () => void;
  }> = [
    {
      title: 'Transparent USD Job Directory',
      description:
        'Verified remote AI, RLHF, prompt engineering, and software engineering contracts with upfront USD pay bands and direct ATS links.',
      ctaLabel: 'Open Job Board',
      icon: Briefcase,
      onClick: () => handleSelectTab('jobs'),
    },
    {
      title: 'Local-First Career Studio',
      description:
        'ATS-friendly Resume Builder with photo upload, tailored Cover Letter & Quick Email Drafter, plus Voice & Rubric Interview Prep.',
      ctaLabel: 'Launch Career Studio',
      icon: FileText,
      onClick: () => handleSelectTab('career-studio'),
    },
    {
      title: 'PlanetAI Video Academy',
      description:
        'Curated YouTube workshops on passing AI screening rounds, STAR frameworks, and RLHF grading with actionable checklists.',
      ctaLabel: 'Watch Video Sessions',
      icon: PlayCircle,
      onClick: () => handleSelectTab('video-academy'),
    },
    {
      title: '18 Editorial AI Briefings',
      description:
        'Field notes on evaluation rubrics, studio voice acoustics, async workflows, and global USD contractor compensation.',
      ctaLabel: 'Read Briefings',
      icon: BookOpen,
      onClick: handleScrollToBriefings,
    },
  ];

  // Full-Page Company/Role 1-Click Focused Kit View
  if (focusedPrep) {
    return (
      <>
        <OfflineIndicator />
        <FocusedPrepWorkspace
          prepPayload={focusedPrep}
          onBackToHub={() => setFocusedPrep(null)}
        />
        <ShareToast />
      </>
    );
  }

  // Dedicated 1-Click Breathing Pages for All Non-Job Suites
  if (activeTab !== 'jobs') {
    return (
      <>
        <OfflineIndicator />
        <DedicatedSuitePage
          activeTab={activeTab}
          onBackToHub={handleBackToHub}
          onSelectTab={(tab) => handleSelectTab(tab)}
          onScrollToBriefings={handleScrollToBriefings}
          onOpenPostJob={() => handleOpenPostJob('featured')}
          legalModal={legalModal}
          onChangeLegalModal={setLegalModal}
        >
          {renderDedicatedSuiteContent()}
        </DedicatedSuitePage>

        <PostJobModal
          isOpen={isPostJobOpen}
          initialTier={postJobInitialTier}
          onClose={() => setIsPostJobOpen(false)}
          onPublishJob={handlePublishJob}
          onSubmitVideoSpotlight={handleSaveSpotlightVideo}
        />

        <InstallAppModal />

        <ShareToast />
      </>
    );
  }

  // Primary Hub Homepage & Spacious Remote Job Board
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white text-slate-900">
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => handleSelectTab(tab)}
        savedCount={savedJobIds.length}
        onOpenSavedJobs={handleOpenSavedJobs}
        onScrollToWorkspace={handleScrollToWorkspace}
        onScrollToBriefings={handleScrollToBriefings}
        onOpenAbout={() => setLegalModal('about')}
      />

      <OfflineIndicator />

      {/* 1. HOMEPAGE HERO: FEATURED PARTNER SPOTLIGHT + INSTANT TAILORED CANDIDATE PREP CARD */}
      <HeroSpotlightShowcase
        customSpotlight={spotlightConfig}
        onLoadPrepKit={handleOpenFocusedPrep}
        onOpenFeatureVideoModal={() => handleOpenPostJob('video-spotlight')}
      />

      {/* Light-Slate Partner / Platform Marquee Strip */}
      <section
        aria-label="Featured hiring platforms"
        className="no-print border-y border-slate-200 bg-slate-50"
      >
        <CompanyMarquee variant="light" />
      </section>

      {/* 2. DEDICATED SUITE LAUNCHER GRID + SPACIOUS FULL-WIDTH JOB BOARD */}
      <main className="w-full max-w-full overflow-x-clip bg-white">
        <section
          id="workspace-showcase"
          aria-label="PlanetAI Hub Suites and Job Board"
          className="scroll-mt-20 mx-auto w-full max-w-7xl px-4 pt-6 pb-8 sm:px-6 sm:pt-10 space-y-8"
        >
          {/* Clean 1-Click Dedicated Page Suite Switcher Grid (Zero Horizontal Scrolling) */}
          <div className="no-print rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
                  1-Click Dedicated Workspace Pages
                </p>
                <p className="text-xs text-slate-600">
                  Launch any specialized career, VA training, crypto vault, finance, or dev utility in its own full-width page.
                </p>
              </div>
              <span className="font-mono text-[11px] font-medium text-slate-500">
                Zero Sign-Up · Browser-Local
              </span>
            </div>

            <div
              role="navigation"
              aria-label="Dedicated workspace suites"
              className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            >
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => handleSelectTab(tab.id, tab.id === 'jobs')}
                    className={`inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all text-center ${
                      isActive
                        ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-[#1D4ED8]/40 hover:bg-blue-50/40 hover:text-[#1D4ED8]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{tab.desktopLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="no-print">
            <PWAInstallBanner />
          </div>

          <JobsBoard
            savedJobIds={savedJobIds}
            postedJobs={postedJobs}
            jobNotes={jobNotes}
            spotlightConfig={spotlightConfig}
            viewMode={jobViewMode}
            onChangeViewMode={setJobViewMode}
            onToggleSave={handleToggleSaveJob}
            onUpdateJobNote={handleUpdateJobNote}
            onOpenPostJob={handleOpenPostJob}
            onOpenPrepKit={handleOpenJobPrepKit}
          />
        </section>

        {/* 3. 4-COLUMN PLATFORM CAPABILITY GRID (Clean White Canvas) */}
        <section
          aria-labelledby="capabilities-heading"
          className="no-print border-y border-slate-200 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                Unified Remote Workflow
              </p>
              <h2
                id="capabilities-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance"
              >
                Everything you need to land remote AI work
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Browse vetted USD contracts, prepare application materials offline, watch interview walkthroughs, and stay current on AI evaluation trends.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {capabilityCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.title}
                    type="button"
                    onClick={card.onClick}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                  >
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#1D4ED8] transition-colors group-hover:bg-[#1D4ED8] group-hover:text-white">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-slate-900">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {card.description}
                      </p>
                    </div>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] group-hover:gap-2 transition-all">
                      <span>{card.ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => handleSelectTab('finance-docs')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1D4ED8]"
              >
                <Wallet className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
                <span>Also explore Freelance Finance Desk &amp; Invoice Generator →</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4. FULL-WIDTH COBALT BLUE HIGHLIGHT BANNER */}
        <section
          aria-label="Free local-first career suite highlight"
          className="no-print bg-[#1D4ED8] py-14 text-white sm:py-16"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl text-balance">
                100% Free &amp; Browser-Local Career Suite — Zero Accounts, Zero Subscriptions, Direct Employer Links
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-blue-100 sm:text-base">
                Your resumes, client invoices, saved job notes, and expense ledgers never leave your browser. Install as a desktop or mobile PWA anytime.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectTab('jobs')}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#1D4ED8] shadow-md transition-colors hover:bg-blue-50 whitespace-nowrap"
              >
                Browse Remote Roles
              </button>
              <button
                type="button"
                onClick={() => handleOpenPostJob('featured')}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 whitespace-nowrap"
              >
                Post a Job
              </button>
            </div>
          </div>
        </section>

        {/* 5. LIGHT-SLATE PUBLISHER SPONSORSHIP / AD UNIT */}
        <section
          aria-label="Sponsored placement"
          className="no-print bg-[#F8FAFC] py-8"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <AdBanner variant="light" />
          </div>
        </section>

        {/* 6. COMPACT PLATFORM EDITORIAL OVERVIEW (SEO & AdSense Publisher Context) */}
        <section
          aria-labelledby="platform-editorial-overview-heading"
          className="no-print border-t border-slate-200 bg-white py-10 sm:py-12"
        >
          <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
            <div className="max-w-3xl space-y-2">
              <h2
                id="platform-editorial-overview-heading"
                className="font-display text-xl font-bold tracking-tight text-slate-900"
              >
                PlanetAI Hub — Remote AI Jobs &amp; Utility Platform
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                PlanetAI Hub is the premier editorial directory for remote artificial intelligence, RLHF, prompt engineering, voice AI, and software engineering roles with transparent USD pay. We also feature 18 long-form editorial briefings and professional offline-ready career, finance, and productivity utilities.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 space-y-1.5">
                <h3 className="font-display text-sm font-bold text-[#1D4ED8]">
                  Curated Remote AI &amp; Tech Careers
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Explore daily-updated remote contracts, full-time positions, and freelance opportunities with direct employer ATS links. Every listing adheres to our transparent pay standard.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 space-y-1.5">
                <h3 className="font-display text-sm font-bold text-[#1D4ED8]">
                  Editorial Briefings &amp; Intelligence
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Read our 18 in-depth editorial briefings covering AI model evaluations, RLHF career paths, voice synthesis benchmarks, and asynchronous remote team workflows.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 space-y-1.5">
                <h3 className="font-display text-sm font-bold text-[#1D4ED8]">
                  Professional Workspace Suites
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Utilize our local-first Career Studio (Resume Builder, STAR Interview Prep, Email Drafter), Finance Desk (Expense Tracker, Invoice Generator, Rate Calculators), and Daily Productivity tools—all operating entirely client-side in your browser with zero signup required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. CORPORATE LIGHT-SLATE FOOTER */}
      <Footer
        onSelectTab={(tab) => handleSelectTab(tab)}
        onScrollToBriefings={handleScrollToBriefings}
        onOpenPostJob={() => handleOpenPostJob('featured')}
        legalModal={legalModal}
        onChangeLegalModal={setLegalModal}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        initialTier={postJobInitialTier}
        onClose={() => setIsPostJobOpen(false)}
        onPublishJob={handlePublishJob}
        onSubmitVideoSpotlight={handleSaveSpotlightVideo}
      />

      <InstallAppModal />

      <ShareToast />
    </div>
  );
}
