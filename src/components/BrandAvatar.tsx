import React, { useEffect, useState } from 'react';

const BRAND_DOMAIN_MAP: Record<string, string> = {
  // Featured & Curated AI / Tech Employers
  'scale ai': 'scale.com',
  anthropic: 'anthropic.com',
  'babel audio': 'babel.audio',
  micro1: 'micro1.ai',
  mercor: 'mercor.com',
  visora: 'visora.com',
  'visora ai': 'visora.com',
  spout: 'withspout.com',
  withspout: 'withspout.com',
  outlier: 'outlier.ai',
  'outlier ai': 'outlier.ai',
  dataannotation: 'dataannotation.tech',
  'data annotation': 'dataannotation.tech',
  vercel: 'vercel.com',
  supabase: 'supabase.com',
  'hugging face': 'huggingface.co',
  huggingface: 'huggingface.co',
  turing: 'turing.com',
  elevenlabs: 'elevenlabs.io',
  cohere: 'cohere.com',
  linear: 'linear.app',
  'mistral ai': 'mistral.ai',
  'perplexity ai': 'perplexity.ai',
  perplexity: 'perplexity.ai',
  zapier: 'zapier.com',
  'telus digital': 'telusinternational.com',
  appen: 'appen.com',
  deepgram: 'deepgram.com',
  cartesia: 'cartesia.ai',
  vapi: 'vapi.ai',
  'weights & biases': 'wandb.ai',
  'together ai': 'together.ai',
  'modal labs': 'modal.com',
  flutterflow: 'flutterflow.io',
  replicate: 'replicate.com',
  replit: 'replit.com',
  langchain: 'langchain.com',

  // AI Assistants
  'google gemini': 'google.com',
  'claude ai': 'anthropic.com',
  chatgpt: 'openai.com',
  openai: 'openai.com',
  grok: 'x.ai',
  'microsoft copilot': 'microsoft.com',
  deepseek: 'deepseek.com',
  'mistral le chat': 'mistral.ai',
  huggingchat: 'huggingface.co',
  poe: 'poe.com',
  'google notebooklm': 'google.com',
  'meta ai': 'meta.ai',
  phind: 'phind.com',
  'gamma ai': 'gamma.app',
  'otter.ai': 'otter.ai',

  // Developer Tools
  'google ai studio': 'google.com',
  'github copilot free tier': 'github.com',
  github: 'github.com',
  netlify: 'netlify.com',
  'mit app inventor': 'appinventor.mit.edu',
  'bolt.new': 'bolt.new',
  'v0 by vercel': 'v0.dev',
  'audacity + openvino': 'audacityteam.org',
  'krisp acoustic check': 'krisp.ai',
  'jsonlint & schema validator': 'jsonlint.com',
};

interface SignatureBrandTileStyle {
  mark: string;
  bgClass: string;
  textClass: string;
  borderClass?: string;
}

