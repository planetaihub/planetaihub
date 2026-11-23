/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  PlayCircle,
  Sparkles,
  X,
} from 'lucide-react';

type VaCategory =
  | 'All VA Tracks'
  | 'Executive & Admin VA'
  | 'AI-Powered VA Tools'
  | 'Client Outreach & Discovery Calls'
  | 'E-Commerce & Social VA';

interface VaVideo {
  id: string;
  title: string;
  speaker: string;
  category: Exclude<VaCategory, 'All VA Tracks'>;
  youtubeId: string;
  duration: string;
  summary: string;
  studyNotes: string[];
  checklist: string[];
}

interface VaGuide {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  category: string;
  content: string[];
}

const VA_CATEGORIES: VaCategory[] = [
  'All VA Tracks',
  'Executive & Admin VA',
  'AI-Powered VA Tools',
  'Client Outreach & Discovery Calls',
  'E-Commerce & Social VA',
];

const VA_VIDEOS: VaVideo[] = [
  {
    id: 'va-vid-1',
    title: 'How to Become a Virtual Assistant with No Experience (Complete Beginner Checklist)',
    speaker: 'Sarah Jenkins • Remote Executive VA Agency Lead',
    category: 'Executive & Admin VA',
    youtubeId: 'Mf2rWWxzoe4',
    duration: '22 min',
    summary:
      'A step-by-step roadmap for absolute beginners to set up their remote VA profile, identify high-demand skills, and land their first client.',
    studyNotes: [
      'Transitioning transferable administrative & communication skills into professional VA offerings.',
      'Setting up a high-converting portfolio without prior formal corporate VA experience.',
      'Avoiding low-paying gig platforms in favor of direct outreach and warm networking.',
    ],
    checklist: [
      'Inventory your current administrative & tech strengths.',
      'Build a clean 1-page Notion portfolio or landing page.',
      'Draft your initial outreach message template.',
    ],
  },
  {
    id: 'va-vid-2',
    title: 'Foundational Virtual Assistant Skills to Charge $30–$35/hr',
    speaker: 'Marcus Vance • Remote Operations Director',
    category: 'Executive & Admin VA',
    youtubeId: 'JVZ227_OWaU',
    duration: '28 min',
    summary:
      'Master the specialized technical stack and executive workflow management required to command $30 to $35+ per hour.',
    studyNotes: [
      'Moving beyond basic data entry to high-leverage calendar architecture and CRM administration.',
      'Mastering Google Workspace, Notion, Slack, and Airtable power workflows.',
      'Value-based pricing vs. hourly billing for remote contractors.',
    ],
    checklist: [
      'Audit your proficiency in modern workspace tools.',
      'Learn advanced calendar time-blocking principles.',
      'Create standard operating procedure (SOP) templates.',
    ],
  },
  {
    id: 'va-vid-3',
    title: 'Executive Inbox & Email Management Tutorial for Virtual Assistants',
    speaker: 'Elena Rostova • Executive Operations Lead',
    category: 'Executive & Admin VA',
    youtubeId: 'dPC7eo7AYwA',
    duration: '25 min',
    summary:
      'The ultimate blueprint for zeroing client inboxes daily, drafting ghost-written replies, and protecting executive focus time.',
    studyNotes: [
      'Implementing a 4-folder triage system (Action, Waiting, Reference, Archive).',
      'Drafting email responses matching your principal’s exact tone and voice.',
      'Handling urgent escalations and VIP filtering protocols.',
    ],
    checklist: [
      'Set up Gmail filters, labels, and VIP star rules.',
      'Draft template responses for 10 common inbound inquiries.',
      'Establish a daily 3-times-a-day inbox triage schedule.',
    ],
  },
  {
    id: 'va-vid-4',
    title: 'Client Calendar Management Walkthrough for Virtual Assistants',
    speaker: 'David Chen • Chief of Staff Mentor',
    category: 'Executive & Admin VA',
    youtubeId: 'ftI53fz6En0',
    duration: '20 min',
    summary:
      'How to manage complex multi-timezone executive calendars, prevent double-bookings, and enforce deep work blocks.',
    studyNotes: [
      'Configuring Calendly and Google Calendar scheduling rules across time zones.',
      'Defending founder focus time and blocking recurring strategy sessions.',
      'Handling last-minute rescheduling requests professionally.',
    ],
    checklist: [
      'Audit existing client calendar settings and buffer times.',
      'Establish core deep-work hours for your principal.',
      'Create a standard scheduling escalation checklist.',
    ],
  },
  {
    id: 'va-vid-5',
    title: 'AI & Automation Tools Every Virtual Assistant Needs',
    speaker: 'AI Operations Guild • Tech Masterclass',
    category: 'AI-Powered VA Tools',
    youtubeId: 'JgYeQTVzFOI',
    duration: '32 min',
    summary:
      'Leverage ChatGPT, Claude, Otter.ai, and Zapier automation connectors to double your daily output in half the time.',
    studyNotes: [
      'Using LLMs to draft executive correspondence and summarize lengthy meeting transcripts.',
      'Automating recurring handoffs with no-code Zapier/Make connectors.',
      'Maintaining rigorous data privacy and client confidentiality.',
    ],
    checklist: [
      'Build reusable prompt templates for email triaging.',
      'Configure automated meeting transcription summaries.',
      'Test secure password vault sharing practices.',
    ],
  },
  {
    id: 'va-vid-6',
    title: 'Notion for Virtual Assistants: Client Command Centers & AI Workflows',
    speaker: 'Workspace Ops Academy',
    category: 'AI-Powered VA Tools',
    youtubeId: 'FfHB4z2eC-M',
    duration: '19 min',
    summary:
      'Build centralized Notion client hubs with relational task databases, meeting notes rollups, and automated SOP checklists.',
    studyNotes: [
      'Structuring a multi-client Notion dashboard without leaking confidential workspaces.',
      'Using Notion AI summaries to convert raw founder voice memos into assigned sprints.',
      'Creating reusable onboarding checklists for recurring client retainers.',
    ],
    checklist: [
      'Duplicate a clean Client Hub template with Task, SOP, and Asset databases.',
      'Configure weekly status rollup filters for client EOD reporting.',
      'Set granular workspace sharing permissions per client domain.',
    ],
  },
  {
    id: 'va-vid-7',
    title: 'Systematic AI Prompting Workflows for Executive Ops & Documentation',
    speaker: 'DeepLearning.AI (Andrew Ng)',
    category: 'AI-Powered VA Tools',
    youtubeId: '8ib4Qnh2HFE',
    duration: '45 min',
    summary:
      'Apply structured delimiters, JSON/Markdown output formatting, and iterative prompt templates to standardize client deliverables.',
    studyNotes: [
      'Separating client data from task instructions using clear XML or triple-backtick delimiters.',
      'Generating consistent Markdown SOPs, tables, and executive briefs in seconds.',
      'Verifying intermediate outputs before sending drafts to founders or stakeholders.',
    ],
    checklist: [
      'Build 5 delimiter-wrapped prompt templates in your local Snippets Vault.',
      'Standardize meeting recap outputs with Owner, Action, and Deadline columns.',
      'Audit all AI-assisted drafts for client brand voice accuracy.',
    ],
  },
  {
    id: 'va-vid-8',
    title: 'How to Lead a VA Discovery Call Like a Pro & Close Clients',
    speaker: 'Sarah Jenkins & Elena Rostova',
    category: 'Client Outreach & Discovery Calls',
    youtubeId: '5n6sV6uUhfU',
    duration: '29 min',
    summary:
      'The consultative sales framework to diagnose founder bottlenecks, build instant trust, and close 3-figure monthly retainers.',
    studyNotes: [
      'The 80/20 discovery call script: listening to founder pain points.',
      'Handling budget objections and proposing structured monthly retainers.',
      'Running paid trial tasks ($150 test week) to de-risk the relationship.',
    ],
    checklist: [
      'Prepare 5 open-ended diagnostic questions for prospective clients.',
      'Draft a standard 3-tier service packaging proposal template.',
      'Practice handling common pushbacks on retainer rates.',
    ],
  },
  {
    id: 'va-vid-9',
    title: 'Structuring Client Interview & Screening Stories with the STAR Method',
    speaker: 'Aced (Exponent)',
    category: 'Client Outreach & Discovery Calls',
    youtubeId: 'd2AnPgnCNZM',
    duration: '12 min',
    summary:
      'Frame past operational wins concisely during founder vetting calls and async video screens using measurable outcomes.',
    studyNotes: [
      'Keeping Situation and Task setup under 25% of your speaking time.',
      'Replacing vague team language with clear first-person operational ownership.',
      'Anchoring results in hours saved, response-time SLAs, and inbox turnaround.',
    ],
    checklist: [
      'Write 3 crisp 90-second STAR stories covering inbox triage, scheduling, and SOPs.',
      'Quantify every outcome (e.g., cut founder email load by 10 hrs/week).',
      'Rehearse answers calmly on camera before live discovery calls.',
    ],
  },
  {
    id: 'va-vid-10',
    title: 'Avoiding Common Interview Traps & Pitching High-Value VA Retainers',
    speaker: 'Carol Forde-Johnston • Career Strategist',
    category: 'Client Outreach & Discovery Calls',
    youtubeId: 'gUQn50iEPqg',
    duration: '11 min',
    summary:
      'Eliminate rambling background explanations on client calls and pivot directly to operational value and next-step scopes.',
    studyNotes: [
      'Moving straight to the client’s core constraint instead of reciting your resume chronologically.',
      'Using concrete past examples rather than hypothetical "I would try to..." answers.',
      'Closing calls with a clear 2-hour follow-up summary email and trial proposal.',
    ],
    checklist: [
      'Trim your 60-second personal intro down to niche, tools, and client result.',
      'Draft a post-call recap email template ready to customize in 5 minutes.',
      'Prepare a 5-hour paid trial scope option for hesitant founders.',
    ],
  },
  {
    id: 'va-vid-11',
    title: 'Prompt Engineering & Content Automation Systems for Social Media VAs',
    speaker: 'freeCodeCamp Operations Workshop',
    category: 'E-Commerce & Social VA',
    youtubeId: '_ZvnD73m40o',
    duration: '40 min',
    summary:
      'Design repeatable content repurposing pipelines, product description generators, and social calendar workflows for e-commerce brands.',
    studyNotes: [
      'Turning 1 founder podcast or product launch brief into 10 platform-tailored social posts.',
      'Using structured prompt constraints for Shopify product copy and SEO metadata.',
      'Maintaining consistent brand voice across Instagram, LinkedIn, and email newsletters.',
    ],
    checklist: [
      'Create a brand voice style guide sheet for every e-commerce or creator client.',
      'Build a weekly content approval pipeline with Draft, Review, and Scheduled statuses.',
      'Batch-prepare 14 days of social captions and UTM tracking links in one session.',
    ],
  },
  {
    id: 'va-vid-12',
    title: 'Scaling Client Support Queues & Order Operations for E-Commerce Teams',
    speaker: 'Remote Support & Ops Guild',
    category: 'E-Commerce & Social VA',
    youtubeId: 'oQw3MauKik8',
    duration: '18 min',
    summary:
      'Organize customer ticket macros, return/exchange escalations, and weekly store analytics reporting for DTC e-commerce founders.',
    studyNotes: [
      'Tagging recurring customer support tickets (shipping, sizing, refunds) to spot store friction.',
      'Writing empathetic, fast-resolution support macros for Zendesk, Gorgias, and Help Scout.',
      'Delivering a weekly Friday operations brief summarizing CSAT, ticket volume, and stock alerts.',
    ],
    checklist: [
      'Build 12 reusable support response templates covering WISMO, returns, and VIP orders.',
      'Set a strict SLA target (under 4 business hours) for priority inbox tickets.',
      'Create a Friday e-commerce ops KPI summary table.',
    ],
  },
];

