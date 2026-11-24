// /src/components/Navigation.tsx

import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
  Sparkles,
  Code2,
  Wallet,
  CheckSquare,
  CloudSun,
  Coins,
  Bookmark,
  PlayCircle,
  Users,
  Shield,
  LayoutGrid,
  X,
  BookOpen,
  Grid,
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
    label: 'Remote Jobs',
    desktopLabel: 'Remote Jobs',
    shortLabel: 'Jobs',
    icon: Briefcase,
  },
  {
    id: 'career-studio',
    label: 'Career Studio',
    desktopLabel: 'Career Studio',
    shortLabel: 'Career',
    icon: FileText,
  },
  {
    id: 'ai-assistants',
    label: 'AI Tools',
    desktopLabel: 'AI Tools',
    shortLabel: 'AI Tools',
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
    label: 'Finance Desk',
    desktopLabel: 'Finance Desk',
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
    label: 'Health',
    desktopLabel: 'Health',
    shortLabel: 'Health',
    icon: CloudSun,
  },
  {
    id: 'live-earning',
    label: 'Live Earning',
    desktopLabel: 'Live Earning',
    shortLabel: 'Earning',
    icon: Coins,
  },
  {
    id: 'video-academy',
    label: 'Video Academy',
    desktopLabel: 'Video Academy',
    shortLabel: 'Academy',
    icon: PlayCircle,
  },
  {
    id: 'va-academy',
    label: 'VA Academy',
    desktopLabel: 'VA Academy',
    shortLabel: 'VA Academy',
    icon: Users,
  },
  {
    id: 'security-vault',
    label: 'Security Vault',
    desktopLabel: 'Security Vault',
    shortLabel: 'Security',
    icon: Shield,
  },
  {
    id: 'workspace-studio',
    label: 'Workspace Studio',
    desktopLabel: 'Workspace Studio',
    shortLabel: 'Workspace',
    icon: Grid,
  },
  {
    id: 'editorial-briefings',
    label: 'Editorial Briefings',
    desktopLabel: '18 Briefings',
    shortLabel: 'Briefings',
    icon: BookOpen,
  },
];

// Backward-compatible export alias if referenced elsewhere
export const NAV_TABS = TABS;

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  savedCount: number;
  onOpenSavedJobs: () => void;
  onScrollToWorkspace: () => void;
  onScrollToBriefings: () => void;
  onOpenAbout: () => void;
}

const MOBILE_PRIMARY_TABS: TabId[] = [
  'jobs',
  'career-studio',
  'ai-assistants',
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  onOpenSavedJobs,
  onScrollToWorkspace,
  onScrollToBriefings,
  onOpenAbout,
}) => {
  const [isMobileSuitesOpen, setIsMobileSuitesOpen] = useState(false);

  const anchorLinks = [
    { label: 'Directory', onClick: () => onSelectTab('jobs') },
    { label: 'Dedicated Suites', onClick: onScrollToWorkspace },
    { label: 'Editorial Briefings', onClick: onScrollToBriefings },
    { label: 'About', onClick: onOpenAbout },
  ];

  const primaryMobileItems = MOBILE_PRIMARY_TABS.map(
    (id) => TABS.find((t) => t.id === id)!
  );

  return (
    <>
      {/* Clean, Spacious White Sticky Header */}
      <header className="no-print sticky top-0 z-30 w-full max-w-full overflow-hidden border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:gap-8">
          {/* Left: PlanetAI Hub Logo */}
          <button
            type="button"
            onClick={() => onSelectTab('jobs')}
            className="inline-flex min-w-0 items-center gap-1.5 sm:gap-2 font-display text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 transition-colors hover:text-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8] sm:text-xl"
          >
            <BrandLogo className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
            <span>PlanetAI Hub</span>
          </button>

          {/* Center: 4 Clean High-Level Anchor Links */}
          <nav
            aria-label="Primary sections"
            className="hidden lg:flex items-center gap-6 xl:gap-8"
          >
            {anchorLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8] whitespace-nowrap shrink-0"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: Share, Install App, Saved (0), Browse USD Roles */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <ShareAppButton variant="light" />
              <PWAInstallButton variant="light" />
            </div>

            <button
              type="button"
              onClick={onOpenSavedJobs}
              aria-label={`Saved jobs (${savedCount})`}
              className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              <Bookmark className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
              <span className="hidden md:inline">Saved</span>
              <span className="font-mono tabular-nums text-slate-600">
                ({savedCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('jobs')}
              className="inline-flex min-h-[36px] sm:min-h-[38px] items-center justify-center rounded-full bg-[#1D4ED8] px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1E40AF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              Browse USD Roles
            </button>
          </div>
        </div>
      </header>

      {/* Mobile All-Suites 2-Column Drawer */}
      {isMobileSuitesOpen && (
        <div
          className="no-print md:hidden fixed inset-0 z-50 flex items-end bg-slate-950/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="All PlanetAI Hub Suites"
          onClick={() => setIsMobileSuitesOpen(false)}
        >
          <div
            className="w-full max-w-full rounded-t-3xl border-t border-slate-200 bg-white p-4 pb-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
                  1-Click Dedicated Pages
                </p>
                <h2 className="font-display text-base font-bold text-slate-900">
                  All PlanetAI Hub Suites
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSuitesOpen(false)}
                aria-label="Close suites menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setIsMobileSuitesOpen(false);
                      onSelectTab(tab.id);
                    }}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                      isActive
                        ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-[#1D4ED8]/40 hover:bg-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{tab.desktopLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Light SaaS Bottom Navigation Bar (4 Fixed Grid Slots — Zero Clipping) */}
      <nav
        aria-label="Mobile navigation dock"
        className="no-print md:hidden fixed bottom-2.5 left-2.5 right-2.5 z-40 max-w-[calc(100vw-1.25rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-[0_12px_36px_rgba(15,23,42,0.16)] backdrop-blur-xl"
      >
        <div className="grid grid-cols-4 gap-1.5">
          {primaryMobileItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center rounded-xl py-1.5 px-2 min-h-[48px] transition-all ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="mt-1 text-[11px] font-medium leading-none whitespace-nowrap">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsMobileSuitesOpen(true)}
            aria-expanded={isMobileSuitesOpen}
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-2 min-h-[48px] text-slate-700 hover:bg-slate-100 hover:text-[#1D4ED8]"
          >
            <LayoutGrid className="h-4 w-4 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
            <span className="mt-1 text-[11px] font-semibold leading-none whitespace-nowrap">
              All Suites
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
