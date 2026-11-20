import React, { useEffect } from 'react';
import { Laptop, Share2, Smartphone, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';

/**
 * Obsidian-glass modal showing clear 2-step installation instructions
 * for Android (Chrome), iPhone/iPad (Safari), and Windows/Mac (Chrome/Edge)
 * whenever the browser's native beforeinstallprompt is unavailable.
 */
export const InstallAppModal: React.FC = () => {
  const { isModalOpen, closeInstallModal } = usePWAInstall();

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeInstallModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen, closeInstallModal]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-app-modal-title"
      onClick={closeInstallModal}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-cyan-500/20 bg-slate-900/95 p-6 text-slate-100 shadow-[0_16px_48px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:rounded-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cyan-500/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/25 bg-[#060913]/80">
              <BrandLogo className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Offline-Ready App
              </p>
              <h2
                id="install-app-modal-title"
                className="font-serif text-xl font-semibold text-white"
              >
                Install PlanetAI Hub
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeInstallModal}
            aria-label="Close install instructions"
            className="inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-slate-800/60 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          Add PlanetAI Hub to your home screen or desktop dock for instant full-screen launch and offline access to your saved jobs and career tools.
        </p>

        <div className="mt-4 space-y-3">
          {/* Android (Chrome) */}
          <div className="rounded-xl border border-cyan-500/15 bg-[#060913]/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Smartphone className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              <span>Android (Chrome)</span>
            </div>
            <ol className="mt-2 space-y-1 text-xs leading-relaxed text-slate-300">
              <li>
                <span className="font-mono font-semibold text-cyan-300">1.</span> Tap the{' '}
                <strong className="text-white">⋮</strong> menu button in the top-right corner of Chrome.
              </li>
              <li>
                <span className="font-mono font-semibold text-cyan-300">2.</span> Tap{' '}
                <strong className="text-white">Install app</strong> (or{' '}
                <strong className="text-white">Add to Home screen</strong>).
              </li>
            </ol>
          </div>

          {/* iPhone / iPad (Safari) */}
          <div className="rounded-xl border border-cyan-500/15 bg-[#060913]/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Share2 className="h-4 w-4 text-indigo-300" aria-hidden="true" />
              <span>iPhone / iPad (Safari)</span>
            </div>
            <ol className="mt-2 space-y-1 text-xs leading-relaxed text-slate-300">
              <li>
                <span className="font-mono font-semibold text-cyan-300">1.</span> Tap the{' '}
                <strong className="text-white">Share</strong> icon in Safari’s bottom or top toolbar.
              </li>
              <li>
                <span className="font-mono font-semibold text-cyan-300">2.</span> Scroll down and tap{' '}
                <strong className="text-white">Add to Home Screen</strong>.
              </li>
            </ol>
          </div>

          {/* Windows / Mac (Chrome / Edge) */}
          <div className="rounded-xl border border-cyan-500/15 bg-[#060913]/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Laptop className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>Windows / Mac (Chrome / Edge)</span>
            </div>
            <ol className="mt-2 space-y-1 text-xs leading-relaxed text-slate-300">
              <li>
                <span className="font-mono font-semibold text-cyan-300">1.</span> Click the{' '}
                <strong className="text-white">Install</strong> icon on the right side of the address bar (or open <strong className="text-white">⋮ → Cast, save, and share</strong>).
              </li>
              <li>
                <span className="font-mono font-semibold text-cyan-300">2.</span> Click{' '}
                <strong className="text-white">Install</strong> to pin PlanetAI Hub as a desktop app.
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-cyan-500/15 pt-4">
          <button
            type="button"
            onClick={closeInstallModal}
            className="min-h-[42px] rounded-xl bg-cyan-400 px-5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
