import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, UserPlus, Eye, FileText, Search, Bot, Download,
  AlertTriangle, Info, CheckCircle2, Clock, Circle, Shield,
  ExternalLink, ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RiskBadge, RiskBar } from '@/components/ui/RiskBadge';
import { useToast } from '@/components/ui/Toast';
import {
  demoInvestigationCase, demoRiskAssessment, demoEvidence, demoTimeline,
  demoProject, demoTender, demoContractor, demoContract, demoTransactions,
  demoDocuments, demoComparableProjects,
} from '@/data/mockData';
import { formatCurrency, formatCurrencyShort, formatDate, signalLabel, riskLevelLabel } from '@/utils/format';
import { cn } from '@/utils/cn';
import { PriceComparisonChart, BidDistributionChart } from '@/components/charts/Charts';

type Tab = 'overview' | 'evidence' | 'timeline' | 'bids' | 'contractor' | 'financials' | 'documents' | 'ai';

export default function InvestigationCasePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false, false, false]);

  const caseData = demoInvestigationCase;
  const project = demoProject;
  const assessment = demoRiskAssessment;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'evidence', label: 'Evidence' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'bids', label: 'Bids' },
    { key: 'contractor', label: 'Contractor' },
    { key: 'financials', label: 'Financials' },
    { key: 'documents', label: 'Documents' },
    { key: 'ai', label: 'AI Investigator' },
  ];

  const verificationSteps = [
    'Verify BOQ specification.',
    'Compare local market pricing.',
    'Review bid evaluation record.',
    'Review contractor performance records.',
    'Verify payment/expenditure records.',
    'Check relevant supporting documents.',
  ];

  const statusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === 'in-progress') return <Clock className="w-4 h-4 text-navy-500" />;
    if (status === 'flagged') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    return <Circle className="w-4 h-4 text-slate-300" />;
  };

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title={`Case ${caseData.id}`}
        subtitle={caseData.projectName}
        breadcrumbs={[
          { label: 'Investigation Center', path: '/investigations' },
          { label: caseData.id },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/investigations" className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Back</Link>
            <button className="btn-secondary" onClick={() => toast('info', 'Case assigned', 'Case assigned to current reviewer.')}>
              <UserPlus className="w-4 h-4" /> Assign
            </button>
            <button className="btn-secondary" onClick={() => toast('success', 'Status updated', 'Case moved to Under Review.')}>
              <Eye className="w-4 h-4" /> Mark Under Review
            </button>
            <button className="btn-primary" onClick={() => toast('success', 'Brief generated', 'Investigation brief is ready to view.')}>
              <FileText className="w-4 h-4" /> Generate Brief
            </button>
          </div>
        }
      />

      {/* Case Header Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Risk Score</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[24px] font-bold text-red-600 tabular-nums">{caseData.riskScore}</span>
                  <span className="text-[12px] text-slate-400">/ 100</span>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Project</div>
                <Link to={`/projects/${project.id}`} className="text-[13px] font-medium text-navy-700 hover:text-navy-900">{project.name}</Link>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Contract</div>
                <Link to={`/contracts/${demoContract.id}`} className="text-[13px] font-medium text-navy-700 hover:text-navy-900">{demoContract.id}</Link>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Contractor</div>
                <Link to={`/contractors/${demoContractor.id}`} className="text-[13px] font-medium text-navy-700 hover:text-navy-900">{demoContractor.name}</Link>
              </div>
            </div>
            <RiskBadge level={caseData.riskLevel} />
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
              activeTab === tab.key
                ? 'text-navy-800 border-navy-700'
                : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Risk Score Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader title="Risk Score" subtitle="Composite assessment" />
              <CardBody>
                <div className="flex flex-col items-center py-4">
                  <div className="relative w-32 h-32 rounded-full border-8 border-red-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-[36px] font-bold text-red-600 tabular-nums leading-none">{caseData.riskScore}</div>
                      <div className="text-[10px] text-slate-400 mt-1">/ 100</div>
                    </div>
                  </div>
                  <RiskBadge level={caseData.riskLevel} />
                  <div className="text-[11px] text-slate-400 mt-1.5">{riskLevelLabel(caseData.riskLevel)}</div>
                </div>
              </CardBody>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader title="Top Risk Signals" subtitle="Weighted anomaly contributions" />
              <CardBody>
                <div className="space-y-3">
                  {assessment.signals.map((signal) => (
                    <div key={signal.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-slate-800">{signal.label}</span>
                          <span className={cn(
                            'badge text-[9px]',
                            signal.confidence === 'high' && 'badge-risk-high',
                            signal.confidence === 'medium' && 'badge-risk-review',
                            signal.confidence === 'low' && 'badge-risk-watch',
                          )}>{signal.confidence}</span>
                        </div>
                        <span className="text-[14px] font-bold tabular-nums text-slate-900">{signal.score}</span>
                      </div>
                      <RiskBar score={signal.score} />
                      <div className="text-[11px] text-slate-400 mt-0.5">{signal.finding}</div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Why Flagged */}
          <div>
            <h3 className="section-title">Why Flagged</h3>
            <p className="section-subtitle">Evidence-backed findings that triggered this review</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoEvidence.map((ev, i) => (
              <Card key={ev.id}>
                <CardBody>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Evidence {String(i + 1).padStart(2, '0')}</span>
                    <span className={cn(
                      'badge text-[9px]',
                      ev.confidence === 'high' && 'badge-risk-high',
                      ev.confidence === 'medium' && 'badge-risk-review',
                      ev.confidence === 'low' && 'badge-risk-watch',
                    )}>{ev.confidence} confidence</span>
                  </div>
                  <div className="text-[14px] font-bold text-slate-900 mb-2">{ev.title}</div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 bg-slate-50 rounded">
                      <div className="text-[9px] text-slate-400 uppercase">Current</div>
                      <div className="text-[13px] font-semibold tabular-nums">{ev.value}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <div className="text-[9px] text-slate-400 uppercase">Benchmark</div>
                      <div className="text-[13px] font-semibold tabular-nums">{ev.benchmark}</div>
                    </div>
                    <div className="col-span-2 p-2 bg-orange-50 rounded">
                      <div className="text-[9px] text-orange-400 uppercase">Deviation</div>
                      <div className="text-[13px] font-semibold tabular-nums text-orange-600">{ev.deviation}</div>
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-snug">{ev.finding}</p>
                  <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Source: {ev.source}</span>
                    <button onClick={() => setActiveTab('evidence')} className="text-[11px] text-navy-600 font-medium hover:text-navy-800">View Evidence →</button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Recommended Verification */}
          <Card>
            <CardHeader title="Recommended Verification" subtitle="Suggested steps for the investigator" />
            <CardBody>
              <div className="space-y-2">
                {verificationSteps.map((step, i) => (
                  <label key={i} className="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
                    <button
                      onClick={() => setChecks(checks.map((c, idx) => idx === i ? !c : c))}
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        checks[i] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-navy-400'
                      )}
                    >
                      {checks[i] && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                    <span className={cn('text-[13px]', checks[i] ? 'text-slate-400 line-through' : 'text-slate-700')}>
                      <span className="font-medium text-navy-700 mr-2">{i + 1}.</span>{step}
                    </span>
                  </label>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Disclaimer */}
          <div className="flex items-start gap-2.5 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <Shield className="w-5 h-5 text-navy-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] text-slate-700 font-medium">Evidence Principle</p>
              <p className="text-[12px] text-slate-600 mt-0.5">
                The system is not accusing anyone. The system is showing exactly why a human should investigate.
              </p>
              <p className="text-[11px] text-slate-400 mt-1.5 italic">
                Risk indicators are analytical signals intended for review and do not independently establish fraud, corruption or criminal liability.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Tab */}
      {activeTab === 'evidence' && (
        <div className="space-y-5">
          {/* Evidence Timeline */}
          <Card>
            <CardHeader title="Evidence Timeline" subtitle="Chronological case events" />
            <CardBody>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
                <div className="space-y-4">
                  {demoTimeline.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 relative">
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 relative z-10',
                        event.status === 'completed' && 'bg-emerald-50 border-emerald-300',
                        event.status === 'in-progress' && 'bg-navy-50 border-navy-300',
                        event.status === 'flagged' && 'bg-red-50 border-red-300',
                        event.status === 'pending' && 'bg-slate-50 border-slate-200',
                      )}>
                        {statusIcon(event.status)}
                      </div>
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-slate-800">{event.label}</span>
                          <span className="text-[11px] text-slate-400">{formatDate(event.date)}</span>
                        </div>
                        <p className="text-[12px] text-slate-500 mt-0.5">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Evidence Matrix */}
          <Card>
            <CardHeader title="Evidence Matrix" subtitle="Structured findings with source traceability" />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Signal</th>
                    <th>Finding</th>
                    <th>Value</th>
                    <th>Benchmark</th>
                    <th>Deviation</th>
                    <th>Source</th>
                    <th>Confidence</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assessment.signals.map((s) => (
                    <tr key={s.id}>
                      <td className="font-medium">{s.label}</td>
                      <td className="max-w-[200px] text-[12px]">{s.finding}</td>
                      <td className="tabular-nums">{s.value}</td>
                      <td className="tabular-nums">{s.benchmark}</td>
                      <td className="tabular-nums font-medium text-orange-600">{s.deviation}</td>
                      <td className="text-[11px] text-slate-500">
                        <button className="text-navy-600 hover:text-navy-800 flex items-center gap-0.5">
                          {s.source} <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                      <td>
                        <span className={cn('badge text-[9px]', s.confidence === 'high' && 'badge-risk-high', s.confidence === 'medium' && 'badge-risk-review', s.confidence === 'low' && 'badge-risk-watch')}>
                          {s.confidence}
                        </span>
                      </td>
                      <td>
                        <span className={cn('badge text-[9px] capitalize', s.status === 'confirmed' && 'badge-risk-high', s.status === 'review-recommended' && 'badge-risk-review', s.status === 'needs-verification' && 'badge-risk-watch')}>
                          {s.status.replace(/-/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Source Traceability */}
          <Card>
            <CardHeader title="Source Traceability" subtitle="Every finding links to its data source" />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { source: 'Tender records', refs: ['T-9281', 'Bid evaluation sheet', 'Notice document'] },
                  { source: 'Comparable project records', refs: ['CMP-001 to CMP-005', 'Pune region', 'Same period'] },
                  { source: 'Contractor history', refs: ['42 past contracts', 'Performance reports', 'Registration records'] },
                ].map((src) => (
                  <div key={src.source} className="p-3 border border-slate-200 rounded-md">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Source</div>
                    <div className="text-[13px] font-medium text-slate-800 mb-2">{src.source}</div>
                    <div className="space-y-1">
                      {src.refs.map((ref) => (
                        <button key={ref} className="flex items-center gap-1 text-[11px] text-navy-600 hover:text-navy-800">
                          <ChevronRight className="w-3 h-3" /> {ref}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800">
              Risk indicators are analytical signals intended for review and do not independently establish fraud, corruption or criminal liability.
            </p>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <Card>
          <CardHeader title="Case Timeline" subtitle="Complete chronological history" />
          <CardBody>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
              <div className="space-y-5">
                {demoTimeline.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 relative">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 relative z-10',
                      event.status === 'completed' && 'bg-emerald-50 border-emerald-300',
                      event.status === 'in-progress' && 'bg-navy-50 border-navy-300',
                      event.status === 'flagged' && 'bg-red-50 border-red-300',
                      event.status === 'pending' && 'bg-slate-50 border-slate-200',
                    )}>
                      {statusIcon(event.status)}
                    </div>
                    <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-md p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-semibold text-slate-800">{event.label}</span>
                        <span className="text-[11px] text-slate-400">{formatDate(event.date)}</span>
                      </div>
                      <p className="text-[12px] text-slate-600">{event.description}</p>
                      <span className={cn(
                        'inline-block mt-2 text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide',
                        event.category === 'project' && 'bg-navy-50 text-navy-600',
                        event.category === 'tender' && 'bg-amber-50 text-amber-600',
                        event.category === 'contract' && 'bg-emerald-50 text-emerald-600',
                        event.category === 'execution' && 'bg-orange-50 text-orange-600',
                        event.category === 'risk' && 'bg-red-50 text-red-600',
                        event.category === 'financial' && 'bg-slate-100 text-slate-600',
                      )}>{event.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Bids Tab */}
      {activeTab === 'bids' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Tender Value', value: formatCurrencyShort(demoTender.tenderValue) },
              { label: 'Bidders', value: demoTender.bidderCount },
              { label: 'Winning Bid', value: formatCurrencyShort(demoTender.winningBid) },
              { label: 'Bid Spread', value: `${demoTender.bidSpread}%` },
            ].map((c) => (
              <Card key={c.label}>
                <CardBody className="p-3">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{c.label}</div>
                  <div className="text-[18px] font-bold text-slate-900 tabular-nums mt-1">{c.value}</div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Bid Table" />
              <div className="overflow-x-auto scrollbar-thin">
                <table className="table-base">
                  <thead>
                    <tr><th>Rank</th><th>Bidder</th><th className="text-right">Amount</th><th className="text-right">Diff</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {demoTender.bidders.map((b) => (
                      <tr key={b.rank} className={cn(b.status === 'winner' && 'bg-navy-50/50')}>
                        <td className="font-semibold tabular-nums">{b.rank}</td>
                        <td className="font-medium">{b.name}</td>
                        <td className="text-right tabular-nums">{formatCurrency(b.bidAmount)}</td>
                        <td className="text-right tabular-nums text-slate-500">{b.differenceFromLowest === 0 ? '—' : `+${b.differenceFromLowest}%`}</td>
                        <td>{b.status === 'winner' ? <span className="badge badge-info">Winner</span> : <span className="badge badge-neutral">Participated</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <CardHeader title="Bid Distribution" />
              <CardBody>
                <BidDistributionChart data={demoTender.bidders.map((b) => ({
                  name: b.name.replace(/Pvt Ltd|Ltd|Contractors|Projects|Infra Solutions/g, '').trim(),
                  amount: b.bidAmount,
                  isWinner: b.status === 'winner',
                }))} />
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader title="Pattern Analysis" />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-slate-50 rounded-md">
                  <div className="text-[10px] text-slate-400 uppercase">Current Spread</div>
                  <div className="text-[20px] font-bold tabular-nums">{demoTender.bidSpread}%</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-md">
                  <div className="text-[10px] text-slate-400 uppercase">Historical Median</div>
                  <div className="text-[20px] font-bold tabular-nums">{demoTender.historicalMedianSpread}%</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-md">
                  <div className="text-[10px] text-orange-400 uppercase">Difference</div>
                  <div className="text-[20px] font-bold tabular-nums text-orange-600">-64.7%</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-md">
                  <div className="text-[10px] text-orange-400 uppercase">Status</div>
                  <div className="text-[13px] font-bold text-orange-600 mt-1">Review Recommended</div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800">Bid-pattern anomalies do not establish collusion. Review tender documentation and bidder history.</p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Contractor Tab */}
      {activeTab === 'contractor' && (
        <div className="space-y-4">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-navy-100 flex items-center justify-center">
                    <span className="text-[14px] font-bold text-navy-700">AI</span>
                  </div>
                  <div>
                    <Link to={`/contractors/${demoContractor.id}`} className="text-[15px] font-semibold text-slate-900 hover:text-navy-700">{demoContractor.name}</Link>
                    <div className="text-[12px] text-slate-400">{demoContractor.id} · {demoContractor.registrationNumber}</div>
                  </div>
                </div>
                <RiskBadge level={demoContractor.riskLevel} />
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Previous', value: demoContractor.previousContracts },
              { label: 'Completed', value: demoContractor.completed, color: 'text-emerald-600' },
              { label: 'Delayed', value: demoContractor.delayed, color: 'text-amber-600' },
              { label: 'Cancelled', value: demoContractor.cancelled, color: 'text-red-500' },
              { label: 'Avg Value', value: formatCurrencyShort(demoContractor.averageValue) },
              { label: 'Delay Rate', value: `${demoContractor.delayRate}%`, color: 'text-amber-600' },
            ].map((c) => (
              <Card key={c.label}>
                <CardBody className="p-3">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{c.label}</div>
                  <div className={cn('text-[18px] font-bold tabular-nums mt-1', c.color || 'text-slate-900')}>{c.value}</div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Delay Rate Comparison" />
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-slate-600">Contractor Delay Rate</span>
                      <span className="text-[14px] font-bold text-amber-600 tabular-nums">{demoContractor.delayRate}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${demoContractor.delayRate * 3}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-slate-600">Peer Delay Rate</span>
                      <span className="text-[14px] font-bold text-slate-500 tabular-nums">{demoContractor.peerDelayRate}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: `${demoContractor.peerDelayRate * 3}%` }} />
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-md text-[12px] text-slate-600">
                    The contractor's delay rate is approximately <span className="font-semibold text-amber-700">2.5x higher</span> than the peer comparison group.
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Categories & States" />
              <CardBody>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Categories</div>
                    <div className="flex flex-wrap gap-2">
                      {demoContractor.categories.map((c) => <span key={c} className="badge badge-neutral">{c}</span>)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">States</div>
                    <div className="flex flex-wrap gap-2">
                      {demoContractor.states.map((s) => <span key={s} className="badge badge-info">{s}</span>)}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Financials Tab */}
      {activeTab === 'financials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Contract Value', value: formatCurrencyShort(demoContract.awardValue) },
              { label: 'Expenditure', value: formatCurrencyShort(demoContract.expenditure) },
              { label: 'Remaining', value: formatCurrencyShort(demoContract.awardValue - demoContract.expenditure) },
              { label: 'Utilization', value: `${((demoContract.expenditure / demoContract.awardValue) * 100).toFixed(1)}%` },
            ].map((c) => (
              <Card key={c.label}>
                <CardBody className="p-3">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{c.label}</div>
                  <div className="text-[18px] font-bold text-slate-900 tabular-nums mt-1">{c.value}</div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader title="Cost Breakdown" subtitle="Sanctioned vs tender vs award vs expenditure" />
            <CardBody>
              <div className="space-y-3">
                {[
                  { label: 'Sanctioned', value: project.sanctionedAmount, max: project.sanctionedAmount, color: 'bg-navy-600' },
                  { label: 'Tender', value: project.tenderValue, max: project.sanctionedAmount, color: 'bg-steel-500' },
                  { label: 'Award', value: demoContract.awardValue, max: project.sanctionedAmount, color: 'bg-emerald-500' },
                  { label: 'Expenditure', value: demoContract.expenditure, max: project.sanctionedAmount, color: 'bg-amber-500' },
                  { label: 'Projected Final', value: 5100000, max: project.sanctionedAmount, color: 'bg-red-400' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-medium text-slate-700">{row.label}</span>
                      <span className="text-[13px] font-semibold tabular-nums">{formatCurrency(row.value)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all duration-500', row.color)} style={{ width: `${(row.value / row.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Execution vs Financial" />
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-slate-600">Physical Progress</span>
                      <span className="text-[14px] font-bold tabular-nums">{project.physicalProgress}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-navy-600 rounded-full" style={{ width: `${project.physicalProgress}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-slate-600">Financial Utilization</span>
                      <span className="text-[14px] font-bold tabular-nums">{((demoContract.expenditure / demoContract.awardValue) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(demoContract.expenditure / demoContract.awardValue) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-slate-600">Expected Progress</span>
                      <span className="text-[14px] font-bold tabular-nums">72%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-md flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-medium text-orange-800">Financial utilization is ahead of reported physical progress.</p>
                      <p className="text-[11px] text-orange-600 mt-0.5">Gap: -4 percentage points. Review measurement records and payment certificates.</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Transactions" />
              <div className="overflow-x-auto scrollbar-thin">
                <table className="table-base">
                  <thead>
                    <tr><th>Date</th><th>Type</th><th className="text-right">Amount</th><th>Reference</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {demoTransactions.map((t) => (
                      <tr key={t.id}>
                        <td className="text-[12px]">{formatDate(t.date)}</td>
                        <td className="capitalize text-[12px]">{t.type.replace(/-/g, ' ')}</td>
                        <td className="text-right tabular-nums font-medium">{t.amount > 0 ? formatCurrency(t.amount) : '—'}</td>
                        <td className="text-[11px] text-slate-500">{t.reference}</td>
                        <td><span className={cn('badge capitalize text-[9px]', t.status === 'verified' && 'badge-risk-normal', t.status === 'processed' && 'badge-info', t.status === 'pending' && 'badge-risk-watch')}>{t.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <Card>
            <CardHeader title="Documents" subtitle="Procurement and execution documents" />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="table-base table-row-hover">
                <thead>
                  <tr><th>Document</th><th>Type</th><th>Date</th><th>Status</th><th>Last Checked</th></tr>
                </thead>
                <tbody>
                  {demoDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td className="font-medium">{doc.name}</td>
                      <td className="capitalize text-[12px]">{doc.type.replace(/-/g, ' ')}</td>
                      <td className="text-[12px] text-slate-600">{doc.date ? formatDate(doc.date) : '—'}</td>
                      <td>
                        <span className={cn('badge text-[9px]', doc.status === 'verified' && 'badge-risk-normal', doc.status === 'pending-review' && 'badge-risk-watch', doc.status === 'mismatch' && 'badge-risk-high', doc.status === 'unavailable' && 'badge-neutral')}>
                          {doc.status.replace(/-/g, ' ')}
                        </span>
                      </td>
                      <td className="text-[11px] text-slate-400">{formatDate(doc.lastChecked)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {demoDocuments.filter((d) => d.mismatches && d.mismatches.length > 0).map((doc) => (
            <Card key={doc.id}>
              <CardHeader title={`Discrepancy: ${doc.name}`} subtitle="Field-level comparison between database and document" />
              <CardBody>
                <div className="space-y-3">
                  {doc.mismatches!.map((m, i) => (
                    <div key={i} className="p-3 border border-red-200 bg-red-50 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-semibold text-slate-800">{m.field}</span>
                        <span className={cn('badge text-[9px]', m.severity === 'high' && 'badge-risk-high', m.severity === 'medium' && 'badge-risk-review', m.severity === 'low' && 'badge-risk-watch')}>{m.severity}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-2 bg-white rounded border border-slate-200">
                          <div className="text-[9px] text-slate-400 uppercase">Database</div>
                          <div className="text-[13px] font-semibold tabular-nums">{m.databaseValue}</div>
                        </div>
                        <div className="p-2 bg-white rounded border border-slate-200">
                          <div className="text-[9px] text-slate-400 uppercase">Document</div>
                          <div className="text-[13px] font-semibold tabular-nums">{m.documentValue}</div>
                        </div>
                        <div className="p-2 bg-white rounded border border-red-200">
                          <div className="text-[9px] text-red-400 uppercase">Difference</div>
                          <div className="text-[13px] font-semibold tabular-nums text-red-600">{m.difference}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">{m.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* AI Tab */}
      {activeTab === 'ai' && (
        <div className="text-center py-12">
          <Bot className="w-10 h-10 text-navy-300 mx-auto mb-3" />
          <p className="text-[14px] text-slate-600 font-medium">AI Investigator</p>
          <p className="text-[13px] text-slate-400 mt-1">Ask questions about this case's evidence and risk signals.</p>
          <button onClick={() => navigate('/ai-investigator')} className="btn-primary mt-4">
            <Bot className="w-4 h-4" /> Open AI Investigator
          </button>
        </div>
      )}
    </div>
  );
}