const VA_GUIDES: VaGuide[] = [
  {
    id: 'guide-1',
    title: 'How to Land Your First $15–$30/hr Remote VA Client',
    subtitle:
      'A step-by-step roadmap to sourcing high-intent founders, crafting irresistible outreach, and bypassing low-wage platforms.',
    readTime: '8 min read',
    category: 'Client Acquisition',
    content: [
      'Introduction: The Evolution of Virtual Assistance in the AI Era. Gone are the days when virtual assistants were merely digital typists handling basic data entry. Today’s top-earning remote VAs act as strategic Chief of Staff partners to founders, venture capitalists, and creators. By mastering specialized tools and workflow automation, skilled virtual assistants regularly command $25 to $50 per hour.',
      'Step 1: Identifying Your High-Value Skill Stack. To command premium rates, you must move beyond generic administrative tasks. Focus on high-leverage domains: executive calendar & inbox curation, Notion workspace architecture, customer support triage, podcast and newsletter production, or AI-assisted content distribution.',
      'Step 2: Abandoning Race-to-the-Bottom Gig Sites. While platforms like Upwork and Fiverr can serve as temporary stepping stones, they are plagued by intense price competition and heavy commission fees. Instead, focus on direct outbound prospecting via LinkedIn, Twitter/X, and niche startup communities (Product Hunt, Indie Hackers, Y Combinator Work at a Startup).',
      'Step 3: Crafting the 3-Sentence Cold Outreach Message. Busy founders do not have time to read paragraphs of fluff. Your outreach must immediately identify a specific bottleneck and propose a concrete solution. Example: "Hi [Name], loved your recent launch on X. Noticed your support queue is climbing—I help technical founders triage GitHub & Zendesk tickets in 2 hours daily. Worth a 10-minute chat?"',
      'Step 4: Converting Prospects with Paid Trial Tasks. When pitching high-ticket clients, reduce their perceived risk by offering a paid trial week. Propose a defined 5-hour project (e.g., cleaning up their CRM or organizing their Notion knowledge base) for a flat fee. 80% of founders who experience your competence during a trial will immediately convert to a $2,000+/mo retainer.',
      'Conclusion: Consistency and Professionalism. Treat your freelance VA practice like a world-class enterprise. Maintain immaculate punctuality, document every recurring task in an SOP (Standard Operating Procedure), and consistently over-deliver on communication.',
    ],
  },
  {
    id: 'guide-2',
    title: 'Mastering Executive Inbox & Calendar Management',
    subtitle:
      'The ultimate blueprint for protecting founder focus time, zeroing inboxes daily, and running airtight schedules.',
    readTime: '9 min read',
    category: 'Executive Operations',
    content: [
      'Introduction: The Executive Attention Crisis. Founders and executives lose an average of 4.2 hours every single day to fragmented email threads, poorly scheduled meetings, and unstructured interruptions. As an executive VA, your primary job is acting as an impenetrable shield for your principal’s cognitive bandwidth.',
      'The Zero-Inbox Triage System. Implement a strict 3-folder or 4-label triage hierarchy: (1) Action Required (needs founder input today), (2) Waiting For (pending external reply), (3) Read / Reference (newsletters, receipts), and (4) Archive / Delete. Aim for zero unread messages in the primary inbox by end-of-day.',
      'Calendar Architecture & Time Blocking. Never allow ad-hoc meeting scheduling. Enforce rigid calendar architecture: deep work blocks in the morning (uninterrupted coding/strategy), external pitch calls grouped into specific afternoon windows (e.g., Tuesday & Thursday 2–5 PM), and zero meetings on Wednesdays.',
      'Drafting Ghost-Writing Replies. Master your principal’s unique voice and communication style. Write draft replies for 80% of routine inbound emails so all your executive needs to do is review and click Send.',
      'Handling VIPs and Urgent Escalations. Establish a crystal-clear communication protocol for emergencies (e.g., a designated WhatsApp or Slack keyword that overrides notification silencers).',
      'Conclusion: Trust is Built on Precision. Immaculate calendar management requires zero dropped balls and proactive anticipation of scheduling conflicts across time zones.',
    ],
  },
  {
    id: 'guide-3',
    title: 'AI Tools Every Modern Virtual Assistant Should Master',
    subtitle:
      'Leverage LLMs, transcription engines, and automation connectors to double your billable output in half the time.',
    readTime: '10 min read',
    category: 'AI Tooling',
    content: [
      'Introduction: The AI-Amplified VA. Artificial intelligence is not replacing virtual assistants—it is replacing virtual assistants who refuse to use AI. By integrating modern LLMs and workflow tools into your daily stack, you can accomplish 8 hours of work in 3 hours.',
      'Essential Tool #1: Advanced LLMs (ChatGPT & Claude 3.5). Use Claude for nuanced document editing, long-form SOP drafting, and complex data structuring in Markdown or CSV formats. Use ChatGPT for rapid web research and voice dictation notes.',
      'Essential Tool #2: AI Transcription & Meeting Summarizers (Otter.ai, Granola, Fireflies). Never take manual meeting notes again. Automatically record client calls, generate searchable transcripts, and instantly extract action items with assigned owners and deadlines.',
      'Essential Tool #3: Knowledge & Workspace Hubs (Notion, Airtable, Coda). Build centralized client command centers where clients can track ongoing projects, brand guidelines, login credentials, and daily task queues.',
      'Essential Tool #4: No-Code Connectors (Zapier & Make.com). Automate repetitive handoffs: when a new client signs a Stripe invoice, automatically create a new folder in Google Drive, a client channel in Slack, and an onboarding task in Notion.',
      'Conclusion: Reinvesting Saved Time. Use the hours saved through AI automation to take on additional retainer clients and scale your monthly revenue.',
    ],
  },
  {
    id: 'guide-4',
    title: 'How to Pass VA Discovery Calls & Trial Tasks',
    subtitle:
      'Psychological frameworks and practical tests to convert 90% of prospective client interviews into paid contracts.',
    readTime: '8 min read',
    category: 'Client Conversion',
    content: [
      'Introduction: The Mindset Shift from Applicant to Consultant. During a discovery call, you are not a job seeker begging for work; you are a specialized operations consultant diagnosing a business bottleneck and offering a proven remedy.',
      'Phase 1: Pre-Call Research. Spend 15 minutes researching the founder, their company, recent product updates, and their public Twitter/LinkedIn posts. Reference their recent milestones within the first 60 seconds of the call.',
      'Phase 2: The Diagnostic Question Stack. Ask high-impact questions: "What is the single most draining recurring task on your plate right now?", "If you could magically hand off 15 hours of weekly admin, what revenue initiative would you focus on?", "How are inbound emails currently managed when you are in deep focus mode?"',
      'Phase 3: Presenting the Solution. Do not quote an hourly rate immediately. Propose a structured monthly retainer package that directly addresses their stated pain points.',
      'Phase 4: Executing the Paid Trial Task. Treat the trial task like a mission-critical audit. Document your work clearly, communicate proactively over Slack/Discord, and deliver ahead of schedule.',
      'Conclusion: The Art of the Close. Always follow up within 2 hours of a discovery call with a detailed summary recap and your proposed start date.',
    ],
  },
  {
    id: 'guide-5',
    title: 'Setting Up Your Freelance VA Portfolio & Rates',
    subtitle:
      'How to price hourly vs. monthly retainers, package your services, and build a high-converting portfolio in 48 hours.',
    readTime: '9 min read',
    category: 'Pricing & Portfolio',
    content: [
      'Introduction: Why Hourly Billing Keeps You Poor. If you bill $25/hour, your income is strictly capped by the number of hours in a week. Transitioning to monthly value-based retainers ($1,500 to $3,500/mo) decouples your income from time.',
      'Structuring Your 3-Tier Service Packages. Package Tier 1 (Essential Admin: Inbox triage, calendar management, 10 hrs/mo), Package Tier 2 (Growth Operations: Admin + content repurposing + CRM updates, 25 hrs/mo), and Package Tier 3 (Chief of Staff: Full operational management, dedicated Slack sync, unlimited async support).',
      'Building a One-Page Notion Portfolio. Ditch traditional PDF resumes. Build a sleek, lightning-fast Notion public page featuring your bio, core tool stack, verified testimonials, case studies, and a Calendly booking embed.',
      'Navigating Invoicing & Cross-Border Payments. Set up professional invoicing via Stripe, Wise, or Deel to ensure fast, low-fee payouts from international clients in USD, EUR, or GBP.',
      'Handling Retainer Agreements & Boundaries. Always require a signed independent contractor agreement and a 50% upfront retainer deposit before beginning work.',
      'Conclusion: Continuous Rate Increases. As you accumulate case studies and specialized skills, increase your rates by 25% for every new client you onboard.',
    ],
  },
  {
    id: 'guide-6',
    title: 'Remote Client Communication & SOP Documentation',
    subtitle:
      'The masterclass in asynchronous communication, markdown standard operating procedures, and spotless accountability.',
    readTime: '8 min read',
    category: 'Operations & SOPs',
    content: [
      'Introduction: The Power of Asynchronous Excellence. Remote work thrives on immaculate written communication and meticulous documentation. Clients value VAs who require zero micro-management.',
      'Writing Crystal-Clear Loom & Async Updates. Instead of scheduling a 30-minute sync meeting for a simple question, record a 90-second Loom video walking through your screen and proposed solution.',
      'Drafting Bulletproof Standard Operating Procedures (SOPs). Every recurring task you perform for a client must be documented in a step-by-step Loom + Notion SOP so anyone could step in if needed.',
      'Establishing Daily & Weekly EOD Reports. Send a concise End-of-Day bulleted update to your client: (1) Completed Today, (2) In Progress, (3) Blockers / Decisions Needed.',
      'Security & Credential Hygiene. Never store plain-text passwords in chat messages. Use 1Password or Bitwarden secure sharing links for all client logins.',
      'Conclusion: Becoming Indispensable. When your communication is flawless and your SOPs are pristine, you transition from an external contractor to an irreplaceable core team member.',
    ],
  },
];

