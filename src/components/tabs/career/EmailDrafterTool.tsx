import React, { useMemo, useState } from 'react';
import {
  Building2,
  Check,
  Copy,
  Link2,
  Mail,
  RotateCcw,
  Sparkles,
  User,
} from 'lucide-react';

type EmailTemplateType = 'cold-outreach' | 'follow-up' | 'thank-you';

interface EmailInputs {
  recipientName: string;
  companyName: string;
  roleTitle: string;
  yourName: string;
  highlight: string;
  portfolioUrl: string;
}

const DEFAULT_INPUTS: EmailInputs = {
  recipientName: 'Alex',
  companyName: 'ChronicleDB',
  roleTitle: 'Senior Frontend Engineer',
  yourName: 'Jordan Reyes',
  highlight:
    'recently cut UI regressions by 38% and built an offline-first React/TypeScript workspace',
  portfolioUrl: 'https://github.com/jordanreyes',
};

export const EmailDrafterTool: React.FC = () => {
  const [template, setTemplate] = useState<EmailTemplateType>('cold-outreach');
  const [inputs, setInputs] = useState<EmailInputs>(DEFAULT_INPUTS);
  const [copiedPart, setCopiedPart] = useState<'subject' | 'body' | null>(null);

  const generated = useMemo(() => {
    const recipient = inputs.recipientName.trim() || 'there';
    const company = inputs.companyName.trim() || 'your team';
    const role = inputs.roleTitle.trim() || 'the open role';
    const sender = inputs.yourName.trim() || 'Your Name';
    const highlight =
      inputs.highlight.trim() ||
      'shipped production features with measurable product impact';
    const link = inputs.portfolioUrl.trim();

    if (template === 'cold-outreach') {
      return {
        subject: `${role} @ ${company} — quick note from ${sender}`,
        body: [
          `Hi ${recipient},`,
          '',
          `I have been following ${company}'s product work closely and noticed the ${role} opening.`,
          '',
          `In my recent role, I ${highlight}. I work well in async remote teams and would love to bring that same ownership to ${company}.`,
          link ? `\nWork samples & background: ${link}` : '',
          '',
          `If you have 10 minutes this week—or can point me to the right person on the hiring team—I would appreciate connecting.`,
          '',
          'Best regards,',
          sender,
        ]
          .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
          .join('\n'),
      };
    }

    if (template === 'follow-up') {
      return {
        subject: `Following up: ${role} application — ${sender}`,
        body: [
          `Hi ${recipient},`,
          '',
          `I applied for the ${role} position at ${company} last week and wanted to briefly follow up to reiterate my interest.`,
          '',
          `Given ${company}'s current priorities, my background where I ${highlight} aligns closely with what your team is building.`,
          link ? `\nFor quick reference, here is my portfolio: ${link}` : '',
          '',
          `Happy to share additional code or work samples whenever convenient.`,
          '',
          'Thank you,',
          sender,
        ]
          .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
          .join('\n'),
      };
    }

    return {
      subject: `Thank you — ${role} conversation with ${company}`,
      body: [
        `Hi ${recipient},`,
        '',
        `Thank you for taking the time to speak with me today about the ${role} role at ${company}.`,
        '',
        `Our discussion around team collaboration and shipping priorities reinforced how excited I am about contributing—especially leveraging my experience where I ${highlight}.`,
        '',
        `Please let me know if any additional details would help as your team reviews next steps.`,
        '',
        'Warm regards,',
        sender,
      ].join('\n'),
    };
  }, [template, inputs]);

  const copyText = async (part: 'subject' | 'body', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPart(part);
      setTimeout(() => setCopiedPart(null), 1800);
    } catch {
      // Clipboard blocked
    }
  };

  const wordCount = useMemo(() => {
    const trimmed = generated.body.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [generated.body]);

  const mailtoHref = `mailto:?subject=${encodeURIComponent(
    generated.subject
  )}&body=${encodeURIComponent(generated.body)}`;

  const labelClass =
    'flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400';
  const inputClass =
    'mt-1.5 h-10 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 text-sm text-slate-100 placeholder:text-slate-600 transition-colors focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none';

  return (
    <div className="space-y-5">
      {copiedPart && (
        <div
          role="status"
          className="fixed right-5 bottom-20 z-50 inline-flex items-center gap-2 rounded-xl border border-emerald-400/35 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-emerald-300 shadow-[0_12px_32px_rgba(0,0,0,0.65)] backdrop-blur-xl md:bottom-6"
        >
          <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <span>Copied ✓</span>
        </div>
      )}

      {/* Floating Studio Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-slate-900/80 px-4 py-2.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar rounded-xl border border-white/[0.08] bg-[#060913]/85 p-1">
          {(
            [
              { id: 'cold-outreach', label: 'Cold Outreach' },
              { id: 'follow-up', label: 'Follow-Up' },
              { id: 'thank-you', label: 'Thank You' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTemplate(item.id)}
              className={`min-h-[38px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                template === item.id
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setInputs(DEFAULT_INPUTS)}
          className="inline-flex min-h-[40px] items-center gap-1.5 self-start rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] sm:self-center whitespace-nowrap"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <span>Reset Variables</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Variables Form */}
        <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6 lg:col-span-5">
          <div className="border-b border-white/[0.08] pb-3">
            <h2 className="font-display text-lg font-bold text-slate-50">
              Personalize Variables
            </h2>
            <p className="text-xs text-slate-400">
              High-signal outreach under 110 words for busy hiring leads.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <label className={labelClass}>
                <User className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                <span>Recipient First Name</span>
              </label>
              <input
                type="text"
                value={inputs.recipientName}
                onChange={(e) =>
                  setInputs((p) => ({ ...p, recipientName: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Building2 className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                <span>Company Name</span>
              </label>
              <input
                type="text"
                value={inputs.companyName}
                onChange={(e) =>
                  setInputs((p) => ({ ...p, companyName: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <span>Target Role</span>
              </label>
              <input
                type="text"
                value={inputs.roleTitle}
                onChange={(e) =>
                  setInputs((p) => ({ ...p, roleTitle: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <span>Your Name</span>
              </label>
              <input
                type="text"
                value={inputs.yourName}
                onChange={(e) =>
                  setInputs((p) => ({ ...p, yourName: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className={labelClass}>
                <Sparkles className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                <span>Key Proof Point / Highlight</span>
              </label>
              <textarea
                rows={3}
                value={inputs.highlight}
                onChange={(e) =>
                  setInputs((p) => ({ ...p, highlight: e.target.value }))
                }
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 py-2.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 transition-colors focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className={labelClass}>
                <Link2 className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                <span>Portfolio or LinkedIn URL (optional)</span>
              </label>
              <input
                type="text"
                value={inputs.portfolioUrl}
                onChange={(e) =>
                  setInputs((p) => ({ ...p, portfolioUrl: e.target.value }))
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Live Email Output */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6 lg:col-span-7">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Generated Draft
                </span>
                <span className="rounded-md border border-indigo-400/30 bg-indigo-500/20 px-2 py-0.5 font-mono text-[11px] font-semibold text-indigo-300 tabular-nums">
                  {wordCount} words
                </span>
              </div>
              <a
                href={mailtoHref}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300 whitespace-nowrap"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Open in Mail App</span>
              </a>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#060913]/75 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Subject Line
                </span>
                <button
                  type="button"
                  onClick={() => copyText('subject', generated.subject)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
                >
                  {copiedPart === 'subject' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                      <span className="text-emerald-400">Copied ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy Subject</span>
                    </>
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-slate-50">
                {generated.subject}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#060913]/75 p-4 sm:p-5">
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
                {generated.body}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => copyText('body', generated.body)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-300"
            >
              {copiedPart === 'body' ? (
                <>
                  <Check className="h-4 w-4 text-slate-950" aria-hidden="true" />
                  <span>Copied ✓</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span>Copy Email Body</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
