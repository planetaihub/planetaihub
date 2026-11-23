/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  BrainCircuit,
  Check,
  Copy,
  Cpu,
  ExternalLink,
  RotateCcw,
  Search,
  Sliders,
} from 'lucide-react';
import { AdBanner } from '../AdBanner';
import { BrandAvatar, getCompanyMark } from '../BrandAvatar';

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
    description: 'Multimodal assistant with deep Workspace integration and long-context reasoning.',
    url: 'https://gemini.google.com',
    domain: 'google.com',
  },
  {
    id: 'claude',
    name: 'Claude AI',
    provider: 'Anthropic',
    category: 'General & Reasoning',
    description: 'Thoughtful long-form writing, structured coding artifacts, and nuanced analysis.',
    url: 'https://claude.ai',
    domain: 'anthropic.com',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    category: 'General & Reasoning',
    description: 'Versatile conversational assistant with free web search, canvas, and voice modes.',
    url: 'https://chatgpt.com',
    domain: 'openai.com',
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    provider: 'Perplexity',
    category: 'Research & Search',
    description: 'Real-time answer engine delivering cited web research and source summaries.',
    url: 'https://www.perplexity.ai',
    domain: 'perplexity.ai',
  },
  {
    id: 'grok',
    name: 'Grok',
    provider: 'xAI',
    category: 'General & Reasoning',
    description: 'Fast conversational assistant with live web context and coding support.',
    url: 'https://grok.com',
    domain: 'x.ai',
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    provider: 'Microsoft',
    category: 'General & Reasoning',
    description: 'Free web-grounded assistant for drafting, image creation, and productivity tasks.',
    url: 'https://copilot.microsoft.com',
    domain: 'microsoft.com',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek',
    category: 'Coding & Docs',
    description: 'Open-weight reasoning and code generation chat with step-by-step logic traces.',
    url: 'https://chat.deepseek.com',
    domain: 'deepseek.com',
  },
  {
    id: 'mistral',
    name: 'Mistral Le Chat',
    provider: 'Mistral AI',
    category: 'General & Reasoning',
    description: 'High-speed European assistant supporting web search, code execution, and canvas.',
    url: 'https://chat.mistral.ai',
    domain: 'mistral.ai',
  },
  {
    id: 'huggingchat',
    name: 'HuggingChat',
    provider: 'Hugging Face',
    category: 'Coding & Docs',
    description: 'Free open-source model playground for comparing leading community LLMs.',
    url: 'https://huggingface.co/chat',
    domain: 'huggingface.co',
  },
  {
    id: 'poe',
    name: 'Poe',
    provider: 'Quora',
    category: 'General & Reasoning',
    description: 'Unified multi-model chat hub to switch between top text and coding models.',
    url: 'https://poe.com',
    domain: 'poe.com',
  },
  {
    id: 'notebooklm',
    name: 'Google NotebookLM',
    provider: 'Google',
    category: 'Research & Search',
    description: 'Source-grounded research notebook turning PDFs and notes into study guides and audio.',
    url: 'https://notebooklm.google.com',
    domain: 'google.com',
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    provider: 'Meta',
    category: 'General & Reasoning',
    description: 'Free Llama-powered assistant for quick answers, brainstorming, and image generation.',
    url: 'https://www.meta.ai',
    domain: 'meta.ai',
  },
  {
    id: 'phind',
    name: 'Phind',
    provider: 'Phind',
    category: 'Coding & Docs',
    description: 'Developer-focused technical answer engine with live code references and docs.',
    url: 'https://www.phind.com',
    domain: 'phind.com',
  },
  {
    id: 'gamma',
    name: 'Gamma AI',
    provider: 'Gamma',
    category: 'Decks & Audio',
    description: 'Generate structured slide decks, briefs, and one-page web docs from a short outline.',
    url: 'https://gamma.app',
    domain: 'gamma.app',
  },
  {
    id: 'otter',
    name: 'Otter.ai',
    provider: 'Otter',
    category: 'Decks & Audio',
    description: 'Real-time meeting transcription, speaker notes, and searchable action summaries.',
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

interface BrandTheme {
  backdropClass: string;
  watermarkColor: string;
  pillClass: string;
}

const BRAND_THEMES: Record<string, BrandTheme> = {
  gemini: {
    backdropClass: 'bg-gradient-to-br from-blue-50/80 via-indigo-50/70 to-sky-50',
    watermarkColor: 'text-indigo-600',
    pillClass: 'border-indigo-200 bg-white/95 text-indigo-700',
  },
  claude: {
    backdropClass: 'bg-gradient-to-br from-orange-50/80 via-amber-50/70 to-rose-50/50',
    watermarkColor: 'text-orange-600',
    pillClass: 'border-orange-200 bg-white/95 text-orange-700',
  },
  chatgpt: {
    backdropClass: 'bg-gradient-to-br from-emerald-50/80 via-teal-50/70 to-cyan-50/50',
    watermarkColor: 'text-emerald-600',
    pillClass: 'border-emerald-200 bg-white/95 text-emerald-700',
  },
  perplexity: {
    backdropClass: 'bg-gradient-to-br from-cyan-50/80 via-sky-50/70 to-slate-100/60',
    watermarkColor: 'text-cyan-700',
    pillClass: 'border-cyan-200 bg-white/95 text-cyan-800',
  },
  grok: {
    backdropClass: 'bg-gradient-to-br from-slate-100/80 via-zinc-100/70 to-slate-50',
    watermarkColor: 'text-slate-700',
    pillClass: 'border-slate-300 bg-white/95 text-slate-800',
  },
  copilot: {
    backdropClass: 'bg-gradient-to-br from-sky-50/80 via-blue-50/70 to-teal-50/50',
    watermarkColor: 'text-sky-600',
    pillClass: 'border-sky-200 bg-white/95 text-sky-800',
  },
  deepseek: {
    backdropClass: 'bg-gradient-to-br from-blue-50/80 via-sky-100/60 to-indigo-50/50',
    watermarkColor: 'text-blue-700',
    pillClass: 'border-blue-200 bg-white/95 text-blue-800',
  },
  mistral: {
    backdropClass: 'bg-gradient-to-br from-amber-50/80 via-yellow-50/70 to-orange-100/50',
    watermarkColor: 'text-amber-600',
    pillClass: 'border-amber-200 bg-white/95 text-amber-800',
  },
  huggingchat: {
    backdropClass: 'bg-gradient-to-br from-yellow-50/80 via-amber-50/70 to-orange-50/50',
    watermarkColor: 'text-amber-500',
    pillClass: 'border-amber-200 bg-white/95 text-amber-800',
  },
  poe: {
    backdropClass: 'bg-gradient-to-br from-purple-50/80 via-indigo-50/70 to-violet-50/50',
    watermarkColor: 'text-purple-600',
    pillClass: 'border-purple-200 bg-white/95 text-purple-800',
  },
  notebooklm: {
    backdropClass: 'bg-gradient-to-br from-blue-50/80 via-indigo-50/70 to-sky-50',
    watermarkColor: 'text-blue-600',
    pillClass: 'border-blue-200 bg-white/95 text-blue-800',
  },
  'meta-ai': {
    backdropClass: 'bg-gradient-to-br from-blue-50/80 via-cyan-50/70 to-slate-50',
    watermarkColor: 'text-blue-600',
    pillClass: 'border-blue-200 bg-white/95 text-blue-800',
  },
  phind: {
    backdropClass: 'bg-gradient-to-br from-emerald-50/80 via-teal-50/70 to-slate-50',
    watermarkColor: 'text-emerald-700',
    pillClass: 'border-emerald-200 bg-white/95 text-emerald-800',
  },
  gamma: {
    backdropClass: 'bg-gradient-to-br from-violet-50/80 via-purple-50/70 to-pink-50/50',
    watermarkColor: 'text-violet-600',
    pillClass: 'border-violet-200 bg-white/95 text-violet-800',
  },
  otter: {
    backdropClass: 'bg-gradient-to-br from-blue-50/80 via-sky-50/70 to-teal-50/50',
    watermarkColor: 'text-blue-600',
    pillClass: 'border-blue-200 bg-white/95 text-blue-800',
  },
};

const DEFAULT_THEME: BrandTheme = {
  backdropClass: 'bg-gradient-to-br from-slate-50 via-white to-slate-100/60',
  watermarkColor: 'text-slate-900',
  pillClass: 'border-slate-200 bg-white/95 text-slate-700',
};

const SOP_BLUEPRINTS = [
  {
    title: 'Inbox Triage SOP',
    content:
      '1. Label urgent founder emails red.\n2. Archive newsletters to Read Later.\n3. Draft replies for 80% of routine inquiries.\n4. Send EOD summary digest.',
  },
  {
    title: 'RLHF Quality Checklist',
    content:
      '1. Verify factual accuracy against trusted web citations.\n2. Ensure tone is objective, neutral, and helpful.\n3. Check for logical consistency and edge cases.\n4. Format output cleanly in Markdown.',
  },
  {
    title: 'Client Onboarding Flow',
    content:
      '1. Send signed contractor agreement & 50% retainer invoice.\n2. Invite client to shared Notion workspace & Slack channel.\n3. Collect secure credentials via 1Password vault.\n4. Schedule kickoff alignment call.',
  },
];

const DEFAULT_PROMPT_STATE = {
  role: 'Senior AI Prompt Engineer',
  context: 'Building high-precision remote workflow templates',
  task: 'Draft comprehensive documentation with step-by-step checklists',
  constraints: 'Zero markdown errors, concise and actionable, professional tone',
  outputFormat: 'Structured Markdown with bullet points',
};

const DEFAULT_TOKEN_SAMPLE =
  'PlanetAI Hub delivers curated remote AI and tech contracts with transparent USD pay.';

async function safeCopyToClipboard(text: string): Promise<boolean> {
  if (!text || typeof navigator === 'undefined') return false;
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }
  if (typeof document === 'undefined') return false;
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export const AIAssistantsTab: React.FC = () => {
  const [viewMode, setViewMode] = useState<'directory' | 'workbench'>('directory');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<AssistantCategory>('All');

  // Prompt Architect State
  const [promptRole, setPromptRole] = useState(DEFAULT_PROMPT_STATE.role);
  const [promptContext, setPromptContext] = useState(DEFAULT_PROMPT_STATE.context);
  const [promptTask, setPromptTask] = useState(DEFAULT_PROMPT_STATE.task);
  const [promptConstraints, setPromptConstraints] = useState(DEFAULT_PROMPT_STATE.constraints);
  const [promptOutputFormat, setPromptOutputFormat] = useState(DEFAULT_PROMPT_STATE.outputFormat);
  const [promptCopied, setPromptCopied] = useState(false);

  // Token Estimator State
  const [tokenText, setTokenText] = useState(DEFAULT_TOKEN_SAMPLE);
  const [copiedBpTitle, setCopiedBpTitle] = useState<string | null>(null);

  const compiledPrompt = useMemo(() => {
    const safeRole = String(promptRole ?? '').trim() || '[Role / Persona]';
    const safeContext = String(promptContext ?? '').trim() || '[Context / Background]';
    const safeTask = String(promptTask ?? '').trim() || '[Core Task]';
    const safeConstraints = String(promptConstraints ?? '').trim() || '[Constraints]';
    const safeFormat = String(promptOutputFormat ?? '').trim() || '[Output Format]';

    return `### Role\n${safeRole}\n\n### Context\n${safeContext}\n\n### Task\n${safeTask}\n\n### Constraints\n${safeConstraints}\n\n### Output Format\n${safeFormat}`;
  }, [promptRole, promptContext, promptTask, promptConstraints, promptOutputFormat]);

  const tokenStats = useMemo(() => {
    const safeText = typeof tokenText === 'string' ? tokenText : '';
    const chars = safeText.length;
    const trimmed = safeText.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const estimatedTokens = chars > 0 ? Math.ceil(chars / 4) : 0;
    const geminiCost = ((estimatedTokens / 1_000_000) * 0.075).toFixed(5);
    const claudeCost = ((estimatedTokens / 1_000_000) * 3.0).toFixed(5);
    const gptCost = ((estimatedTokens / 1_000_000) * 2.5).toFixed(5);

    return { chars, words, estimatedTokens, geminiCost, claudeCost, gptCost };
  }, [tokenText]);

  const filteredTools = useMemo(() => {
    const safeList = Array.isArray(AI_ASSISTANTS) ? AI_ASSISTANTS : [];
    const q = String(query ?? '').trim().toLowerCase();
    return safeList.filter((tool) => {
      if (!tool) return false;
      if (category !== 'All' && tool.category !== category) return false;
      if (q) {
        const haystack = [tool.name, tool.provider, tool.category, tool.description]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, category]);

  const handleCopyPrompt = async () => {
    const ok = await safeCopyToClipboard(compiledPrompt);
    if (ok) {
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 2500);
    }
  };

  const handleResetPrompt = () => {
    setPromptRole(DEFAULT_PROMPT_STATE.role);
    setPromptContext(DEFAULT_PROMPT_STATE.context);
    setPromptTask(DEFAULT_PROMPT_STATE.task);
    setPromptConstraints(DEFAULT_PROMPT_STATE.constraints);
    setPromptOutputFormat(DEFAULT_PROMPT_STATE.outputFormat);
  };

  const isWorkbench = viewMode === 'workbench';

  return (
    <section
      aria-labelledby="ai-tools-heading"
      className="w-full max-w-full space-y-8 pb-12 overflow-x-hidden"
    >
      {/* Header Banner & Mode Switcher (Light SaaS Card) */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/70 p-6 text-slate-900 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              <BrainCircuit className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
              <span>AI &amp; Automation Workbench</span>
            </div>
            <h1
              id="ai-tools-heading"
              className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              AI Assistants Directory &amp; Zero-API Workbench
            </h1>
            <p className="text-xs text-slate-600 sm:text-sm">
              Explore {AI_ASSISTANTS.length} verified AI assistant portals or utilize our 100% client-side prompt architect, token estimator, and SOP blueprint generator.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="AI Assistants view mode"
            className="grid w-full grid-cols-2 gap-2.5 rounded-2xl border border-slate-200 bg-slate-100/90 p-1.5 sm:w-auto shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isWorkbench}
              onClick={() => setViewMode('directory')}
              className={`min-h-[42px] rounded-xl px-3.5 py-2 text-center text-xs font-semibold leading-snug transition-colors ${
                !isWorkbench
                  ? 'bg-[#1D4ED8] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
              }`}
            >
              AI Directory
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isWorkbench}
              onClick={() => setViewMode('workbench')}
              className={`min-h-[42px] rounded-xl px-3.5 py-2 text-center text-xs font-semibold leading-snug transition-colors ${
                isWorkbench
                  ? 'bg-[#1D4ED8] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
              }`}
            >
              API Bench
            </button>
          </div>
        </div>
      </div>

      {!isWorkbench ? (
        <div className="space-y-6">
          {/* Search & Category Grid */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search AI assistants by name or provider..."
                aria-label="Search AI assistants"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-3.5 pl-10 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>

            <div
              role="tablist"
              aria-label="Filter AI assistants by category"
              className="grid grid-cols-2 gap-2.5 lg:flex lg:flex-wrap lg:items-center"
            >
              {CATEGORIES.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setCategory(cat)}
                    className={`flex min-h-[42px] items-center justify-center rounded-xl border px-3.5 py-2 text-center text-xs font-semibold leading-snug transition-all ${
                      cat === 'All' ? 'col-span-2 lg:col-span-1' : ''
                    } ${
                      isActive
                        ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Tool Cards Grid with Brand Watermarks */}
          {filteredTools.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <p className="font-display text-base font-bold text-slate-900">
                No matching AI assistants found
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Try another search term or switch back to All categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
                className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF]"
              >
                Show All {AI_ASSISTANTS.length} Assistants
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => {
                const theme = BRAND_THEMES[tool.id] ?? DEFAULT_THEME;

                return (
                  <article
                    key={tool.id}
                    className={`group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-200/90 ${theme.backdropClass} p-5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-xl`}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                      aria-hidden="true"
                    >
                      <div
                        className={`absolute -bottom-5 -right-5 flex items-center justify-center font-display font-black tracking-tighter select-none text-[110px] leading-none opacity-[0.12] group-hover:opacity-[0.18] transition-opacity duration-300 ${theme.watermarkColor}`}
                      >
                        {getCompanyMark(tool.name)}
                      </div>
                    </div>

                    <div className="relative z-10 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold shadow-2xs ${theme.pillClass}`}
                        >
                          {tool.category}
                        </span>
                        <div className="rounded-xl border border-white/90 bg-white p-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
                          <BrandAvatar
                            name={tool.name}
                            domain={tool.domain}
                            size="sm"
                            variant="light"
                            className="border-0 bg-transparent shadow-none"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-[#1D4ED8] transition-colors">
                          {tool.name}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-slate-600">{tool.provider}</p>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 mt-6 border-t border-slate-200/60 pt-4">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1E40AF]"
                      >
                        <span>Open Assistant Portal</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Zero-API AI & Automation Workbench (API Bench) */
        <div className="space-y-8">
          {/* Tool 1: Prompt Architect */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#1D4ED8]">
                  <Sliders className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Interactive Prompt Architect
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleResetPrompt}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>
              <p className="text-xs text-slate-600">
                Configure role, context, task, constraints, and output format to generate clean, high-precision prompts offline.
              </p>

              <div>
                <label htmlFor="wb-role" className="block text-xs font-semibold text-slate-700">
                  Role / Persona
                </label>
                <input
                  id="wb-role"
                  type="text"
                  value={promptRole}
                  onChange={(e) => setPromptRole(e.target.value)}
                  className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
                />
              </div>

              <div>
                <label htmlFor="wb-context" className="block text-xs font-semibold text-slate-700">
                  Context / Background
                </label>
                <input
                  id="wb-context"
                  type="text"
                  value={promptContext}
                  onChange={(e) => setPromptContext(e.target.value)}
                  className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
                />
              </div>

              <div>
                <label htmlFor="wb-task" className="block text-xs font-semibold text-slate-700">
                  Core Task
                </label>
                <input
                  id="wb-task"
                  type="text"
                  value={promptTask}
                  onChange={(e) => setPromptTask(e.target.value)}
                  className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="wb-constraints"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Constraints &amp; Rules
                  </label>
                  <input
                    id="wb-constraints"
                    type="text"
                    value={promptConstraints}
                    onChange={(e) => setPromptConstraints(e.target.value)}
                    className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
                  />
                </div>

                <div>
                  <label htmlFor="wb-format" className="block text-xs font-semibold text-slate-700">
                    Output Format
                  </label>
                  <input
                    id="wb-format"
                    type="text"
                    value={promptOutputFormat}
                    onChange={(e) => setPromptOutputFormat(e.target.value)}
                    className="input-obsidian mt-1 h-10 w-full px-3 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm lg:col-span-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Compiled Prompt Output
                  </h3>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                      promptCopied
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-[#1D4ED8] bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                    }`}
                  >
                    {promptCopied ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>{promptCopied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap break-words select-all max-h-64 overflow-y-auto">
                  {compiledPrompt}
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Ready to paste directly into Gemini, Claude, or ChatGPT with zero API configuration.
              </p>
            </div>
          </div>

          {/* Tool 2: Token & Context Estimator */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Cpu className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Client-Side LLM Token Estimator
                  </h2>
                </div>
                {tokenText && (
                  <button
                    type="button"
                    onClick={() => setTokenText('')}
                    className="text-[11px] font-semibold text-slate-500 hover:text-rose-600"
                  >
                    Clear Text
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Instant local token counter and estimated API cost comparison across leading LLM providers.
              </p>

              <div>
                <label
                  htmlFor="wb-token-input"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Input Text / Document
                </label>
                <textarea
                  id="wb-token-input"
                  value={tokenText}
                  onChange={(e) => setTokenText(e.target.value)}
                  rows={4}
                  placeholder="Paste text to estimate token count and model input cost..."
                  className="input-obsidian mt-1 w-full p-3 text-xs"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm lg:col-span-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <h3 className="font-display text-base font-bold text-emerald-900">
                  Token &amp; Cost Analysis
                </h3>
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-xl border border-emerald-200 bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Characters
                    </p>
                    <p className="mt-1 font-mono text-base font-bold text-slate-900 tabular-nums">
                      {tokenStats.chars}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Words
                    </p>
                    <p className="mt-1 font-mono text-base font-bold text-slate-900 tabular-nums">
                      {tokenStats.words}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Est. Tokens
                    </p>
                    <p className="mt-1 font-mono text-base font-bold text-emerald-700 tabular-nums">
                      {tokenStats.estimatedTokens}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between gap-2 border-b border-emerald-200 pb-1">
                    <span className="text-slate-600">Est. API Cost (Gemini Flash):</span>
                    <span className="font-mono font-bold text-emerald-800 tabular-nums">
                      ${tokenStats.geminiCost}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-emerald-200 pb-1">
                    <span className="text-slate-600">Est. API Cost (GPT-4o):</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      ${tokenStats.gptCost}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-600">Est. API Cost (Claude 3.5 Sonnet):</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      ${tokenStats.claudeCost}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tool 3: No-Code Workflow & SOP Blueprint Generator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                No-Code Workflow &amp; SOP Blueprint Generator
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Pre-built, customizable automation templates ready to copy into your Notion workspace or client documentation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {(SOP_BLUEPRINTS ?? []).map((bp) => {
                const isCopied = copiedBpTitle === bp.title;
                return (
                  <div
                    key={bp.title}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4"
                  >
                    <div className="space-y-2">
                      <h3 className="font-display text-sm font-bold text-slate-900">{bp.title}</h3>
                      <pre className="rounded-xl border border-slate-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-600 whitespace-pre-wrap break-words">
                        {bp.content}
                      </pre>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        const ok = await safeCopyToClipboard(bp.content);
                        if (ok) {
                          setCopiedBpTitle(bp.title);
                          window.setTimeout(() => setCopiedBpTitle(null), 2000);
                        }
                      }}
                      className="inline-flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E40AF]"
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{isCopied ? 'Copied Blueprint!' : 'Copy SOP Template'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <AdBanner />
    </section>
  );
};
