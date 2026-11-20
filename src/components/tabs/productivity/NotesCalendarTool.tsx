import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Trash2,
} from 'lucide-react';
import type { UserNote } from '../../../types';
import { loadUserNotes, saveUserNotes } from '../../../utils/storage';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const NotesCalendarTool: React.FC = () => {
  const todayIso = toIsoDate(new Date());
  const [viewDate, setViewDate] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDateIso, setSelectedDateIso] = useState<string>(todayIso);

  const [notes, setNotes] = useState<UserNote[]>(() => {
    const existing = loadUserNotes();
    if (existing.length > 0) return existing;
    return [
      {
        id: 'note-welcome',
        title: `Daily Plan · ${todayIso}`,
        content:
          '- Review shortlisted remote roles\n- Tailor resume summary\n- Complete two 25m focus blocks',
        updatedAt: todayIso,
      },
    ];
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(
    () => notes[0]?.id || ''
  );

  useEffect(() => {
    saveUserNotes(notes);
  }, [notes]);

  const activeNote =
    notes.find((n) => n.id === activeNoteId) || notes[0] || null;

  const calendarCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ day: number | null; iso: string | null }> = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ day: null, iso: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;
      cells.push({ day, iso });
    }
    return cells;
  }, [viewDate]);

  const noteDatesSet = useMemo(
    () => new Set(notes.map((n) => n.updatedAt)),
    [notes]
  );

  const createNote = (forDate = selectedDateIso) => {
    const next: UserNote = {
      id: `note-${Date.now()}`,
      title: `Note · ${forDate}`,
      content: '',
      updatedAt: forDate,
    };
    setNotes((prev) => [next, ...prev]);
    setActiveNoteId(next.id);
  };

  const updateActiveNote = (field: 'title' | 'content', value: string) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? { ...n, [field]: value, updatedAt: selectedDateIso }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const remaining = prev.filter((n) => n.id !== id);
      if (activeNoteId === id) {
        setActiveNoteId(remaining[0]?.id || '');
      }
      return remaining;
    });
  };

  const exportTxt = () => {
    if (!activeNote) return;
    const body = `${activeNote.title}\nDate: ${activeNote.updatedAt}\n\n${activeNote.content}`;
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Monthly Interactive Calendar */}
      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-5">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <h2 className="font-display text-base font-bold text-slate-50">
            {monthLabel}
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setViewDate(
                  (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
                )
              }
              aria-label="Previous month"
              className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
                setSelectedDateIso(todayIso);
              }}
              className="min-h-[36px] rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() =>
                setViewDate(
                  (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
                )
              }
              aria-label="Next month"
              className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="py-1">
              {wd}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {calendarCells.map((cell, idx) => {
            if (!cell.day || !cell.iso) {
              return <div key={`empty-${idx}`} className="h-10" />;
            }
            const isSelected = cell.iso === selectedDateIso;
            const isToday = cell.iso === todayIso;
            const hasNote = noteDatesSet.has(cell.iso);

            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => setSelectedDateIso(cell.iso!)}
                className={`relative flex h-10 flex-col items-center justify-center rounded-xl font-mono text-xs font-semibold tabular-nums transition-all ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                    : isToday
                      ? 'border border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                      : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span>{cell.day}</span>
                {hasNote && (
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 h-1 w-1 rounded-full ${
                      isSelected ? 'bg-slate-950' : 'bg-emerald-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 border-t border-white/[0.08] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Saved Notes ({notes.length})
            </span>
            <button
              type="button"
              onClick={() => createNote(selectedDateIso)}
              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_14px_rgba(6,182,212,0.28)] hover:bg-cyan-300"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>New Note</span>
            </button>
          </div>

          <div className="mt-3 max-h-48 space-y-1.5 overflow-y-auto">
            {notes.map((n) => (
              <div
                key={n.id}
                className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition-colors ${
                  activeNote?.id === n.id
                    ? 'border-cyan-400/40 bg-cyan-400/10'
                    : 'border-white/[0.08] bg-[#060913]/60 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveNoteId(n.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-xs font-semibold text-slate-50">
                    {n.title || 'Untitled Note'}
                  </p>
                  <p className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {n.updatedAt}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => deleteNote(n.id)}
                  aria-label={`Delete ${n.title}`}
                  className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Local Notepad Editor */}
      <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6 lg:col-span-7">
        {activeNote ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
              <span className="font-mono text-xs text-slate-400 tabular-nums">
                Selected Date:{' '}
                <span className="text-cyan-300">{selectedDateIso}</span> · Saved
                locally
              </span>
              <button
                type="button"
                onClick={exportTxt}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                <span>Export .txt</span>
              </button>
            </div>

            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateActiveNote('title', e.target.value)}
              placeholder="Note title..."
              className="w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3.5 py-2.5 font-display text-lg font-bold text-slate-50 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
            />

            <textarea
              rows={13}
              value={activeNote.content}
              onChange={(e) => updateActiveNote('content', e.target.value)}
              placeholder="Write meeting notes, daily tasks, or scratchpad ideas..."
              className="w-full rounded-xl border border-white/[0.08] bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-slate-400">
              No notes open. Create a note for {selectedDateIso}.
            </p>
            <button
              type="button"
              onClick={() => createNote(selectedDateIso)}
              className="mt-4 min-h-[44px] rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-300"
            >
              Create Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
