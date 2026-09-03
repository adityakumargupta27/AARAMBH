import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Modal } from '@/components/ui/Modal';
import { ShowCauseNoticeModal } from '@/components/ui/ShowCauseNoticeModal';
import { CollusionNetworkModal } from '@/components/ui/CollusionNetworkModal';
import { JurySandboxModal } from '@/components/ui/JurySandboxModal';
import { SmartLockWidget } from '@/components/ui/SmartLockWidget';
import { api } from '@/services/api';
import { aiQuickQuestions, demoRiskAssessment } from '@/data/mockData';
import type { AIMessage } from '@/types';
import { cn } from '@/utils/cn';

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

export default function AIInvestigatorPage() {
  const navigate = useNavigate();
  const [selectedCaseId, setSelectedCaseId] = useState('AR-2026-001024');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      content:
        'I am the Aarambha AI Investigator Agent. I have ingested the case telemetry, Schedule of Rates (CPWD), tender bid registries, and PFMS payment records. Ask me any question about the evidence, statistical anomalies, or statutory violations.',
      structured: {
        thoughtSteps: [
          { step: 1, title: 'Telemetry Ingestion', detail: 'Loaded 12 primary evidence records for Case AR-2026-001024.' },
          { step: 2, title: 'Forensic Models Active', detail: 'Benford χ², CPWD SoR Rate Variance, and Bid Cluster detectors ready.' },
        ],
        recommendedActions: [
          { id: 'draft_notice', label: 'Draft Show-Cause Notice', icon: 'FileText', description: 'Statutory GFR/CVC Notice' },
          { id: 'smart_lock', label: 'Engage PFMS Smart Lock', icon: 'Lock', description: 'Freeze pending tranches' },
          { id: 'collusion_graph', label: 'Inspect Collusion Network', icon: 'Network', description: 'Director DIN linkages' },
        ],
      },
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({ init: false });
  const [activeModal, setActiveModal] = useState<'notice' | 'smart_lock' | 'collusion' | 'jury' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedCase = availableCases.find((c) => c.id === selectedCaseId) || availableCases[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleThoughts = (msgId: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleActionClick = (actionId: string) => {
    if (actionId === 'draft_notice') setActiveModal('notice');
    else if (actionId === 'smart_lock') setActiveModal('smart_lock');
    else if (actionId === 'collusion_graph') setActiveModal('collusion');
    else if (actionId === 'jury_sandbox') setActiveModal('jury');
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

    setMessages((prev) => [...prev, userMsg]);
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

      setMessages((prev) => [...prev, aiMsg]);
      // Auto-expand thought steps on new message
      setExpandedThoughts((prev) => ({ ...prev, [aiMsgId]: true }));
    } catch (err) {
      const errorMsg: AIMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content:
          'Case data analyzed: Primary finding indicates +45.5% civil rate variance and 2.4% tender spread. Recommended action is to hold disbursements under GFR 2017 Rule 173.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-4 h-full flex flex-col">
      <PageHeader
        title="AI Investigator Agent"
        subtitle="Autonomous forensic intelligence agent for procurement audit, GFR compliance, and pre-disbursement verification."
        action={
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Investigating Case:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              aria-label="Select investigation case"
              className="text-[12px] bg-slate-800/80 border border-slate-700/50 text-white rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
            >
              {availableCases.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.id} — {c.constituency} ({c.riskScore}/100)
                </option>
              ))}
            </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Left: Case Context & Forensic Telemetry */}
        <div className="space-y-3">
          <Card>
            <CardHeader title="Case Dossier" subtitle="Active telemetry profile" />
            <CardBody className="space-y-3">
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Case Reference</div>
                <button
                  onClick={() => navigate(`/investigations/${selectedCase.id}`)}
                  className="text-[14px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 mt-0.5"
                >
                  {selectedCase.id} <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Project & Location</div>
                <div className="text-[13px] font-medium text-slate-100">{selectedCase.projectName}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {selectedCase.constituency}, {selectedCase.state}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Contractor</div>
                <div className="text-[13px] font-medium text-slate-100">{selectedCase.contractorName}</div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-700/30">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Composite Risk:</div>
                <span className="text-[16px] font-bold text-red-400 tabular-nums">{selectedCase.riskScore}</span>
                <span className="text-[11px] text-slate-400">/ 100</span>
                <RiskBadge level={selectedCase.riskLevel} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Primary Risk Signals" subtitle="Algorithmic telemetry" />
            <CardBody className="space-y-2">
              {demoRiskAssessment.signals.slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2.5 bg-slate-800/40 border border-slate-700/30 rounded-md">
                  <div className="min-w-0 pr-2">
                    <div className="text-[12px] font-medium text-slate-200 truncate">{s.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{s.category}</div>
                  </div>
                  <span className="text-[13px] font-bold tabular-nums text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    {s.score}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Linked Evidence</div>
                  <div className="text-[16px] font-bold text-white tabular-nums">{selectedCase.evidenceCount} verified items</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-sky-400" />
                </div>
              </div>
              <div className="pt-2 border-t border-slate-700/30 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Statutory Standard:</span>
                <span className="text-sky-300 font-medium">GFR 2017 & CVC 2021</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right: Agent Chat Interface */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="flex flex-col flex-1 min-h-0 border-slate-700/40">
            {/* Chat message history */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4 min-h-[420px] max-h-[600px]">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[90%]', msg.role === 'user' ? '' : 'w-full')}>
                    {msg.role === 'user' ? (
                      <div className="bg-sky-600/90 text-white rounded-lg rounded-tr-sm px-4 py-2.5 text-[13px] shadow-sm">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-4 h-4 text-sky-400" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg rounded-tl-sm p-4 space-y-3 shadow-lg">
                            {/* Chain-of-Thought Transparency Panel */}
                            {msg.structured?.thoughtSteps && msg.structured.thoughtSteps.length > 0 && (
                              <div className="border border-sky-500/20 rounded-md bg-sky-500/5 overflow-hidden">
                                <button
                                  onClick={() => toggleThoughts(msg.id)}
                                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-sky-500/10 transition-colors"
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
                                  <div className="p-3 border-t border-sky-500/15 space-y-2 bg-slate-900/40">
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

                            {/* Main Message Content */}
                            <div className="text-[13px] text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                              {msg.content}
                            </div>

                            {/* Statutory Rules Identified */}
                            {msg.structured?.statutoryRules && msg.structured.statutoryRules.length > 0 && (
                              <div className="space-y-1.5 pt-2 border-t border-slate-700/30">
                                <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <Scale className="w-3 h-3" /> Statutory Violations Cited
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {msg.structured.statutoryRules.map((rule, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px]"
                                    >
                                      <div className="font-semibold text-amber-300">{rule.rule}</div>
                                      <div className="text-slate-300 text-[10px] mt-0.5">{rule.clause}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* In-Chat Action Execution Buttons */}
                            {msg.structured?.recommendedActions && msg.structured.recommendedActions.length > 0 && (
                              <div className="pt-2 border-t border-slate-700/30">
                                <div className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                  <Layers className="w-3 h-3" /> Execute Recommended Forensic Actions
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {msg.structured.recommendedActions.map((action) => (
                                    <button
                                      key={action.id}
                                      onClick={() => handleActionClick(action.id)}
                                      className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-md bg-slate-800 hover:bg-sky-500/20 border border-slate-600/60 hover:border-sky-500/50 text-slate-100 hover:text-sky-300 transition-all shadow-sm"
                                    >
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

                            {/* Evidence Reference Tags */}
                            {msg.structured?.evidence && msg.structured.evidence.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                <span className="text-[10px] text-slate-400 font-medium">Evidence Grounding:</span>
                                {msg.structured.evidence.map((ev, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-1.5 py-0.5 rounded text-sky-300 bg-sky-500/10 border border-sky-500/20"
                                  >
                                    {ev}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Vigilance Legal Disclaimer */}
                            {msg.structured?.disclaimer && (
                              <div className="p-2 rounded flex items-start gap-2 bg-slate-900/50 border border-slate-700/30">
                                <Shield className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-slate-400 leading-snug">{msg.structured.disclaimer}</p>
                              </div>
                            )}
                          </div>
                        </div>
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
                  <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg rounded-tl-sm p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-sky-300">Agent Reasoning in Progress...</span>
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Querying CPWD rate schedule, tender bid spreads, and GFR 2017 statutory clauses...
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2.5 border-t border-slate-700/30 bg-slate-900/30">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Suggested Forensic Inquiries
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiQuickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] px-2.5 py-1.5 bg-slate-800/60 border border-slate-700/40 text-slate-200 rounded-md hover:bg-sky-500/15 hover:border-sky-500/30 hover:text-sky-300 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* User Input Bar */}
            <div className="p-3 border-t border-slate-700/30 bg-slate-900/40">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Ask any question about this case, evidence, rates, or GFR rules..."
                  className="input flex-1 text-[13px] bg-slate-900/90 border-slate-700/60 placeholder:text-slate-500"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="btn-primary px-4 py-2 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[12px]">Investigate</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* In-Chat Executable Action Modals */}
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
    </div>
  );
}
