import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, FileText, PenTool, Users, Search, Bot, Download,
  TrendingUp, AlertTriangle, CheckCircle2, Clock, Circle,
  IndianRupee, MapPin, Calendar,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RiskBadge, RiskBar } from '@/components/ui/RiskBadge';
import { PriceComparisonChart } from '@/components/charts/Charts';
import { demoProject, demoRiskAssessment, demoComparableProjects, demoTimeline } from '@/data/mockData';
import { formatCurrency, formatCurrencyShort, formatDate, riskLevelConfig, riskLevelLabel } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function Project360Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = demoProject.id === id ? demoProject : demoProject;

  const summaryCards = [
    { label: 'Estimated Cost', value: formatCurrencyShort(project.estimatedCost) },
    { label: 'Sanctioned', value: formatCurrencyShort(project.sanctionedAmount) },
    { label: 'Tender Value', value: formatCurrencyShort(project.tenderValue) },
    { label: 'Award Value', value: formatCurrencyShort(project.awardValue) },
    { label: 'Expenditure', value: formatCurrencyShort(project.expenditure) },
    { label: 'Physical Progress', value: `${project.physicalProgress}%` },
  ];

  const quickLinks = [
    { label: 'View Tender', path: `/tenders/${project.tenderId}`, icon: FileText },
    { label: 'View Contract', path: `/contracts/${project.contractId}`, icon: PenTool },
    { label: 'View Contractor', path: `/contractors/${project.contractorId}`, icon: Users },
    { label: 'View Evidence', path: `/investigations/AR-2026-001024`, icon: Search },
    { label: 'Open Investigation', path: `/investigations/AR-2026-001024`, icon: AlertTriangle },
    { label: 'Ask AI Investigator', path: '/ai-investigator', icon: Bot },
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
        title="Project 360"
        subtitle={project.name}
        breadcrumbs={[
          { label: 'Projects', path: '/projects' },
          { label: project.id },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/projects" className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Back</Link>
            <button className="btn-secondary"><Download className="w-4 h-4" /> Export</button>
          </div>
        }
      />

      {/* Project Identity Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Project ID</div>
                <div className="text-[15px] font-bold text-navy-800">{project.id}</div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</div>
                <div className="text-[13px] font-medium text-slate-700 capitalize">{project.status}</div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Risk</div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-red-600 tabular-nums">{project.riskScore}</span>
                  <span className="text-[12px] text-slate-400">/ 100</span>
                </div>
              </div>
            </div>
            <RiskBadge level={project.riskLevel} />
          </div>
        </CardBody>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardBody className="p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{card.label}</div>
              <div className="text-[18px] font-bold text-slate-900 tabular-nums mt-1">{card.value}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Lifecycle Timeline */}
      <Card>
        <CardHeader title="Project Lifecycle" subtitle="Key milestones from recommendation to completion" />
        <CardBody>
          <div className="flex items-stretch overflow-x-auto scrollbar-thin pb-2">
            {demoTimeline.map((event, i) => (
              <div key={event.id} className="flex items-stretch flex-shrink-0">
                <div className="flex flex-col items-center w-32">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border-2',
                    event.status === 'completed' && 'bg-emerald-50 border-emerald-300',
                    event.status === 'in-progress' && 'bg-navy-50 border-navy-300',
                    event.status === 'flagged' && 'bg-red-50 border-red-300',
                    event.status === 'pending' && 'bg-slate-50 border-slate-200',
                  )}>
                    {statusIcon(event.status)}
                  </div>
                  <div className="text-[11px] font-medium text-slate-700 mt-2 text-center leading-tight">{event.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(event.date)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 text-center leading-tight">{event.description}</div>
                </div>
                {i < demoTimeline.length - 1 && (
                  <div className="flex items-center pt-4">
                    <div className={cn(
                      'w-6 h-0.5',
                      event.status === 'completed' ? 'bg-emerald-300' : 'bg-slate-200'
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Risk Assessment + Why Flagged */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Risk Assessment" subtitle="Composite score and signal breakdown" />
          <CardBody>
            <div className="flex items-center justify-center py-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-red-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[36px] font-bold text-red-600 tabular-nums leading-none">{project.riskScore}</div>
                    <div className="text-[10px] text-slate-400 mt-1">/ 100</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mb-4">
              <RiskBadge level={project.riskLevel} />
              <div className="text-[11px] text-slate-400 mt-1">{riskLevelLabel(project.riskLevel)}</div>
            </div>
            <div className="space-y-3">
              {demoRiskAssessment.signals.map((signal) => (
                <div key={signal.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-slate-700">{signal.label}</span>
                    <span className="text-[12px] font-semibold tabular-nums text-slate-900">{signal.score}</span>
                  </div>
                  <RiskBar score={signal.score} />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Why Flagged - Evidence Cards */}
        <div className="lg:col-span-2 space-y-3">
          <div>
            <h3 className="section-title">Why Flagged</h3>
            <p className="section-subtitle">Key evidence-backed findings that triggered review</p>
          </div>
          {demoRiskAssessment.signals.slice(0, 3).map((signal) => {
            const config = riskLevelConfig(signal.score >= 70 ? 'high' : signal.score >= 50 ? 'review' : 'watch');
            return (
              <Card key={signal.id} hover onClick={() => navigate('/investigations/AR-2026-001024')}>
                <CardBody>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{signal.label}</span>
                      <p className="text-[13px] text-slate-700 mt-1">{signal.finding}</p>
                    </div>
                    <RiskBadge level={signal.score >= 70 ? 'high' : signal.score >= 50 ? 'review' : 'watch'} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-50">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Current</div>
                      <div className="text-[14px] font-semibold text-slate-900 tabular-nums">{signal.value}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Benchmark</div>
                      <div className="text-[14px] font-semibold text-slate-900 tabular-nums">{signal.benchmark}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Deviation</div>
                      <div className={cn('text-[14px] font-semibold tabular-nums', config.textClass)}>{signal.deviation}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Source: {signal.source}</span>
                    <button className="text-[12px] text-navy-600 hover:text-navy-800 font-medium flex items-center gap-1">
                      View Evidence <ArrowLeft className="w-3 h-3 rotate-180" />
                    </button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Price Comparison */}
      <Card>
        <CardHeader title="Comparable Project Pricing" subtitle="Unit price comparison with similar projects in the same region" />
        <CardBody>
          <PriceComparisonChart data={demoComparableProjects} />
          <div className="flex items-center gap-4 mt-2 text-[12px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500" /> Current Project</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-steel-200" /> Comparable Projects</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-navy-600" /> Benchmark ₹8,250</span>
          </div>
        </CardBody>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader title="Quick Links" subtitle="Navigate to connected entities" />
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className="flex flex-col items-center gap-2 p-3 rounded-md border border-slate-200 hover:border-navy-300 hover:bg-navy-50 transition-all group"
                >
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-navy-700" />
                  <span className="text-[11px] font-medium text-slate-600 group-hover:text-navy-800 text-center">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
