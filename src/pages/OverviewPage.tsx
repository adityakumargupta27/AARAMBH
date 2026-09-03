import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  FolderKanban, TrendingUp, FileText, PenTool, IndianRupee, AlertTriangle,
  MapPin, ArrowUpRight, Clock, Activity, Lock, Share2, Sparkles,
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
    <div className="animate-fade-in space-y-6 stagger-children">
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

      {/* Official MoSPI Dataset Ingestion Callout */}
      <div className="flex items-center justify-between p-4 rounded-xl flex-wrap gap-3 border-gradient" style={{
        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.15) 0%, rgba(14, 165, 233, 0.08) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.12)',
      }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
            boxShadow: '0 0 20px -4px rgba(56, 189, 248, 0.3)',
          }}>
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-tight text-white">
              Official MoSPI MPLADS Dataset Ingested: 543 Parliamentary Constituencies
            </div>
            <div className="text-[11px] text-slate-400">
              Total Monitored Allocated Limit: <strong className="text-sky-300">₹83,327.5 Million (₹8,332.75 Cr)</strong> across all Indian States &amp; Union Territories
            </div>
          </div>
        </div>
        <Link
          to="/constituencies"
          className="btn-primary btn-sm flex items-center gap-1.5"
        >
          Explore 543 Constituencies Registry <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Real-World Institutional Innovations Quick-Strike Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link
          to="/investigations/AR-2026-001024"
          className="p-3.5 rounded-xl border flex items-center justify-between gap-3 hover-lift transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
            borderColor: 'rgba(239, 68, 68, 0.25)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-red-400">Zero-Leakage Firewall</div>
              <div className="text-[13px] font-bold text-white">PFMS Smart Lock: ₹18.4L Withheld</div>
              <div className="text-[10px] text-slate-400">Pre-disbursement hold on Case AR-2026-001024</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-red-400 flex-shrink-0" />
        </Link>

        <Link
          to="/investigations/AR-2026-001024"
          className="p-3.5 rounded-xl border flex items-center justify-between gap-3 hover-lift transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
            borderColor: 'rgba(56, 189, 248, 0.25)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Forensic Accounting</div>
              <div className="text-[13px] font-bold text-white">Benford’s Law χ² = 223.32</div>
              <div className="text-[10px] text-slate-400">Digits 7 &amp; 8 fabrication spike detected</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-sky-400 flex-shrink-0" />
        </Link>

        <Link
          to="/investigations/AR-2026-001024"
          className="p-3.5 rounded-xl border flex items-center justify-between gap-3 hover-lift transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
            borderColor: 'rgba(234, 88, 12, 0.25)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Inter-District Cartel Ring</div>
              <div className="text-[13px] font-bold text-white">Shared Director DIN: 08472911</div>
              <div className="text-[10px] text-slate-400">Pune · Shirur · Baramati rotation nexus</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
        </Link>
      </div>

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
                      <span className="text-[13px] text-slate-300">{d.name}</span>
                    </div>
                    <span className="text-[13px] font-semibold text-white tabular-nums">{d.value.toLocaleString('en-IN')}</span>
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
                      <span className="text-[13px] font-medium text-slate-200">{signal.label}</span>
                      <span className="text-[11px] text-slate-400 ml-2">{signal.description}</span>
                    </div>
                    <span className="text-[13px] font-semibold text-white tabular-nums">{signal.percentage}%</span>
                  </div>
                  <div className="meter">
                    <div
                      className="meter-fill"
                      style={{ width: `${signal.percentage}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}
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
              const bg = intensity > 0.8 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : intensity > 0.6 ? 'bg-orange-400/15 text-orange-300 border border-orange-400/25' : intensity > 0.4 ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20' : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/15';
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
              action={<Link to="/investigations" className="text-[12px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors">View all <ArrowUpRight className="w-3 h-3" /></Link>}
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
                      <td className="font-medium text-sky-400">{c.id}</td>
                      <td className="max-w-[180px] truncate">{c.projectName}</td>
                      <td>{c.state}</td>
                      <td className="max-w-[140px] truncate">{c.contractorName}</td>
                      <td className="tabular-nums">{formatCurrencyShort(c.caseValue)}</td>
                      <td className="capitalize">{c.primarySignal.replace(/-/g, ' ')}</td>
                      <td><span className="text-[12px] text-slate-400 capitalize">{c.status.replace(/-/g, ' ')}</span></td>
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
            <div className="divide-y" style={{ borderColor: 'rgba(148, 163, 184, 0.06)' }}>
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
                        act.type === 'update' && 'bg-sky-400',
                        act.type === 'contractor' && 'bg-amber-500',
                        act.type === 'document' && 'bg-orange-500'
                      )}
                    />
                    <span className="text-[12.5px] text-slate-300 leading-snug">{act.text}</span>
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
            <span className="flex items-center gap-1.5 text-slate-400"><span className="w-3 h-0.5 bg-sky-500" /> Total Flagged</span>
            <span className="flex items-center gap-1.5 text-slate-400"><span className="w-3 h-0.5 bg-red-400" /> High Priority</span>
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
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{insight.label}</span>
              </div>
              <div className="text-[18px] font-bold text-white">{insight.value}</div>
              <div className="text-[12px] text-slate-400 mt-0.5">{insight.sub}</div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
