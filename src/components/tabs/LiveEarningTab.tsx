import React, { useMemo, useState } from 'react';
import {
  Check,
  Coins,
  Copy,
  ExternalLink,
  Gift,
  ShieldCheck,
} from 'lucide-react';
import {
  EARNING_CATEGORIES,
  EARNING_OPPORTUNITIES,
  type EarningCategory,
  type EarningOpportunity,
} from '../../data/earningOpportunities';
import { AdBanner } from '../AdBanner';

function getBadgeClasses(tone: 'cyan' | 'emerald' | 'indigo'): string {
  if (tone === 'emerald') {
    return 'border-emerald-400/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.25)]';
  }
  if (tone === 'indigo') {
    return 'border-indigo-400/40 bg-indigo-500/25 text-indigo-200 shadow-[0_0_15px_rgba(129,140,248,0.25)]';
  }
  return 'border-cyan-400/50 bg-cyan-400/20 text-cyan-200 shadow-[0_0_18px_rgba(6,182,212,0.3)]';
}

const ProductLogoBadge: React.FC<{ item: EarningOpportunity; size?: 'header' | 'inline' }> = ({
  item,
  size = 'header',
}) => {
  const [hasError, setHasError] = useState(false);
  const initials = item.name.slice(0, 2).toUpperCase();

  const containerClass =
    size === 'inline'
      ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/15 p-1.5 shadow-sm'
      : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-slate-900/85 p-2 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.6)]';

  const imgClass = size === 'inline' ? 'h-6 w-6 object-contain rounded' : 'h-6 w-6 object-contain rounded-md';

  return (
    <div className={containerClass}>
      {!hasError ? (
        <img
          src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`}
          alt={`${item.name} logo`}
          onError={() => setHasError(true)}
          className={imgClass}
        />
      ) : (
        <span className="font-mono text-xs font-bold text-cyan-300">
          {initials}
        </span>
      )}
    </div>
  );
};

export const LiveEarningTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<EarningCategory>('All');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const filteredOpportunities = useMemo(() => {
    if (selectedCategory === 'All') return EARNING_OPPORTUNITIES;
    return EARNING_OPPORTUNITIES.filter(
      (item) => item.category === selectedCategory
    );
  }, [selectedCategory]);

  const handleCopyCode = async (id: string, code: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedCodeId(id);
      window.setTimeout(() => {
        setCopiedCodeId((prev) => (prev === id ? null : prev));
      }, 2200);
    } catch {
      // Clipboard blocked gracefully
    }
  };

  return (
    <section aria-labelledby="live-earning-heading" className="space-y-6">
      {/* Header & AdSense-Safe Disclosure */}
      <div className="border-b border-cyan-500/15 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/25 bg-slate-900/75 text-cyan-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Coins className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Featured Spotlight Partners
              </p>
              <h1
                id="live-earning-heading"
                className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance"
              >
                Live Earning Opportunities
              </h1>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-300 tabular-nums">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span>{EARNING_OPPORTUNITIES.length} Verified Platforms</span>
          </span>
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Verified side-income, AI training, and passive earning platforms. Some links may be referral links at no extra cost to you.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div
        role="tablist"
        aria-label="Filter live earning opportunities by category"
        className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade px-1 pb-1"
      >
        {EARNING_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isSelected}
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
              className={`snap-center min-h-[40px] rounded-xl border px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-[0_0_18px_rgba(6,182,212,0.3)]'
                  : 'border-indigo-400/30 bg-indigo-500/15 text-indigo-300 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* 4-Card Featured Spotlight Grid with Dark Atmospheric Photo Header */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredOpportunities.map((item) => {
          const isCopied = copiedCodeId === item.id;
          return (
            <article
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-cyan-500/25 bg-[#08121e] shadow-[0_16px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_20px_50px_rgba(6,182,212,0.18)]"
            >
              <div>
                {/* 1. h-48 Top Photo Header with Dark Navy Gradient Overlay */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.bgImageUrl}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-luminosity filter brightness-90 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08121e] via-[#08121e]/75 to-[#08121e]/25" />

                  {/* 2. Badges inside Photo Header */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5">
                    <div className="flex items-start justify-between gap-3">
                      {/* Top-Left: Cyan Badge Pill */}
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] font-bold tracking-wider uppercase backdrop-blur-md ${getBadgeClasses(
                          item.badgeTone
                        )}`}
                      >
                        {item.badge}
                      </span>

                      {/* Top-Right: Glassmorphic Product Logo Badge */}
                      <ProductLogoBadge item={item} size="header" />
                    </div>

                    {/* Bottom-Left of Photo: Category Pill */}
                    <div>
                      <span className="inline-flex rounded-md border border-indigo-400/35 bg-indigo-500/25 px-2.5 py-1 text-[11px] font-semibold text-indigo-200 backdrop-blur-md shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Card Body */}
                <div className="p-6">
                  {/* Company Logo Right Next to Title */}
                  <div className="flex items-center gap-3.5">
                    <ProductLogoBadge item={item} size="inline" />
                    <div className="min-w-0">
                      <h2 className="truncate font-serif text-2xl font-bold tracking-tight text-white">
                        {item.name}
                      </h2>
                      <p className="font-mono text-xs text-emerald-400 font-bold tabular-nums">
                        {item.pay}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">{item.subtitle}</p>

                  {/* Description */}
                  <p className="mt-3.5 text-sm leading-relaxed text-slate-300">
                    {item.description}
                  </p>

                  {/* Interactive Referral Code Box (Loggy3 794MG8) */}
                  {item.referralCode && (
                    <div className="mt-4 rounded-xl border border-cyan-400/35 bg-slate-900/85 p-4 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Gift
                            className="h-4 w-4 shrink-0 text-cyan-300"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-semibold text-slate-200">
                            Referral Code:
                          </span>
                          <code className="rounded-lg border border-cyan-400/40 bg-[#060913] px-2.5 py-1 font-mono text-sm font-bold tracking-widest text-cyan-300">
                            {item.referralCode}
                          </code>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopyCode(item.id, item.referralCode!)
                          }
                          className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                            isCopied
                              ? 'border-emerald-400/50 bg-emerald-500/25 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.3)]'
                              : 'border-cyan-400/40 bg-cyan-400/20 text-cyan-200 hover:bg-cyan-400/30 hover:text-white'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      {item.referralNote && (
                        <p className="mt-3 text-xs leading-relaxed text-slate-300">
                          {item.referralNote}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="border-t border-white/[0.08] px-6 py-4">
                <a
                  href={item.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:bg-cyan-300 whitespace-nowrap"
                >
                  <span>{item.ctaLabel}</span>
                  <ExternalLink className="h-3.5 w-3.5 sr-only" aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* AdSense Manual Slot Below Main Content */}
      <AdBanner />
    </section>
  );
};
