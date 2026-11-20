import React, { useState } from 'react';
import { Download, Share2, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { shareContent } from '../utils/shareHelper';
import { dismissPWABanner, isPWABannerDismissed } from '../utils/storage';

interface ActionButtonProps {
  className?: string;
}

export const ShareAppButton: React.FC<ActionButtonProps> = ({
  className = '',
}) => {
  const handleShareApp = () => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://planetaihub.com';
    void shareContent({
      title: 'PlanetAI Hub — Remote AI Jobs & Career Suite',
      text: 'Remote AI & tech jobs with transparent USD pay, career tools, and offline utilities on PlanetAI Hub.',
      url: origin,
    });
  };

  return (
    <button
      type="button"
      onClick={handleShareApp}
      aria-label="Share PlanetAI Hub"
      className={`bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 rounded-xl px-2.5 py-1.5 min-h-[36px] text-xs font-medium flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 whitespace-nowrap shrink-0 ${className}`}
    >
      <Share2 className="h-3.5 w-3.5 text-slate-300 shrink-0" aria-hidden="true" />
      <span>Share</span>
    </button>
  );
};

export const PWAInstallButton: React.FC<ActionButtonProps> = ({
  className = '',
}) => {
  const { isInstalled, install } = usePWAInstall();

  // Automatically hide Install App when running in standalone installed mode
  if (isInstalled) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        void install();
      }}
      aria-label="Install PlanetAI Hub app"
      className={`border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 rounded-xl px-2.5 py-1.5 min-h-[36px] text-xs font-medium flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 whitespace-nowrap shrink-0 ${className}`}
    >
      <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Install App</span>
    </button>
  );
};

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(() =>
    isPWABannerDismissed()
  );

  if (isInstalled || dismissed || (!isInstallable && !isIOS)) {
    return null;
  }

  const handleDismiss = () => {
    dismissPWABanner();
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Install PlanetAI Hub app"
      className="mb-6 flex flex-col gap-3 rounded-2xl border border-cyan-500/15 bg-slate-900/75 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3 sm:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/25 bg-indigo-500/15 text-cyan-300">
          <Smartphone className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            Install PlanetAI Hub for offline access
          </p>
          <p className="text-xs text-slate-400">
            Pin this hub to your home screen or desktop. Saved jobs and tools work offline with zero account required.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={() => {
            void install();
          }}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md transition-all hover:bg-cyan-300 whitespace-nowrap shrink-0"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span>{isInstallable ? 'Install App' : 'How to Install'}</span>
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-cyan-500/15 bg-slate-800/60 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
