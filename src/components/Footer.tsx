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

type LegalModalType = 'about' | 'contact' | 'privacy' | 'terms' | null;

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
              Legal &amp; Info
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('about')}
                  className="text-left transition-colors hover:text-cyan-300"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('contact')}
                  className="text-left transition-colors hover:text-cyan-300"
                >
                  Contact Us
                </button>
              </li>
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
                  Terms of Service
                </button>
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

      {/* Comprehensive AdSense-Compliant Legal & Info Modals */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-cyan-500/20 bg-slate-900/95 p-6 text-slate-100 shadow-2xl backdrop-blur-xl sm:rounded-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-cyan-500/15 pb-4">
              <h2
                id="legal-modal-title"
                className="font-serif text-2xl font-semibold text-white"
              >
                {legalModal === 'about'
                  ? 'About PlanetAI Hub'
                  : legalModal === 'contact'
                  ? 'Contact Us'
                  : legalModal === 'privacy'
                  ? 'Privacy Policy'
                  : 'Terms of Service'}
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

            {legalModal === 'about' && (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
                <p>
                  <strong>PlanetAI Hub</strong> (<a href="https://planetaihub.com" className="text-cyan-400 underline">planetaihub.com</a>) is an independent editorial platform dedicated to remote artificial intelligence, machine learning training, prompt engineering, voice AI, and software engineering career opportunities.
                </p>
                <p>
                  Our mission is to bring absolute transparency to remote employment by curating verified listings that feature transparent USD compensation bands and direct employer ATS links. In addition to our job board, we publish in-depth editorial intelligence briefings and provide professional offline-capable career, finance, and productivity utilities.
                </p>
                <p>
                  We operate with a zero-signup, local-first design philosophy, ensuring user privacy and instant accessibility across desktop and mobile devices.
                </p>
              </div>
            )}

            {legalModal === 'contact' && (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
                <p>
                  We welcome inquiries from job seekers, hiring managers, and editorial partners. Whether you have questions about our remote listings, advertising opportunities, or technical feedback, our team is ready to assist you.
                </p>
                <div className="rounded-xl border border-cyan-500/20 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Editorial &amp; Support Desk</p>
                  <p className="mt-1 text-base font-bold text-white">
                    <a href="mailto:team@planetaihub.com" className="hover:text-cyan-300 underline">team@planetaihub.com</a>
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  We strive to respond to all publisher and employer placement inquiries within 24–48 business hours.
                </p>
              </div>
            )}

            {legalModal === 'privacy' && (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
                <p>
                  At PlanetAI Hub, accessible at <a href="https://planetaihub.com" className="text-cyan-400 underline">planetaihub.com</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and recorded by PlanetAI Hub and how we use it.
                </p>
                <p>
                  <strong>Browser Local Storage Privacy:</strong> PlanetAI Hub operates on a zero-signup model. All user shortlists, bookmarks, notes, resume drafts, expense records, and health vitals are stored exclusively inside your device’s browser <code className="font-mono text-xs text-cyan-300">localStorage</code>. We do not transmit or store personal workspace records on external servers.
                </p>
                <p>
                  <strong>Google AdSense &amp; Third-Party Cookies:</strong> Google, as a third-party vendor, uses cookies (such as DART cookies) to serve ads on PlanetAI Hub. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the internet.
                </p>
                <p>
                  Users may opt out of personalized advertising by visiting the <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Google Ads Settings</a> page.
                </p>
                <p className="text-xs text-slate-400">
                  If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:team@planetaihub.com" className="text-cyan-400 underline">team@planetaihub.com</a>.
                </p>
              </div>
            )}

            {legalModal === 'terms' && (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
                <p>
                  By accessing and using PlanetAI Hub (<a href="https://planetaihub.com" className="text-cyan-400 underline">planetaihub.com</a>), you agree to comply with and be bound by the following terms and conditions of use.
                </p>
                <p>
                  <strong>Aggregated Job Listings &amp; ATS Links:</strong> Job listings displayed on PlanetAI Hub are curated from public remote RSS feeds, employer career pages, and direct submissions. We do not act as an employer or recruitment agency. Users must verify final compensation, employment contracts, and regional eligibility directly on the hiring company's official ATS portal.
                </p>
                <p>
                  <strong>Utility Disclaimer:</strong> Financial calculators, resume builders, and productivity tools provided on this platform are for informational and workflow assistance only and do not constitute formal legal, financial, or tax advice.
                </p>
                <p>
                  <strong>Intellectual Property:</strong> Editorial briefings, interface design, and branding are the property of PlanetAI Hub. Unauthorized scraping or republishing of proprietary editorial content is prohibited.
                </p>
                <p className="text-xs text-slate-400">
                  For questions regarding these Terms of Service, please contact <a href="mailto:team@planetaihub.com" className="text-cyan-400 underline">team@planetaihub.com</a>.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end border-t border-cyan-500/15 pt-4">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="min-h-[40px] rounded-xl bg-cyan-400 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300"
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
