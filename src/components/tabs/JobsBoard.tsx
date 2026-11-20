import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Share2,
  SlidersHorizontal,
} from 'lucide-react';
import { REMOTE_JOBS } from '../../data/jobs';
import type {
  JobCategory,
  JobListing,
  JobRoleLevel,
  RemoteRegion,
} from '../../types';
import { AdBanner } from '../AdBanner';
import { BrandAvatar, resolveBrandDomain } from '../BrandAvatar';
import { EditorialBriefings } from '../EditorialBriefings';
import { JobDetailModal } from '../JobDetailModal';
import { resolveApplyUrl } from '../../utils/referralLinks';
import { shareContent } from '../../utils/shareHelper';

interface JobsBoardProps {
  savedJobIds: string[];
  postedJobs: JobListing[];
  jobNotes: Record<string, string>;
  viewMode: 'all' | 'saved';
  onChangeViewMode: (mode: 'all' | 'saved') => void;
  onToggleSave: (jobId: string) => void;
  onUpdateJobNote: (jobId: string, note: string) => void;
  onOpenPostJob: () => void;
}

const CATEGORIES: Array<'All' | JobCategory> = [
  'All',
  'AI Training & RLHF',
  'Prompt Engineering',
  'Audio & Voice AI',
  'AI Evaluation',
  'AI Safety',
  'AI Operations',
  'Engineering',
  'Developer Relations',
  'Design & UI',
];

const ROLE_TYPES: Array<'All' | JobRoleLevel> = [
  'All',
  'Full-time',
  'Contract',
  'Freelance',
  'Part-time',
];

const REGIONS: Array<'All' | RemoteRegion> = [
  'All',
  'Worldwide',
  'Americas',
  'Europe / EMEA',
  'US Only',
  'APAC',
];

const PAY_THRESHOLDS = [
  { label: 'Any Pay', minUsd: 0 },
  { label: '$50k+ / yr eq.', minUsd: 50000 },
  { label: '$90k+ / yr eq.', minUsd: 90000 },
  { label: '$140k+ / yr eq.', minUsd: 140000 },
  { label: '$180k+ / yr eq.', minUsd: 180000 },
];

type QuickFilterKey =
  | 'entry-level'
  | 'pay-shown'
  | 'contract'
  | 'full-time'
  | 'ph-apac';

const QUICK_FILTERS: Array<{ key: QuickFilterKey; label: string }> = [
  { key: 'entry-level', label: 'Entry Level' },
  { key: 'pay-shown', label: 'Pay Shown' },
  { key: 'contract', label: 'Contract' },
  { key: 'full-time', label: 'Full-Time' },
  { key: 'ph-apac', label: 'PH / APAC Friendly' },
];

const INITIAL_JOBS_COUNT = 9;
const JOBS_PAGE_STEP = 9;

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function normalizeRemotiveType(rawType?: string): JobRoleLevel {
  const lower = (rawType || '').toLowerCase();
  if (lower.includes('contract')) return 'Contract';
  if (lower.includes('part')) return 'Part-time';
  if (lower.includes('freelance')) return 'Freelance';
  return 'Full-time';
}