const SIGNATURE_BRAND_TILES: Record<string, SignatureBrandTileStyle> = {
  micro1: {
    mark: 'm.',
    bgClass: 'bg-black',
    textClass: 'text-white',
    borderClass: 'border border-black',
  },
  'scale ai': {
    mark: 'S/',
    bgClass: 'bg-[#0F172A]',
    textClass: 'text-indigo-300',
    borderClass: 'border border-slate-800',
  },
  outlier: {
    mark: 'O.',
    bgClass: 'bg-[#0F172A]',
    textClass: 'text-emerald-300',
    borderClass: 'border border-slate-800',
  },
  'outlier ai': {
    mark: 'O.',
    bgClass: 'bg-[#0F172A]',
    textClass: 'text-emerald-300',
    borderClass: 'border border-slate-800',
  },
  mercor: {
    mark: 'M',
    bgClass: 'bg-[#4F46E5]',
    textClass: 'text-white',
    borderClass: 'border border-[#4338CA]',
  },
  dataannotation: {
    mark: 'DA',
    bgClass: 'bg-[#064E3B]',
    textClass: 'text-emerald-100',
    borderClass: 'border border-emerald-900',
  },
  'data annotation': {
    mark: 'DA',
    bgClass: 'bg-[#064E3B]',
    textClass: 'text-emerald-100',
    borderClass: 'border border-emerald-900',
  },
  'telus digital': {
    mark: 'TD',
    bgClass: 'bg-[#4B286D]',
    textClass: 'text-white',
    borderClass: 'border border-purple-900',
  },
  'babel audio': {
    mark: 'BA',
    bgClass: 'bg-[#1D4ED8]',
    textClass: 'text-white',
    borderClass: 'border border-blue-700',
  },
  spout: {
    mark: 'sp',
    bgClass: 'bg-[#0369A1]',
    textClass: 'text-white',
    borderClass: 'border border-sky-800',
  },
  withspout: {
    mark: 'sp',
    bgClass: 'bg-[#0369A1]',
    textClass: 'text-white',
    borderClass: 'border border-sky-800',
  },
  visora: {
    mark: 'V',
    bgClass: 'bg-[#4338CA]',
    textClass: 'text-white',
    borderClass: 'border border-indigo-700',
  },
  'visora ai': {
    mark: 'V',
    bgClass: 'bg-[#4338CA]',
    textClass: 'text-white',
    borderClass: 'border border-indigo-700',
  },
  anthropic: {
    mark: 'A\\',
    bgClass: 'bg-[#1C1917]',
    textClass: 'text-[#F5EFE6]',
    borderClass: 'border border-stone-800',
  },
  cohere: {
    mark: 'Co',
    bgClass: 'bg-[#1E3A2F]',
    textClass: 'text-emerald-200',
    borderClass: 'border border-emerald-950',
  },
  zapier: {
    mark: 'Z_',
    bgClass: 'bg-[#FF4F00]',
    textClass: 'text-white',
    borderClass: 'border border-orange-600',
  },
  turing: {
    mark: 'Tu',
    bgClass: 'bg-[#18181B]',
    textClass: 'text-sky-300',
    borderClass: 'border border-zinc-800',
  },
  'perplexity ai': {
    mark: 'Px',
    bgClass: 'bg-[#0E7490]',
    textClass: 'text-white',
    borderClass: 'border border-cyan-800',
  },
  perplexity: {
    mark: 'Px',
    bgClass: 'bg-[#0E7490]',
    textClass: 'text-white',
    borderClass: 'border border-cyan-800',
  },
  elevenlabs: {
    mark: 'II',
    bgClass: 'bg-[#09090B]',
    textClass: 'text-white',
    borderClass: 'border border-zinc-800',
  },
  vercel: {
    mark: '▲',
    bgClass: 'bg-[#000000]',
    textClass: 'text-white',
    borderClass: 'border border-neutral-800',
  },
  supabase: {
    mark: 'S',
    bgClass: 'bg-[#1C1C1C]',
    textClass: 'text-[#3ECF8E]',
    borderClass: 'border border-neutral-800',
  },
  'hugging face': {
    mark: 'HF',
    bgClass: 'bg-[#92400E]',
    textClass: 'text-[#FEF3C7]',
    borderClass: 'border border-amber-800',
  },
  huggingface: {
    mark: 'HF',
    bgClass: 'bg-[#92400E]',
    textClass: 'text-[#FEF3C7]',
    borderClass: 'border border-amber-800',
  },
  appen: {
    mark: 'Ap',
    bgClass: 'bg-[#991B1B]',
    textClass: 'text-white',
    borderClass: 'border border-red-900',
  },
  'mistral ai': {
    mark: 'Mi',
    bgClass: 'bg-[#B45309]',
    textClass: 'text-white',
    borderClass: 'border border-amber-800',
  },
  linear: {
    mark: 'Ln',
    bgClass: 'bg-[#312E81]',
    textClass: 'text-white',
    borderClass: 'border border-indigo-900',
  },
  deepgram: {
    mark: 'Dg',
    bgClass: 'bg-[#0F172A]',
    textClass: 'text-emerald-400',
    borderClass: 'border border-slate-800',
  },
  cartesia: {
    mark: 'Ca',
    bgClass: 'bg-[#1E1B4B]',
    textClass: 'text-sky-300',
    borderClass: 'border border-indigo-900',
  },
  vapi: {
    mark: 'Va',
    bgClass: 'bg-[#111827]',
    textClass: 'text-cyan-300',
    borderClass: 'border border-slate-800',
  },
  'weights & biases': {
    mark: 'W&B',
    bgClass: 'bg-[#1C1917]',
    textClass: 'text-amber-300',
    borderClass: 'border border-stone-800',
  },
  'together ai': {
    mark: 'Tg',
    bgClass: 'bg-[#0F172A]',
    textClass: 'text-blue-300',
    borderClass: 'border border-slate-800',
  },
  'modal labs': {
    mark: 'Mo',
    bgClass: 'bg-[#052E16]',
    textClass: 'text-lime-300',
    borderClass: 'border border-emerald-950',
  },
  replicate: {
    mark: 'Rp',
    bgClass: 'bg-[#18181B]',
    textClass: 'text-white',
    borderClass: 'border border-zinc-800',
  },
  replit: {
    mark: 'Re',
    bgClass: 'bg-[#EA580C]',
    textClass: 'text-white',
    borderClass: 'border border-orange-700',
  },
  langchain: {
    mark: 'LC',
    bgClass: 'bg-[#115E59]',
    textClass: 'text-teal-100',
    borderClass: 'border border-teal-900',
  },
};

