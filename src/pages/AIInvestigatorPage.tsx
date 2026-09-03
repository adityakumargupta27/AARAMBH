import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, Sparkles, FileText, AlertTriangle, Shield, Lightbulb } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { aiMockResponses, aiQuickQuestions, demoInvestigationCase, demoRiskAssessment } from '@/data/mockData';
import type { AIMessage } from '@/types';
import { signalLabel } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function AIInvestigatorPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      content: 'I am the Aarambha AI Investigator. I can analyze procurement evidence and risk signals for this case. Ask me about the findings, evidence, or recommended verification steps.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const caseData = demoInvestigationCase;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (question: string) => {
    if (!question.trim() || loading) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const mockResponse = aiMockResponses[question];
      if (mockResponse) {
        setMessages((prev) => [...prev, { ...mockResponse, timestamp: new Date().toISOString() }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            timestamp: new Date().toISOString(),
            content: 'I can provide analysis on the available evidence for this case. Try one of the suggested questions for a detailed response.',
            structured: {
              answer: 'I can provide analysis on the available evidence for this case. Try one of the suggested questions for a detailed response.',
              disclaimer: 'Risk indicators are analytical signals intended for review and do not independently establish fraud, corruption or criminal liability.',
            },
          },
        ]);
      }
      setLoading(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="animate-fade-in space-y-4 h-full flex flex-col">
      <PageHeader
        title="AI Investigator"
        subtitle="Ask questions about procurement evidence and risk signals."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Left: Case Context */}
        <div className="space-y-3">
          <Card>
            <CardHeader title="Case Context" subtitle="Active investigation" />
            <CardBody className="space-y-3">
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Case</div>
                <button onClick={() => navigate(`/investigations/${caseData.id}`)} className="text-[14px] font-bold text-sky-400 hover:text-navy-900">
                  {caseData.id}
                </button>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Project</div>
                <div className="text-[13px] font-medium text-slate-100">{caseData.projectName}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Contractor</div>
                <div className="text-[13px] font-medium text-slate-100">{caseData.contractorName}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Risk:</div>
                <span className="text-[16px] font-bold text-red-600 tabular-nums">{caseData.riskScore}</span>
                <span className="text-[11px] text-slate-400">/ 100</span>
                <RiskBadge level={caseData.riskLevel} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Top Signals" />
            <CardBody className="space-y-2">
              {demoRiskAssessment.signals.slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 bg-slate-800/40 border border-slate-700/30 rounded">
                  <span className="text-[12px] font-medium text-slate-300">{s.label}</span>
                  <span className="text-[13px] font-bold tabular-nums text-white">{s.score}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Evidence</div>
                  <div className="text-[18px] font-bold text-white tabular-nums">{caseData.evidenceCount} records</div>
                </div>
                <FileText className="w-6 h-6 text-slate-300" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right: Chat */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="flex flex-col flex-1 min-h-0">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4 min-h-[400px]">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[85%]', msg.role === 'user' ? '' : 'w-full')}>
                    {msg.role === 'user' ? (
                      <div className="bg-navy-700 text-white rounded-lg rounded-tr-sm px-4 py-2.5 text-[13px]">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-navy-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-4 h-4 text-sky-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg rounded-tl-sm px-4 py-3">
                            <p className="text-[13px] text-slate-200 leading-relaxed">{msg.content}</p>

                            {msg.structured?.signals && (
                              <div className="mt-3 space-y-2">
                                {msg.structured.signals.map((sig, i) => (
                                  <div key={i} className="p-2.5 rounded-md border" style={{ background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(148, 163, 184, 0.12)' }}>
                                    <div className="text-[12px] font-semibold text-sky-400">{sig.label}</div>
                                    <div className="text-[12px] text-slate-300 mt-0.5">{sig.description}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {msg.structured?.recommendation && (
                              <div className="mt-3 p-2.5 rounded-md flex items-start gap-2 border" style={{ background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
                                <Lightbulb className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-[10px] font-semibold text-sky-400 uppercase">Recommendation</div>
                                  <p className="text-[12px] text-slate-300 mt-0.5">{msg.structured.recommendation}</p>
                                </div>
                              </div>
                            )}

                            {msg.structured?.evidence && msg.structured.evidence.length > 0 && (
                              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-slate-400 font-medium">Evidence used:</span>
                                {msg.structured.evidence.map((ev, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded text-slate-300 border" style={{ background: 'rgba(30, 41, 59, 0.6)', borderColor: 'rgba(148, 163, 184, 0.12)' }}>{ev}</span>
                                ))}
                              </div>
                            )}

                            {msg.structured?.disclaimer && (
                              <div className="mt-2.5 p-2 rounded flex items-start gap-1.5 border" style={{ background: 'rgba(217, 119, 6, 0.1)', borderColor: 'rgba(217, 119, 6, 0.2)' }}>
                                <Shield className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-300 leading-snug">{msg.structured.disclaimer}</p>
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
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-navy-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] text-slate-300">Analyzing available evidence</span>
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" />
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2.5 border-t border-slate-700/20">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Questions</div>
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

            {/* Input */}
            <div className="p-3 border-t border-slate-700/20">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Ask about this case..."
                  className="input flex-1"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="btn-primary"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
