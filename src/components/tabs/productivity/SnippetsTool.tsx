import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Plus, Search, Trash2 } from 'lucide-react';
import { readJson, STORAGE_KEYS, writeJson } from '../../../utils/storage';

interface SnippetItem {
  id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
}

const STARTER_SNIPPETS: SnippetItem[] = [
  {
    id: 'snip-1',
    title: 'Portfolio & Links Intro',
    category: 'Outreach',
    content:
      'GitHub: https://github.com/yourhandle | Portfolio: https://yoursite.dev | Timezone: UTC-5 (4h overlap with EMEA)',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'snip-2',
    title: 'Code Review Prompt',
    category: 'AI Prompt',
    content:
      'Review this diff for race conditions, accessibility regressions, and edge-case error handling. Keep feedback concise and ordered by severity.',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'snip-3',
    title: 'Async Daily Standup',
    category: 'Remote Ops',
    content:
      'Yesterday: Shipped checkout validation fix.\nToday: Writing Playwright specs for offline queue.\nBlockers: None.',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
];

export const SnippetsTool: React.FC = () => {
  const [snippets, setSnippets] = useState<SnippetItem[]>(() =>
    readJson<SnippetItem[]>(
      STORAGE_KEYS.PRODUCTIVITY_SNIPPETS,
      STARTER_SNIPPETS
    )
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Outreach');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    writeJson(STORAGE_KEYS.PRODUCTIVITY_SNIPPETS, snippets);
  }, [snippets]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const item: SnippetItem = {
      id: `snip-${Date.now()}`,
      title: title.trim(),
      category: category.trim() || 'General',
      content: content.trim(),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setSnippets((prev) => [item, ...prev]);
    setTitle('');
    setContent('');
  };

  const handleCopy = async (item: SnippetItem) => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Clipboard blocked
    }
  };

  const handleDelete = (id: string) => {
    setSnippets((prev) => prev.filter((item) => item.id !== id));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return snippets;
    return snippets.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
    );
  }, [snippets, search]);

  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-wider text-slate-400';
  const inputClass =
    'mt-1.5 h-11 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 text-sm text-slate-100 placeholder:text-slate-600 transition-colors focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {copiedId && (
        <div
          role="status"
          className="fixed right-5 bottom-20 z-50 inline-flex items-center gap-2 rounded-xl border border-emerald-400/35 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-emerald-300 shadow-[0_12px_32px_rgba(0,0,0,0.65)] backdrop-blur-xl md:bottom-6"
        >
          <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <span>Copied ✓</span>
        </div>
      )}

      {/* Add Snippet Form */}
      <form
        onSubmit={handleAdd}
        className="space-y-4 rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-5"
      >
        <h2 className="border-b border-white/[0.08] pb-3 font-display text-lg font-bold text-slate-50">
          Save New Snippet
        </h2>

        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Recruiter Availability Reply"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Group / Label</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. AI Prompt, Links, Outreach"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Text, Prompt, or Link</label>
          <textarea
            rows={5}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste reusable text here..."
            className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 p-3 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-300"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Save Snippet</span>
        </button>
      </form>

      {/* Saved Snippets List */}
      <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-7">
        <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-bold text-slate-50">
            Saved Snippets ({filtered.length})
          </h2>
          <div className="relative w-full sm:w-60">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search snippets..."
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 pr-3 pl-9 text-xs text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">
            No snippets found. Add your first prompt or link on the left.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/[0.08] bg-[#060913]/65 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-50">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[11px] font-medium text-indigo-300">
                        {item.category}
                      </span>
                      <span aria-hidden="true" className="mx-1.5 text-slate-600">
                        ·
                      </span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {item.updatedAt}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_14px_rgba(6,182,212,0.25)] transition-all hover:bg-cyan-300"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check
                            className="h-3.5 w-3.5 text-slate-950"
                            aria-hidden="true"
                          />
                          <span>Copied ✓</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Delete ${item.title}`}
                      className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-400 transition-colors hover:bg-red-500/15 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <p className="mt-2.5 whitespace-pre-line font-mono text-xs leading-relaxed text-slate-300">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
