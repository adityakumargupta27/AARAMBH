import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Shield,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Lock,
  Network,
  Scale,
  ExternalLink,
  Layers,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Search,
  Check,
  Building,
  Plus,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  PanelRightClose,
  PanelRight,
  Info,
  Clock,
  History,
  Landmark,
} from 'lucide-react';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Modal } from '@/components/ui/Modal';
import { ShowCauseNoticeModal } from '@/components/ui/ShowCauseNoticeModal';
import { CollusionNetworkModal } from '@/components/ui/CollusionNetworkModal';
import { JurySandboxModal } from '@/components/ui/JurySandboxModal';
import { SmartLockWidget } from '@/components/ui/SmartLockWidget';
import { VigilanceReportModal } from '@/components/ui/VigilanceReportModal';
import { api } from '@/services/api';
import { officialMPAllocations, allParliamentAllocations } from '@/data/officialMpladsData';
import { aiQuickQuestions, demoRiskAssessment } from '@/data/mockData';
import type { AIMessage } from '@/types';
import { cn } from '@/utils/cn';

interface TargetItem {
  id: string;
  projectName: string;
  contractorName: string;
  mpName?: string;
  house?: 'Lok Sabha' | 'Rajya Sabha';
  mpType?: string;
  riskScore: number;
  riskLevel: 'high' | 'review' | 'watch' | 'normal';
  evidenceCount: number;
  state: string;
  constituency: string;
  sanctionedAmount: number;
  awardValue: number;
  disbursedAmount: number;
  contractValue: number;
  isAugmented?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  targetId: string;
  projectName: string;
  mpName?: string;
  house?: string;
  state?: string;
  createdAt: string;
  messages: AIMessage[];
}

const availableCases = [
  {
    id: 'AR-2026-001024',
    projectName: 'Construction of Community Hall (MPLADS-1024)',
    contractorName: 'ABC Infrastructure Pvt Ltd',
    riskScore: 82,
    riskLevel: 'high' as const,
    evidenceCount: 12,
    state: 'Maharashtra',
    constituency: 'Pune',
    sanctionedAmount: 5200000,
    disbursedAmount: 4270000,
    contractValue: 8200000,
  },
  {
    id: 'AR-2026-001025',
    projectName: 'Rural Connectivity Road & Culvert Works',
    contractorName: 'Kalyan Infratech Solutions Ltd',
    riskScore: 76,
    riskLevel: 'high' as const,
    evidenceCount: 9,
    state: 'Maharashtra',
    constituency: 'Nagpur',
    sanctionedAmount: 3800000,
    disbursedAmount: 3150000,
    contractValue: 4600000,
  },
  {
    id: 'AR-2026-001026',
    projectName: 'Smart Classroom & Computer Lab Upgradation',
    contractorName: 'Shree Sai Eduventures & Tech',
    riskScore: 68,
    riskLevel: 'review' as const,
    evidenceCount: 7,
    state: 'Uttar Pradesh',
    constituency: 'Varanasi',
    sanctionedAmount: 2400000,
    disbursedAmount: 1800000,
    contractValue: 2750000,
  },
];

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-2 text-[13px] text-slate-200 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header parsing: ### or ####
        if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
          const headerText = trimmed.replace(/^#{3,4}\s+/, '').replace(/\*\*/g, '');
          return (
            <div key={idx} className="font-bold text-sky-300 text-[14px] pt-2 pb-1 border-b border-slate-700/40">
              {headerText}
            </div>
          );
        }

        // Parse bold (**text**) and italic (*text*) inside the line
        const parts = line.split(/(\*\*.*?\*\*|\*[^*]+?\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            return (
              <strong key={pIdx} className="font-bold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('*') && part.endsWith('*') && part.length >= 3 && !part.startsWith('**')) {
            return (
              <span key={pIdx} className="text-slate-300 font-medium italic">
                {part.slice(1, -1)}
              </span>
            );
          }
          return part;
        });

        const isList = /^[•\-*]\s+|^\d+\.\s+/.test(trimmed);
        return (
          <p key={idx} className={cn(isList ? 'pl-2 text-slate-300' : '')}>
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
}

