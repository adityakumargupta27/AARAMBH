import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, Download, ArrowUpDown, ChevronLeft, ChevronRight, FolderKanban, Database, Bot } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { RiskBadge, RiskBar } from '@/components/ui/RiskBadge';
import { EmptyState } from '@/components/ui/State';
import { useToast } from '@/components/ui/Toast';
import { mockProjects } from '@/data/mockData';
import { api } from '@/services/api';
import type { Project } from '@/types';
import { formatCurrency, formatCurrencyShort, formatDate, riskLevelConfig } from '@/utils/format';
import { cn } from '@/utils/cn';

type SortField = 'riskScore' | 'lastUpdated' | 'estimatedCost' | 'name';
type SortDir = 'asc' | 'desc';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [dataSource, setDataSource] = useState('Local Fallback');
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    api.getProjects()
      .then((data) => {
        if (data && data.length > 0) {
          setProjects(data);
          setDataSource('MongoDB Atlas (Live)');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const states = [...new Set(projects.map((p) => p.state))].sort();
  const types = [...new Set(projects.map((p) => p.projectType || 'Infrastructure'))].sort();

  const activeFilters = [stateFilter, statusFilter, riskFilter, typeFilter].filter(Boolean).length;

  const filtered = useMemo(() => {
    let result = projects.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (stateFilter && p.state !== stateFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (riskFilter && p.riskLevel !== riskFilter) return false;
      if (typeFilter && p.projectType !== typeFilter) return false;
      return true;
    });
    result = result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'riskScore') cmp = a.riskScore - b.riskScore;
      else if (sortField === 'lastUpdated') cmp = a.lastUpdated.localeCompare(b.lastUpdated);
      else if (sortField === 'estimatedCost') cmp = a.estimatedCost - b.estimatedCost;
      else if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return result;
  }, [search, stateFilter, statusFilter, riskFilter, typeFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const clearAll = () => {
    setSearch(''); setStateFilter(''); setStatusFilter(''); setRiskFilter(''); setTypeFilter('');
    setPage(1);
    toast('info', 'Filters cleared');
  };

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader
        title="Projects"
        subtitle="Explore MPLADS-funded works and their connected procurement lifecycle."
        actions={
          <button className="btn-secondary" onClick={() => toast('info', 'Export started', 'Generating CSV export of project records.')}>
            <Download className="w-4 h-4" /> Export
          </button>
        }
      />

      {/* Toolbar */}
      <Card>
        <CardBody className="p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search projects..."
                className="input pl-8"
              />
            </div>
            <button className={cn('btn-secondary', showFilters && 'border-navy-300 text-sky-400')} onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4" /> Filters {activeFilters > 0 && <span className="ml-1 px-1.5 py-0.5 bg-navy-600 text-white rounded-full text-[10px]">{activeFilters}</span>}
            </button>
            {activeFilters > 0 && (
              <button className="btn-ghost" onClick={clearAll}>
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-700/20">
              <div>
                <label className="label">State</label>
                <select className="input" value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}>
                  <option value="">All States</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Project Type</label>
                <select className="input" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
                  <option value="">All Types</option>
                  {types.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div>
                <label className="label">Risk Level</label>
                <select className="input" value={riskFilter} onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}>
                  <option value="">All Risk Levels</option>
                  <option value="high">High</option>
                  <option value="review">Review</option>
                  <option value="watch">Watch</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>
          )}

          {activeFilters > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {stateFilter && <FilterChip label={`State: ${stateFilter}`} onClear={() => setStateFilter('')} />}
              {typeFilter && <FilterChip label={`Type: ${typeFilter}`} onClear={() => setTypeFilter('')} />}
              {statusFilter && <FilterChip label={`Status: ${statusFilter}`} onClear={() => setStatusFilter('')} />}
              {riskFilter && <FilterChip label={`Risk: ${riskFilter}`} onClear={() => setRiskFilter('')} />}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="p-4 space-y-2 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-10 bg-slate-800/30 rounded" />)}
          </div>
        ) : paged.length === 0 ? (
          <EmptyState icon={<FolderKanban className="w-8 h-8" />} title="No projects found" description="Try adjusting your filters or search query." />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="table-base table-row-hover">
              <thead>
                <tr>
                  <th className="cursor-pointer" onClick={() => handleSort('name')}>
                    <span className="flex items-center gap-1">Project ID <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th>Project</th>
                  <th>State</th>
                  <th>Constituency</th>
                  <th className="text-right cursor-pointer" onClick={() => handleSort('estimatedCost')}>
                    <span className="flex items-center gap-1 justify-end">Est. Cost <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-right">Sanctioned</th>
                  <th>Status</th>
                  <th className="cursor-pointer" onClick={() => handleSort('riskScore')}>
                    <span className="flex items-center gap-1">Risk <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="cursor-pointer" onClick={() => handleSort('lastUpdated')}>
                    <span className="flex items-center gap-1">Updated <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p) => (
                  <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)}>
                    <td className="font-medium text-sky-400">{p.id}</td>
                    <td className="max-w-[200px] truncate">{p.name}</td>
                    <td>{p.state}</td>
                    <td>{p.constituency}</td>
                    <td className="text-right tabular-nums">{formatCurrencyShort(p.estimatedCost)}</td>
                    <td className="text-right tabular-nums">{formatCurrencyShort(p.sanctionedAmount)}</td>
                    <td><span className="text-[12px] capitalize text-slate-600">{p.status}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <RiskBadge level={p.riskLevel} showLabel={false} />
                        <span className="text-[12px] font-semibold tabular-nums text-slate-300 w-6">{p.riskScore}</span>
                      </div>
                    </td>
                    <td className="text-[12px] text-slate-500">{formatDate(p.lastUpdated)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/ai-investigator?projectId=${p.id}`)}
                        className="btn-ghost btn-xs text-[11px] text-sky-400 hover:text-sky-300 hover:bg-sky-500/15 flex items-center gap-1 px-2 py-1 rounded border border-sky-500/20"
                        title="Open AI Forensic Investigation & Report"
                      >
                        <Bot className="w-3 h-3" />
                        <span>Audit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/20">
            <span className="text-[12px] text-slate-500">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-ghost btn-sm disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[12px] text-slate-600 px-2">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="btn-ghost btn-sm disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-sky-500/10 text-sky-400 border border-navy-200 rounded-md text-[11px] font-medium">
      {label}
      <button onClick={onClear} className="hover:text-navy-900"><X className="w-3 h-3" /></button>
    </span>
  );
}
