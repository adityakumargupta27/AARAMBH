import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  FolderKanban, TrendingUp, FileText, PenTool, IndianRupee, AlertTriangle,
  MapPin, ArrowUpRight, Clock, Activity,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { KPICard } from '@/components/ui/KPICard';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { RiskDonutChart, RiskTrendChart } from '@/components/charts/Charts';
import {
  kpiData, riskDistribution, topRiskSignals, recentActivity,
  bottomInsights, demoStateRisk, mockInvestigationCases,
} from '@/data/mockData';
import { formatCurrencyShort, riskLevelConfig } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function OverviewPage() {
  const navigate = useNavigate();

  const topStates = [...demoStateRisk].sort((a, b) => b.riskIndex - a.riskIndex).slice(0, 8);
  const maxRiskIndex = Math.max(...demoStateRisk.map((s) => s.riskIndex));
  const priorityCases = mockInvestigationCases
    .filter((c) => c.riskLevel === 'high' || c.riskLevel === 'review')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Procurement Intelligence Overview"
        subtitle="Monitor projects, tenders, contracts and emerging procurement risks across the MPLADS ecosystem."
        actions={
          <div className="flex items-center gap-2">
            <select className="input input-sm w-auto">
              <option>All India</option>
              <option>Maharashtra</option>
              <option>Uttar Pradesh</option>
              <option>Tamil Nadu</option>
            </select>
            <select className="input input-sm w-auto">
              <option>FY 2025–26</option>
              <option>FY 2024–25</option>
            </select>
            <select className="input input-sm w-auto">
              <option>All Project Types</option>
              <option>Infrastructure</option>
              <option>Public Building</option>
              <option>Civil Works</option>
            </select>
          </div>
        }
      />

      {/* KPI Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard label="Total Projects" value={kpiData.totalProjects.toLocaleString('en-IN')} supporting="Across monitored records" trend={{ direction: 'up', value: '+2.1%' }} to="/projects" icon={<FolderKanban className="w-4 h-4" />} />
        <KPICard label="Active Projects" value={kpiData.activeProjects.toLocaleString('en-IN')} supporting="Currently active" trend={{ direction: 'up', value: '+1.4%' }} to="/projects" icon={<TrendingUp className="w-4 h-4" />} />
        <KPICard label="Total Tenders" value={kpiData.totalTenders.toLocaleString('en-IN')} supporting="Procurement opportunities" trend={{ direction: 'up', value: '+3.8%' }} to="/tenders" icon={<FileText className="w-4 h-4" />} />
        <KPICard label="Contracts Awarded" value={kpiData.contractsAwarded.toLocaleString('en-IN')} supporting="Awarded contracts" trend={{ direction: 'up', value: '+1.9%' }} to="/contracts" icon={<PenTool className="w-4 h-4" />} />
        <KPICard label="Procurement Value" value={kpiData.procurementValue} supporting="Aggregate monitored value" trend={{ direction: 'up', value: '+5.2%' }} icon={<IndianRupee className="w-4 h-4" />} />
        <KPICard label="High Priority Reviews" value={kpiData.highPriorityReviews} supporting="Require investigation" trend={{ direction: 'up', value: '+6' }} accent="risk" to="/risk" icon={<AlertTriangle className="w-4 h-4" />} />
      </div>

      {/* Risk Overview — two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Risk Distribution" subtitle="Projects by risk classification" />
          <CardBody>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <RiskDonutChart />
              </div>
              <div className="space-y-3 w-44 flex-shrink-0">
                {riskDistribution.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                      <span className="text-[13px] text-slate-700">{d.name}</span>
                    </div>
                    <span className="text-[13px] font-semibold text-slate-900 tabular-nums">{d.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Top Risk Signals" subtitle="Primary anomaly categories detected" />
          <CardBody>
            <div className="space-y-3.5">
              {topRiskSignals.map((signal) => (
                <div key={signal.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-[13px] font-medium text-slate-800">{signal.label}</span>
                      <span className="text-[11px] text-slate-400 ml-2">{signal.description}</span>
                    </div>
                    <span className="text-[13px] font-semibold text-slate-900 tabular-nums">{signal.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-navy-600 transition-all duration-500"
                      style={{ width: `${signal.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Procurement Risk Map */}
      <Card>
        <CardHeader
          title="Procurement Risk Map"
          subtitle="State-level risk density across India"
          action={
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400" /> Low</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-400" /> Medium</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-400" /> High</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500" /> Critical</span>
            </div>
          }
        />
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {demoStateRisk.sort((a, b) => b.riskIndex - a.riskIndex).map((state) => {
              const intensity = state.riskIndex / maxRiskIndex;
              const bg = intensity > 0.8 ? 'bg-red-500 text-white' : intensity > 0.6 ? 'bg-orange-400 text-white' : intensity > 0.4 ? 'bg-amber-300 text-slate-800' : 'bg-emerald-200 text-slate-700';
              return (
                <div
                  key={state.state}
                  className={cn('rounded-md p-2.5 cursor-pointer transition-all hover:scale-105 hover:shadow-sm', bg)}
                  onClick={() => navigate('/risk')}
                  title={`${state.state} — Risk Index ${state.riskIndex}`}
                >
                  <div className="text-[12px] font-semibold leading-tight">{state.state}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{state.projects} projects</div>
                  <div className="text-[10px] opacity-80">{state.highPriority} high priority</div>
                  <div className="text-[14px] font-bold tabular-nums mt-1">{state.riskIndex}</div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Priority Review Queue + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Priority Review Queue"
              subtitle="Cases requiring immediate attention"
              action={<Link to="/investigations" className="text-[12px] text-navy-600 hover:text-navy-800 font-medium flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></Link>}
            />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="table-base table-row-hover">
                <thead>
                  <tr>
                    <th>Risk</th>
                    <th>Case ID</th>
                    <th>Project</th>
                    <th>State</th>
                    <th>Contractor</th>
                    <th>Value</th>
                    <th>Primary Signal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityCases.map((c) => (
                    <tr key={c.id} onClick={() => navigate(`/investigations/${c.id}`)}>
                      <td><RiskBadge level={c.riskLevel} /></td>
                      <td className="font-medium text-navy-700">{c.id}</td>
                      <td className="max-w-[180px] truncate">{c.projectName}</td>
                      <td>{c.state}</td>
                      <td className="max-w-[140px] truncate">{c.contractorName}</td>
                      <td className="tabular-nums">{formatCurrencyShort(c.caseValue)}</td>
                      <td className="capitalize">{c.primarySignal.replace(/-/g, ' ')}</td>
                      <td><span className="text-[12px] text-slate-600 capitalize">{c.status.replace(/-/g, ' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Recent Activity" subtitle="Latest system events" />
          <CardBody className="p-0">
            <div className="divide-y divide-slate-50">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                    <span className="text-[10px] font-medium text-slate-400 tabular-nums">{act.time}</span>
                  </div>
                  <div className="flex items-start gap-2 min-w-0">
                    <span
                      className={cn(
                        'mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0',
                        act.type === 'risk' && 'bg-red-500',
                        act.type === 'update' && 'bg-navy-500',
                        act.type === 'contractor' && 'bg-amber-500',
                        act.type === 'document' && 'bg-orange-500'
                      )}
                    />
                    <span className="text-[12.5px] text-slate-700 leading-snug">{act.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Risk Trend Chart */}
      <Card>
        <CardHeader title="Risk Cases Over Time" subtitle="Total flagged cases and high priority cases — last 6 months" />
        <CardBody>
          <RiskTrendChart />
          <div className="flex items-center gap-4 mt-2 text-[12px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-navy-600" /> Total Flagged</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500" /> High Priority</span>
          </div>
        </CardBody>
      </Card>

      {/* Bottom Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bottomInsights.map((insight) => (
          <Card key={insight.label} hover>
            <CardBody>
              <div className="flex items-center gap-2 mb-1">
                {insight.label === 'Highest Risk State' && <MapPin className="w-4 h-4 text-slate-400" />}
                {insight.label === 'Largest Procurement Category' && <FolderKanban className="w-4 h-4 text-slate-400" />}
                {insight.label === 'Fastest Growing Risk Signal' && <TrendingUp className="w-4 h-4 text-slate-400" />}
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{insight.label}</span>
              </div>
              <div className="text-[18px] font-bold text-slate-900">{insight.value}</div>
              <div className="text-[12px] text-slate-400 mt-0.5">{insight.sub}</div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