const FALLBACK_TILE_PALETTE: Array<{ bgClass: string; textClass: string }> = [
  { bgClass: 'bg-[#0F172A]', textClass: 'text-white' },
  { bgClass: 'bg-[#1D4ED8]', textClass: 'text-white' },
  { bgClass: 'bg-[#047857]', textClass: 'text-white' },
  { bgClass: 'bg-[#3730A3]', textClass: 'text-white' },
  { bgClass: 'bg-[#0F766E]', textClass: 'text-white' },
  { bgClass: 'bg-[#9F1239]', textClass: 'text-white' },
];

export function resolveBrandDomain(
  name: string = '',
  explicitDomain?: string
): string {
  const safeName = typeof name === 'string' ? name : '';
  const normalizedName = safeName.trim().toLowerCase();
  if (BRAND_DOMAIN_MAP[normalizedName]) {
    return BRAND_DOMAIN_MAP[normalizedName];
  }

  const cleanedExplicit = (explicitDomain || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .toLowerCase();

  if (cleanedExplicit && cleanedExplicit.includes('.')) {
    return cleanedExplicit;
  }

  const slug = normalizedName.replace(/[^a-z0-9]/g, '');
  return slug ? `${slug}.com` : '';
}

function getTwoLetterMonogram(name: string = ''): string {
  const safeName = typeof name === 'string' ? name : '';
  const words = safeName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AI';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function hashNameIndex(name: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

export function getCompanyMark(name: string = ''): string {
  const normalized = (name || '').trim().toLowerCase();
  const matched =
    SIGNATURE_BRAND_TILES[normalized] ||
    Object.entries(SIGNATURE_BRAND_TILES).find(([key]) =>
      normalized.includes(key)
    )?.[1];
  if (matched?.mark) return matched.mark;
  return getTwoLetterMonogram(name);
}

export const MercorMarkSvg: React.FC<{ className?: string }> = ({
  className = 'h-7 w-7',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M5.5 23V9.6C5.5 7.9 7.5 7 8.8 8.2L16 14.9L13.5 18.4L9.3 14.4V23C9.3 24.1 8.45 25 7.4 25C6.35 25 5.5 24.1 5.5 23Z"
      fill="white"
      fillOpacity="0.82"
    />
    <path
      d="M22.7 23V14.4L17.4 19.4C16.6 20.15 15.4 20.15 14.6 19.4L12.6 17.5L15.1 14L16 14.9L23.2 8.2C24.5 7 26.5 7.9 26.5 9.6V23C26.5 24.1 25.65 25 24.6 25C23.55 25 22.7 24.1 22.7 23Z"
      fill="white"
    />
  </svg>
);

const ScaleMarkSvg: React.FC<{ className?: string }> = ({
  className = 'h-7 w-7',
}) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <path
      d="M8.5 23.5L15.5 8.5H19.5L12.5 23.5H8.5Z"
      fill="#A5B4FC"
    />
    <path
      d="M14.5 23.5L21.5 8.5H25L18 23.5H14.5Z"
      fill="white"
    />
    <circle cx="9.5" cy="10.5" r="2.2" fill="#818CF8" />
  </svg>
);

const OutlierMarkSvg: React.FC<{ className?: string }> = ({
  className = 'h-7 w-7',
}) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <circle cx="15.5" cy="16" r="8.5" stroke="#34D399" strokeWidth="3.2" />
    <circle cx="23.5" cy="8.5" r="2.6" fill="white" />
  </svg>
);

const DataAnnotationMarkSvg: React.FC<{ className?: string }> = ({
  className = 'h-7 w-7',
}) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <path
      d="M11 9L5.5 16L11 23"
      stroke="#6EE7B7"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 9L26.5 16L21 23"
      stroke="#6EE7B7"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 8L14.5 24"
      stroke="white"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
  </svg>
);

