import { useState, useMemo } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  Search, Filter, X, ArrowLeft, Users, TrendingUp, Clock, XCircle,
  CheckCircle2, AlertTriangle, Building2,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RiskBadge, RiskBar } from '@/components/ui/RiskBadge';
import { AwardValueTrendChart, DelayTrendChart } from '@/components/charts/Charts';
import { EmptyState } from '@/components/ui/State';

import { mockContractors, demoContractor, mockContracts } from '@/data/mockData';
import { formatCurrency, formatCurrencyShort, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function ContractorsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  const filtered = useMemo(() => {
    return mockContractors.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (riskFilter && c.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [search, riskFilter]);

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Contractor Intelligence" subtitle="Contractor directory with performance and risk indicators." />

      <Card>
        <CardBody className="p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contractors..." className="input pl-8" />
            </div>
            <select className="input w-auto" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="">All Risk Levels</option>
              <option value="high">High</option>
              <option value="review">Review</option>
              <option value="watch">Watch</option>
              <option value="normal">Normal</option>
            </select>
            {(search || riskFilter) && (
              <button className="btn-ghost" onClick={() => { setSearch(''); setRiskFilter(''); }}>
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<Users className="w-8 h-8" />} title="No contractors found" />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="table-base table-row-hover">
              <thead>
                <tr>
                  <th>Contractor</th>
                  <th className="text-center">Previous</th>
                  <th className="text-center">Completed</th>
                  <th className="text-center">Delayed</th>
                  <th className="text-center">Cancelled</th>
                  <th className="text-right">Avg Value</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} onClick={() => navigate(`/contractors/${c.id}`)}>
                    <td>
                      <div className="font-medium text-slate-100">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.id}</div>
                    </td>
                    <td className="text-center tabular-nums">{c.previousContracts}</td>
                    <td className="text-center tabular-nums text-emerald-600">{c.completed}</td>
                    <td className="text-center tabular-nums text-amber-600">{c.delayed}</td>
                    <td className="text-center tabular-nums text-red-500">{c.cancelled}</td>
                    <td className="text-right tabular-nums">{formatCurrencyShort(c.averageValue)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <RiskBadge level={c.riskLevel} showLabel={false} />
                        <span className="text-[12px] font-semibold tabular-nums">{c.riskScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export function ContractorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contractor = mockContractors.find((c) => c.id === id) || demoContractor;
  const contractHistory = mockContracts.filter((c) => c.contractorId === contractor.id || (contractor.id === 'CTR-001' && c.contractorId === 'CTR-001'));

  const summaryStats = [
    { label: 'Previous Contracts', value: contractor.previousContracts, icon: Building2 },
    { label: 'Completed', value: contractor.completed, icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'Delayed', value: contractor.delayed, icon: Clock, color: 'text-amber-600' },
    { label: 'Cancelled', value: contractor.cancelled, icon: XCircle, color: 'text-red-500' },
    { label: 'Avg Contract Value', value: formatCurrencyShort(contractor.averageValue) },
    { label: 'Total Awarded', value: formatCurrencyShort(contractor.totalValueAwarded) },
  ];

  const performanceData = [
    { name: 'On Time', value: contractor.completed, color: '#10b981' },
    { name: 'Delayed', value: contractor.delayed, color: '#f59e0b' },
    { name: 'Cancelled', value: contractor.cancelled, color: '#ef4444' },
  ];

  const riskFactors = [
    { label: 'Elevated delay frequency', severity: 'high', explanation: `Delay rate of ${contractor.delayRate}% is significantly above peer average of ${contractor.peerDelayRate}%.`, evidenceCount: 7 },
    { label: 'Repeated awards', severity: 'medium', explanation: `42 previous contracts indicate high award frequency across 3 states.`, evidenceCount: 3 },
    { label: 'Unusual participation', severity: 'low', explanation: `Participated in 18 tenders in the comparison period.`, evidenceCount: 2 },
    { label: 'Cost variance history', severity: 'medium', explanation: `Average contract value shows variance from peer median.`, evidenceCount: 4 },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title={contractor.name}
        subtitle={`${contractor.id} — Contractor Profile`}
        breadcrumbs={[{ label: 'Contractors', path: '/contractors' }, { label: contractor.id }]}
        actions={<Link to="/contractors" className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Back</Link>}
      />

      {/* Risk Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Risk Score</div>
                <div className="text-[28px] font-bold text-orange-600 tabular-nums">{contractor.riskScore}<span className="text-[14px] text-slate-400">/100</span></div>
              </div>
              <RiskBadge level={contractor.riskLevel} />
            </div>
            <div className="flex items-center gap-6 text-[12px] text-slate-500">
              <div><span className="text-slate-400">Reg. Date:</span> {formatDate(contractor.registrationDate)}</div>
              <div><span className="text-slate-400">Reg. Number:</span> {contractor.registrationNumber}</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryStats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardBody className="p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {Icon && <Icon className={cn('w-3.5 h-3.5', s.color)} />}
                  {s.label}
                </div>
                <div className={cn('text-[18px] font-bold tabular-nums mt-1', s.color || 'text-white')}>{s.value}</div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Performance + Risk Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Contract Outcomes" subtitle="Distribution of past contract results" />
          <CardBody>
            <div className="space-y-3">
              {performanceData.map((d) => {
                const total = performanceData.reduce((s, p) => s + p.value, 0);
                const pct = (d.value / total * 100).toFixed(1);
                return (
                  <div key={d.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-slate-300">{d.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold tabular-nums">{d.value}</span>
                        <span className="text-[11px] text-slate-400">({pct}%)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-800/30 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/20 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-slate-400">Delay Rate</div>
                <div className="text-[18px] font-bold text-amber-600 tabular-nums">{contractor.delayRate}%</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Peer Delay Rate</div>
                <div className="text-[18px] font-bold text-slate-500 tabular-nums">{contractor.peerDelayRate}%</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Risk Factors" subtitle="Historical performance signals" />
          <CardBody>
            <div className="space-y-3">
              {riskFactors.map((rf) => (
                <div key={rf.label} className="p-3 border border-slate-700/30 rounded-md">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-[13px] font-medium text-slate-100">{rf.label}</span>
                    <span className={cn(
                      'badge',
                      rf.severity === 'high' && 'badge-risk-high',
                      rf.severity === 'medium' && 'badge-risk-review',
                      rf.severity === 'low' && 'badge-risk-watch',
                    )}>{rf.severity}</span>
                  </div>
                  <p className="text-[12px] text-slate-500">{rf.explanation}</p>
                  <div className="text-[11px] text-slate-400 mt-1">{rf.evidenceCount} evidence records</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Historical Trend Charts (Prompt 06) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Award Value Over Time" subtitle="Total annual contract procurement value" />
          <CardBody>
            <AwardValueTrendChart
              data={[
                { year: '2021', value: 8500000 },
                { year: '2022', value: 14200000 },
                { year: '2023', value: 19800000 },
                { year: '2024', value: 24500000 },
                { year: '2025', value: 32000000 },
                { year: '2026', value: 49200000 },
              ]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Delay Trend vs Peer Median" subtitle="Historical project delay percentage trajectory" />
          <CardBody>
            <DelayTrendChart
              data={[
                { year: '2021', contractorDelay: 12.5, peerMedian: 8.2 },
                { year: '2022', contractorDelay: 15.0, peerMedian: 8.5 },
                { year: '2023', contractorDelay: 18.2, peerMedian: 9.0 },
                { year: '2024', contractorDelay: 21.0, peerMedian: 9.1 },
                { year: '2025', contractorDelay: 23.8, peerMedian: 9.4 },
              ]}
            />
          </CardBody>
        </Card>
      </div>

      {/* Contract History */}

      <Card>
        <CardHeader title="Contract History" subtitle="Past and current contracts" />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="table-base table-row-hover">
            <thead>
              <tr>
                <th>Contract</th>
                <th>Project</th>
                <th className="text-right">Value</th>
                <th>Award Date</th>
                <th>Status</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {contractHistory.length > 0 ? contractHistory.map((c) => (
                <tr key={c.id} onClick={() => navigate(`/contracts/${c.id}`)}>
                  <td className="font-medium text-sky-400">{c.id}</td>
                  <td className="max-w-[180px] truncate">{c.projectName}</td>
                  <td className="text-right tabular-nums">{formatCurrencyShort(c.awardValue)}</td>
                  <td className="text-[12px] text-slate-600">{formatDate(c.awardDate)}</td>
                  <td><span className="text-[12px] capitalize text-slate-600">{c.status}</span></td>
                  <td><RiskBadge level={c.riskLevel} showLabel={false} /></td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="text-center text-slate-400 py-8">No contract history available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
