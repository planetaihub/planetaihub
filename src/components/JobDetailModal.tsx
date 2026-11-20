import React, { useEffect } from 'react';
import { Bookmark, Clock, ExternalLink, MapPin, Share2, X } from 'lucide-react';
import type { JobListing } from '../types';
import { BrandAvatar } from './BrandAvatar';
import { resolveApplyUrl } from '../utils/referralLinks';
import { shareContent } from '../utils/shareHelper';

interface JobDetailModalProps {
  job: JobListing | null;
  isSaved: boolean;
  personalNote: string;
  onToggleSave: (jobId: string) => void;
  onUpdateNote: (jobId: string, note: string) => void;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isSaved,
  personalNote,
  onToggleSave,
  onUpdateNote,
  onClose,
}) => {
  useEffect(() => {
    if (!job) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [job, onClose]);

  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-cyan-500/20 bg-slate-900/95 p-6 text-slate-100 shadow-[0_16px_48px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cyan-500/15 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <BrandAvatar name={job.company} domain={job.companyDomain} />
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  {job.company}
                  <span aria-hidden="true" className="mx-2 text-slate-600">
                    ·
                  </span>
                  <span className="font-normal text-emerald-400">{job.source}</span>
                </p>
                <h2
                  id="job-modal-title"
                  className="mt-0.5 font-serif text-2xl font-semibold text-white text-balance"
                >
                  {job.title}
                </h2>
              </div>
            </div>
            <p className="mt-2.5 inline-block rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 font-mono text-sm font-semibold text-emerald-400 tabular-nums">
              {job.payRange}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
              <span className="rounded-md border border-indigo-400/30 bg-indigo-500/20 px-2 py-0.5 text-indigo-300">
                {job.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{job.type}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                {job.location}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                {job.postedAt}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close job details"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-slate-800/60 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-300">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Role Overview
            </h3>
            <p className="mt-1.5 text-slate-300">{job.summary}</p>
            <p className="mt-2 text-xs text-slate-500">
              Location & schedule: {job.timezoneNote}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Core Focus
            </h3>
            <p className="mt-1.5 font-mono text-xs text-indigo-300">
              {job.stack.join(' · ')}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Key Responsibilities
            </h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate-300">
              {job.responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              What You Bring
            </h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate-300">
              {job.requirements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-cyan-500/15 pt-5">
            <label
              htmlFor="job-personal-note"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Personal Application Note (Saved locally in browser)
            </label>
            <textarea
              id="job-personal-note"
              rows={3}
              value={personalNote}
              onChange={(e) => onUpdateNote(job.id, e.target.value)}
              placeholder="Track referral contacts, interview dates, or tailored resume notes..."
              className="input-obsidian mt-2 w-full px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-cyan-500/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(job.id)}
              className={`inline-flex min-h-[44px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isSaved
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20'
                  : 'border-cyan-500/20 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  isSaved ? 'fill-emerald-400 text-emerald-400' : ''
                }`}
                aria-hidden="true"
              />
              <span>{isSaved ? 'Saved to Shortlist' : 'Save Job'}</span>
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
                  text: `${job.title} at ${job.company} (${job.payRange}) — via PlanetAI Hub`,
                  url: `${origin}/?job=${encodeURIComponent(job.id)}`,
                });
              }}
              aria-label={`Share ${job.title} at ${job.company}`}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.1] hover:text-cyan-300 whitespace-nowrap shrink-0"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              <span>Share</span>
            </button>
          </div>

          <a
            href={resolveApplyUrl(job.company, job.applyUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md transition-colors hover:bg-cyan-300 whitespace-nowrap shrink-0"
          >
            <span>Apply Now ↗</span>
            <ExternalLink className="h-4 w-4 sr-only" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
};
