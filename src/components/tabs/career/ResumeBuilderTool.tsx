import React, { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  Check,
  Copy,
  FileText,
  Globe,
  Mail,
  MapPin,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import { loadCareerState, saveCareerState } from '../../../utils/storage';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string;
}

interface CareerDocumentState {
  docType: 'resume' | 'cover-letter';
  fullName: string;
  targetTitle: string;
  email: string;
  location: string;
  portfolioUrl: string;
  summary: string;
  skills: string;
  experiences: ExperienceItem[];
  recipientName: string;
  targetCompany: string;
  coverLetterOpening: string;
  coverLetterBody: string;
  coverLetterClosing: string;
}

const DEFAULT_DOC: CareerDocumentState = {
  docType: 'resume',
  fullName: 'Jordan Reyes',
  targetTitle: 'Senior Frontend & Product Engineer',
  email: 'jordan.reyes@example.com',
  location: 'Remote · UTC-5 (Americas / EMEA Overlap)',
  portfolioUrl: 'github.com/jordanreyes',
  summary:
    'Product-focused software engineer with 6+ years building accessible, offline-capable React and TypeScript web applications for distributed teams. Specialized in design systems, performance optimization, and clear async technical writing.',
  skills:
    'TypeScript, React 19, Tailwind CSS, Vite, PWA / Service Workers, Node.js, PostgreSQL, Playwright, WCAG AA',
  experiences: [
    {
      id: 'exp-1',
      role: 'Senior Frontend Engineer',
      company: 'Northbound Systems',
      period: '2023 – Present',
      bullets:
        'Architected shared React component library adopted across 4 product squads, cutting UI regressions by 38%.\nLed local-first IndexedDB sync initiative enabling zero-downtime field workflows on slow connections.\nReduced bundle size by 29% and improved p95 route transition latency under 90ms.',
    },
    {
      id: 'exp-2',
      role: 'Full-Stack Engineer',
      company: 'MetricFlow',
      period: '2020 – 2023',
      bullets:
        'Built self-serve billing and usage analytics dashboards in TypeScript and PostgreSQL.\nAutomated Playwright accessibility checks across 40+ customer-facing workflows.',
    },
  ],
  recipientName: 'Hiring Team',
  targetCompany: 'Linearity Labs',
  coverLetterOpening:
    'I am writing to apply for the Senior Frontend Engineer role at Linearity Labs. Having spent the past six years designing accessible component primitives and local-first React applications in fully remote engineering teams, your focus on sub-50ms interactive craft resonates strongly with my work.',
  coverLetterBody:
    'At Northbound Systems, I unified four fragmented frontends onto a single TypeScript design system and led our offline PWA caching architecture. Working across European and North American timezones taught me to document architectural decisions clearly in written RFCs and unblock teammates asynchronously.',
  coverLetterClosing:
    'I would welcome the opportunity to discuss how my experience with design systems and performance engineering can support Linearity Labs. Thank you for your time and consideration.',
};

const POWER_VERBS = [
  'Architected',
  'Spearheaded',
  'Accelerated',
  'Automated',
  'Reduced latency by 35%',
];

const SAMPLE_SUMMARY =
  'Senior product-minded engineer with 6+ years shipping resilient TypeScript, React, and AI-assisted web platforms in distributed remote teams. Track record of cutting p95 latency by 40%, scaling design systems across squads, and driving measurable activation lift.';

const SAMPLE_COVER_HOOK =
  'I am excited to apply for this role—over the past six years building high-craft web applications for remote-first engineering organizations, I have specialized in turning complex workflows into sub-100ms user experiences.';

