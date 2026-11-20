import React, { useEffect, useState } from 'react';

const BRAND_DOMAIN_MAP: Record<string, string> = {
  // Featured & Curated AI / Tech Employers
  'scale ai': 'scale.com',
  anthropic: 'anthropic.com',
  'babel audio': 'babel.audio',
  micro1: 'micro1.ai',
  mercor: 'mercor.com',
  visora: 'visora.com',
  spout: 'withspout.com',
  withspout: 'withspout.com',
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

export function resolveBrandDomain(
  name: string,
  explicitDomain?: string
): string {
  const normalizedName = name.trim().toLowerCase();
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

function getTwoLetterMonogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AI';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export interface BrandAvatarProps {
  name: string;
  domain?: string;
  size?: 'xs' | 'md';
  className?: string;
}

/**
 * Renders a crisp real brand logo using Google's high-res favicon resolver
 * inside a frosted obsidian glass badge, with an automatic 2-letter monogram fallback.
 */
export const BrandAvatar: React.FC<BrandAvatarProps> = ({
  name,
  domain,
  size = 'md',
  className = '',
}) => {
  const resolvedDomain = resolveBrandDomain(name, domain);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [resolvedDomain, name]);

  const sizeClasses =
    size === 'xs'
      ? 'w-6 h-6 rounded-md bg-white/[0.06] border border-white/10 p-0.5'
      : 'w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 p-1.5';

  const textSizeClass = size === 'xs' ? 'text-[9px]' : 'text-xs';
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
          className={`font-mono font-bold tracking-tight text-indigo-200 select-none ${textSizeClass}`}
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
          className="h-full w-full rounded-[4px] object-contain"
        />
      )}
    </div>
  );
};