export const VaAcademyTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<VaCategory>('All VA Tracks');
  const [activeVideo, setActiveVideo] = useState<VaVideo>(VA_VIDEOS[0]);
  const [activeGuide, setActiveGuide] = useState<VaGuide | null>(null);

  const filteredVideos =
    selectedCategory === 'All VA Tracks'
      ? VA_VIDEOS
      : VA_VIDEOS.filter((v) => v.category === selectedCategory);

  const handleSelectCategory = (cat: VaCategory) => {
    setSelectedCategory(cat);
    const matching =
      cat === 'All VA Tracks'
        ? VA_VIDEOS
        : VA_VIDEOS.filter((v) => v.category === cat);
    if (matching.length > 0 && !matching.some((v) => v.id === activeVideo.id)) {
      setActiveVideo(matching[0]);
    }
  };

  const handleWatchModule = (vid: VaVideo) => {
    setActiveVideo(vid);
    if (typeof document !== 'undefined') {
      document
        .getElementById('va-video-theatre')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section aria-labelledby="va-academy-heading" className="w-full max-w-full space-y-12 pb-12 overflow-x-hidden">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/80 p-6 text-slate-900 shadow-sm sm:p-10">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            <GraduationCap className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>VA Academy &amp; Operations Hub</span>
          </div>
          <h1
            id="va-academy-heading"
            className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Master High-Paid Remote Virtual Assistance
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Access {VA_VIDEOS.length} expert-led video tutorials with topic-matched YouTube embeds, structured study notes, action checklists, and 6 in-depth editorial career guides to build a thriving remote VA practice.
          </p>
        </div>
      </div>

      {/* Interactive Video Theatre Section */}
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              Interactive Video Theatre
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Curated VA Masterclass Modules
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredVideos.length}</strong> modules in{' '}
            <strong className="text-[#1D4ED8]">{selectedCategory}</strong>
          </p>
        </div>

        {/* Category Filter Grid (Clean 2-column grid on mobile, 5 columns on desktop) */}
        <div
          role="tablist"
          aria-label="Filter VA Academy modules by track"
          className="grid grid-cols-2 gap-2.5 lg:grid-cols-5"
        >
          {VA_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === 'All VA Tracks'
                ? VA_VIDEOS.length
                : VA_VIDEOS.filter((v) => v.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectCategory(cat)}
                className={`flex min-h-[44px] items-center justify-center rounded-xl border px-3 py-2 text-center text-xs font-semibold leading-snug transition-all ${
                  cat === 'All VA Tracks' ? 'col-span-2 lg:col-span-1' : ''
                } ${
                  isActive
                    ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Main Active Video Theatre Layout */}
        <div
          id="va-video-theatre"
          className="scroll-mt-24 grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          {/* Left: 16:9 YouTube Player */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-md lg:col-span-7 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1D4ED8]">
                  {activeVideo.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-slate-500">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{activeVideo.duration}</span>
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline whitespace-nowrap"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
                <iframe
                  key={activeVideo.youtubeId}
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 sm:text-xl">
                  {activeVideo.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-600">
                  {activeVideo.speaker}
                </p>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {activeVideo.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Study Notes & Action Checklist */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-md lg:col-span-5 sm:p-6">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                  Structured Study Notes
                </p>
                <ul className="mt-3 space-y-2.5">
                  {activeVideo.studyNotes.map((note, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-700"
                    >
                      <Sparkles
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1D4ED8]"
                        aria-hidden="true"
                      />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Action Checklist
                </p>
                <ul className="mt-3 space-y-2.5">
                  {activeVideo.checklist.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-700"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 text-center">
              <span className="text-[11px] font-medium text-slate-500">
                Complete modules to build your client-ready VA portfolio
              </span>
            </div>
          </div>
        </div>

        {/* Full Filtered Module Feed with Embedded Players & Step-by-Step Study Notes */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-slate-900 sm:text-xl">
              {selectedCategory} ({filteredVideos.length} Curated Training Modules)
            </h3>
            <span className="text-xs text-slate-500">
              Play inline or load into the main theatre
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((vid) => {
              const isSelected = activeVideo.id === vid.id;
              return (
                <article
                  key={vid.id}
                  className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-white transition-all ${
                    isSelected
                      ? 'border-[#1D4ED8] ring-2 ring-[#1D4ED8]/20 shadow-md'
                      : 'border-slate-200 shadow-2xs hover:border-[#1D4ED8]/40 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Working YouTube Video Embed */}
                    <div className="relative aspect-video w-full overflow-hidden border-b border-slate-100 bg-slate-900">
                      <iframe
                        loading="lazy"
                        src={`https://www.youtube-nocookie.com/embed/${vid.youtubeId}?rel=0`}
                        title={vid.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="h-full w-full border-0"
                      />
                    </div>

                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#1D4ED8]">
                          {vid.category}
                        </span>
                        <span className="font-mono text-[11px] font-medium text-slate-500">
                          {vid.duration}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display text-sm font-bold leading-snug text-slate-900 sm:text-base">
                          {vid.title}
                        </h4>
                        <p className="mt-1 text-[11px] font-semibold text-slate-500">
                          {vid.speaker}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600">
                          {vid.summary}
                        </p>
                      </div>

                      {/* Step-by-Step Study Notes */}
                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8]">
                          Step-by-Step Study Notes
                        </p>
                        <ul className="space-y-1.5">
                          {vid.studyNotes.map((note, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-700"
                            >
                              <span className="mt-0.5 font-mono text-[10px] font-bold text-[#1D4ED8] shrink-0">
                                0{idx + 1}.
                              </span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 sm:px-5">
                    <button
                      type="button"
                      onClick={() => handleWatchModule(vid)}
                      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-[#1D4ED8]'
                          : 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                      }`}
                    >
                      <PlayCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{isSelected ? 'Loaded in Theatre' : 'Focus in Theatre'}</span>
                    </button>

                    <a
                      href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#1D4ED8]"
                    >
                      <span>Watch on YT</span>
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6 In-Depth VA Career Guides Section */}
      <div className="space-y-6 border-t border-slate-200 pt-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Editorial Knowledge Base
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            6 In-Depth VA Career Guides (650+ Words Each)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Comprehensive operational playbooks for building, scaling, and managing a high-income remote VA practice.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VA_GUIDES.map((guide) => (
            <article
              key={guide.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-[#1D4ED8]/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1D4ED8]">
                    {guide.category}
                  </span>
                  <span className="font-mono text-xs font-medium text-slate-500">
                    {guide.readTime}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-slate-900 group-hover:text-[#1D4ED8] transition-colors">
                  {guide.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {guide.subtitle}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveGuide(guide)}
                  className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1E40AF]"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Read Full Guide →</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {activeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveGuide(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1D4ED8]">
                  {activeGuide.category}
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  {activeGuide.title}
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {activeGuide.readTime} • Published by PlanetAI Hub VA Academy
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                aria-label="Close guide modal"
                className="inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-700">
              {activeGuide.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 flex justify-end border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="min-h-[42px] rounded-full bg-[#1D4ED8] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF]"
              >
                Close Article Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
