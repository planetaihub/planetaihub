import React, { useMemo, useState } from 'react';
import { Code2, Search } from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { BrandAvatar } from '../BrandAvatar';

type DevToolCategory =
  | 'All'
  | 'AI App Builders'
  | 'Coding & Validation'
  | 'Backend & Hosting'
  | 'Audio & Voice QA';

interface DevToolItem {
  id: string;
  name: string;
  category: Exclude<DevToolCategory, 'All'>;
  description: string;
  url: string;
  domain: string;
}

const DEV_TOOLS: DevToolItem[] = [
  {
    id: 'ai-studio',
    name: 'Google AI Studio',
    category: 'AI App Builders',
    description:
      'Prototyping environment and free API playground for building Gemini-powered apps.',
    url: 'https://aistudio.google.com',
    domain: 'google.com',
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot Free Tier',
    category: 'Coding & Validation',
    description:
      'In-editor code completions and chat included free for individual GitHub accounts.',
    url: 'https://github.com/features/copilot',
    domain: 'github.com',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Backend & Hosting',
    description:
      'Open-source Postgres database, auth, edge functions, and storage with generous free tier.',
    url: 'https://supabase.com',
    domain: 'supabase.com',
  },
  {
    id: 'netlify',
    name: 'Netlify',
    category: 'Backend & Hosting',
    description:
      'Instant Git-to-edge web hosting with preview deploys, forms, and serverless functions.',
    url: 'https://www.netlify.com',
    domain: 'netlify.com',
  },
  {
    id: 'flutterflow',
    name: 'FlutterFlow',
    category: 'AI App Builders',
    description:
      'Visual cross-platform builder exporting clean Flutter code for iOS, Android, and Web.',
    url: 'https://www.flutterflow.io',
    domain: 'flutterflow.io',
  },
  {
    id: 'mit-app-inventor',
    name: 'MIT App Inventor',
    category: 'AI App Builders',
    description:
      'Block-based visual mobile app builder designed for rapid prototyping and education.',
    url: 'https://appinventor.mit.edu',
    domain: 'appinventor.mit.edu',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Backend & Hosting',
    description:
      'Zero-config frontend cloud for Vite, React, and Next.js with instant global edge CDN.',
    url: 'https://vercel.com',
    domain: 'vercel.com',
  },
  {
    id: 'replit',
    name: 'Replit',
    category: 'AI App Builders',
    description:
      'Browser-based collaborative IDE and cloud container runtime with instant live URLs.',
    url: 'https://replit.com',
    domain: 'replit.com',
  },
  {
    id: 'bolt-new',
    name: 'Bolt.new',
    category: 'AI App Builders',
    description:
      'Full-stack WebContainers workspace to prompt, run, and deploy web apps in-browser.',
    url: 'https://bolt.new',
    domain: 'bolt.new',
  },
  {
    id: 'v0-vercel',
    name: 'v0 by Vercel',
    category: 'AI App Builders',
    description:
      'Generative UI workbench producing copy-ready React and Tailwind CSS components.',
    url: 'https://v0.dev',
    domain: 'v0.dev',
  },
  {
    id: 'audacity-openvino',
    name: 'Audacity + OpenVINO',
    category: 'Audio & Voice QA',
    description:
      'Free open-source audio editor enhanced with local AI noise suppression and stem tools.',
    url: 'https://www.audacityteam.org',
    domain: 'audacityteam.org',
  },
  {
    id: 'krisp',
    name: 'Krisp Acoustic Check',
    category: 'Audio & Voice QA',
    description:
      'Real-time background noise, echo cancellation, and mic clarity testing for remote calls.',
    url: 'https://krisp.ai',
    domain: 'krisp.ai',
  },
  {
    id: 'jsonlint',
    name: 'JSONLint & Schema Validator',
    category: 'Coding & Validation',
    description:
      'Validate, format, and inspect JSON payloads and structural syntax errors instantly.',
    url: 'https://jsonlint.com',
    domain: 'jsonlint.com',
  },
];

const CATEGORIES: DevToolCategory[] = [
  'All',
  'AI App Builders',
  'Backend & Hosting',
  'Coding & Validation',
  'Audio & Voice QA',
];

export const DevToolsTab: React.FC = () => {
  const [category, setCategory] = useState<DevToolCategory>('All');
  const [query, setQuery] = useState('');

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEV_TOOLS.filter((tool) => {
      if (category !== 'All' && tool.category !== category) return false;
      if (q) {
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [category, query]);

  return (
    <section aria-labelledby="dev-tools-heading" className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-cyan-500/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/25 bg-slate-900/75 text-cyan-400">
              <Code2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Builder Launchpad
              </p>
              <h1
                id="dev-tools-heading"
                className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance"
              >
                Free App Builders & Developer Tools
              </h1>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            Curated launchpad of free-tier app builders, cloud hosting platforms, code validators, and remote audio utilities.
          </p>
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter developer tools..."
            aria-label="Filter developer tools"
            className="input-obsidian h-11 w-full pr-3.5 pl-10 text-sm"
          />
        </div>
      </div>

      {/* Horizontally Scrollable Category Sub-Tab Bar */}
      <div
        role="tablist"
        aria-label="Filter developer tools by category"
        className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x no-scrollbar mobile-scroll-fade px-3 pr-8 pb-1 md:px-0 md:pr-0"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={(e) => {
                setCategory(cat);
                if (window.innerWidth <= 768) {
                  e.currentTarget.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest',
                  });
                }
              }}
              className={`snap-center min-h-[40px] rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-sm'
                  : 'border-indigo-400/30 bg-indigo-500/20 text-indigo-300 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              {cat === 'All' ? `All Tools (${DEV_TOOLS.length})` : cat}
            </button>
          );
        })}
      </div>

      {/* Editorial Card Grid */}
      {filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/75 p-10 text-center backdrop-blur-xl">
          <p className="text-sm font-medium text-slate-300">
            No tools match "{query}".
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('All');
            }}
            className="mt-4 min-h-[44px] rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Show All {DEV_TOOLS.length} Tools
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool, index) => (
            <article
              key={tool.id}
              className="flex flex-col justify-between rounded-2xl border border-cyan-500/15 bg-slate-900/75 p-5 shadow-[0_10px_28px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)]"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <BrandAvatar name={tool.name} domain={tool.domain} />
                    <div className="min-w-0">
                      <h2 className="truncate font-serif text-lg font-semibold text-white">
                        {tool.name}
                      </h2>
                      <p className="truncate text-xs text-indigo-300">
                        {tool.category}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-slate-500 tabular-nums shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <p className="mt-3.5 line-clamp-2 text-sm leading-relaxed text-slate-400">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 border-t border-cyan-500/15 pt-3.5">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300 whitespace-nowrap"
                >
                  Open Tool ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdBanner />
    </section>
  );
};
