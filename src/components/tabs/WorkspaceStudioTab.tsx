import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Kanban,
  CheckSquare,
  Users,
  Grid,
  Image as ImageIcon,
  Edit3,
  Table,
  Presentation,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Layers,
  Clock,
  Tag,
  DollarSign,
  Maximize2,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { ShareToast } from '../ShareToast';

export type WorkspaceToolId =
  | 'notion'
  | 'trello'
  | 'clickup'
  | 'gohighlevel'
  | 'monday'
  | 'canva'
  | 'gdocs'
  | 'gsheets'
  | 'gslides';

type CategoryFilter = 'all' | 'task-ops' | 'crm-funnels' | 'design-docs';

interface NotionBlock {
  id: string;
  type: 'heading' | 'text' | 'todo' | 'callout';
  content: string;
  checked?: boolean;
}

interface KanbanCard {
  id: string;
  column: 'todo' | 'inprogress' | 'done';
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  tag: string;
}

interface ClickUpTask {
  id: string;
  title: string;
  status: 'Open' | 'In Review' | 'Complete';
  priority: 'Low' | 'Normal' | 'Urgent';
  dueDate: string;
}

interface GhlLead {
  id: string;
  name: string;
  company: string;
  stage: 'New Lead' | 'Discovery Call' | 'Proposal Sent' | 'Closed Won';
  value: number;
}

interface MondayItem {
  id: string;
  name: string;
  status: 'Working on it' | 'Stuck' | 'Done';
  owner: string;
  due: string;
}

interface SheetCell {
  value: string;
}

interface SlideItem {
  id: string;
  title: string;
  bullets: string[];
  notes: string;
}

const STORAGE_KEYS = {
  NOTION: 'planetai_workspace_notion_v1',
  TRELLO: 'planetai_workspace_trello_v1',
  CLICKUP: 'planetai_workspace_clickup_v1',
  GHL: 'planetai_workspace_ghl_v1',
  MONDAY: 'planetai_workspace_monday_v1',
  CANVA: 'planetai_workspace_canva_v1',
  GDOCS: 'planetai_workspace_gdocs_v1',
  GSHEETS: 'planetai_workspace_gsheets_v1',
  GSLIDES: 'planetai_workspace_gslides_v1',
};

