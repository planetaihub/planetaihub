import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { JobCategory, JobListing, JobRoleLevel, RemoteRegion } from '../types';
import { BrandAvatar, resolveBrandDomain } from './BrandAvatar';
import {
  MICRO1_COMPANY_REFERRAL_URL,
  resolveApplyUrl,
} from '../utils/referralLinks';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishJob: (job: JobListing) => void;
}

const JOB_CATEGORIES: JobCategory[] = [
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

const ROLE_LEVELS: JobRoleLevel[] = [
  'Full-time',
  'Contract',
  'Freelance',
  'Part-time',
];

const REGIONS: RemoteRegion[] = [
  'Worldwide',
  'APAC',
  'Americas',
  'Europe / EMEA',
  'US Only',
];

function parseAnnualPay(payRange: string): { minUsd: number; maxUsd: number } {
  const matches = payRange.match(/[\d,]+/g) || [];
  const nums = matches
    .map((m) => Number(m.replace(/,/g, '')))
    .filter((n) => !Number.isNaN(n) && n > 0);
  const multiplier = payRange.toLowerCase().includes('/ hr') ? 2080 : 1;
  if (nums.length === 0) return { minUsd: 80000, maxUsd: 120000 };
  if (nums.length === 1) return { minUsd: nums[0] * multiplier, maxUsd: nums[0] * multiplier };
  return { minUsd: nums[0] * multiplier, maxUsd: nums[1] * multiplier };
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onPublishJob,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState<JobCategory>('AI Training & RLHF');
  const [type, setType] = useState<JobRoleLevel>('Contract');
  const [region, setRegion] = useState<RemoteRegion>('Worldwide');
  const [payRange, setPayRange] = useState('$45 - $70 / hr');
  const [location, setLocation] = useState('Remote (Worldwide)');
  const [applyUrl, setApplyUrl] = useState('https://');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedCompany = company.trim();
    const trimmedPay = payRange.trim();
    const trimmedUrl = applyUrl.trim();

    if (!trimmedTitle || !trimmedCompany || !trimmedPay) {
      setError('Please enter a role title, company name, and transparent USD pay range.');
      return;
    }
    if (!/^https?:\/\/.+/i.test(trimmedUrl)) {
      setError('Please provide a valid direct ATS or careers URL starting with https://');
      return;
    }

    const { minUsd, maxUsd } = parseAnnualPay(trimmedPay);

    const newJob: JobListing = {
      id: `employer-${Date.now()}`,
      title: trimmedTitle,
      company: trimmedCompany,
      category,
      payRange: trimmedPay,
      location: location.trim() || `Remote (${region})`,
      type,
      source: 'Featured Employer',
      postedAt: new Date().toISOString().slice(0, 10),
      applyUrl: resolveApplyUrl(trimmedCompany, trimmedUrl),
      companyDomain: resolveBrandDomain(trimmedCompany),
      region,
      payMinUsd: minUsd,
      payMaxUsd: maxUsd,
      summary:
        summary.trim() ||
        `Direct remote ${category.toLowerCase()} opportunity with transparent USD compensation at ${trimmedCompany}.`,
      stack: [category, type, region, 'Transparent Pay'],
      responsibilities: [
        `Lead ${category.toLowerCase()} deliverables asynchronously across distributed teams.`,
        `Maintain high accuracy, clean documentation, and timely milestone execution.`,
      ],
      requirements: [
        `Proven experience in ${category} or closely related AI/software work.`,
        `Eligibility for ${location.trim() || region} remote work.`,
      ],
      timezoneNote: `${location.trim() || region} · ${type}`,
    };

    onPublishJob(newJob);
    setTitle('');
    setCompany('');
    setSummary('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-job-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-cyan-500/20 bg-slate-900/95 p-6 text-slate-100 shadow-2xl backdrop-blur-xl sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cyan-500/15 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              For Employers · team@planetaihub.com
            </p>
            <h2
              id="post-job-title"
              className="mt-1 font-serif text-2xl font-semibold text-white"
            >
              Post a Remote Role
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Every PlanetAI Hub listing requires transparent USD pay and a direct ATS link.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Post a Job modal"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-cyan-500/20 bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Role Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Staff AI Evaluation Engineer"
                className="input-obsidian mt-1.5 h-11 w-full px-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Company Name *
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Anthropic"
                className="input-obsidian mt-1.5 h-11 w-full px-3 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Transparent USD Pay *
              </label>
              <input
                type="text"
                value={payRange}
                onChange={(e) => setPayRange(e.target.value)}
                placeholder="$45 - $70 / hr or $140k - $180k"
                className="input-obsidian mt-1.5 h-11 w-full px-3 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="input-obsidian mt-1.5 h-11 w-full px-3 text-sm"
              >
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as JobRoleLevel)}
                className="input-obsidian mt-1.5 h-11 w-full px-3 text-sm"
              >
                {ROLE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as RemoteRegion)}
                className="input-obsidian mt-1.5 h-11 w-full px-3 text-sm"
              >
                {REGIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Location Label
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote (Worldwide)"
                className="input-obsidian mt-1.5 h-11 w-full px-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              Direct ATS / Apply URL *
            </label>
            <input
              type="url"
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              placeholder="https://jobs.lever.co/..."
              className="input-obsidian mt-1.5 h-11 w-full px-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              Brief Role Summary
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Core focus, timezone overlap, and rubric deliverables..."
              className="input-obsidian mt-1.5 w-full px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-cyan-500/15 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-xl border border-cyan-500/20 bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] rounded-xl bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-md transition-colors hover:bg-cyan-300"
            >
              Publish to Board
            </button>
          </div>

          <a
            href={MICRO1_COMPANY_REFERRAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-left transition-all duration-200 hover:border-cyan-400/45 hover:bg-slate-950/90"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <BrandAvatar name="micro1" domain="micro1.ai" size="xs" />
              <span className="text-xs font-medium text-cyan-300 hover:text-cyan-200">
                Hiring AI Talent? Source Pre-Vetted Engineers via micro1 →
              </span>
            </div>
          </a>
        </form>
      </div>
    </div>
  );
};
