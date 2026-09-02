import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, Gauge, ArrowUpRight, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/State';
import { mockInvestigationCases, mockProjects, mockContractors } from '@/data/mockData';
import { formatCurrencyShort, formatDate, signalLabel, caseStatusLabel } from '@/utils/format';
import type { InvestigationCase } from '@/types';
import { cn } from '@/utils/cn';

export default function RiskExplorerPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [state, setState] = useState('');
  const [signalType, setSignalType] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState<'risk' | 'newest' | 'value' | 'signals'>('risk');
  const [showFilters, setShowFilters] = useState(true);
  const [previewCase, setPreviewCase] = useState<InvestigationCase | null>(null);

  const states = [...new Set(mockInvestigationCases.map((c) => c.state))].sort();

  const signalCategories = [
    'price-anomaly', 'bid-pattern', 'contractor-history', 'execution-variance',
    'payment-anomaly', 'document-discrepancy', 'timeline-anomaly', 'duplicate-similar',
  ];

  const filtered = useMemo(() => {
    let result = mockInvestigationCases.filter((c) => {
      if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.projectName.toLowerCase().includes(search.toLowerCase())) return false;
      if (riskLevel && c.riskLevel !== riskLevel) return false;
      if (state && c.state !== state) return false;
      if (signalType && c.primarySignal !== signalType && !c.secondarySignals.includes(signalType as any)) return false;
      if (status && c.status !== status) return false;
      return true;
    });
    result = result.sort((a, b) => {
      if (sortBy === 'risk') return b.riskScore - a.riskScore;
      if (sortBy === 'newest') return b.lastUpdated.localeCompare(a.lastUpdated);
      if (sortBy === 'value') return b.caseValue - a.caseValue;
      if (sortBy === 'signals') return (b.secondarySignals.length + 1) - (a.secondarySignals.length + 1);
      return 0;
    });
    return result;
  }, [search, riskLevel, state, signalType, status, sortBy]);

  const activeFilters = [riskLevel, state, signalType, status].filter(Boolean).length;

  const summary = {
    total: filtered.length,
    highPriority: filtered.filter((c) => c.riskLevel === 'high').length,
    avgRisk: filtered.length > 0 ? Math.round(filtered.reduce((s, c) => s + c.riskScore, 0) / filtered.length) : 0,
    totalValue: filtered.reduce((s, c) => s + c.caseValue, 0),
  };

  const clearAll = () => {
    setSearch(''); setRiskLevel(''); setState(''); setSignalType(''); setStatus('');
  };

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Risk Explorer" subtitle="Find procurement cases requiring further review." />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Cases Found', value: summary.total.toLocaleString('en-IN') },
          { label: 'High Priority', value: summary.highPriority, accent: true },
          { label: 'Average Risk', value: summary.avgRisk },
          { label: 'Total Value', value: formatCurrencyShort(summary.totalValue) },
        ].map((s) => (
          <Card key={s.label} className={cn(s.accent && 'border-l-4 border-l-red-400')}>
            <CardBody className="p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{s.label}</div>
              <div className={cn('text-[22px] font-bold tabular-nums mt-1', s.accent ? 'text-red-600' : 'text-slate-900')}>{s.value}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filter Sidebar */}
        <Card className={cn(!showFilters && 'hidden lg:block')}>
          <CardHeader title="Filters" action={
            activeFilters > 0 ? <button className="text-[11px] text-navy-600 font-medium" onClick={clearAll}>Clear All</button> : undefined
          } />
          <CardBody className="space-y-3">
            <div>
              <label className="label">Risk Score Range</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="input input-sm" />
                <span className="text-slate-400">—</span>
                <input type="number" placeholder="Max" className="input input-sm" />
              </div>
            </div>
            <div>
              <label className="label">Risk Level</label>
              <select className="input" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
                <option value="">All Levels</option>
                <option value="high">High Priority</option>
                <option value="review">Review</option>
                <option value="watch">Watch</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            <div>
              <label className="label">State</label>
              <select className="input" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">All States</option>
                {states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Anomaly Type</label>
              <select className="input" value={signalType} onChange={(e) => setSignalType(e.target.value)}>
                <option value="">All Signals</option>
                {signalCategories.map((s) => <option key={s} value={s}>{signalLabel(s)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Case Status</label>
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="under-review">Under Review</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <button className="btn-primary w-full">Apply Filters</button>
          </CardBody>
        </Card>

        {/* Results Table */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cases..." className="input pl-8" />
            </div>
            <button className="btn-secondary lg:hidden" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4" /> Filters
            </button>
            <select className="input w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="risk">Highest Risk</option>
              <option value="newest">Newest</option>
              <option value="value">Largest Value</option>
              <option value="signals">Most Signals</option>
            </select>
          </div>

          {activeFilters > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {riskLevel && <FilterChip label={`Risk: ${riskLevel}`} onClear={() => setRiskLevel('')} />}
              {state && <FilterChip label={`State: ${state}`} onClear={() => setState('')} />}
              {signalType && <FilterChip label={`Signal: ${signalLabel(signalType)}`} onClear={() => setSignalType('')} />}
              {status && <FilterChip label={`Status: ${status}`} onClear={() => setStatus('')} />}
            </div>
          )}

          <Card>
            {filtered.length === 0 ? (
              <EmptyState icon={<Gauge className="w-8 h-8" />} title="No cases match these filters" description="Try adjusting your filter criteria." />
            ) : (
              <div className="overflow-x-auto scrollbar-thin">
                <table className="table-base table-row-hover">
                  <thead>
                    <tr>
                      <th>Risk</th>
                      <th>Case ID</th>
                      <th>Project</th>
                      <th>Contractor</th>
                      <th className="text-right">Value</th>
                      <th>Primary Signal</th>
                      <th>Score</th>
                      <th>Status</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id} onClick={() => setPreviewCase(c)}>
                        <td><RiskBadge level={c.riskLevel} /></td>
                        <td className="font-medium text-navy-700">{c.id}</td>
                        <td className="max-w-[160px] truncate">{c.projectName}</td>
                        <td className="max-w-[120px] truncate">{c.contractorName}</td>
                        <td className="text-right tabular-nums">{formatCurrencyShort(c.caseValue)}</td>
                        <td className="capitalize text-[12px]">{c.primarySignal.replace(/-/g, ' ')}</td>
                        <td><span className="font-bold tabular-nums text-slate-800">{c.riskScore}</span></td>
                        <td><span className="text-[12px] capitalize text-slate-600">{c.status.replace(/-/g, ' ')}</span></td>
                        <td className="text-[11px] text-slate-400">{formatDate(c.lastUpdated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Case Preview Drawer */}
      <Drawer
        open={!!previewCase}
        onClose={() => setPreviewCase(null)}
        title={previewCase?.id}
        subtitle={previewCase?.projectName}
        footer={
          <>
            <button className="btn-secondary" onClick={() => previewCase && navigate(`/projects/${previewCase.projectId}`)}>
              <FileText className="w-4 h-4" /> View Project
            </button>
            <button className="btn-primary" onClick={() => previewCase && navigate(`/investigations/${previewCase.id}`)}>
              <ArrowUpRight className="w-4 h-4" /> Open Investigation
            </button>
          </>
        }
      >
        {previewCase && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-[28px] font-bold text-red-600 tabular-nums">{previewCase.riskScore}</div>
                <div className="text-[10px] text-slate-400">/ 100</div>
              </div>
              <RiskBadge level={previewCase.riskLevel} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-[10px] text-slate-400 uppercase">Contractor</div>
                <div className="text-[13px] font-medium text-slate-800">{previewCase.contractorName}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-[10px] text-slate-400 uppercase">State</div>
                <div className="text-[13px] font-medium text-slate-800">{previewCase.state}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-[10px] text-slate-400 uppercase">Case Value</div>
                <div className="text-[13px] font-medium text-slate-800">{formatCurrencyShort(previewCase.caseValue)}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-[10px] text-slate-400 uppercase">Evidence Count</div>
                <div className="text-[13px] font-medium text-slate-800">{previewCase.evidenceCount} records</div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Top Signals</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[12px] font-medium text-slate-800">{signalLabel(previewCase.primarySignal)}</span>
                </div>
                {previewCase.secondarySignals.map((s) => (
                  <div key={s} className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="text-[12px] text-slate-600">{signalLabel(s)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Detected: {formatDate(previewCase.detectedDate)} · Last Updated: {formatDate(previewCase.lastUpdated)}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-navy-50 text-navy-700 border border-navy-200 rounded-md text-[11px] font-medium">
      {label}
      <button onClick={onClear} className="hover:text-navy-900"><X className="w-3 h-3" /></button>
    </span>
  );
}
