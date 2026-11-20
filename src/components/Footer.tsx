import React, { useEffect, useState } from 'react';
import { Mail, Plus, X } from 'lucide-react';
import type { TabId } from '../types';
import { TABS } from './Navigation';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton, ShareAppButton } from './PWAInstallBanner';
import { MICRO1_COMPANY_REFERRAL_URL } from '../utils/referralLinks';

interface FooterProps {
  onSelectTab: (tab: TabId) => void;
  onOpenPostJob: () => void;
}

type LegalModalType = 'privacy' | 'terms' | null;

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenPostJob,
}) => {
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  useEffect(() => {
    if (!legalModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLegalModal(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [legalModal]);

  return (
    <>
      <footer className="no-print mt-16 border-t border-cyan-500/15 pt-12 pb-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: PlanetAI Hub Brand Summary */}
          <div>
            <button
              type="button"
              onClick={() => onSelectTab('jobs')}
              className="inline-flex items-center gap-2.5 font-serif text-xl font-semibold tracking-tight text-white transition-colors hover:text-cyan-300"
            >
              <BrandLogo className="h-7 w-7 shrink-0" />
              <span>PlanetAI Hub</span>
            </button>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Editorial remote AI & engineering job board paired with an offline-ready career, finance, and productivity workspace. Zero signup required.
            </p>
            <p className="mt-4 font-mono text-xs text-slate-500">
              planetaihub.com · LocalStorage PWA
            </p>
          </div>

          {/* Column 2: Platform Tab Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              {TABS.map((tab) => (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTab(tab.id)}
                    className="text-left transition-colors hover:text-cyan-300"
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ShareAppButton />
              <PWAInstallButton />
            </div>
          </div>

          {/* Column 3: For Employers */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              For Employers
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenPostJob}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300 whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Post a Job</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('jobs')}
                  className="text-left transition-colors hover:text-white"
                >
                  Featured Roles Spotlight
                </button>
              </li>
              <li>
                <a
                  href={MICRO1_COMPANY_REFERRAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-cyan-500/20 bg-slate-900/70 px-3.5 py-2.5 text-xs font-medium leading-snug text-cyan-300 transition-all duration-200 hover:border-cyan-400/45 hover:bg-slate-900 hover:text-cyan-200"
                >
                  Hiring AI Talent? Source Pre-Vetted Engineers via micro1 →
                </a>
              </li>
              <li className="text-xs leading-relaxed text-slate-500">
                100% Transparent Pay Standard: every listing displays verified USD hourly or annual bands with direct ATS links.
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Legal & Info
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('privacy')}
                  className="text-left transition-colors hover:text-cyan-300"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('terms')}
                  className="text-left transition-colors hover:text-cyan-300"
                >
                  Terms of Use
                </button>
              </li>
              <li>
                <a
                  href="mailto:team@planetaihub.com"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-cyan-300"
                >
                  <Mail className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                  <span>team@planetaihub.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-cyan-500/15 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} PlanetAI Hub. All bookmarks, notes, expenses, and vitals stay private in your browser.
          </p>
          <p className="font-mono text-[11px] text-slate-500">
            Offline-Ready PWA · Transparent Pay Directory
          </p>
        </div>
      </footer>

      {/* Privacy & Terms Editorial Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-cyan-500/20 bg-slate-900/95 p-6 text-slate-100 shadow-2xl backdrop-blur-xl sm:rounded-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-cyan-500/15 pb-4">
              <h2
                id="legal-modal-title"
                className="font-serif text-2xl font-semibold text-white"
              >
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}
              </h2>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label="Close dialog"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-cyan-500/20 bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {legalModal === 'privacy' ? (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                <p>
                  PlanetAI Hub operates on a zero-signup, browser-first privacy model. Your saved job shortlists, notes, resume drafts, invoices, expenses, and vitals are stored exclusively inside your device’s <code className="font-mono text-xs text-cyan-300">localStorage</code>.
                </p>
                <p>
                  We do not maintain user accounts or sell personal workspace entries. Manual Google AdSense display units may use standard advertising cookies subject to Google’s publisher policies.
                </p>
                <p className="text-xs text-slate-400">
                  Questions? Contact <a href="mailto:team@planetaihub.com" className="text-cyan-400 underline">team@planetaihub.com</a>.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                <p>
                  Job listings aggregated from curated company career pages and public remote ATS feeds are provided for informational discovery. Always verify final compensation, eligibility, and contract terms directly on the employer’s official ATS page.
                </p>
                <p>
                  Client-side financial calculators, invoice exports, and health trackers are utility aids and do not constitute tax, legal, or medical advice.
                </p>
                <p className="text-xs text-slate-400">
                  Employer inquiries: <a href="mailto:team@planetaihub.com" className="text-cyan-400 underline">team@planetaihub.com</a>.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end border-t border-cyan-500/15 pt-4">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="min-h-[40px] rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