export const ResumeBuilderTool: React.FC = () => {
  const [doc, setDoc] = useState<CareerDocumentState>(() =>
    loadCareerState<CareerDocumentState>('doc', DEFAULT_DOC)
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    saveCareerState('doc', doc);
  }, [doc]);

  const updateField = <K extends keyof CareerDocumentState>(
    field: K,
    value: CareerDocumentState[K]
  ) => {
    setDoc((prev) => ({ ...prev, [field]: value }));
  };

  const updateExperience = (
    id: string,
    field: keyof ExperienceItem,
    value: string
  ) => {
    setDoc((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addExperience = () => {
    setDoc((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp-${Date.now()}`,
          role: 'Role Title',
          company: 'Company Name',
          period: '2022 – 2024',
          bullets: 'Delivered measurable outcome, reducing cycle time by 25%.',
        },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    setDoc((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const appendBulletChip = (expId: string, chip: string) => {
    setDoc((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        const trimmed = exp.bullets.trim();
        const addition =
          chip === 'Reduced latency by 35%'
            ? 'Reduced latency by 35% across core user workflows through caching and bundle splitting.'
            : `${chip} cross-functional delivery, improving reliability and measurable team velocity.`;
        return {
          ...exp,
          bullets: trimmed ? `${trimmed}\n${addition}` : addition,
        };
      }),
    }));
  };

  const handleReset = () => {
    setDoc(DEFAULT_DOC);
  };

  const buildPlainText = (): string => {
    const header = `${doc.fullName}\n${doc.targetTitle}\n${doc.email} | ${doc.location} | ${doc.portfolioUrl}`;
    if (doc.docType === 'cover-letter') {
      return [
        header,
        '',
        `Dear ${doc.recipientName || 'Hiring Team'} at ${doc.targetCompany || 'your team'},`,
        '',
        doc.coverLetterOpening,
        '',
        doc.coverLetterBody,
        '',
        doc.coverLetterClosing,
        '',
        'Sincerely,',
        doc.fullName,
      ].join('\n');
    }

    const expText = doc.experiences
      .map((exp) => {
        const lines = exp.bullets
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => `- ${l}`)
          .join('\n');
        return `${exp.role} — ${exp.company} (${exp.period})\n${lines}`;
      })
      .join('\n\n');

    return [
      header,
      '',
      'SUMMARY',
      doc.summary,
      '',
      'EXPERIENCE',
      expText,
      '',
      'SKILLS',
      doc.skills,
    ].join('\n');
  };

  const atsAnalysis = useMemo(() => {
    let score = 0;
    const identityFields = [
      doc.fullName,
      doc.targetTitle,
      doc.email,
      doc.location,
      doc.portfolioUrl,
    ].filter((v) => v.trim().length > 2).length;
    score += Math.min(25, identityFields * 5);

    if (doc.docType === 'resume') {
      if (doc.summary.trim().length >= 100) score += 20;
      else if (doc.summary.trim().length >= 30) score += 10;

      const allBullets = doc.experiences
        .flatMap((e) => e.bullets.split('\n'))
        .map((b) => b.trim())
        .filter(Boolean);
      const metricBullets = allBullets.filter((b) => /\d+|%|\$/.test(b)).length;
      if (allBullets.length >= 3) score += 20;
      else if (allBullets.length >= 1) score += 10;
      if (metricBullets >= 2) score += 20;
      else if (metricBullets === 1) score += 10;

      const skillCount = doc.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean).length;
      if (skillCount >= 5) score += 15;
      else if (skillCount >= 2) score += 8;
    } else {
      if (doc.recipientName.trim() && doc.targetCompany.trim()) score += 15;
      if (doc.coverLetterOpening.trim().length >= 80) score += 20;
      if (doc.coverLetterBody.trim().length >= 100) score += 25;
      if (doc.coverLetterClosing.trim().length >= 40) score += 15;
    }

    const clamped = Math.min(100, Math.max(0, score));
    const status =
      clamped >= 90 ? 'Optimal' : clamped >= 70 ? 'Strong' : 'Needs Detail';
    return { score: clamped, status };
  }, [doc]);

  const wordCount = useMemo(() => {
    const text = buildPlainText().trim();
    return text ? text.split(/\s+/).length : 0;
  }, [doc]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const labelClass =
    'flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400';
  const inputClass =
    'mt-1.5 h-10 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 text-sm text-slate-100 placeholder:text-slate-600 transition-colors focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none';
  const textareaClass =
    'mt-1.5 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 py-2.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 transition-colors focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none';

  return (
    <div className="space-y-5">
      {/* Copied Toast Notification */}
      {copied && (
        <div
          role="status"
          className="no-print fixed right-5 bottom-20 z-50 inline-flex items-center gap-2 rounded-xl border border-emerald-400/35 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-emerald-300 shadow-[0_12px_32px_rgba(0,0,0,0.65)] backdrop-blur-xl md:bottom-6"
        >
          <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <span>Copied ✓</span>
        </div>
      )}

      {/* Floating Studio Toolbar */}
      <div className="no-print flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-slate-900/80 px-4 py-2.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Pill Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#060913]/85 p-1">
            <button
              type="button"
              onClick={() => updateField('docType', 'resume')}
              className={`min-h-[38px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                doc.docType === 'resume'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Resume Builder
            </button>
            <button
              type="button"
              onClick={() => updateField('docType', 'cover-letter')}
              className={`min-h-[38px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                doc.docType === 'cover-letter'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Cover Letter
            </button>
          </div>

          {/* Live ATS Readability & Completeness Meter */}
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#060913]/70 px-3 py-1.5">
            <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  atsAnalysis.score >= 85
                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                    : 'bg-cyan-400'
                }`}
                style={{ width: `${atsAnalysis.score}%` }}
              />
            </div>
            <span className="font-mono text-xs font-semibold text-slate-200 tabular-nums whitespace-nowrap">
              ATS Score:{' '}
              <span
                className={
                  atsAnalysis.score >= 85 ? 'text-emerald-400' : 'text-cyan-400'
                }
              >
                {atsAnalysis.score}%
              </span>{' '}
              <span className="text-slate-500">·</span>{' '}
              <span className="text-slate-300">{atsAnalysis.status}</span>
            </span>
          </div>
        </div>

        {/* Crisp Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-400">Copied ✓</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-300 whitespace-nowrap"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Split Workspace: Elevated Form Editor + Crisp White A4 Paper Sheet */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left: Elevated Form Editor */}
        <div className="no-print space-y-5 rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-50">
                Candidate Details
              </h2>
              <p className="text-xs text-slate-400">
                Single-column ATS structure · Instant browser auto-save
              </p>
            </div>
            <span className="rounded-lg border border-indigo-400/30 bg-indigo-500/20 px-2.5 py-1 font-mono text-[11px] font-semibold text-indigo-300 tabular-nums">
              {wordCount} words
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                <User className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={doc.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Briefcase className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                <span>Target Role Title</span>
              </label>
              <input
                type="text"
                value={doc.targetTitle}
                onChange={(e) => updateField('targetTitle', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Mail className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={doc.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Globe className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                <span>Portfolio / GitHub</span>
              </label>
              <input
                type="text"
                value={doc.portfolioUrl}
                onChange={(e) => updateField('portfolioUrl', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>
                <MapPin className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                <span>Location &amp; Timezone Overlap</span>
              </label>
              <input
                type="text"
                value={doc.location}
                onChange={(e) => updateField('location', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {doc.docType === 'resume' ? (
            <>
              <div className="border-t border-white/[0.08] pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className={labelClass}>
                    <Sparkles className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                    <span>Executive Summary</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => updateField('summary', SAMPLE_SUMMARY)}
                    className="inline-flex items-center gap-1 rounded-lg border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/25"
                  >
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    <span>Sample Fill</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={doc.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  className={textareaClass}
                />
              </div>

              <div className="space-y-3 border-t border-white/[0.08] pt-4">
                <div className="flex items-center justify-between">
                  <span className={labelClass}>
                    <Briefcase className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                    <span>Experience History</span>
                  </span>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-400/20"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Add Role</span>
                  </button>
                </div>

                {doc.experiences.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="space-y-2.5 rounded-xl border border-white/[0.08] bg-[#060913]/55 p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                        Role 0{idx + 1}
                      </span>
                      {doc.experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          aria-label={`Remove experience ${idx + 1}`}
                          className="inline-flex min-h-[30px] min-w-[30px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) =>
                          updateExperience(exp.id, 'role', e.target.value)
                        }
                        placeholder="Role Title"
                        className="h-9 rounded-lg border border-white/[0.08] bg-slate-950/75 px-2.5 text-xs font-medium text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, 'company', e.target.value)
                        }
                        placeholder="Company"
                        className="h-9 rounded-lg border border-white/[0.08] bg-slate-950/75 px-2.5 text-xs font-medium text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) =>
                          updateExperience(exp.id, 'period', e.target.value)
                        }
                        placeholder="2023 – Present"
                        className="h-9 rounded-lg border border-white/[0.08] bg-slate-950/75 px-2.5 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
                      />
                    </div>

                    <textarea
                      rows={3}
                      value={exp.bullets}
                      onChange={(e) =>
                        updateExperience(exp.id, 'bullets', e.target.value)
                      }
                      placeholder="One quantified achievement per line..."
                      className="w-full rounded-lg border border-white/[0.08] bg-slate-950/75 px-2.5 py-2 text-xs leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
                    />

                    {/* AI Power Verbs Quick-Insert Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        + Power Verbs:
                      </span>
                      {POWER_VERBS.map((verb) => (
                        <button
                          key={verb}
                          type="button"
                          onClick={() => appendBulletChip(exp.id, verb)}
                          className="rounded-md border border-white/[0.08] bg-slate-900/90 px-2 py-0.5 text-[11px] font-medium text-slate-300 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                        >
                          + {verb}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.08] pt-4">
                <label className={labelClass}>
                  <span>Core Skills (comma-separated)</span>
                </label>
                <textarea
                  rows={2}
                  value={doc.skills}
                  onChange={(e) => updateField('skills', e.target.value)}
                  className={textareaClass}
                />
              </div>
            </>
          ) : (
            <div className="space-y-4 border-t border-white/[0.08] pt-4">
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    <span>Recipient / Hiring Manager</span>
                  </label>
                  <input
                    type="text"
                    value={doc.recipientName}
                    onChange={(e) =>
                      updateField('recipientName', e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <span>Target Company</span>
                  </label>
                  <input
                    type="text"
                    value={doc.targetCompany}
                    onChange={(e) =>
                      updateField('targetCompany', e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label className={labelClass}>
                    <span>Opening Hook</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateField('coverLetterOpening', SAMPLE_COVER_HOOK)
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/25"
                  >
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    <span>Sample Hook</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={doc.coverLetterOpening}
                  onChange={(e) =>
                    updateField('coverLetterOpening', e.target.value)
                  }
                  className={textareaClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span>Evidence &amp; Remote Fit Paragraph</span>
                </label>
                <textarea
                  rows={4}
                  value={doc.coverLetterBody}
                  onChange={(e) =>
                    updateField('coverLetterBody', e.target.value)
                  }
                  className={textareaClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span>Closing Call to Action</span>
                </label>
                <textarea
                  rows={2}
                  value={doc.coverLetterClosing}
                  onChange={(e) =>
                    updateField('coverLetterClosing', e.target.value)
                  }
                  className={textareaClass}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Elevated Crisp White Executive A4 Paper Sheet */}
        <div className="space-y-3 lg:col-span-6">
          <div className="no-print flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <FileText className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
              <span>Executive A4 Preview</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-400">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              />
              A4 Print Ready · Auto-Saved
            </span>
          </div>

          <div
            id="printable-career-doc"
            className="rounded-xl border border-slate-200/80 bg-white p-8 font-sans text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.7)] sm:p-10"
          >
            {/* Header */}
            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                {doc.fullName || 'Your Name'}
              </h3>
              <p className="mt-0.5 text-sm font-semibold text-slate-700">
                {doc.targetTitle || 'Target Role'}
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {[doc.email, doc.location, doc.portfolioUrl]
                  .filter(Boolean)
                  .join('  ·  ')}
              </p>
            </div>

            {doc.docType === 'resume' ? (
              <div className="mt-6 space-y-6 text-sm text-slate-800">
                <div>
                  <h4 className="border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Executive Summary
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700">
                    {doc.summary}
                  </p>
                </div>

                <div>
                  <h4 className="border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Professional Experience
                  </h4>
                  <div className="mt-3 space-y-4">
                    {doc.experiences.map((exp) => {
                      const bulletLines = exp.bullets
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean);
                      return (
                        <div key={exp.id}>
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-sm font-bold text-slate-950">
                              {exp.role}
                              <span className="font-medium text-slate-600">
                                {' '}
                                — {exp.company}
                              </span>
                            </p>
                            <span className="font-mono text-xs text-slate-500 tabular-nums">
                              {exp.period}
                            </span>
                          </div>
                          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-700">
                            {bulletLines.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Technical &amp; Core Skills
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700">
                    {doc.skills}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
                <p className="font-semibold text-slate-950">
                  Dear {doc.recipientName || 'Hiring Team'} at{' '}
                  {doc.targetCompany || 'your team'},
                </p>
                <p>{doc.coverLetterOpening}</p>
                <p>{doc.coverLetterBody}</p>
                <p>{doc.coverLetterClosing}</p>
                <div className="pt-3">
                  <p className="text-slate-600">Sincerely,</p>
                  <p className="mt-1 font-bold text-slate-950">
                    {doc.fullName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