export const JobsBoard: React.FC<JobsBoardProps> = ({
  savedJobIds,
  postedJobs,
  jobNotes,
  viewMode,
  onChangeViewMode,
  onToggleSave,
  onUpdateJobNote,
  onOpenPostJob,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | JobCategory>(
    'All'
  );
  const [selectedType, setSelectedType] = useState<'All' | JobRoleLevel>('All');
  const [selectedRegion, setSelectedRegion] = useState<'All' | RemoteRegion>(
    'All'
  );
  const [minPayUsd, setMinPayUsd] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'curated' | 'highest-pay'>('curated');
  const [entryLevelOnly, setEntryLevelOnly] = useState(false);
  const [payShownOnly, setPayShownOnly] = useState(false);
  const [apacFriendlyOnly, setApacFriendlyOnly] = useState(false);
  const [visibleJobCount, setVisibleJobCount] =
    useState<number>(INITIAL_JOBS_COUNT);
  const [activeJob, setActiveJob] = useState<JobListing | null>(null);

  const [liveAtsJobs, setLiveAtsJobs] = useState<JobListing[]>([]);
  const [atsSyncStatus, setAtsSyncStatus] = useState<
    'idle' | 'syncing' | 'synced' | 'offline'
  >('idle');

  const syncLiveAtsFeeds = async (signal?: AbortSignal) => {
    setAtsSyncStatus('syncing');
    try {
      const [remotiveRes, jobicyRes] = await Promise.allSettled([
        fetch(
          'https://remotive.com/api/remote-jobs?category=software-dev&limit=6',
          { signal }
        ),
        fetch(
          'https://jobicy.com/api/v2/remote-jobs?count=6&industry=tech',
          { signal }
        ),
      ]);

      const synced: JobListing[] = [];

      if (remotiveRes.status === 'fulfilled' && remotiveRes.value.ok) {
        const data = (await remotiveRes.value.json()) as {
          jobs?: Array<{
            id: number;
            title: string;
            company_name: string;
            salary?: string;
            candidate_required_location?: string;
            job_type?: string;
            publication_date?: string;
            url: string;
          }>;
        };
        for (const item of (data.jobs || []).slice(0, 6)) {
          const pay = item.salary?.trim() || 'USD Salary (ATS)';
          synced.push({
            id: `remotive-${item.id}`,
            title: item.title,
            company: item.company_name,
            category: 'Engineering',
            payRange: pay,
            location: item.candidate_required_location || 'Remote (Worldwide)',
            type: normalizeRemotiveType(item.job_type),
            source: 'Live ATS · Remotive',
            postedAt: (item.publication_date || '').slice(0, 10) || 'Live',
            applyUrl: resolveApplyUrl(item.company_name, item.url),
            companyDomain: resolveBrandDomain(item.company_name),
            region: 'Worldwide',
            payMinUsd: item.salary ? 80000 : 0,
            payMaxUsd: item.salary ? 150000 : 0,
            summary: `Live synced remote opening at ${item.company_name} via Remotive ATS.`,
            stack: ['Live ATS', 'Remote', 'Software Engineering'],
            responsibilities: [
              `Collaborate remotely with ${item.company_name} product and engineering teams.`,
              'Review full job specification directly on the employer ATS page.',
            ],
            requirements: [
              `Remote eligibility in ${item.candidate_required_location || 'listed regions'}.`,
            ],
            timezoneNote: item.candidate_required_location || 'Remote',
          });
        }
      }

      if (jobicyRes.status === 'fulfilled' && jobicyRes.value.ok) {
        const data = (await jobicyRes.value.json()) as {
          jobs?: Array<{
            id: number;
            jobTitle: string;
            companyName: string;
            annualSalaryMin?: string;
            annualSalaryMax?: string;
            salaryCurrency?: string;
            jobGeo?: string;
            jobType?: string[];
            pubDate?: string;
            url: string;
          }>;
        };
        for (const item of (data.jobs || []).slice(0, 6)) {
          const minNum = Number(item.annualSalaryMin || 0);
          const maxNum = Number(item.annualSalaryMax || 0);
          const hasPay = minNum > 0 || maxNum > 0;
          const payRange = hasPay
            ? `$${Math.round((minNum || maxNum) / 1000)}k - $${Math.round((maxNum || minNum) / 1000)}k / yr`
            : 'Competitive Remote Pay';
          synced.push({
            id: `jobicy-${item.id}`,
            title: item.jobTitle,
            company: item.companyName,
            category: 'AI Operations',
            payRange,
            location: item.jobGeo || 'Remote (Worldwide)',
            type: normalizeRemotiveType(item.jobType?.[0]),
            source: 'Live ATS · Jobicy',
            postedAt: (item.pubDate || '').slice(0, 10) || 'Live',
            applyUrl: resolveApplyUrl(item.companyName, item.url),
            companyDomain: resolveBrandDomain(item.companyName),
            region: 'Worldwide',
            payMinUsd: minNum,
            payMaxUsd: maxNum,
            summary: `Live synced remote tech opening at ${item.companyName} via Jobicy ATS.`,
            stack: ['Live ATS', 'Tech', item.jobGeo || 'Worldwide'],
            responsibilities: [
              `Contribute remotely to ${item.companyName} operations and delivery.`,
            ],
            requirements: [`Eligible in ${item.jobGeo || 'Worldwide'}.`],
            timezoneNote: item.jobGeo || 'Remote',
          });
        }
      }

      if (synced.length > 0) {
        setLiveAtsJobs(synced);
        setAtsSyncStatus('synced');
      } else {
        setAtsSyncStatus('offline');
      }
    } catch {
      setAtsSyncStatus('offline');
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    syncLiveAtsFeeds(controller.signal);
    return () => controller.abort();
  }, []);

  // Reset pagination back to initial 9 rows whenever filter criteria change
  useEffect(() => {
    setVisibleJobCount(INITIAL_JOBS_COUNT);
  }, [
    searchQuery,
    selectedCategory,
    selectedType,
    selectedRegion,
    minPayUsd,
    payShownOnly,
    entryLevelOnly,
    apacFriendlyOnly,
    sortBy,
    viewMode,
  ]);

  const allJobs = useMemo(
    () => [...postedJobs, ...REMOTE_JOBS, ...liveAtsJobs],
    [postedJobs, liveAtsJobs]
  );

  // Auto-open shared job modal if visited via ?job=<id>
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sharedJobId = new URLSearchParams(window.location.search).get('job');
    if (!sharedJobId) return;
    const matched = allJobs.find((j) => j.id === sharedJobId);
    if (matched) {
      setActiveJob(matched);
    }
  }, [allJobs]);

  const featuredJobs = useMemo(() => {
    const picks: JobListing[] = [...postedJobs.slice(0, 2)];
    for (const job of REMOTE_JOBS) {
      if (job.featured && !picks.some((p) => p.id === job.id)) {
        picks.push(job);
      }
      if (picks.length >= 4) break;
    }
    const preferredIds = [
      'curated-001',
      'curated-005',
      'curated-002',
      'curated-003',
    ];
    for (const id of preferredIds) {
      if (picks.length >= 4) break;
      const found = REMOTE_JOBS.find((j) => j.id === id);
      if (found && !picks.some((p) => p.id === found.id)) {
        picks.push(found);
      }
    }
    return picks.slice(0, 4);
  }, [postedJobs]);

  const heroPreviewCards = useMemo(() => featuredJobs.slice(0, 3), [featuredJobs]);

  const savedSet = useMemo(() => new Set(savedJobIds), [savedJobIds]);

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matched = allJobs.filter((job) => {
      if (viewMode === 'saved' && !savedSet.has(job.id)) {
        return false;
      }
      if (selectedCategory !== 'All' && job.category !== selectedCategory) {
        return false;
      }
      if (selectedType !== 'All' && job.type !== selectedType) {
        return false;
      }
      if (selectedRegion !== 'All' && job.region !== selectedRegion) {
        return false;
      }
      if (minPayUsd > 0 && job.payMaxUsd < minPayUsd) {
        return false;
      }
      if (payShownOnly && !job.payRange.includes('$')) {
        return false;
      }
      if (entryLevelOnly) {
        const lowerTitle = `${job.title} ${job.category} ${job.type}`.toLowerCase();
        const isEntry =
          lowerTitle.includes('trainer') ||
          lowerTitle.includes('bilingual') ||
          lowerTitle.includes('specialist') ||
          lowerTitle.includes('associate') ||
          lowerTitle.includes('junior') ||
          lowerTitle.includes('entry') ||
          lowerTitle.includes('freelance');
        if (!isEntry) return false;
      }
      if (apacFriendlyOnly) {
        const loc = `${job.location} ${job.region}`.toLowerCase();
        const isApacFriendly =
          loc.includes('worldwide') ||
          loc.includes('global') ||
          loc.includes('apac') ||
          loc.includes('ph');
        if (!isApacFriendly) return false;
      }
      if (query) {
        const haystack = [
          job.title,
          job.company,
          job.category,
          job.location,
          job.type,
          job.summary,
          job.source,
          ...job.stack,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === 'highest-pay') {
      return [...matched].sort((a, b) => b.payMaxUsd - a.payMaxUsd);
    }
    return matched;
  }, [
    allJobs,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedRegion,
    minPayUsd,
    payShownOnly,
    entryLevelOnly,
    apacFriendlyOnly,
    sortBy,
    viewMode,
    savedSet,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedType !== 'All' ||
    selectedRegion !== 'All' ||
    minPayUsd > 0 ||
    entryLevelOnly ||
    payShownOnly ||
    apacFriendlyOnly;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedRegion('All');
    setMinPayUsd(0);
    setEntryLevelOnly(false);
    setPayShownOnly(false);
    setApacFriendlyOnly(false);
    setSortBy('curated');
  };

  const isQuickFilterActive = (key: QuickFilterKey): boolean => {
    switch (key) {
      case 'entry-level':
        return entryLevelOnly;
      case 'pay-shown':
        return payShownOnly;
      case 'contract':
        return selectedType === 'Contract';
      case 'full-time':
        return selectedType === 'Full-time';
      case 'ph-apac':
        return apacFriendlyOnly;
    }
  };

  const toggleQuickFilter = (key: QuickFilterKey) => {
    switch (key) {
      case 'entry-level':
        setEntryLevelOnly((prev) => !prev);
        break;
      case 'pay-shown':
        setPayShownOnly((prev) => !prev);
        break;
      case 'contract':
        setSelectedType((prev) => (prev === 'Contract' ? 'All' : 'Contract'));
        break;
      case 'full-time':
        setSelectedType((prev) => (prev === 'Full-time' ? 'All' : 'Full-time'));
        break;
      case 'ph-apac':
        setApacFriendlyOnly((prev) => !prev);
        break;
    }
  };

  // Paginated visible slice (9 jobs initially, +9 per Show more click)
  const visibleJobs = useMemo(
    () => filteredJobs.slice(0, visibleJobCount),
    [filteredJobs, visibleJobCount]
  );
  const remainingJobsCount = Math.max(0, filteredJobs.length - visibleJobs.length);
  const allJobsShown = remainingJobsCount === 0 && filteredJobs.length > INITIAL_JOBS_COUNT;

  // Chunk visible jobs in groups of 9 so one manual <AdBanner /> renders cleanly after every 9 rows
  const jobChunks = useMemo(() => chunkArray(visibleJobs, 9), [visibleJobs]);

  return (
    <section aria-labelledby="jobs-heading" className="space-y-10">
      {/* 1. SPLIT-SCREEN EDITORIAL HERO BANNER */}
      <div className="grid grid-cols-1 items-center gap-8 border-b border-cyan-500/15 pb-10 lg:grid-cols-12 lg:gap-10">
        {/* Left Side: Serif Headline, Live Count, Integrated Search & Quick Filters */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
            <span className="text-cyan-400 font-semibold uppercase tracking-wider">
              Editorial AI Board
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-semibold text-emerald-400 tabular-nums">
              {allJobs.length} Active Remote Roles
            </span>
            <span aria-hidden="true">·</span>
            <span>Transparent USD Pay</span>
          </div>

          <h1
            id="jobs-heading"
            className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.35rem] text-balance"
          >
            Remote AI & Tech Jobs, Delivered Daily.
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Curated RLHF, prompt engineering, voice AI, and full-stack software openings across{' '}
            <strong className="font-mono text-emerald-400 tabular-nums">
              {allJobs.length}
            </strong>{' '}
            verified roles with direct employer ATS links and zero middlemen.
          </p>

          {/* Integrated Search + Primary Electric Cyan CTA */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search role, company, or AI skill..."
                aria-label="Search jobs by role, company, or skill"
                className="h-12 w-full rounded-xl border border-cyan-500/20 bg-slate-900/75 pr-3.5 pl-10 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-xl focus:border-cyan-400/60 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={onOpenPostJob}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 shadow-[0_4px_18px_rgba(6,182,212,0.28)] transition-colors hover:bg-cyan-300 whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Post a Job</span>
            </button>
          </div>

          {/* Quick Filter Pills (Indigo-Violet secondary active accent) */}
          <div
            aria-label="Quick job filters"
            className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade px-1 pr-8 pb-1 sm:px-0 sm:pr-0"
          >
            {QUICK_FILTERS.map((pill) => {
              const active = isQuickFilterActive(pill.key);
              return (
                <button
                  key={pill.key}
                  type="button"
                  onClick={(e) => {
                    toggleQuickFilter(pill.key);
                    if (window.innerWidth <= 768) {
                      e.currentTarget.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest',
                      });
                    }
                  }}
                  aria-pressed={active}
                  className={`snap-center shrink-0 whitespace-nowrap min-h-[38px] rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'border-indigo-400/50 bg-indigo-500/25 text-indigo-200 font-semibold shadow-sm'
                      : 'border-cyan-500/15 bg-slate-900/75 text-slate-300 hover:border-cyan-400/40 hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Staggered Floating Stack of 3 Featured Job Preview Cards */}
        <div className="lg:col-span-5">
          <div className="space-y-3">
            {heroPreviewCards.map((job, idx) => {
              const offsetClass =
                idx === 0
                  ? 'lg:translate-x-2'
                  : idx === 1
                  ? 'lg:-translate-x-3'
                  : 'lg:translate-x-3';
              return (
                <div
                  key={job.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveJob(job)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveJob(job);
                    }
                  }}
                  className={`w-full cursor-pointer text-left rounded-2xl border border-cyan-500/15 bg-slate-900/75 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${offsetClass}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <BrandAvatar name={job.company} domain={job.companyDomain} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-200 truncate">
                            {job.company}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="rounded bg-cyan-400 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-950">
                            Featured
                          </span>
                        </div>
                        <p className="mt-0.5 truncate font-serif text-base font-semibold text-white">
                          {job.title}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                        {job.payRange}
                      </p>
                      <div className="mt-1 flex items-center justify-end gap-2 text-[11px]">
                        <span className="text-slate-500">{job.type}</span>
                        <a
                          href={resolveApplyUrl(job.company, job.applyUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-semibold text-cyan-300 transition-colors hover:text-cyan-200 whitespace-nowrap"
                        >
                          View Role ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. HIGH-CONTRAST FEATURED JOBS SPOTLIGHT (4-CARD ROW) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Featured Spotlight
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-white sm:text-3xl">
              Top Transparent-Pay Openings
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Hand-verified hourly & salaried remote contracts
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredJobs.map((job) => {
            const isSaved = savedSet.has(job.id);
            return (
              <article
                key={`featured-${job.id}`}
                className="flex flex-col justify-between rounded-2xl border border-cyan-500/20 bg-slate-900/75 p-5 text-slate-100 backdrop-blur-xl shadow-[0_14px_34px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <BrandAvatar name={job.company} domain={job.companyDomain} />
                    <span className="rounded-md bg-cyan-400 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-950">
                      FEATURED
                    </span>
                  </div>

                  <p className="mt-3.5 text-xs font-semibold text-slate-300">
                    {job.company}
                    <span aria-hidden="true" className="mx-1.5 text-slate-500">
                      ·
                    </span>
                    <span className="text-slate-400 font-normal">{job.type}</span>
                  </p>

                  <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-white">
                    <button
                      type="button"
                      onClick={() => setActiveJob(job)}
                      className="text-left transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                    >
                      {job.title}
                    </button>
                  </h3>

                  <p className="mt-2 font-mono text-sm font-bold text-emerald-400 tabular-nums">
                    {job.payRange}
                  </p>

                  <p className="mt-1.5 text-xs text-slate-400">{job.location}</p>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-cyan-500/15 pt-3">
                  <button
                    type="button"
                    onClick={() => onToggleSave(job.id)}
                    aria-pressed={isSaved}
                    aria-label={
                      isSaved
                        ? `Remove ${job.title} from saved`
                        : `Save ${job.title}`
                    }
                    className={`inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      isSaved
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20'
                        : 'border-cyan-500/20 bg-slate-800/70 text-slate-300 hover:border-cyan-400/45 hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark
                      className={`h-3.5 w-3.5 ${
                        isSaved ? 'fill-emerald-400 text-emerald-400' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const origin =
                        typeof window !== 'undefined'
                          ? window.location.origin
                          : 'https://planetaihub.com';
                      void shareContent({
                        title: `${job.title} at ${job.company}`,
                        text: `${job.title} at ${job.company} (${job.payRange})`,
                        url: `${origin}/?job=${encodeURIComponent(job.id)}`,
                      });
                    }}
                    aria-label={`Share ${job.title} at ${job.company}`}
                    className="inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition-colors hover:bg-white/[0.1] hover:text-cyan-300"
                  >
                    <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <a
                    href={resolveApplyUrl(job.company, job.applyUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-xl bg-cyan-400 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300 whitespace-nowrap"
                  >
                    View Role ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 3. DIRECTORY CONTROLS: VIEW SWITCHER, CATEGORY STRIP & FACET FILTERS */}
      <div className="space-y-4 border-t border-cyan-500/15 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Live Directory
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-white sm:text-3xl">
              All Remote AI & Tech Positions
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => syncLiveAtsFeeds()}
              disabled={atsSyncStatus === 'syncing'}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-cyan-500/20 bg-slate-900/75 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-xl transition-colors hover:border-emerald-400/50 hover:text-emerald-300 disabled:opacity-60 whitespace-nowrap"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-emerald-400 ${
                  atsSyncStatus === 'syncing' ? 'animate-spin' : ''
                }`}
                aria-hidden="true"
              />
              <span>
                {atsSyncStatus === 'syncing'
                  ? 'Syncing ATS...'
                  : liveAtsJobs.length > 0
                  ? `Live ATS (${liveAtsJobs.length})`
                  : 'Sync Live ATS'}
              </span>
            </button>

            <div className="rounded-xl border border-cyan-500/15 bg-slate-900/75 backdrop-blur-xl shrink-0">
              <div
                role="tablist"
                aria-label="Job board views"
                className="flex items-center gap-1 overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade p-1 max-md:px-3 max-md:pr-8"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'all'}
                  onClick={(e) => {
                    onChangeViewMode('all');
                    if (window.innerWidth <= 768) {
                      e.currentTarget.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest',
                      });
                    }
                  }}
                  className={`snap-center min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    viewMode === 'all'
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({allJobs.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'saved'}
                  onClick={(e) => {
                    onChangeViewMode('saved');
                    if (window.innerWidth <= 768) {
                      e.currentTarget.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest',
                      });
                    }
                  }}
                  className={`snap-center min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    viewMode === 'saved'
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Saved ({savedJobIds.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontally Scrollable Category Strip */}
        <div
          aria-label="Filter by category"
          className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade px-3 pr-8 pb-1 md:px-0 md:pr-0"
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={(e) => {
                  setSelectedCategory(category);
                  if (window.innerWidth <= 768) {
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    });
                  }
                }}
                className={`snap-center min-h-[40px] rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-sm'
                    : 'border-indigo-400/30 bg-indigo-500/20 text-indigo-300 hover:border-cyan-400/40 hover:text-white'
                }`}
              >
                {category === 'All' ? 'All Categories' : category}
              </button>
            );
          })}
        </div>

        {/* Multi-Facet Select Filter Bar */}
        <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/75 p-4 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            <select
              aria-label="Filter by employment type"
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as 'All' | JobRoleLevel)
              }
              className="input-obsidian h-11 w-full px-3 text-sm font-medium"
            >
              {ROLE_TYPES.map((role) => (
                <option key={role} value={role}>
                  {role === 'All' ? 'All Employment Types' : role}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by minimum pay range"
              value={minPayUsd}
              onChange={(e) => setMinPayUsd(Number(e.target.value))}
              className="input-obsidian h-11 w-full px-3 text-sm font-medium"
            >
              {PAY_THRESHOLDS.map((tier) => (
                <option key={tier.minUsd} value={tier.minUsd}>
                  {tier.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by remote region"
              value={selectedRegion}
              onChange={(e) =>
                setSelectedRegion(e.target.value as 'All' | RemoteRegion)
              }
              className="input-obsidian h-11 w-full px-3 text-sm font-medium"
            >
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region === 'All' ? 'All Regions' : region}
                </option>
              ))}
            </select>

            <select
              aria-label="Sort job listings"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'curated' | 'highest-pay')
              }
              className="input-obsidian h-11 w-full px-3 text-sm font-medium"
            >
              <option value="curated">Sort: Editorial Curated</option>
              <option value="highest-pay">Sort: Highest Pay</option>
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-cyan-500/15 pt-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                className="h-3.5 w-3.5 text-cyan-400"
                aria-hidden="true"
              />
              <span>
                Showing{' '}
                <strong className="font-mono font-semibold text-white tabular-nums">
                  {visibleJobs.length}
                </strong>{' '}
                of{' '}
                <strong className="font-mono font-semibold text-emerald-400 tabular-nums">
                  {filteredJobs.length}
                </strong>{' '}
                {filteredJobs.length === 1 ? 'role' : 'roles'}
                {viewMode === 'saved' ? ' in saved shortlist' : ''}
              </span>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. SCANNABLE COMPACT JOB DIRECTORY ROWS (9 INITIAL + PAGINATED + ADBANNER AFTER EVERY 9 ROWS) */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/75 px-6 py-14 text-center backdrop-blur-xl">
          <h3 className="font-serif text-xl font-semibold text-white">
            {viewMode === 'saved'
              ? 'No saved jobs yet'
              : 'No matching remote roles found'}
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-400">
            {viewMode === 'saved'
              ? 'Bookmark any role below to keep a private shortlist with personal notes.'
              : 'Try broadening your pay threshold, switching remote regions, or clearing active filters.'}
          </p>
          <div className="mt-5 flex justify-center">
            {viewMode === 'saved' ? (
              <button
                type="button"
                onClick={() => onChangeViewMode('all')}
                className="min-h-[44px] rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Browse All Jobs
              </button>
            ) : (
              <button
                type="button"
                onClick={resetFilters}
                className="min-h-[44px] rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Clear All Filters
              </button>
            )}
          </div>
          <AdBanner />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2.5">
            {jobChunks.map((chunk, chunkIdx) => {
              const isFullNineChunk = chunk.length === 9;
              const isLastChunk = chunkIdx === jobChunks.length - 1;
              const shouldShowBannerAfterChunk = isFullNineChunk || isLastChunk;

              return (
                <React.Fragment key={`chunk-${chunkIdx}`}>
                  <div className="space-y-2.5">
                    {chunk.map((job, rowIdx) => {
                      const isSaved = savedSet.has(job.id);
                      const hasNote = Boolean(jobNotes[job.id]?.trim());
                      const isFeatured =
                        Boolean(job.featured) ||
                        job.id.startsWith('employer-') ||
                        (chunkIdx === 0 && rowIdx < 4);
                      const isLiveAts = job.source.startsWith('Live ATS');
                      const isNew =
                        job.id.startsWith('employer-') ||
                        isLiveAts ||
                        job.postedAt >= '2026-11-20';

                      return (
                        <article
                          key={job.id}
                          className="flex flex-col gap-3.5 rounded-xl border border-cyan-500/15 bg-slate-900/75 p-4 backdrop-blur-xl transition-all duration-200 hover:border-cyan-400/40 hover:bg-slate-900 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)] md:flex-row md:items-center md:justify-between"
                        >
                          {/* Left & Middle: Brand Logo + Title, Tags & Metadata */}
                          <div className="flex min-w-0 items-start gap-3.5 md:items-center">
                            <BrandAvatar name={job.company} domain={job.companyDomain} />

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-serif text-lg font-semibold leading-snug text-white">
                                  <button
                                    type="button"
                                    onClick={() => setActiveJob(job)}
                                    className="text-left transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                                  >
                                    {job.title}
                                  </button>
                                </h3>

                                {isNew && (
                                  <span className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                                    NEW
                                  </span>
                                )}
                                {isFeatured && (
                                  <span className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider bg-cyan-400 text-slate-950">
                                    FEATURED
                                  </span>
                                )}
                                <span className="rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                  {isLiveAts ? 'LIVE ATS' : 'CURATED ATS'}
                                </span>
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                                <span className="font-medium text-slate-200">
                                  {job.company}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{job.location}</span>
                                <span aria-hidden="true">·</span>
                                <span>{job.type}</span>
                                <span aria-hidden="true">·</span>
                                <span>{job.category}</span>
                                {hasNote && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-cyan-300">
                                      Note saved
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right: Pay Rate + Save Bookmark + Apply Button */}
                          <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-cyan-500/15 pt-3 md:shrink-0 md:justify-end md:border-t-0 md:pt-0">
                            <span className="font-mono text-sm font-semibold text-emerald-400 tabular-nums md:mr-2">
                              {job.payRange}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onToggleSave(job.id)}
                                aria-pressed={isSaved}
                                aria-label={
                                  isSaved
                                    ? `Remove ${job.title} from saved`
                                    : `Save ${job.title}`
                                }
                                className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                                  isSaved
                                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20'
                                    : 'border-cyan-500/20 bg-slate-800/70 text-slate-200 hover:border-cyan-400/45 hover:bg-slate-800'
                                }`}
                              >
                                <Bookmark
                                  className={`h-3.5 w-3.5 ${
                                    isSaved
                                      ? 'fill-emerald-400 text-emerald-400'
                                      : ''
                                  }`}
                                  aria-hidden="true"
                                />
                                <span>{isSaved ? 'Saved' : 'Save'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const origin =
                                    typeof window !== 'undefined'
                                      ? window.location.origin
                                      : 'https://planetaihub.com';
                                  void shareContent({
                                    title: `${job.title} at ${job.company}`,
                                    text: `${job.title} at ${job.company} (${job.payRange})`,
                                    url: `${origin}/?job=${encodeURIComponent(job.id)}`,
                                  });
                                }}
                                aria-label={`Share ${job.title} at ${job.company}`}
                                className="inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition-colors hover:bg-white/[0.1] hover:text-cyan-300"
                              >
                                <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>

                              <a
                                href={resolveApplyUrl(job.company, job.applyUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-cyan-400 px-4 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300 whitespace-nowrap"
                              >
                                Apply Now ↗
                              </a>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {shouldShowBannerAfterChunk && <AdBanner />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Centered Show More (X remaining) / Show Less Pagination Pill */}
          {(remainingJobsCount > 0 || allJobsShown) && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  if (allJobsShown) {
                    setVisibleJobCount(INITIAL_JOBS_COUNT);
                  } else {
                    setVisibleJobCount((prev) =>
                      Math.min(filteredJobs.length, prev + JOBS_PAGE_STEP)
                    );
                  }
                }}
                className="bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-full px-6 py-2.5 text-sm font-medium transition-colors shadow-md"
              >
                {allJobsShown
                  ? 'Show less'
                  : `Show more (${remainingJobsCount} remaining)`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. EDITORIAL PHOTO-OVERLAY AI NEWS & BRIEFINGS SECTION */}
      <EditorialBriefings />

      <JobDetailModal
        job={activeJob}
        isSaved={activeJob ? savedSet.has(activeJob.id) : false}
        personalNote={activeJob ? jobNotes[activeJob.id] || '' : ''}
        onToggleSave={onToggleSave}
        onUpdateNote={onUpdateJobNote}
        onClose={() => setActiveJob(null)}
      />
    </section>
  );
};