export const WorkspaceStudioTab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<WorkspaceToolId>('notion');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Notion State
  const [notionBlocks, setNotionBlocks] = useState<NotionBlock[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTION);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: '1', type: 'heading', content: 'Q1 AI Operations SOP & Roadmap' },
      { id: '2', type: 'text', content: 'Standard operating procedure for asynchronous prompt evaluation and model grading.' },
      { id: '3', type: 'todo', content: 'Calibrate inter-annotator agreement on coding rubric', checked: true },
      { id: '4', type: 'todo', content: 'Publish weekly Python benchmark report', checked: false },
      { id: '5', type: 'callout', content: 'Note: All deliverables must adhere to the 100% transparent USD pay and verification standard.' },
    ];
  });
  const [newBlockText, setNewBlockText] = useState('');
  const [newBlockType, setNewBlockType] = useState<'heading' | 'text' | 'todo' | 'callout'>('text');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTION, JSON.stringify(notionBlocks));
  }, [notionBlocks]);

  // 2. Trello State
  const [trelloCards, setTrelloCards] = useState<KanbanCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRELLO);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 't1', column: 'todo', title: 'Audit Python RAG pipeline latency', priority: 'High', tag: 'Engineering' },
      { id: 't2', column: 'inprogress', title: 'Record AI interviewer video walkthrough', priority: 'Medium', tag: 'Studio' },
      { id: 't3', column: 'done', title: 'Deploy Stripe / PayPal verification flow', priority: 'High', tag: 'Billing' },
    ];
  });
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardTag, setNewCardTag] = useState('AI Ops');
  const [newCardPriority, setNewCardPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRELLO, JSON.stringify(trelloCards));
  }, [trelloCards]);

  // 3. ClickUp State
  const [clickupTasks, setClickupTasks] = useState<ClickUpTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLICKUP);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'cu1', title: 'Review DPO reward model weights', status: 'In Review', priority: 'Urgent', dueDate: '2026-03-30' },
      { id: 'cu2', title: 'Update contractor invoice template', status: 'Complete', priority: 'Normal', dueDate: '2026-03-25' },
      { id: 'cu3', title: 'Configure SES email relay endpoints', status: 'Open', priority: 'Normal', dueDate: '2026-04-05' },
    ];
  });
  const [cuTitle, setCuTitle] = useState('');
  const [cuPriority, setCuPriority] = useState<'Low' | 'Normal' | 'Urgent'>('Normal');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLICKUP, JSON.stringify(clickupTasks));
  }, [clickupTasks]);

  // 4. GoHighLevel State
  const [ghlLeads, setGhlLeads] = useState<GhlLead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GHL);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'ghl1', name: 'Dr. Marcus Vance', company: 'Neural Labs', stage: 'Discovery Call', value: 3500 },
      { id: 'ghl2', name: 'Sarah Jenkins', company: 'Apex AI', stage: 'Proposal Sent', value: 7500 },
      { id: 'ghl3', name: 'Alex Thorne', company: 'Synthetix', stage: 'Closed Won', value: 12000 },
      { id: 'ghl4', name: 'Elena Rostova', company: 'OmniVoice', stage: 'New Lead', value: 2500 },
    ];
  });
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadValue, setLeadValue] = useState('3000');
  const [leadStage, setLeadStage] = useState<GhlLead['stage']>('New Lead');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GHL, JSON.stringify(ghlLeads));
  }, [ghlLeads]);

  // 5. Monday.com State
  const [mondayItems, setMondayItems] = useState<MondayItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MONDAY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'm1', name: 'Model hallucination benchmark suite', status: 'Working on it', owner: 'Von Ryan', due: '2026-03-31' },
      { id: 'm2', name: 'Multilingual speech corpus ingestion', status: 'Done', owner: 'Aria Chen', due: '2026-03-20' },
      { id: 'm3', name: 'Security vault AES-256 audit', status: 'Stuck', owner: 'Devon Rex', due: '2026-04-02' },
    ];
  });
  const [mondName, setMondName] = useState('');
  const [mondOwner, setMondOwner] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MONDAY, JSON.stringify(mondayItems));
  }, [mondayItems]);

  // 6. Canva State
  const [canvaConfig, setCanvaConfig] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CANVA);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      headline: 'PlanetAI Hub · Remote AI Career Suite',
      subheadline: 'Transparent USD Pay · Zero Signup Required',
      bgColor: '#1D4ED8',
      textColor: '#ffffff',
      aspectRatio: '16:9' as '16:9' | '1:1',
    };
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CANVA, JSON.stringify(canvaConfig));
  }, [canvaConfig]);

  const handleDownloadCanva = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvaConfig.aspectRatio === '16:9' ? 1200 : 1080;
    const h = canvaConfig.aspectRatio === '16:9' ? 675 : 1080;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = canvaConfig.bgColor;
    ctx.fillRect(0, 0, w, h);

    // Decorative gradient accent
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255,255,255,0.15)');
    grad.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Headline
    ctx.fillStyle = canvaConfig.textColor;
    ctx.font = 'bold 52px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap headline
    const words = canvaConfig.headline.split(' ');
    let line = '';
    let y = h / 2 - 40;
    const maxWidth = w - 160;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, w / 2, y);
        line = words[n] + ' ';
        y += 64;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, w / 2, y);

    // Subheadline
    ctx.font = '28px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(canvaConfig.subheadline, w / 2, y + 80);

    // Trigger download
    const link = document.createElement('a');
    link.download = `planetai-banner-${canvaConfig.aspectRatio === '16:9' ? '16x9' : '1x1'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    triggerToast('Banner downloaded as PNG!');
  };

  // 7. Google Docs State
  const [docContent, setDocContent] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.GDOCS) || '# Project Proposal: Asynchronous AI Evaluation\n\nExecutive summary for distributed model calibration across frontier LLM evaluation queues.\n\n## 1. Objectives\n- Maintain >98% inter-annotator agreement on coding tasks.\n- Enforce transparent USD pay ranges for all posted contracts.\n\n## 2. Methodology\nContributors evaluate model reasoning traces step by step and justify preference rankings.';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GDOCS, docContent);
  }, [docContent]);

  const wordCount = docContent.trim() ? docContent.trim().split(/\s+/).length : 0;
  const charCount = docContent.length;

  const handleDownloadDoc = () => {
    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'planetai-document.txt';
    link.click();
    URL.revokeObjectURL(url);
    triggerToast('Document exported as .txt');
  };

  // 8. Google Sheets State
  const [sheetData, setSheetData] = useState<SheetCell[][]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GSHEETS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      [{ value: 'Category / Role' }, { value: 'Hours' }, { value: 'Rate ($/hr)' }, { value: 'Total ($)' }],
      [{ value: 'RLHF Prompt Review' }, { value: '40' }, { value: '65' }, { value: '=B2*C2' }],
      [{ value: 'Python RAG Audit' }, { value: '25' }, { value: '95' }, { value: '=B3*C3' }],
      [{ value: 'Voice Synthesis Eval' }, { value: '30' }, { value: '55' }, { value: '=B4*C4' }],
      [{ value: 'Total Budget' }, { value: '95' }, { value: '-' }, { value: '=D2+D3+D4' }],
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GSHEETS, JSON.stringify(sheetData));
  }, [sheetData]);

  const updateCell = (rIdx: number, cIdx: number, val: string) => {
    const copy = sheetData.map((row, i) => i === rIdx ? row.map((cell, j) => j === cIdx ? { value: val } : cell) : row);
    setSheetData(copy);
  };

  const handleExportCsv = () => {
    const csv = sheetData.map(row => row.map(c => `"${c.value}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'planetai-budget-sheet.csv';
    link.click();
    URL.revokeObjectURL(url);
    triggerToast('Spreadsheet exported as CSV');
  };

  // 9. Google Slides State
  const [slides, setSlides] = useState<SlideItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GSLIDES);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 's1', title: 'PlanetAI Hub Architecture', bullets: ['Decentralized AI Contributor Directory', 'Verified Transparent USD Pay Standards', 'Client-Side Privacy & Zero Knowledge Vault'], notes: 'Introduce platform mission and remote contractor alignment.' },
      { id: 's2', title: 'Frontier LLM Evaluation Workflows', bullets: ['Multi-step reasoning diagnostics', 'Automated containerized test suites', 'Rigorous inter-annotator calibration'], notes: 'Highlight shift from simple A/B clicks to diagnostic rubrics.' },
      { id: 's3', title: 'Monetization & Employer Spotlight', bullets: ['Standard listing: FREE', 'Featured Role Pin: $79 / 30 Days', 'Flagship Video & Prep Spotlight: $249'], notes: 'Detail transparent tier pricing and direct PayPal checkout.' },
    ];
  });
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GSLIDES, JSON.stringify(slides));
  }, [slides]);

  const toolsList = [
    { id: 'notion' as WorkspaceToolId, name: 'Notion', icon: FileText, cat: 'task-ops', desc: 'Docs & Wiki' },
    { id: 'trello' as WorkspaceToolId, name: 'Trello', icon: Kanban, cat: 'task-ops', desc: 'Kanban Board' },
    { id: 'clickup' as WorkspaceToolId, name: 'ClickUp', icon: CheckSquare, cat: 'task-ops', desc: 'Sprint Tasks' },
    { id: 'gohighlevel' as WorkspaceToolId, name: 'GoHighLevel', icon: Users, cat: 'crm-funnels', desc: 'CRM Pipeline' },
    { id: 'monday' as WorkspaceToolId, name: 'Monday.com', icon: Grid, cat: 'task-ops', desc: 'Work OS Grid' },
    { id: 'canva' as WorkspaceToolId, name: 'Canva', icon: ImageIcon, cat: 'design-docs', desc: 'Design Studio' },
    { id: 'gdocs' as WorkspaceToolId, name: 'Google Docs', icon: Edit3, cat: 'design-docs', desc: 'Word Editor' },
    { id: 'gsheets' as WorkspaceToolId, name: 'Google Sheets', icon: Table, cat: 'design-docs', desc: 'Live Sheets' },
    { id: 'gslides' as WorkspaceToolId, name: 'Google Slides', icon: Presentation, cat: 'design-docs', desc: 'Pitch Deck' },
  ];

  const filteredTools = categoryFilter === 'all'
    ? toolsList
    : toolsList.filter(t => t.cat === categoryFilter);

  return (
    <div className="space-y-6 pb-12">
      {toastMessage && <ShareToast message={toastMessage} />}

      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-400" />
              <span>Offline-Ready Professional Suite</span>
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Workspace &amp; Docs Studio
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
              9 interactive, browser-local productivity workspaces. Manage Notion docs, Trello boards, ClickUp sprints, GHL pipelines, Monday grids, Canva banners, Docs, Sheets, and Slides entirely client-side with zero external login required.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Auto-Saved Locally</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons (Wrapped 2-Column Mobile Grid) */}
      <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={() => setCategoryFilter('all')}
          className={`col-span-2 sm:col-span-1 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
            categoryFilter === 'all'
              ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Layers className="h-4 w-4 shrink-0" />
          <span>All 9 Workspaces</span>
        </button>

        <button
          type="button"
          onClick={() => setCategoryFilter('task-ops')}
          className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
            categoryFilter === 'task-ops'
              ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Kanban className="h-4 w-4 shrink-0" />
          <span>Task &amp; Project Ops</span>
        </button>

        <button
          type="button"
          onClick={() => setCategoryFilter('crm-funnels')}
          className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
            categoryFilter === 'crm-funnels'
              ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Users className="h-4 w-4 shrink-0" />
          <span>CRM &amp; Funnels</span>
        </button>

        <button
          type="button"
          onClick={() => setCategoryFilter('design-docs')}
          className={`col-span-2 sm:col-span-1 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
            categoryFilter === 'design-docs'
              ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span>Design &amp; Cloud Docs</span>
        </button>
      </div>

      {/* Tool Selector Pills (Wrapped 2-Column Grid on Mobile) */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
        {filteredTools.map((tool) => {
          const IconComp = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-start gap-2.5 sm:gap-3 rounded-2xl border p-3 sm:p-3.5 text-left transition-all ${
                isActive
                  ? 'border-[#1D4ED8] bg-blue-50/70 shadow-sm ring-2 ring-blue-600/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${
                isActive ? 'bg-[#1D4ED8] text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                <IconComp className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <p className="font-display text-xs sm:text-sm font-bold leading-snug text-slate-900">
                    {tool.name}
                  </p>
                  {isActive && <ChevronRight className="mt-0.5 h-3.5 w-3.5 text-[#1D4ED8] shrink-0" />}
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                  {tool.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Workspace Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {/* 1. NOTION WORKSPACE BUILDER */}
        {activeTool === 'notion' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Notion Workspace Builder</h3>
                <p className="text-xs text-slate-500">Create structured SOPs, task checklists, and callout blocks.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const md = notionBlocks.map(b => b.type === 'heading' ? `# ${b.content}` : b.type === 'todo' ? `- [${b.checked ? 'x' : ' '}] ${b.content}` : b.type === 'callout' ? `> ${b.content}` : b.content).join('\n\n');
                  navigator.clipboard.writeText(md);
                  triggerToast('Copied Markdown to clipboard!');
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 w-full sm:w-auto"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Markdown</span>
              </button>
            </div>

            <div className="space-y-3">
              {notionBlocks.map(b => (
                <div key={b.id} className={`rounded-xl border p-3 flex items-center justify-between gap-3 ${
                  b.type === 'callout' ? 'border-blue-200 bg-blue-50/60 text-blue-900' :
                  b.type === 'heading' ? 'border-slate-200 bg-slate-50 font-bold text-slate-900' :
                  'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {b.type === 'todo' && (
                      <input
                        type="checkbox"
                        checked={b.checked}
                        onChange={(e) => {
                          setNotionBlocks(notionBlocks.map(x => x.id === b.id ? { ...x, checked: e.target.checked } : x));
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-[#1D4ED8]"
                      />
                    )}
                    <span className={`text-xs sm:text-sm ${b.type === 'todo' && b.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {b.content}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotionBlocks(notionBlocks.filter(x => x.id !== b.id))}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newBlockText.trim()) return;
                setNotionBlocks([...notionBlocks, { id: Date.now().toString(), type: newBlockType, content: newBlockText.trim(), checked: false }]);
                setNewBlockText('');
              }}
              className="flex flex-col gap-2.5 sm:flex-row sm:items-center pt-2"
            >
              <select
                value={newBlockType}
                onChange={(e) => setNewBlockType(e.target.value as any)}
                className="h-11 w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
              >
                <option value="text">Text Paragraph</option>
                <option value="heading">Heading</option>
                <option value="todo">Task Checkbox</option>
                <option value="callout">Callout Box</option>
              </select>
              <input
                type="text"
                value={newBlockText}
                onChange={(e) => setNewBlockText(e.target.value)}
                placeholder="Type block content..."
                className="h-11 w-full sm:flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
              />
              <button
                type="submit"
                className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-5 text-xs font-semibold text-white hover:bg-[#1E40AF]"
              >
                <Plus className="h-4 w-4" />
                <span>Add Block</span>
              </button>
            </form>
          </div>
        )}

        {/* 2. TRELLO KANBAN BOARD */}
        {activeTool === 'trello' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Trello Kanban Board</h3>
                <p className="text-xs text-slate-500">Manage deliverables across To Do, In Progress, and Done columns.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <input
                  type="text"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="New task title..."
                  className="h-10 w-full sm:w-auto rounded-xl border border-slate-200 px-3 text-xs text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newCardTitle.trim()) return;
                    setTrelloCards([...trelloCards, { id: Date.now().toString(), column: 'todo', title: newCardTitle.trim(), priority: newCardPriority, tag: newCardTag }]);
                    setNewCardTitle('');
                  }}
                  className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-1 rounded-xl bg-[#1D4ED8] px-4 text-xs font-semibold text-white hover:bg-[#1E40AF] whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Card</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {(['todo', 'inprogress', 'done'] as const).map(col => {
                const colTitle = col === 'todo' ? 'To Do' : col === 'inprogress' ? 'In Progress' : 'Done';
                const colCards = trelloCards.filter(c => c.column === col);
                return (
                  <div key={col} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-700">{colTitle}</span>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">{colCards.length}</span>
                    </div>

                    <div className="space-y-2.5">
                      {colCards.map(card => (
                        <div key={card.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#1D4ED8]">{card.tag}</span>
                            <span className={`text-[10px] font-bold ${card.priority === 'High' ? 'text-rose-600' : 'text-slate-500'}`}>{card.priority}</span>
                          </div>
                          <p className="text-xs font-medium text-slate-900">{card.title}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                const nextCol = col === 'todo' ? 'inprogress' : col === 'inprogress' ? 'done' : 'todo';
                                setTrelloCards(trelloCards.map(c => c.id === card.id ? { ...c, column: nextCol } : c));
                              }}
                              className="text-[10px] font-semibold text-[#1D4ED8] hover:underline"
                            >
                              Move →
                            </button>
                            <button
                              type="button"
                              onClick={() => setTrelloCards(trelloCards.filter(c => c.id !== card.id))}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. CLICKUP SPRINT PLANNER */}
        {activeTool === 'clickup' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">ClickUp Sprint &amp; Task Planner</h3>
                <p className="text-xs text-slate-500">Track task statuses, priority flags, and execution dates.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <input
                  type="text"
                  value={cuTitle}
                  onChange={(e) => setCuTitle(e.target.value)}
                  placeholder="Task title..."
                  className="h-10 w-full sm:w-auto rounded-xl border border-slate-200 px-3 text-xs text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!cuTitle.trim()) return;
                    setClickupTasks([...clickupTasks, { id: Date.now().toString(), title: cuTitle.trim(), status: 'Open', priority: cuPriority, dueDate: '2026-04-15' }]);
                    setCuTitle('');
                  }}
                  className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-1 rounded-xl bg-[#1D4ED8] px-4 text-xs font-semibold text-white hover:bg-[#1E40AF] whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {clickupTasks.map(task => (
                <div key={task.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const nextStatus: ClickUpTask['status'] = task.status === 'Open' ? 'In Review' : task.status === 'In Review' ? 'Complete' : 'Open';
                        setClickupTasks(clickupTasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold shrink-0 ${
                        task.status === 'Complete' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'In Review' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      <span>{task.status}</span>
                    </button>
                    <span className="text-xs font-medium text-slate-900">{task.title}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className={`font-semibold ${task.priority === 'Urgent' ? 'text-rose-600' : 'text-slate-600'}`}>{task.priority}</span>
                    <span className="font-mono text-slate-500 whitespace-nowrap">{task.dueDate}</span>
                    <button
                      type="button"
                      onClick={() => setClickupTasks(clickupTasks.filter(t => t.id !== task.id))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. GOHIGHLEVEL CRM PIPELINE */}
        {activeTool === 'gohighlevel' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">GoHighLevel Pipeline &amp; CRM Tracker</h3>
                <p className="text-xs text-slate-500">Manage client leads, deal values, and conversion stages.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Client name..."
                  className="h-10 w-full sm:w-auto rounded-xl border border-slate-200 px-3 text-xs text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!leadName.trim()) return;
                    setGhlLeads([...ghlLeads, { id: Date.now().toString(), name: leadName.trim(), company: leadCompany || 'Enterprise', stage: leadStage, value: Number(leadValue) || 2500 }]);
                    setLeadName('');
                    setLeadCompany('');
                  }}
                  className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-1 rounded-xl bg-[#1D4ED8] px-4 text-xs font-semibold text-white hover:bg-[#1E40AF] whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Lead</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {(['New Lead', 'Discovery Call', 'Proposal Sent', 'Closed Won'] as const).map(stage => {
                const stageLeads = ghlLeads.filter(l => l.stage === stage);
                const stageTotal = stageLeads.reduce((acc, l) => acc + l.value, 0);
                return (
                  <div key={stage} className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold text-slate-800">{stage}</span>
                      <span className="font-mono text-[11px] font-bold text-emerald-700">${stageTotal.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2.5">
                      {stageLeads.map(lead => (
                        <div key={lead.id} className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 shadow-2xs">
                          <p className="text-xs font-bold text-slate-900">{lead.name}</p>
                          <p className="text-[11px] text-slate-500">{lead.company}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                            <span className="font-mono font-bold text-[#1D4ED8]">${lead.value.toLocaleString()}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const stages: GhlLead['stage'][] = ['New Lead', 'Discovery Call', 'Proposal Sent', 'Closed Won'];
                                const nextIdx = (stages.indexOf(lead.stage) + 1) % stages.length;
                                setGhlLeads(ghlLeads.map(l => l.id === lead.id ? { ...l, stage: stages[nextIdx] } : l));
                              }}
                              className="font-semibold text-slate-600 hover:text-[#1D4ED8]"
                            >
                              Advance →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. MONDAY.COM WORK OS GRID */}
        {activeTool === 'monday' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Monday.com Work OS Grid</h3>
                <p className="text-xs text-slate-500">Color-coded deliverable tracker with status toggles.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <input
                  type="text"
                  value={mondName}
                  onChange={(e) => setMondName(e.target.value)}
                  placeholder="Deliverable name..."
                  className="h-10 w-full sm:w-auto rounded-xl border border-slate-200 px-3 text-xs text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!mondName.trim()) return;
                    setMondayItems([...mondayItems, { id: Date.now().toString(), name: mondName.trim(), status: 'Working on it', owner: mondOwner || 'Self', due: '2026-04-10' }]);
                    setMondName('');
                    setMondOwner('');
                  }}
                  className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-1 rounded-xl bg-[#1D4ED8] px-4 text-xs font-semibold text-white hover:bg-[#1E40AF] whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {mondayItems.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-xs sm:text-sm font-medium text-slate-900 leading-snug">
                    {item.name}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end sm:gap-4 text-xs">
                    <div className="flex items-center gap-2.5 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          const next: MondayItem['status'] = item.status === 'Working on it' ? 'Done' : item.status === 'Done' ? 'Stuck' : 'Working on it';
                          setMondayItems(mondayItems.map(i => i.id === item.id ? { ...i, status: next } : i));
                        }}
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${
                          item.status === 'Done' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'Stuck' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </button>
                      <span className="text-slate-600 font-medium">{item.owner}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-500 whitespace-nowrap">{item.due}</span>
                      <button
                        type="button"
                        onClick={() => setMondayItems(mondayItems.filter(i => i.id !== item.id))}
                        className="text-slate-400 hover:text-rose-600 shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. CANVA QUICK BANNER STUDIO */}
        {activeTool === 'canva' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Canva Quick Banner &amp; Hero Studio</h3>
                <p className="text-xs text-slate-500">Design custom social thumbnails and hero banners with 1-click PNG export.</p>
              </div>
              <button
                type="button"
                onClick={handleDownloadCanva}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] w-full sm:w-auto"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PNG</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Headline Text</label>
                  <input
                    type="text"
                    value={canvaConfig.headline}
                    onChange={(e) => setCanvaConfig({ ...canvaConfig, headline: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Subheadline</label>
                  <input
                    type="text"
                    value={canvaConfig.subheadline}
                    onChange={(e) => setCanvaConfig({ ...canvaConfig, subheadline: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Background Color</label>
                    <input
                      type="color"
                      value={canvaConfig.bgColor}
                      onChange={(e) => setCanvaConfig({ ...canvaConfig, bgColor: e.target.value })}
                      className="mt-1 h-10 w-full rounded-xl border border-slate-200 cursor-pointer bg-white p-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Aspect Ratio</label>
                    <select
                      value={canvaConfig.aspectRatio}
                      onChange={(e) => setCanvaConfig({ ...canvaConfig, aspectRatio: e.target.value as any })}
                      className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-800 bg-white"
                    >
                      <option value="16:9">16:9 Landscape (Hero)</option>
                      <option value="1:1">1:1 Square (Social)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-900 p-6 lg:col-span-7">
                <div
                  className={`relative flex flex-col items-center justify-center p-6 text-center shadow-xl transition-all ${
                    canvaConfig.aspectRatio === '16:9' ? 'aspect-video w-full' : 'aspect-square w-72'
                  }`}
                  style={{ backgroundColor: canvaConfig.bgColor, color: canvaConfig.textColor, borderRadius: '1rem' }}
                >
                  <p className="font-display text-lg font-bold sm:text-xl drop-shadow-md">{canvaConfig.headline}</p>
                  <p className="mt-2 text-xs opacity-95">{canvaConfig.subheadline}</p>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
          </div>
        )}

        {/* 7. GOOGLE DOCS WRITER */}
        {activeTool === 'gdocs' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Google Docs Distraction-Free Writer</h3>
                <p className="text-xs text-slate-500">Live word counter, clean formatting, and instant text export.</p>
              </div>
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
                <span className="font-mono text-xs text-slate-500">{wordCount} words · {charCount} chars</span>
                <button
                  type="button"
                  onClick={handleDownloadDoc}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export .txt</span>
                </button>
              </div>
            </div>

            <textarea
              rows={12}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 font-mono text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/15"
            />
          </div>
        )}

        {/* 8. GOOGLE SHEETS BUDGET GRID */}
        {activeTool === 'gsheets' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Google Sheets Live Formula &amp; Budget Grid</h3>
                <p className="text-xs text-slate-500">Interactive spreadsheet cells with instant CSV export.</p>
              </div>
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] w-full sm:w-auto"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs font-mono">
                <tbody>
                  {sheetData.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx === 0 ? 'bg-slate-100 font-bold text-slate-800' : 'border-t border-slate-100'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2 border-r border-slate-200 last:border-0">
                          {rIdx === 0 ? (
                            <span className="px-2">{cell.value}</span>
                          ) : (
                            <input
                              type="text"
                              value={cell.value}
                              onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                              className="w-full bg-transparent px-2 py-1 text-xs text-slate-900 focus:bg-white focus:outline-none rounded"
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. GOOGLE SLIDES DECK OUTLINER */}
        {activeTool === 'gslides' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Google Slides Pitch &amp; Deck Outliner</h3>
                <p className="text-xs text-slate-500">Presentation builder with full-screen presentation preview mode.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPresenting(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] w-full sm:w-auto"
              >
                <Presentation className="h-3.5 w-3.5" />
                <span>Present Preview</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-3 lg:col-span-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Slides Deck ({slides.length})</span>
                  <button
                    type="button"
                    onClick={() => setSlides([...slides, { id: Date.now().toString(), title: `Slide ${slides.length + 1}`, bullets: ['Key point 1', 'Key point 2'], notes: 'Speaker notes here.' }])}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1D4ED8]"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Slide</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlideIdx(idx)}
                      className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition ${
                        currentSlideIdx === idx ? 'border-[#1D4ED8] bg-blue-50/70 font-bold text-slate-900' : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-mono">0{idx + 1}. {s.title}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white lg:col-span-8 flex flex-col justify-between aspect-video">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
                    <span>Slide {currentSlideIdx + 1} of {slides.length}</span>
                    <span className="font-mono">PlanetAI Workspace Studio</span>
                  </div>
                  <h4 className="mt-6 font-display text-xl font-bold sm:text-2xl">{slides[currentSlideIdx]?.title}</h4>
                  <ul className="mt-4 space-y-2">
                    {slides[currentSlideIdx]?.bullets.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-slate-800/80 p-3 text-[11px] text-slate-400">
                  <strong className="text-slate-300">Speaker Notes:</strong> {slides[currentSlideIdx]?.notes}
                </div>
              </div>
            </div>

            {isPresenting && (
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 p-6 text-white">
                <div className="absolute top-6 right-6 flex items-center gap-4">
                  <span className="font-mono text-xs text-slate-400">Slide {currentSlideIdx + 1} / {slides.length}</span>
                  <button
                    type="button"
                    onClick={() => setIsPresenting(false)}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    Exit Presentation
                  </button>
                </div>

                <div className="max-w-3xl w-full text-center space-y-6">
                  <h2 className="font-display text-3xl font-bold sm:text-5xl">{slides[currentSlideIdx]?.title}</h2>
                  <div className="space-y-3 text-left max-w-xl mx-auto">
                    {slides[currentSlideIdx]?.bullets.map((b, i) => (
                      <div key={i} className="flex items-center gap-3 text-base sm:text-lg text-slate-200">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-6 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIdx(Math.max(0, currentSlideIdx - 1))}
                    disabled={currentSlideIdx === 0}
                    className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-2.5 text-xs font-bold disabled:opacity-30"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIdx(Math.min(slides.length - 1, currentSlideIdx + 1))}
                    disabled={currentSlideIdx === slides.length - 1}
                    className="rounded-xl bg-[#1D4ED8] px-5 py-2.5 text-xs font-bold"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Editorial Guide (For Readers & AdSense Crawlers) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Asynchronous Productivity &amp; Client-Side Workspaces
        </h2>
        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
          PlanetAI Hub&apos;s Workspace &amp; Docs Studio brings 9 essential cloud and project management utilities directly into your browser with zero logins, external API keys, or tracking scripts required. Whether you are formatting SOPs in Notion, managing sprint velocity in ClickUp or Trello, tracking enterprise leads in GoHighLevel, organizing cross-functional milestones in Monday.com, or generating banners in Canva, all data persists instantly via secure local storage.
        </p>
        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
          Designed specifically for distributed engineering teams, remote AI evaluators, and virtual assistants, this suite ensures lightning-fast load times and complete data ownership. Combine these browser-local tools with our transparent USD job board and automated resume builder for an unmatched remote workflow experience.
        </p>
      </div>
    </div>
  );
};
