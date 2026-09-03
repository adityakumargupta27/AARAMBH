import { useState, useMemo } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Search, Filter, X, Download, ArrowLeft, PenTool, Calendar, TrendingUp, CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RiskBadge, RiskBar } from '@/components/ui/RiskBadge';
import { EmptyState } from '@/components/ui/State';
import { useToast } from '@/components/ui/Toast';
import { mockContracts, demoContract, demoTransactions, demoTimeline } from '@/data/mockData';

import { formatCurrency, formatCurrencyShort, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function ContractsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    return mockContracts.filter((c) => {
      if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.projectName.toLowerCase().includes(search.toLowerCase()) && !c.contractorName.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (riskFilter && c.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [search, statusFilter, riskFilter]);

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader
        title="Contracts"
        subtitle="Contract registry with award values, progress and risk indicators."
        actions={<button className="btn-secondary" onClick={() => toast('info', 'Export started')}><Download className="w-4 h-4" /> Export</button>}
      />

      <Card>
        <CardBody className="p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contracts..." className="input pl-8" />
            </div>
            <button className={cn('btn-secondary', showFilters && 'border-navy-300 text-sky-400')} onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4" /> Filters
            </button>
            {(statusFilter || riskFilter) && (
              <button className="btn-ghost" onClick={() => { setStatusFilter(''); setRiskFilter(''); }}>
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-700/20">
              <div>
                <label className="label">Status</label>
                <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div>
                <label className="label">Risk Level</label>
                <select className="input" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
                  <option value="">All Risk</option>
                  <option value="high">High</option>
                  <option value="review">Review</option>
                  <option value="watch">Watch</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<PenTool className="w-8 h-8" />} title="No contracts found" description="Try adjusting your filters." />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="table-base table-row-hover">
              <thead>
                <tr>
                  <th>Contract ID</th>
                  <th>Project</th>
                  <th>Contractor</th>
                  <th className="text-right">Award Value</th>
                  <th>Award Date</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} onClick={() => navigate(`/contracts/${c.id}`)}>
                    <td className="font-medium text-sky-400">{c.id}</td>
                    <td className="max-w-[180px] truncate">{c.projectName}</td>
                    <td className="max-w-[140px] truncate">{c.contractorName}</td>
                    <td className="text-right tabular-nums">{formatCurrencyShort(c.awardValue)}</td>
                    <td className="text-[12px] text-slate-600">{formatDate(c.awardDate)}</td>
                    <td><span className="text-[12px] capitalize text-slate-600">{c.status}</span></td>
                    <td>
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <div className="flex-1 h-1.5 bg-slate-800/30 rounded-full overflow-hidden">
                          <div className="h-full bg-navy-600 rounded-full" style={{ width: `${c.currentProgress}%` }} />
                        </div>
                        <span className="text-[11px] tabular-nums text-slate-500">{c.currentProgress}%</span>
                      </div>
                    </td>
                    <td><RiskBadge level={c.riskLevel} /></td>
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

export function ContractDetailPage() {
  const { id } = useParams();
  const contract = mockContracts.find((c) => c.id === id) || demoContract;

  const summaryCards = [
    { label: 'Award Value', value: formatCurrencyShort(contract.awardValue) },
    { label: 'Expenditure', value: formatCurrencyShort(contract.expenditure) },
    { label: 'Start Date', value: formatDate(contract.startDate) },
    { label: 'Expected Completion', value: formatDate(contract.expectedCompletionDate) },
    { label: 'Current Progress', value: `${contract.currentProgress}%` },
    { label: 'Risk Score', value: contract.riskScore },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title="Contract Detail"
        subtitle={`${contract.id} — ${contract.projectName}`}
        breadcrumbs={[{ label: 'Contracts', path: '/contracts' }, { label: contract.id }]}
        actions={<Link to="/contracts" className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Back</Link>}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryCards.map((c) => (
          <Card key={c.label}>
            <CardBody className="p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{c.label}</div>
              <div className="text-[16px] font-bold text-white tabular-nums mt-1">{c.value}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Contract Lifecycle Timeline (Prompt 06) */}
      <Card>
        <CardHeader title="Contract & Execution Lifecycle" subtitle="Milestones from procurement to execution and payments" />
        <CardBody>
          <div className="flex items-stretch overflow-x-auto scrollbar-thin pb-2">
            {demoTimeline.map((event, i) => (
              <div key={event.id} className="flex items-stretch flex-shrink-0">
                <div className="flex flex-col items-center w-32">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border-2',
                    event.status === 'completed' && 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
                    event.status === 'in-progress' && 'bg-sky-500/15 border-sky-500/40 text-sky-400',
                    event.status === 'flagged' && 'bg-red-500/20 border-red-500/40 text-red-400',
                    event.status === 'pending' && 'bg-slate-800/40 border-slate-700/40 text-slate-400',
                  )}>
                    {event.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {event.status === 'in-progress' && <Clock className="w-4 h-4 text-sky-400" />}
                    {event.status === 'flagged' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    {event.status === 'pending' && <Circle className="w-4 h-4 text-slate-300" />}
                  </div>
                  <div className="text-[11px] font-medium text-slate-300 mt-2 text-center leading-tight">{event.label}</div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Card>
          <CardHeader title="Contract Details" />
          <CardBody>
            <dl className="space-y-3">
              {[
                ['Project', contract.projectName],
                ['Tender', contract.tenderId],
                ['Contractor', contract.contractorName],
                ['Award Value', formatCurrency(contract.awardValue)],
                ['Start Date', formatDate(contract.startDate)],
                ['Expected Completion', formatDate(contract.expectedCompletionDate)],
                ['Current Progress', `${contract.currentProgress}%`],
                ['Expenditure', formatCurrency(contract.expenditure)],
                ['State', contract.state],
                ['Status', contract.status],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <dt className="text-[12px] text-slate-500">{label}</dt>
                  <dd className="text-[13px] font-medium text-slate-100 capitalize">{value}</dd>
                </div>
              ))}
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Transactions" subtitle="Payment history for this contract" />
          <div className="overflow-x-auto scrollbar-thin">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th className="text-right">Amount</th>
                  <th>Reference</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {demoTransactions.filter((t) => t.contractId === contract.id || contract.id === 'C-9281').map((t) => (
                  <tr key={t.id}>
                    <td className="text-[12px]">{formatDate(t.date)}</td>
                    <td className="capitalize text-[12px]">{t.type.replace(/-/g, ' ')}</td>
                    <td className="text-right tabular-nums font-medium">{t.amount > 0 ? formatCurrency(t.amount) : '—'}</td>
                    <td className="text-[12px] text-slate-500">{t.reference}</td>
                    <td><span className={cn('badge capitalize', t.status === 'verified' && 'badge-risk-normal', t.status === 'processed' && 'badge-info', t.status === 'pending' && 'badge-risk-watch')}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Related Records" />
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Link to={`/projects/${contract.projectId}`} className="flex items-center gap-2 p-3 rounded-md border border-slate-700/30 hover:border-navy-300 hover:bg-sky-500/10 transition-all group">
              <PenTool className="w-4 h-4 text-slate-400 group-hover:text-sky-400" />
              <span className="text-[12px] font-medium text-slate-600 group-hover:text-sky-300">Open Project</span>
            </Link>
            <Link to={`/tenders/${contract.tenderId}`} className="flex items-center gap-2 p-3 rounded-md border border-slate-700/30 hover:border-navy-300 hover:bg-sky-500/10 transition-all group">
              <Calendar className="w-4 h-4 text-slate-400 group-hover:text-sky-400" />
              <span className="text-[12px] font-medium text-slate-600 group-hover:text-sky-300">Open Tender</span>
            </Link>
            <Link to={`/contractors/${contract.contractorId}`} className="flex items-center gap-2 p-3 rounded-md border border-slate-700/30 hover:border-navy-300 hover:bg-sky-500/10 transition-all group">
              <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-sky-400" />
              <span className="text-[12px] font-medium text-slate-600 group-hover:text-sky-300">Open Contractor</span>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