const all774ParliamentTargets: TargetItem[] = [
  ...availableCases.map((c) => ({
    ...c,
    awardValue: c.contractValue || c.sanctionedAmount,
    mpName: 'Assigned MP',
    house: 'Lok Sabha' as const,
    mpType: 'Elected MP',
  })),
  ...allParliamentAllocations.map((m, i) => {
    const isAugmented = !m.isBaseline;
    const excessRatio = (m.allocatedAmount - 147000000) / 147000000;
    const riskScore = isAugmented ? Math.min(96, Math.round(65 + excessRatio * 35)) : 38;
    const riskLevel: 'high' | 'review' | 'watch' | 'normal' =
      riskScore >= 75 ? 'high' : riskScore >= 50 ? 'review' : 'normal';

    return {
      id: m.id || `${m.house === 'Lok Sabha' ? 'LS' : 'RS'}-${String(i + 1).padStart(3, '0')}`,
      projectName: `${m.house} Public Works (${m.constituency})`,
      contractorName: `${m.state} State Infrastructure & Works Ltd`,
      mpName: m.mpName,
      house: m.house,
      mpType: m.mpType,
      riskScore,
      riskLevel,
      evidenceCount: isAugmented ? 12 : 5,
      state: m.state,
      constituency: m.constituency,
      sanctionedAmount: m.allocatedAmount,
      awardValue: Math.round(m.allocatedAmount * 0.94),
      disbursedAmount: Math.round(m.allocatedAmount * 0.72),
      contractValue: m.allocatedAmount,
      isAugmented,
    };
  }),
];

function buildInitialBriefing(target: TargetItem): AIMessage {
  return {
    id: `briefing-${target.id}-${Date.now()}`,
    role: 'assistant',
    timestamp: new Date().toISOString(),
    content: `**CONFIDENTIAL VIGILANCE BRIEFING — FILE ${target.id}**\n\nGood day, Officer. You are now auditing **${target.projectName}** (${target.constituency}, ${target.state}) allocated to **Hon. ${target.mpName || 'Parliamentary MP'}** (${target.house || 'Lok Sabha'}) with a composite Risk Index of **${target.riskScore}/100**.\n\n• **Core Concerns**: Civil tender price anomaly vs CPWD Schedule of Rates, bid compression margin, and milestone expenditure pacing.\n• **Statutory Framework**: Rule 149 & 173 GFR 2017 & CPWD Works Manual Section 10CA.\n• **Allocated Outlay**: ₹${(target.sanctionedAmount / 10000000).toFixed(2)} Crores.\n\nYou can click **"Official Vigilance Report"** to view, print, or download the statutory Form VIG-01 inspection docket.`,
    structured: {
      thoughtSteps: [
        { step: 1, title: 'Dossier Loaded', detail: `Ingested telemetry for ${target.id} (${target.constituency}, ${target.state}).` },
        { step: 2, title: 'Compliance Standards Active', detail: 'Cross-referencing Rule 149/173 GFR 2017 & CPWD Schedule of Rates.' },
      ],
      recommendedActions: [
        { id: 'view_report', label: 'Official Vigilance Report', icon: 'FileText', description: 'Complete official statutory docket' },
        { id: 'draft_notice', label: 'Draft Show-Cause Notice', icon: 'FileText', description: 'Statutory GFR/CVC Notice' },
        { id: 'smart_lock', label: 'Engage PFMS Smart Lock', icon: 'Lock', description: 'Freeze pending tranches' },
        { id: 'collusion_graph', label: 'Inspect Collusion Network', icon: 'Network', description: 'Director DIN linkages' },
      ],
    },
  };
}

