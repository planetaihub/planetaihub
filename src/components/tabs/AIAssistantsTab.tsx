import React, { useMemo, useState } from 'react';
import { ExternalLink, Search, Sparkles } from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { BrandAvatar } from '../BrandAvatar';

type AssistantCategory =
  | 'All'
  | 'General & Reasoning'
  | 'Research & Search'
  | 'Coding & Docs'
  | 'Decks & Audio';

interface AIAssistantTool {
  id: string;
  name: string;
  provider: string;
  category: Exclude<AssistantCategory, 'All'>;
  description: string;
  url: string;
  domain: string;
}

const AI_ASSISTANTS: AIAssistantTool[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    provider: 'Google',
    category: 'General & Reasoning',
    description:
      'Multimodal assistant with deep Workspace integration and long-context reasoning.',
    url: 'https://gemini.google.com',
    domain: 'google.com',
  },
  {
    id: 'claude',
    name: 'Claude AI',
    provider: 'Anthropic',
    category: 'General & Reasoning',
    description:
      'Thoughtful long-form writing, structured coding artifacts, and nuanced analysis.',
    url: 'https://claude.ai',
    domain: 'anthropic.com',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    category: 'General & Reasoning',
    description:
      'Versatile conversational assistant with free web search, canvas, and voice modes.',
    url: 'https://chatgpt.com',
    domain: 'openai.com',
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    provider: 'Perplexity',
    category: 'Research & Search',
    description:
      'Real-time answer engine delivering cited web research and source summaries.',
    url: 'https://www.perplexity.ai',
    domain: 'perplexity.ai',
  },
  {
    id: 'grok',
    name: 'Grok',
    provider: 'xAI',
    category: 'General & Reasoning',
    description:
      'Fast conversational assistant with live web context and coding support.',
    url: 'https://grok.com',
    domain: 'x.ai',
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    provider: 'Microsoft',
    category: 'General & Reasoning',
    description:
      'Free web-grounded assistant for drafting, image creation, and productivity tasks.',
    url: 'https://copilot.microsoft.com',
    domain: 'microsoft.com',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek',
    category: 'Coding & Docs',
    description:
      'Open-weight reasoning and code generation chat with step-by-step logic traces.',
    url: 'https://chat.deepseek.com',
    domain: 'deepseek.com',
  },
  {
    id: 'mistral',
    name: 'Mistral Le Chat',
    provider: 'Mistral AI',
    category: 'General & Reasoning',
    description:
      'High-speed European assistant supporting web search, code execution, and canvas.',
    url: 'https://chat.mistral.ai',
    domain: 'mistral.ai',
  },
  {
    id: 'huggingchat',
    name: 'HuggingChat',
    provider: 'Hugging Face',
    category: 'Coding & Docs',
    description:
      'Free open-source model playground for comparing leading community LLMs.',
    url: 'https://huggingface.co/chat',
    domain: 'huggingface.co',
  },
  {
    id: 'poe',
    name: 'Poe',
    provider: 'Quora',
    category: 'General & Reasoning',
    description:
      'Unified multi-model chat hub to switch between top text and coding models.',
    url: 'https://poe.com',
    domain: 'poe.com',
  },
  {
    id: 'notebooklm',
    name: 'Google NotebookLM',
    provider: 'Google',
    category: 'Research & Search',
    description:
      'Source-grounded research notebook turning PDFs and notes into study guides and audio.',
    url: 'https://notebooklm.google.com',
    domain: 'google.com',
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    provider: 'Meta',
    category: 'General & Reasoning',
    description:
      'Free Llama-powered assistant for quick answers, brainstorming, and image generation.',
    url: 'https://www.meta.ai',
    domain: 'meta.ai',
  },
  {
    id: 'phind',
    name: 'Phind',
    provider: 'Phind',
    category: 'Coding & Docs',
    description:
      'Developer-focused technical answer engine with live code references and docs.',
    url: 'https://www.phind.com',
    domain: 'phind.com',
  },
  {
    id: 'gamma',
    name: 'Gamma AI',
    provider: 'Gamma',
    category: 'Decks & Audio',
    description:
      'Generate structured slide decks, briefs, and one-page web docs from a short outline.',
    url: 'https://gamma.app',
    domain: 'gamma.app',
  },
  {
    id: 'otter',
    name: 'Otter.ai',
    provider: 'Otter',
    category: 'Decks & Audio',
    description:
      'Real-time meeting transcription, speaker notes, and searchable action summaries.',
    url: 'https://otter.ai',
    domain: 'otter.ai',
  },
];

const CATEGORIES: AssistantCategory[] = [
  'All',
  'General & Reasoning',
  'Research & Search',
  'Coding & Docs',
  'Decks & Audio',
];

export const AIAssistantsTab: React.FC = () => {
  const [category, setCategory] = useState<AssistantCategory>('All');
  const [query, setQuery] = useState('');

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AI_ASSISTANTS.filter((tool) => {
      if (category !== 'All' && tool.category !== category) return false;
      if (q) {
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.provider.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [category, query]);

  return (
    <section aria-labelledby="ai-assistants-heading" className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-cyan-500/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/25 bg-slate-900/75 text-cyan-400">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Curated AI Directory
              </p>
              <h1
                id="ai-assistants-heading"
                className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance"
              >
                15 Free AI Assistants
              </h1>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            Direct directory of leading free-tier AI workspaces for research, coding, document synthesis, and slide creation.
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
            placeholder="Filter assistants..."
            aria-label="Filter AI assistants"
            className="input-obsidian h-11 w-full pr-3.5 pl-10 text-sm"
          />
        </div>
      </div>

      {/* Horizontally Scrollable Category Sub-Tab Bar */}
      <div
        role="tablist"
        aria-label="Filter AI assistants by category"
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
              {cat === 'All' ? `All Tools (${AI_ASSISTANTS.length})` : cat}
            </button>
          );
        })}
      </div>

      {/* Editorial Card Grid with Crisp Monogram Avatars */}
      {filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/75 p-10 text-center backdrop-blur-xl">
          <p className="text-sm font-medium text-slate-300">
            No AI assistants match "{query}".
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('All');
            }}
            className="mt-4 min-h-[44px] rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Show All 15 Tools
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
                      <p className="truncate text-xs text-slate-400">
                        {tool.provider}
                        <span aria-hidden="true" className="mx-1.5 text-slate-600">
                          ·
                        </span>
                        <span className="text-indigo-300">{tool.category}</span>
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
                  className="inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300 whitespace-nowrap"
                >
                  <span>Open Tool ↗</span>
                  <ExternalLink className="h-3.5 w-3.5 sr-only" aria-hidden="true" />
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
