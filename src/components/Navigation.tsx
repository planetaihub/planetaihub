import React, { useEffect, useRef } from 'react';
import {
  Briefcase,
  FileText,
  Sparkles,
  Code2,
  Wallet,
  CheckSquare,
  CloudSun,
  Bookmark,
} from 'lucide-react';
import type { TabId } from '../types';
import { PWAInstallButton, ShareAppButton } from './PWAInstallBanner';
import { BrandLogo } from './BrandLogo';

export interface NavTabItem {
  id: TabId;
  label: string;
  desktopLabel: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TABS: NavTabItem[] = [
  {
    id: 'jobs',
    label: 'Jobs',
    desktopLabel: 'Jobs',
    shortLabel: 'Jobs',
    icon: Briefcase,
  },
  {
    id: 'career-studio',
    label: 'Career Studio',
    desktopLabel: 'Career',
    shortLabel: 'Career',
    icon: FileText,
  },
  {
    id: 'ai-assistants',
    label: 'AI Assistants',
    desktopLabel: 'AI Tools',
    shortLabel: 'Assistants',
    icon: Sparkles,
  },
  {
    id: 'dev-tools',
    label: 'Dev Tools',
    desktopLabel: 'Dev Tools',
    shortLabel: 'Dev Tools',
    icon: Code2,
  },
  {
    id: 'finance-docs',
    label: 'Finance & Docs',
    desktopLabel: 'Finance',
    shortLabel: 'Finance',
    icon: Wallet,
  },
  {
    id: 'productivity',
    label: 'Productivity',
    desktopLabel: 'Productivity',
    shortLabel: 'Productivity',
    icon: CheckSquare,
  },
  {
    id: 'health-weather',
    label: 'Health & Weather',
    desktopLabel: 'Health',
    shortLabel: 'Health',
    icon: CloudSun,
  },
];

// Backward-compatible export alias if referenced elsewhere
export const NAV_TABS = TABS;

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  savedCount: number;
  onOpenSavedJobs: () => void;
}

const scrollElementIntoCenter = (el: HTMLElement | null) => {
  if (!el || typeof window === 'undefined') return;
  if (window.innerWidth <= 768) {
    el.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }
};

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  onOpenSavedJobs,
}) => {
  const mobileTabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  useEffect(() => {
    scrollElementIntoCenter(mobileTabRefs.current[activeTab] ?? null);
  }, [activeTab]);

  return (
    <>
      {/* Deep Cosmic Navy Top Header */}
      <header className="sticky top-0 z-30 border-b border-cyan-500/15 bg-[#060913]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:h-16">
          {/* Zone 1: Single-line Serif Brand Wordmark + Custom Emblem */}
          <button
            type="button"
            onClick={() => onSelectTab('jobs')}
            className="inline-flex items-center gap-2 font-serif text-lg font-semibold tracking-tight text-white whitespace-nowrap shrink-0 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 sm:gap-2.5 sm:text-xl"
          >
            <BrandLogo className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
            <span>PlanetAI Hub</span>
          </button>

          {/* Zone 2: Desktop 7-Tab Navigation Strip (All 7 tabs fit cleanly without clipping) */}
          <nav
            aria-label="Main workspaces"
            className="hidden md:flex flex-1 min-w-0 items-center overflow-x-auto no-scrollbar mx-2 py-1"
          >
            <div className="mx-auto flex items-center gap-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onSelectTab(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative inline-flex min-h-[36px] items-center px-2.5 py-1.5 text-[13px] font-medium transition-all whitespace-nowrap shrink-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950 font-semibold shadow-[0_2px_14px_rgba(6,182,212,0.3)]'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    {tab.desktopLabel}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Zone 3: Compact Share, Install App & Saved Actions */}
          <div className="shrink-0 flex items-center gap-1.5">
            <ShareAppButton />
            <PWAInstallButton />
            <button
              type="button"
              onClick={onOpenSavedJobs}
              aria-label={`Saved jobs (${savedCount})`}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-cyan-500/20 bg-slate-900/75 px-2.5 py-1.5 text-xs font-semibold text-slate-100 transition-colors hover:border-cyan-400/50 hover:bg-slate-800/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 whitespace-nowrap shrink-0"
            >
              <Bookmark className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
              <span className="hidden sm:inline">Saved</span>
              <span className="font-mono tabular-nums text-slate-400">
                ({savedCount})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Floating Cosmic Slate Glass Bottom Navigation Dock (All 7 Tabs) */}
      <nav
        aria-label="Mobile navigation dock"
        className="md:hidden fixed bottom-2.5 left-2.5 right-2.5 z-40 rounded-2xl border border-cyan-500/20 bg-[#060913]/92 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(6,182,212,0.12)] backdrop-blur-xl"
      >
        <div className="flex items-center overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade gap-1 px-3 pr-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  mobileTabRefs.current[tab.id] = el;
                }}
                type="button"
                onClick={(e) => {
                  onSelectTab(tab.id);
                  scrollElementIntoCenter(e.currentTarget);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`snap-center shrink-0 min-w-[68px] flex flex-col items-center justify-center py-2 px-2.5 rounded-xl min-h-[48px] transition-all ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="mt-1 text-[11px] font-medium leading-none whitespace-nowrap">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