const defaultSessions: ChatSession[] = [
  {
    id: 'session-shahjahanpur',
    title: 'Shahjahanpur Public Works Audit',
    targetId: 'LS-440',
    projectName: 'Lok Sabha Public Works (SHAHJAHANPUR(SC))',
    mpName: 'Shri Arun Kumar Sagar',
    house: 'Lok Sabha',
    state: 'Uttar Pradesh',
    createdAt: 'Today, 03:45 AM',
    messages: [
      {
        id: 'msg-sj-1',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: `**CONFIDENTIAL VIGILANCE BRIEFING — CASE LS-440**\n\nGood day, Officer. Routine algorithmic screening has flagged **Tender T-9281** (Lok Sabha Public Works (SHAHJAHANPUR(SC)), SHAHJAHANPUR(SC)) awarded to **Uttar Pradesh State Infrastructure & Works Ltd** with an elevated Risk Index of **82/100 (HIGH PRIORITY)**.\n\n• **Core Concerns**: Unapproved civil unit rate (+45.5% over CPWD benchmark), a compressed 2.4% cartel bid spread with directorship overlap (DIN: 08472911), and an unverified financial-to-physical progress disparity (+18.8%).\n\nYou can click **"Official Vigilance Report"** above or below to examine, print, or download the full statutory inspection docket.`,
        structured: {
          thoughtSteps: [
            { step: 1, title: 'Dossier Loaded', detail: 'Active file: LS-440 (Lok Sabha Public Works (SHAHJAHANPUR(SC))).' },
            { step: 2, title: 'Statutory Benchmarks Active', detail: 'Cross-referencing Rule 149/173 GFR 2017 & Section 10CA CPWD Manual.' },
          ],
          recommendedActions: [
            { id: 'view_report', label: 'Official Vigilance Report', icon: 'FileText', description: 'Official statutory docket' },
            { id: 'draft_notice', label: 'Draft Show-Cause Notice', icon: 'FileText', description: 'Statutory Notice' },
            { id: 'smart_lock', label: 'Engage PFMS Smart Lock', icon: 'Lock', description: 'Freeze disbursements' },
            { id: 'collusion_graph', label: 'Inspect Collusion Network', icon: 'Network', description: 'Inspect cartel' },
          ],
        },
      },
    ],
  },
  {
    id: 'session-varanasi',
    title: 'Varanasi MPLADS Scrutiny',
    targetId: 'LS-457',
    projectName: 'Lok Sabha Public Works (VARANASI)',
    mpName: 'Shri Narendra Modi',
    house: 'Lok Sabha',
    state: 'Uttar Pradesh',
    createdAt: 'Yesterday',
    messages: [
      {
        id: 'msg-v-1',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: `**CONFIDENTIAL VIGILANCE BRIEFING — FILE: LS-457 (VARANASI)**\n\nGood day, Officer. You are auditing **VARANASI, Uttar Pradesh** represented by **Hon. Shri Narendra Modi**.\n\n• **Outlay**: ₹16.21 Crores sanctioned limit.\n• **Status**: Telemetry analysis confirms CPWD Schedule of Rates compliance. Minor vendor variance under regular watch.\n\nClick **"Official Vigilance Report"** to view complete inspection summary.`,
        structured: {
          thoughtSteps: [
            { step: 1, title: 'Varanasi Profile Loaded', detail: 'Ingested ₹16.21 Cr limit and telemetry.' },
          ],
          recommendedActions: [
            { id: 'view_report', label: 'Official Vigilance Report', icon: 'FileText', description: 'Examine official memo' },
          ],
        },
      },
    ],
  },
  {
    id: 'session-karnataka-rs',
    title: 'Karnataka RS Works Review',
    targetId: 'RS-216',
    projectName: 'Rajya Sabha Public Works (Karnataka)',
    mpName: 'Smt. Nirmala Sitharaman',
    house: 'Rajya Sabha',
    state: 'Karnataka',
    createdAt: '2 days ago',
    messages: [
      {
        id: 'msg-rs-1',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: `**CONFIDENTIAL VIGILANCE BRIEFING — FILE: RS-216 (RAJYA SABHA)**\n\nOfficer, auditing Rajya Sabha developmental schemes for **Hon. Smt. Nirmala Sitharaman (2022-28)**, Karnataka.\n\n• **Outlay**: ₹21.60 Crores sanctioned limit.\n• **Findings**: Civil works progress steady at 64%. Escrow accounts operating under normal thresholds.`,
        structured: {
          thoughtSteps: [
            { step: 1, title: 'Rajya Sabha File Loaded', detail: 'Target: RS-216 Karnataka.' },
          ],
          recommendedActions: [
            { id: 'view_report', label: 'Official Vigilance Report', icon: 'FileText', description: 'Generate report' },
          ],
        },
      },
    ],
  },
];