const TelusMarkSvg: React.FC<{ className?: string }> = ({
  className = 'h-7 w-7',
}) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <path
      d="M7 10.5H21M14 10.5V23.5"
      stroke="white"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <circle cx="23.5" cy="21" r="3" fill="#4ADE80" />
  </svg>
);

const VisoraMarkSvg: React.FC<{ className?: string }> = ({
  className = 'h-7 w-7',
}) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <path
      d="M7 9.5L16 24L25 9.5"
      stroke="white"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="11.5" r="2.3" fill="#A5B4FC" />
  </svg>
);

const SpoutMarkSvg: React.FC<{ className?: string }> = ({
  className = 'h-7 w-7',
}) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <path
      d="M7 18.5C9.5 14 13 14 15.5 18.5C18 23 21.5 23 24.5 18.5"
      stroke="white"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path
      d="M9.5 12.5C11.5 9.5 14.5 9.5 16.5 12.5"
      stroke="#BAE6FD"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);

const BabelAudioMarkSvg: React.FC<{ className?: string }> = ({
  className = 'h-7 w-7',
}) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <rect x="6" y="13" width="3.2" height="6" rx="1.6" fill="#BFDBFE" />
    <rect x="11.5" y="8" width="3.2" height="16" rx="1.6" fill="white" />
    <rect x="17" y="10.5" width="3.2" height="11" rx="1.6" fill="#DBEAFE" />
    <rect x="22.5" y="7" width="3.2" height="18" rx="1.6" fill="white" />
  </svg>
);

const AnthropicMarkSvg: React.FC<{ className?: string }> = ({
  className = 'h-7 w-7',
}) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <path
      d="M6.5 23.5L12.5 8.5H15.8L21.8 23.5H18.4L17 19.7H11.3L9.9 23.5H6.5ZM12.3 16.8H16L14.15 11.7L12.3 16.8Z"
      fill="#F5EFE6"
    />
    <path
      d="M19.8 8.5H23L26.5 23.5H23.3L19.8 8.5Z"
      fill="#D6CFC2"
    />
  </svg>
);

function renderCustomBrandSvg(
  normalizedName: string,
  svgClass: string
): React.ReactNode | null {
  if (normalizedName.includes('mercor')) {
    return <MercorMarkSvg className={svgClass} />;
  }
  if (normalizedName.includes('scale')) {
    return <ScaleMarkSvg className={svgClass} />;
  }
  if (normalizedName.includes('outlier')) {
    return <OutlierMarkSvg className={svgClass} />;
  }
  if (normalizedName.includes('dataannotation') || normalizedName.includes('data annotation')) {
    return <DataAnnotationMarkSvg className={svgClass} />;
  }
  if (normalizedName.includes('telus')) {
    return <TelusMarkSvg className={svgClass} />;
  }
  if (normalizedName.includes('visora')) {
    return <VisoraMarkSvg className={svgClass} />;
  }
  if (normalizedName.includes('spout')) {
    return <SpoutMarkSvg className={svgClass} />;
  }
  if (normalizedName.includes('babel')) {
    return <BabelAudioMarkSvg className={svgClass} />;
  }
  if (normalizedName.includes('anthropic') || normalizedName.includes('claude')) {
    return <AnthropicMarkSvg className={svgClass} />;
  }
  return null;
}

function matchSignatureBrand(name: string): SignatureBrandTileStyle | undefined {
  const normalized = name.trim().toLowerCase();
  return (
    SIGNATURE_BRAND_TILES[normalized] ||
    Object.entries(SIGNATURE_BRAND_TILES).find(([key]) =>
      normalized.includes(key)
    )?.[1]
  );
}

