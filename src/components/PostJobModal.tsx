import React, { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Sparkles, X } from 'lucide-react';
import type { JobCategory, JobListing, JobRoleLevel, RemoteRegion } from '../types';
import { BrandAvatar, resolveBrandDomain } from './BrandAvatar';
import { resolveApplyUrl } from '../utils/referralLinks';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishJob: (job: JobListing) => void;
}

const PAYPAL_FEATURED_URL = 'https://paypal.com';
const CONTACT_EMAIL = 'team@planetaihub.com';

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
  const [tier, setTier] = useState<'standard' | 'featured'>('featured');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [employerEmail, setEmployerEmail] = useState('');
  const [category, setCategory] = useState<JobCategory>('AI Training & RLHF');
  const [type, setType] = useState<JobRoleLevel>('Contract');
  const [region, setRegion] = useState<RemoteRegion>('Worldwide');
  const [payRange, setPayRange] = useState('$45 - $70 / hr');
  const [location, setLocation] = useState('Remote (Worldwide)');
  const [applyUrl, setApplyUrl] = useState('https://');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTier, setSubmittedTier] = useState<'standard' | 'featured' | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSubmittedTier(null);
        setError('');
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setSubmittedTier(null);
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedCompany = company.trim();
    const trimmedPay = payRange.trim();
    const trimmedUrl = applyUrl.trim();
    const trimmedEmail = employerEmail.trim();

    if (!trimmedTitle || !trimmedCompany || !trimmedPay) {
      setError('Please enter a role title, company name, and transparent USD pay range.');
      return;
    }
    if (!/^https?:\/\/.+/i.test(trimmedUrl)) {
      setError('Please provide a valid direct ATS or careers URL starting with https://');
      return;
    }

    setError('');
    setSubmitting(true);

    const { minUsd, maxUsd } = parseAnnualPay(trimmedPay);
    const isFeatured = tier === 'featured';

    const newJob: JobListing = {
      id: `employer-${Date.now()}`,
      title: trimmedTitle,
      company: trimmedCompany,
      category,
      payRange: trimmedPay,
      location: location.trim() || `Remote (${region})`,
      type,
      source: isFeatured ? 'Featured Spotlight' : 'Featured Employer',
      postedAt: new Date().toISOString().slice(0, 10),
      applyUrl: resolveApplyUrl(trimmedCompany, trimmedUrl),
      companyDomain: resolveBrandDomain(trimmedCompany),
      region,
      payMinUsd: minUsd,
      payMaxUsd: maxUsd,
      featured: isFeatured,
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

    try {
      await fetch(`https://formsubmit.co{CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[PlanetAI Hub] ${isFeatured ? 'FEATURED ($29) ' : 'Free '}Job Submission: ${trimmedTitle} @ ${trimmedCompany}`,
          tier: isFeatured ? 'Featured Spotlight ($29 USD / 30 days)' : 'Standard Listing ($0 Free)',
          employer_email: trimmedEmail || 'Not provided',
          company: trimmedCompany,
          title: trimmedTitle,
          pay_range: trimmedPay,
          category,
          type,
          region,
          apply_url: trimmedUrl,
          ready_to_paste_json: JSON.stringify(newJob, null, 2),
        }),
      });
    } catch {
      // Non-blocking fallback
    }

    setSubmitting(false);
    setSubmittedTier(tier);

    if (isFeatured) {
      window.open(PAYPAL_FEATURED_URL, '_blank', 'noopener,noreferrer');
    }

    setTitle('');
    setCompany('');
    setEmployerEmail('');
    setSummary('');
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-job-title"
      onClick={handleResetAndClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-cyan-500/20 bg-slate-900/95 p-6 text-slate-100 shadow-2xl backdrop-blur-xl sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cyan-500/15 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              For Employers · {CONTACT_EMAIL}
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
            onClick={handleResetAndClose}
            aria-label="Close Post a Job modal"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-cyan-500/20 bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {submittedTier ? (
          <div className="mt-6 space-y-5 rounded-2xl border border-cyan-500/25 bg-slate-950/70 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            {submittedTier === 'featured' ? (
              <>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-white">
                    Role Submitted — Complete Featured Payment
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    Your role details have been sent to{' '}
                    <span className="font-mono text-cyan-300">{CONTACT_EMAIL}</span>. Complete
                    your <strong className="text-white">$29 USD</strong> PayPal checkout below to
                    pin your role in the <strong className="text-cyan-300">Featured Spotlight</strong>{' '}
                    for 30 days.
                  </p>
                </div>

                <a
                  href={PAYPAL_FEATURED_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                >
                  <span>Complete $29 Featured Payment via PayPal</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </>
            ) : (
              <div>
                <h3 className="font-serif text-xl font-semibold text-white">
                  Standard Role Published!
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Your remote listing is now live in the directory and forwarded to{' '}
                  <span className="font-mono text-cyan-300">{CONTACT_EMAIL}</span> for editorial
                  verification.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white"
            >
              Return to Job Directory
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setTier('featured')}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                  tier === 'featured'
                    ? 'border-cyan-400/70 bg-cyan-500/10 shadow-md shadow-cyan-500/10'
                    : 'border-white/10 bg-slate-950/40 hover:border-white/20'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured Spotlight
                  </span>
                  <span className="font-mono text-xs font-bold text-white">$29</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Pinned at top for 30 days + Verified Spotlight badge.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTier('standard')}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                  tier === 'standard'
                    ? 'border-cyan-400/70 bg-cyan-500/10'
                    : 'border-white/10 bg-slate-950/40 hover:border-white/20'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    Standard Listing
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400">FREE</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Listed in chronological order with transparent USD pay.
                </p>
              </button>
            </div>
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
                <div className="mt-1.5 flex items-center gap-2">
                  <BrandAvatar
                    company={company || 'AI'}
                    domain={resolveBrandDomain(company || 'planetaihub.com')}
                    size="sm"
                  />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Anthropic"
                    className="input-obsidian h-11 w-full px-3 text-sm"
                  />
                </div>
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
                  Engagement
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
                  Remote Region
                </label>
                <select
                  value={region}
                  onChange={(e) => {
                    const next = e.target.value as RemoteRegion;
                    setRegion(next);
                    setLocation(`Remote (${next})`);
                  }}
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
                  Employer Email
                </label>
                <input
                  type="email"
                  value={employerEmail}
                  onChange={(e) => setEmployerEmail(e.target.value)}
                  placeholder="hiring@company.com"
                  className="input-obsidian mt-1.5 h-11 w-full px-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Direct Application / ATS URL *
              </label>
              <input
                type="url"
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                placeholder="https://greenhouse.io..."
                className="input-obsidian mt-1.5 h-11 w-full px-3 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Role Summary (Optional)
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describe key responsibilities, tech stack, and async expectations..."
                className="input-obsidian mt-1.5 w-full p-3 text-sm"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-cyan-500/15 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-60"
              >
                {submitting
                  ? 'Submitting...'
                  : tier === 'featured'
                  ? 'Submit & Pay $29 via PayPal →'
                  : 'Publish Free Standard Role'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