export default function AIInvestigatorPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Targets (All 774 MPs)
  const [targets, setTargets] = useState<TargetItem[]>(all774ParliamentTargets);
  const [selectedCaseId, setSelectedCaseId] = useState('LS-440');

  // UI Panels Layout (ChatGPT 3-pane layout)
  const [historySidebarOpen, setHistorySidebarOpen] = useState(true);
  const [contextDrawerOpen, setContextDrawerOpen] = useState(true);

  // Chat Sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('aarambha_investigator_sessions_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved sessions', e);
    }
    return defaultSessions;
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-shahjahanpur';
  });

  // Current Active Session
  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || sessions[0] || defaultSessions[0];
  }, [sessions, activeSessionId]);

  // Current Active Case
  const selectedCase = useMemo(() => {
    return (
      targets.find((c) => c.id === activeSession.targetId) ||
      targets.find((c) => c.id === selectedCaseId) ||
      targets[0] ||
      availableCases[0]
    );
  }, [targets, activeSession.targetId, selectedCaseId]);

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aarambha_investigator_sessions_v2', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Could not save sessions', e);
    }
  }, [sessions]);

  // Target Selection Modal State
  const [targetSelectorOpen, setTargetSelectorOpen] = useState(false);
  const [targetSearchQuery, setTargetSearchQuery] = useState('');
  const [targetFilterHouse, setTargetFilterHouse] = useState<'all' | 'Lok Sabha' | 'Rajya Sabha'>('all');
  const [targetFilterState, setTargetFilterState] = useState('');
  const [targetFilterType, setTargetFilterType] = useState<'all' | 'augmented' | 'baseline'>('all');

  // In-Chat Modals
  const [activeModal, setActiveModal] = useState<'notice' | 'smart_lock' | 'collusion' | 'jury' | 'report' | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({ init: false });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession.messages, loading]);

  // Handle creating a NEW chat / investigation session (ChatGPT style)
  const handleNewChat = (target?: TargetItem) => {
    const t = target || selectedCase;
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: `${t.constituency} Inquiry`,
      targetId: t.id,
      projectName: t.projectName,
      mpName: t.mpName,
      house: t.house || 'Lok Sabha',
      state: t.state,
      createdAt: 'Just now',
      messages: [buildInitialBriefing(t)],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setSelectedCaseId(t.id);
  };

  // Delete a session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter((s) => s.id !== sessionId);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
        setSelectedCaseId(remaining[0].targetId);
      }
    }
  };

  // Selecting a target updates the current session or creates a new one
  const selectTarget = (target: TargetItem) => {
    setSelectedCaseId(target.id);
    setTargetSelectorOpen(false);

    // Update active session to point to this target and append new briefing
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: `${target.constituency} Investigation`,
            targetId: target.id,
            projectName: target.projectName,
            mpName: target.mpName,
            house: target.house,
            state: target.state,
            messages: [...s.messages, buildInitialBriefing(target)],
          };
        }
        return s;
      })
    );
  };

  const toggleThoughts = (msgId: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleActionClick = (actionId: string) => {
    if (actionId === 'draft_notice') setActiveModal('notice');
    else if (actionId === 'smart_lock') setActiveModal('smart_lock');
    else if (actionId === 'collusion_graph') setActiveModal('collusion');
    else if (actionId === 'jury_sandbox') setActiveModal('jury');
    else if (actionId === 'view_report' || actionId === 'formal_report') setActiveModal('report');
  };

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: AIMessage = {
      id: userMsgId,
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    // Append user message immediately
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            // If it's a generic title, update it based on the first question
            title: s.messages.length <= 1 ? question.slice(0, 32) + (question.length > 32 ? '...' : '') : s.title,
            messages: [...s.messages, userMsg],
          };
        }
        return s;
      })
    );

    setInput('');
    setLoading(true);

    try {
      const response = await api.queryAIInvestigator({
        question,
        caseId: selectedCase.id,
        caseContext: selectedCase,
      });

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: AIMessage = {
        id: aiMsgId,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: response.answer,
        structured: {
          answer: response.answer,
          evidence: response.evidenceCited,
          disclaimer: response.disclaimer,
          thoughtSteps: response.thoughtSteps,
          statutoryRules: response.statutoryRules,
          recommendedActions: response.recommendedActions,
        },
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, aiMsg],
            };
          }
          return s;
        })
      );
      setExpandedThoughts((prev) => ({ ...prev, [aiMsgId]: true }));
    } catch (err) {
      const errorMsg: AIMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content:
          'Case data analyzed: Primary finding indicates +45.5% civil rate variance and 2.4% tender spread. Recommended action is to hold disbursements under GFR 2017 Rule 173.',
      };
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, errorMsg] } : s))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col bg-[#0b1120] text-slate-100 rounded-xl overflow-hidden border border-slate-800/90 shadow-2xl">
      {/* Top Global Bar */}
      <header className="h-14 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 flex-shrink-0 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={historySidebarOpen ? 'Hide Chat History' : 'Show Chat History'}
          >
            {historySidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
            <span className="font-bold text-white text-[13px] sm:text-[14px] truncate leading-tight">
              {activeSession.title}
            </span>
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-semibold border hidden md:inline-flex",
              selectedCase.house === 'Rajya Sabha'
                ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                : "bg-blue-500/15 border-blue-500/30 text-blue-300"
            )}>
              {selectedCase.house || 'Lok Sabha'} • {selectedCase.constituency}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setTargetSelectorOpen(true)}
            className="btn-secondary text-[11px] px-2.5 py-1.5 flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700 shadow-sm"
            title="Switch Target Project or Constituency"
          >
            <Search className="w-3 h-3 text-sky-400" />
            <span className="hidden sm:inline">Target:</span>
            <span className="font-semibold truncate max-w-[110px]">{selectedCase.constituency}</span>
          </button>

          <button
            onClick={() => setActiveModal('report')}
            className="btn-primary text-[11px] px-3 py-1.5 flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 shadow-sm"
          >
            <FileText className="w-3 h-3" />
            <span className="hidden sm:inline">Official Vigilance Report</span>
          </button>

          <button
            onClick={() => setContextDrawerOpen(!contextDrawerOpen)}
            className={cn(
              "p-1.5 rounded-lg border transition-colors",
              contextDrawerOpen
                ? "bg-sky-500/15 border-sky-500/30 text-sky-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
            )}
            title={contextDrawerOpen ? 'Hide Case Context Dossier' : 'Show Case Context Dossier'}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main 3-Pane Workspace Container */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* ============================================================ */}
        {/* 1. LEFT SIDEBAR: Chat Sessions History (ChatGPT style)        */}
        {/* ============================================================ */}
        <aside
          className={cn(
            "bg-slate-950/80 border-r border-slate-800/80 flex flex-col transition-all duration-300 flex-shrink-0 z-20",
            historySidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
          )}
        >
          {/* New Chat Button */}
          <div className="p-3 border-b border-slate-800/80">
            <button
              onClick={() => handleNewChat()}
              className="w-full py-2 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-500/50 text-sky-300 font-semibold text-[12px] flex items-center justify-center gap-2 transition-all shadow-sm group"
            >
              <Plus className="w-4 h-4 text-sky-400 group-hover:rotate-90 transition-transform duration-200" />
              <span>New Investigation</span>
            </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Recent Audits</span>
              <span className="text-slate-600 font-mono">{sessions.length}</span>
            </div>

            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    setSelectedCaseId(session.targetId);
                  }}
                  className={cn(
                    "group p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 text-left relative",
                    isActive
                      ? "bg-slate-800/90 border-sky-500/40 text-white shadow-md shadow-sky-500/5"
                      : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200 hover:border-slate-800"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-sky-400" : "text-slate-500")} />
                      <span className="font-semibold text-[12px] truncate">{session.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate flex items-center gap-1.5">
                      <span>{session.house === 'Rajya Sabha' ? 'RS' : 'LS'}</span>
                      <span>•</span>
                      <span className="truncate">{session.mpName || session.state || 'Assigned MP'}</span>
                    </div>
                  </div>

                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 rounded transition-opacity flex-shrink-0"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3 text-slate-500 hover:text-red-400" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Badge */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-sky-400" /> CVC / GFR 2017
            </span>
            <span className="font-mono text-slate-400">774 MPs Ingested</span>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* 2. CENTER PANEL: ChatGPT-Style Conversational Interface      */}
        {/* ============================================================ */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] relative">
          {/* Scrollable Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
            <div className="max-w-4xl mx-auto w-full space-y-5">
              {activeSession.messages.map((msg) => (
                <div key={msg.id} className={cn('flex gap-3.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role !== 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4 text-sky-400" />
                    </div>
                  )}

                  <div className={cn('space-y-2', msg.role === 'user' ? 'max-w-[80%]' : 'w-full flex-1 min-w-0')}>
                    {msg.role === 'user' ? (
                      <div className="bg-sky-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13px] shadow-md leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm p-4 sm:p-5 space-y-3 shadow-xl backdrop-blur-sm">
                        {/* Reasoning Trace (Collapsible) */}
                        {msg.structured?.thoughtSteps && msg.structured.thoughtSteps.length > 0 && (
                          <div className="border border-sky-500/20 rounded-lg bg-sky-500/5 overflow-hidden">
                            <button
                              onClick={() => toggleThoughts(msg.id)}
                              className="w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-sky-500/10 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                                <span className="text-[11px] font-semibold text-sky-300">
                                  Forensic Reasoning Trace ({msg.structured.thoughtSteps.length} steps)
                                </span>
                              </div>
                              {expandedThoughts[msg.id] ? (
                                <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
                              )}
                            </button>

                            {expandedThoughts[msg.id] && (
                              <div className="p-3.5 border-t border-sky-500/15 space-y-2 bg-slate-950/60">
                                {msg.structured.thoughtSteps.map((ts) => (
                                  <div key={ts.step} className="flex items-start gap-2.5 text-[11px]">
                                    <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center flex-shrink-0 text-[9px] font-bold border border-sky-500/30">
                                      {ts.step}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <span className="font-semibold text-slate-200">{ts.title}: </span>
                                      <span className="text-slate-400 leading-relaxed">{ts.detail}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Main Clean Formatted Text */}
                        <FormattedMessage content={msg.content} />

                        {/* Statutory Rules Cited */}
                        {msg.structured?.statutoryRules && msg.structured.statutoryRules.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t border-slate-800">
                            <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Scale className="w-3 h-3" /> Statutory Violations Cited
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.structured.statutoryRules.map((rule, idx) => (
                                <div key={idx} className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px]">
                                  <div className="font-semibold text-amber-300">{rule.rule}</div>
                                  <div className="text-slate-300 text-[10px] mt-0.5">{rule.clause}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Executable Recommended Forensic Actions */}
                        {msg.structured?.recommendedActions && msg.structured.recommendedActions.length > 0 && (
                          <div className="pt-2 border-t border-slate-800">
                            <div className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Layers className="w-3 h-3" /> Execute Recommended Forensic Actions
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {msg.structured.recommendedActions.map((action) => (
                                <button
                                  key={action.id}
                                  onClick={() => handleActionClick(action.id)}
                                  className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-500/20 border border-slate-700 hover:border-sky-500/50 text-slate-100 hover:text-sky-300 transition-all shadow-sm"
                                >
                                  {action.id === 'view_report' && <FileText className="w-3.5 h-3.5 text-sky-400" />}
                                  {action.id === 'draft_notice' && <FileText className="w-3.5 h-3.5 text-sky-400" />}
                                  {action.id === 'smart_lock' && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                                  {action.id === 'collusion_graph' && <Network className="w-3.5 h-3.5 text-emerald-400" />}
                                  {action.id === 'jury_sandbox' && <Scale className="w-3.5 h-3.5 text-purple-400" />}
                                  <span>{action.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-sky-300">Auditor Reasoning in Progress...</span>
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Cross-referencing CPWD Schedule of Rates, tender bid spreads, and GFR 2017 clauses...
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Prompt Bar & Suggestions (ChatGPT-Style) */}
          <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800/80 backdrop-blur-md">
            <div className="max-w-4xl mx-auto space-y-2.5">
              {/* Quick Inquiry Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                {aiQuickQuestions.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="flex-shrink-0 px-3 py-1.5 bg-slate-900 hover:bg-sky-500/15 border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 rounded-full transition-all text-[11px]"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="relative flex items-center bg-slate-900 border border-slate-700/80 focus-within:border-sky-500 rounded-xl shadow-lg transition-all p-1.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                  placeholder="Ask any forensic question about this file, unit rates, GFR rules, or contractors..."
                  className="w-full bg-transparent px-3 py-2 text-[13px] text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  disabled={loading}
                  autoFocus
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-30 disabled:hover:bg-sky-600 transition-all flex items-center justify-center flex-shrink-0"
                  title="Send Inquiry"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* ============================================================ */}
        {/* 3. RIGHT SIDEBAR: Context Dossier of Target (Side Context)    */}
        {/* ============================================================ */}
        <aside
          className={cn(
            "bg-slate-950/90 border-l border-slate-800/80 flex flex-col transition-all duration-300 flex-shrink-0 z-20",
            contextDrawerOpen ? "w-80" : "w-0 overflow-hidden border-l-0"
          )}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-[13px] text-white">Target Dossier & Telemetry</span>
            </div>
            <button
              onClick={() => setContextDrawerOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              title="Close Dossier"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>

          {/* Dossier Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[12px] scrollbar-thin">
            {/* Target Selector Banner */}
            <button
              onClick={() => setTargetSelectorOpen(true)}
              className="w-full py-2 px-3 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 font-semibold text-[12px] flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span className="truncate">Choose from 774 MPs</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-200 uppercase font-mono">
                Change
              </span>
            </button>

            {/* Case Reference & House */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Case Reference</span>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded font-semibold border",
                  selectedCase.house === 'Rajya Sabha'
                    ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                    : "bg-blue-500/15 border-blue-500/30 text-blue-300"
                )}>
                  {selectedCase.house || 'Lok Sabha'}
                </span>
              </div>
              <div className="text-[14px] font-bold text-sky-400 font-mono flex items-center gap-1">
                {selectedCase.id}
              </div>
            </div>

            {/* MP Profile */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Member of Parliament</div>
              <div className="text-[13px] font-bold text-amber-300">
                Hon. {selectedCase.mpName || 'Assigned MP'}
              </div>
              <div className="text-[11px] text-slate-400">
                {selectedCase.constituency}, {selectedCase.state}
              </div>
              {selectedCase.mpType && (
                <div className="text-[10px] inline-block px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {selectedCase.mpType}
                </div>
              )}
            </div>

            {/* Financial Outlay & Budget */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">MoSPI Allocated Limit</div>
              <div className="text-[18px] font-bold text-emerald-400 tabular-nums">
                ₹{(selectedCase.sanctionedAmount / 10000000).toFixed(2)} Crores
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800 text-slate-400">
                <span>Disbursed Outlay:</span>
                <span className="font-semibold text-slate-200">
                  ₹{(selectedCase.disbursedAmount / 10000000).toFixed(2)} Cr
                </span>
              </div>
            </div>

            {/* Composite Risk Score */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Risk Score</span>
                <RiskBadge level={selectedCase.riskLevel} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-red-400 tabular-nums">{selectedCase.riskScore}</span>
                <span className="text-[11px] text-slate-500">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    selectedCase.riskScore >= 75 ? "bg-red-500" : selectedCase.riskScore >= 50 ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${selectedCase.riskScore}%` }}
                />
              </div>
            </div>

            {/* Primary Signals */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Primary Algorithmic Signals</div>
              <div className="space-y-1.5">
                {demoRiskAssessment.signals.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-1.5 rounded bg-slate-800/40 text-[11px]">
                    <span className="text-slate-300 truncate pr-2">{s.label}</span>
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.2 rounded border border-red-500/20">
                      {s.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setActiveModal('report')}
                className="w-full btn-primary py-2 text-[12px] flex items-center justify-center gap-1.5 shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Examine Vigilance Memo</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ============================================================ */}
      {/* 4. MODALS & TARGET FILE SELECTOR                             */}
      {/* ============================================================ */}
      <VigilanceReportModal open={activeModal === 'report'} onClose={() => setActiveModal(null)} caseData={selectedCase} />
      <ShowCauseNoticeModal open={activeModal === 'notice'} onClose={() => setActiveModal(null)} />
      <CollusionNetworkModal open={activeModal === 'collusion'} onClose={() => setActiveModal(null)} />
      <JurySandboxModal open={activeModal === 'jury'} onClose={() => setActiveModal(null)} />

      {/* Smart Lock Escrow Modal Wrapper */}
      <Modal
        open={activeModal === 'smart_lock'}
        onClose={() => setActiveModal(null)}
        title="PFMS Zero-Leakage Pre-Disbursement Smart Lock"
        subtitle="Automated payment gate check under PFMS Rule 112 & GFR 2017 Clause 21"
        size="lg"
      >
        <div className="space-y-4">
          <SmartLockWidget
            onOpenNoticeModal={() => setActiveModal('notice')}
            onOpenSyndicateModal={() => setActiveModal('collusion')}
          />
        </div>
      </Modal>

      {/* Target Selection Modal (All 774 MPs) */}
      <Modal
        open={targetSelectorOpen}
        onClose={() => setTargetSelectorOpen(false)}
        title="Select Target Parliamentary MP to Investigate"
        subtitle={`Choose from ${targets.length} official Parliamentary MPs across Lok Sabha (543) and Rajya Sabha (231)`}
        size="xl"
      >
        <div className="space-y-3">
          {/* Search Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={targetSearchQuery}
                onChange={(e) => setTargetSearchQuery(e.target.value)}
                placeholder="Search MP (e.g. Modi, Nirmala, Sonia, Akhilesh), constituency, state, or ID..."
                className="input pl-9 text-[13px] bg-slate-900/90 border-slate-700 w-full"
                autoFocus
              />
            </div>
            {targetSearchQuery && (
              <button
                onClick={() => setTargetSearchQuery('')}
                className="btn-secondary text-[12px]"
              >
                Clear
              </button>
            )}
          </div>

          {/* House Selector, State Filter & Outlay Type */}
          <div className="flex items-center gap-2 flex-wrap text-[12px]">
            {/* House Tabs */}
            <div className="flex items-center rounded-md bg-slate-900 border border-slate-800 p-0.5 text-[11px]">
              <button
                onClick={() => setTargetFilterHouse('all')}
                className={cn("px-2.5 py-1 rounded transition-colors", targetFilterHouse === 'all' ? "bg-sky-600 text-white font-semibold" : "text-slate-400 hover:text-slate-200")}
              >
                All Parliament (774)
              </button>
              <button
                onClick={() => setTargetFilterHouse('Lok Sabha')}
                className={cn("px-2.5 py-1 rounded transition-colors", targetFilterHouse === 'Lok Sabha' ? "bg-blue-600 text-white font-semibold" : "text-slate-400 hover:text-slate-200")}
              >
                Lok Sabha (543)
              </button>
              <button
                onClick={() => setTargetFilterHouse('Rajya Sabha')}
                className={cn("px-2.5 py-1 rounded transition-colors", targetFilterHouse === 'Rajya Sabha' ? "bg-purple-600 text-white font-semibold" : "text-slate-400 hover:text-slate-200")}
              >
                Rajya Sabha (231)
              </button>
            </div>

            <select
              value={targetFilterState}
              onChange={(e) => setTargetFilterState(e.target.value)}
              aria-label="Filter by state"
              className="bg-slate-900 border border-slate-700 text-white rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-500 max-w-[180px]"
            >
              <option value="">All States ({targets.length})</option>
              {Array.from(new Set(targets.map((t) => t.state))).sort().map((st) => (
                <option key={st} value={st}>
                  {st} ({targets.filter((t) => t.state === st).length})
                </option>
              ))}
            </select>

            <div className="flex items-center rounded-md bg-slate-900 border border-slate-800 p-0.5 text-[11px]">
              <button
                onClick={() => setTargetFilterType('all')}
                className={cn("px-2 py-1 rounded transition-colors", targetFilterType === 'all' ? "bg-slate-700 text-white font-semibold" : "text-slate-400 hover:text-slate-200")}
              >
                All Outlays
              </button>
              <button
                onClick={() => setTargetFilterType('augmented')}
                className={cn("px-2 py-1 rounded transition-colors", targetFilterType === 'augmented' ? "bg-amber-600 text-white font-semibold" : "text-slate-400 hover:text-slate-200")}
              >
                High Outlay
              </button>
            </div>

            <span className="text-[11px] text-slate-400 ml-auto font-mono">
              Showing <strong className="text-sky-400">{
                targets.filter((t) => {
                  if (targetFilterHouse !== 'all' && t.house !== targetFilterHouse) return false;
                  if (targetFilterState && t.state !== targetFilterState) return false;
                  if (targetFilterType === 'augmented' && !t.isAugmented) return false;
                  if (targetFilterType === 'baseline' && t.isAugmented) return false;
                  if (!targetSearchQuery.trim()) return true;
                  const q = targetSearchQuery.toLowerCase();
                  return (
                    t.constituency.toLowerCase().includes(q) ||
                    t.state.toLowerCase().includes(q) ||
                    t.projectName.toLowerCase().includes(q) ||
                    t.contractorName.toLowerCase().includes(q) ||
                    (t.mpName && t.mpName.toLowerCase().includes(q)) ||
                    t.id.toLowerCase().includes(q)
                  );
                }).length
              }</strong> MPs
            </span>
          </div>

          {/* Full Parliament MP List */}
          <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {targets
              .filter((t) => {
                if (targetFilterHouse !== 'all' && t.house !== targetFilterHouse) return false;
                if (targetFilterState && t.state !== targetFilterState) return false;
                if (targetFilterType === 'augmented' && !t.isAugmented) return false;
                if (targetFilterType === 'baseline' && t.isAugmented) return false;
                if (!targetSearchQuery.trim()) return true;
                const q = targetSearchQuery.toLowerCase();
                return (
                  t.constituency.toLowerCase().includes(q) ||
                  t.state.toLowerCase().includes(q) ||
                  t.projectName.toLowerCase().includes(q) ||
                  t.contractorName.toLowerCase().includes(q) ||
                  (t.mpName && t.mpName.toLowerCase().includes(q)) ||
                  t.id.toLowerCase().includes(q)
                );
              })
              .map((target) => (
                <div
                  key={target.id}
                  onClick={() => selectTarget(target)}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3",
                    target.id === selectedCase.id
                      ? "bg-sky-500/15 border-sky-500/50 shadow-md shadow-sky-500/10"
                      : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-bold text-sky-400 font-mono">{target.id}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-semibold border",
                        target.house === 'Rajya Sabha'
                          ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                          : "bg-blue-500/15 border-blue-500/30 text-blue-300"
                      )}>
                        {target.house || 'Lok Sabha'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded font-medium">
                        {target.constituency}, {target.state}
                      </span>
                      {target.mpName && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded font-semibold">
                          MP: {target.mpName}
                        </span>
                      )}
                      <RiskBadge level={target.riskLevel} />
                    </div>
                    <div className="text-[13px] font-semibold text-white mt-1 truncate">{target.projectName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-4 flex-wrap">
                      <span>Agency: <strong className="text-slate-300">{target.contractorName}</strong></span>
                      <span>Allocated Limit: <strong className="text-emerald-400">₹{(target.sanctionedAmount / 10000000).toFixed(2)} Cr</strong></span>
                      <span>Risk Score: <strong className="text-amber-400">{target.riskScore}/100</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {target.id === selectedCase.id ? (
                      <span className="text-[11px] font-semibold text-sky-300 px-3 py-1.5 bg-sky-500/20 border border-sky-500/40 rounded flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Active Target
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectTarget(target);
                        }}
                        className="btn-primary text-[11px] px-3 py-1.5 flex items-center gap-1"
                      >
                        <Bot className="w-3 h-3" />
                        <span>Audit File</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