export interface BrandTileProps {
  name: string;
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * High-contrast square brand tile featuring crisp custom SVG marks and bold
 * monograms (w-12 h-12 rounded-xl) with zero broken external images.
 */
export const BrandTile: React.FC<BrandTileProps> = ({
  name = '',
  size = 'md',
  className = '',
}) => {
  const normalized = name.trim().toLowerCase();
  const matched = matchSignatureBrand(name);

  const fallbackPalette =
    FALLBACK_TILE_PALETTE[hashNameIndex(normalized || 'ai', FALLBACK_TILE_PALETTE.length)];

  const mark = matched?.mark || getTwoLetterMonogram(name);
  const bgClass = matched?.bgClass || fallbackPalette.bgClass;
  const textClass = matched?.textClass || fallbackPalette.textClass;
  const borderClass = matched?.borderClass || 'border border-black/10';

  const sizeClass =
    size === 'lg'
      ? 'w-14 h-14 rounded-2xl text-xl font-black tracking-tight'
      : 'w-12 h-12 rounded-xl text-lg font-black tracking-tight';

  const svgSizeClass = size === 'lg' ? 'h-8 w-8' : 'h-7 w-7';
  const customSvg = renderCustomBrandSvg(normalized, svgSizeClass);

  return (
    <div
      aria-hidden="true"
      className={`shrink-0 flex items-center justify-center font-display shadow-sm select-none ${sizeClass} ${bgClass} ${textClass} ${borderClass} ${className}`}
    >
      {customSvg || <span>{mark}</span>}
    </div>
  );
};

export interface BrandAvatarProps {
  name: string;
  domain?: string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Renders a crisp real brand logo using signature custom SVG marks / bold
 * monograms for featured partners, and Google's high-res favicon resolver
 * with an automatic high-contrast monogram fallback for other domains.
 */
export const BrandAvatar: React.FC<BrandAvatarProps> = ({
  name = '',
  domain,
  size = 'md',
  variant = 'light',
  className = '',
}) => {
  const resolvedDomain = resolveBrandDomain(name, domain);
  const [hasError, setHasError] = useState(false);
  const normalizedName = (name || '').trim().toLowerCase();
  const matchedSignature = matchSignatureBrand(name);

  useEffect(() => {
    setHasError(false);
  }, [resolvedDomain, name]);

  const signatureSizeClasses =
    size === 'xs'
      ? 'w-6 h-6 rounded-md text-[11px] font-black tracking-tight'
      : size === 'sm'
      ? 'w-9 h-9 rounded-lg text-sm font-black tracking-tight'
      : 'w-12 h-12 rounded-xl text-lg font-black tracking-tight';

  const svgSizeClasses =
    size === 'xs' ? 'h-4 w-4' : size === 'sm' ? 'h-5 w-5' : 'h-7 w-7';

  const customSvg = renderCustomBrandSvg(normalizedName, svgSizeClasses);

  if (customSvg || matchedSignature) {
    const fallbackPalette =
      FALLBACK_TILE_PALETTE[
        hashNameIndex(normalizedName || 'ai', FALLBACK_TILE_PALETTE.length)
      ];
    const bgClass = matchedSignature?.bgClass || fallbackPalette.bgClass;
    const textClass = matchedSignature?.textClass || fallbackPalette.textClass;
    const borderClass = matchedSignature?.borderClass || 'border border-black/10';
    const mark = matchedSignature?.mark || getTwoLetterMonogram(name);

    return (
      <div
        aria-hidden="true"
        className={`shrink-0 flex items-center justify-center font-display shadow-sm select-none ${signatureSizeClasses} ${bgClass} ${textClass} ${borderClass} ${className}`}
      >
        {customSvg || <span>{mark}</span>}
      </div>
    );
  }

  const surfaceClasses =
    variant === 'dark'
      ? 'bg-white/[0.08] border border-white/15'
      : 'bg-slate-50 border border-slate-200 shadow-sm';

  const sizeClasses =
    size === 'xs'
      ? `w-6 h-6 rounded-md p-0.5 ${surfaceClasses}`
      : size === 'sm'
      ? `w-9 h-9 rounded-lg p-1 ${surfaceClasses}`
      : `w-12 h-12 rounded-xl p-1.5 ${surfaceClasses}`;

  const textSizeClass =
    size === 'xs'
      ? 'text-[10px] font-black tracking-tight'
      : size === 'sm'
      ? 'text-sm font-black tracking-tight'
      : 'text-lg font-black tracking-tight';
  const fallbackColorClass =
    variant === 'dark' ? 'text-blue-200' : 'text-[#1D4ED8]';
  const showFallback = !resolvedDomain || hasError;
  const faviconUrl = resolvedDomain
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        resolvedDomain
      )}&sz=128`
    : '';

  return (
    <div
      aria-hidden="true"
      className={`shrink-0 flex items-center justify-center overflow-hidden ${sizeClasses} ${className}`}
    >
      {showFallback ? (
        <span
          className={`font-display select-none ${fallbackColorClass} ${textSizeClass}`}
        >
          {getTwoLetterMonogram(name)}
        </span>
      ) : (
        <img
          src={faviconUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="h-full w-full rounded-md object-contain"
        />
      )}
    </div>
  );
};

export interface CompanyTheme {
  cardBgClass: string;
  watermarkColor: string;
}

const COMPANY_THEMES: Record<string, CompanyTheme> = {
  micro1: {
    cardBgClass: 'bg-gradient-to-br from-neutral-50/90 via-white to-zinc-100/80',
    watermarkColor: 'text-neutral-900',
  },
  'scale ai': {
    cardBgClass: 'bg-gradient-to-br from-indigo-50/75 via-white to-slate-50',
    watermarkColor: 'text-indigo-600',
  },
  outlier: {
    cardBgClass: 'bg-gradient-to-br from-emerald-50/75 via-white to-cyan-50/50',
    watermarkColor: 'text-emerald-600',
  },
  'outlier ai': {
    cardBgClass: 'bg-gradient-to-br from-emerald-50/75 via-white to-cyan-50/50',
    watermarkColor: 'text-emerald-600',
  },
  mercor: {
    cardBgClass: 'bg-gradient-to-br from-indigo-50/85 via-white to-blue-50/60',
    watermarkColor: 'text-[#4F46E5]',
  },
  dataannotation: {
    cardBgClass: 'bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50',
    watermarkColor: 'text-teal-700',
  },
  'data annotation': {
    cardBgClass: 'bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50',
    watermarkColor: 'text-teal-700',
  },
  anthropic: {
    cardBgClass: 'bg-gradient-to-br from-stone-50/90 via-white to-amber-50/50',
    watermarkColor: 'text-stone-800',
  },
  'telus digital': {
    cardBgClass: 'bg-gradient-to-br from-purple-50/70 via-white to-violet-50/50',
    watermarkColor: 'text-purple-700',
  },
  'babel audio': {
    cardBgClass: 'bg-gradient-to-br from-blue-50/85 via-white to-sky-50/60',
    watermarkColor: 'text-blue-600',
  },
  spout: {
    cardBgClass: 'bg-gradient-to-br from-sky-50/80 via-white to-blue-50/50',
    watermarkColor: 'text-sky-600',
  },
  visora: {
    cardBgClass: 'bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50',
    watermarkColor: 'text-indigo-700',
  },
  'visora ai': {
    cardBgClass: 'bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50',
    watermarkColor: 'text-indigo-700',
  },
  cohere: {
    cardBgClass: 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50',
    watermarkColor: 'text-emerald-700',
  },
  zapier: {
    cardBgClass: 'bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50',
    watermarkColor: 'text-orange-600',
  },
  turing: {
    cardBgClass: 'bg-gradient-to-br from-zinc-100/80 via-white to-slate-50',
    watermarkColor: 'text-zinc-800',
  },
  'perplexity ai': {
    cardBgClass: 'bg-gradient-to-br from-cyan-50/80 via-white to-teal-50/50',
    watermarkColor: 'text-cyan-700',
  },
  perplexity: {
    cardBgClass: 'bg-gradient-to-br from-cyan-50/80 via-white to-teal-50/50',
    watermarkColor: 'text-cyan-700',
  },
  elevenlabs: {
    cardBgClass: 'bg-gradient-to-br from-zinc-100/80 via-white to-stone-50',
    watermarkColor: 'text-zinc-900',
  },
  vercel: {
    cardBgClass: 'bg-gradient-to-br from-neutral-100/80 via-white to-slate-50',
    watermarkColor: 'text-neutral-900',
  },
  supabase: {
    cardBgClass: 'bg-gradient-to-br from-emerald-50/60 via-white to-zinc-50',
    watermarkColor: 'text-emerald-600',
  },
  'hugging face': {
    cardBgClass: 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/50',
    watermarkColor: 'text-amber-700',
  },
};

export function getCompanyTheme(name: string = ''): CompanyTheme {
  const normalized = (name || '').trim().toLowerCase();
  const found =
    COMPANY_THEMES[normalized] ||
    Object.entries(COMPANY_THEMES).find(([key]) =>
      normalized.includes(key)
    )?.[1];
  return (
    found || {
      cardBgClass: 'bg-gradient-to-br from-slate-50/85 via-white to-slate-100/60',
      watermarkColor: 'text-slate-900',
    }
  );
}

