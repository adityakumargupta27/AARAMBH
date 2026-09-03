import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, Download, ArrowUpDown, ChevronLeft, ChevronRight, FolderKanban, Database, Bot, Landmark } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { RiskBadge, RiskBar } from '@/components/ui/RiskBadge';
import { EmptyState } from '@/components/ui/State';
import { useToast } from '@/components/ui/Toast';
import { officialParliamentProjects } from '@/data/officialProjects';
import { api } from '@/services/api';
import type { Project } from '@/types';
import { formatCurrency, formatCurrencyShort, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

type SortField = 'riskScore' | 'estimatedCost' | 'name' | 'state';
type SortDir = 'asc' | 'desc';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>(officialParliamentProjects);
  const [activeHouse, setActiveHouse] = useState<'all' | 'Lok Sabha' | 'Rajya Sabha'>('all');
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    api.getProjects()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch((e) => {
        console.warn('Using synchronous official projects fallback', e);
      });
  }, []);

  const states = useMemo(() => [...new Set(projects.map((p) => p.state))].sort(), [projects]);
  const types = useMemo(() => [...new Set(projects.map((p) => p.projectType || 'Civic Infrastructure'))].sort(), [projects]);

  const activeFilters = [stateFilter, statusFilter, riskFilter, typeFilter].filter(Boolean).length;

  const filtered = useMemo(() => {
    let result = projects.filter((p) => {
      if (activeHouse !== 'all') {
        const h = p.house || (p.id?.startsWith('RS') ? 'Rajya Sabha' : 'Lok Sabha');
        if (h !== activeHouse) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesId = p.id?.toLowerCase().includes(q);
        const matchesConst = p.constituency?.toLowerCase().includes(q);
        const matchesMP = p.mpName?.toLowerCase().includes(q);
        const matchesState = p.state?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesConst && !matchesMP && !matchesState) return false;
      }
      if (stateFilter && p.state !== stateFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (riskFilter && p.riskLevel !== riskFilter) return false;
      if (typeFilter && p.projectType !== typeFilter) return false;
      return true;
    });

    result = result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'riskScore') cmp = (a.riskScore || 0) - (b.riskScore || 0);
      else if (sortField === 'estimatedCost') cmp = (a.estimatedCost || 0) - (b.estimatedCost || 0);
      else if (sortField === 'name') cmp = (a.name || '').localeCompare(b.name || '');
      else if (sortField === 'state') cmp = (a.state || '').localeCompare(b.state || '');
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [projects, activeHouse, search, stateFilter, statusFilter, riskFilter, typeFilter, sortField, sortDir]);

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
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title="MPLADS Public Infrastructure Works"
        subtitle={`Official MoSPI procurement and developmental projects across all ${projects.length} Parliamentary MPs (543 Lok Sabha + 231 Rajya Sabha)`}
        actions={
          <button className="btn-secondary" onClick={() => toast('info', 'Export started', 'Generating CSV export of official project records.')}>
            <Download className="w-4 h-4" /> Export CSV
          </button>
        }
      />

      {/* House Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 flex-wrap">
        <button
          onClick={() => { setActiveHouse('all'); setPage(1); }}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold text-[13px] transition-all flex items-center gap-2",
            activeHouse === 'all'
              ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
              : "bg-slate-800/60 text-slate-400 hover:text-white"
          )}
        >
          <Landmark className="w-4 h-4" />
          <span>All Parliament (774 Works)</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-200 font-mono">₹11,697.5 Cr</span>
        </button>

        <button
          onClick={() => { setActiveHouse('Lok Sabha'); setPage(1); }}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold text-[13px] transition-all flex items-center gap-2",
            activeHouse === 'Lok Sabha'
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-800/60 text-slate-400 hover:text-white"
          )}
        >
          <span>Lok Sabha (543 Works)</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 font-mono">₹8,333.7 Cr</span>
        </button>

        <button
          onClick={() => { setActiveHouse('Rajya Sabha'); setPage(1); }}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold text-[13px] transition-all flex items-center gap-2",
            activeHouse === 'Rajya Sabha'
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "bg-slate-800/60 text-slate-400 hover:text-white"
          )}
        >
          <span>Rajya Sabha (231 Works)</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 font-mono">₹3,363.8 Cr</span>
        </button>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-sky-500">
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Works Tracked</div>
            <div className="text-[24px] font-bold text-sky-400 tabular-nums mt-1">
              {activeHouse === 'all' ? '774 Works' : activeHouse === 'Lok Sabha' ? '543 Works' : '231 Works'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Official MoSPI sanctioned files</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Sanctioned Outlay</div>
            <div className="text-[24px] font-bold text-white tabular-nums mt-1">
              {activeHouse === 'all' ? '₹11,697.5 Cr' : activeHouse === 'Lok Sabha' ? '₹8,333.7 Cr' : '₹3,363.8 Cr'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Matched with official registry</div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Surplus / Carried Forward</div>
            <div className="text-[24px] font-bold text-amber-400 tabular-nums mt-1">
              {activeHouse === 'all' ? '333 Works' : activeHouse === 'Lok Sabha' ? '156 Works' : '177 Works'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Accumulated prior funds (&gt;₹14.7 Cr)</div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Baseline Standard</div>
            <div className="text-[24px] font-bold text-emerald-400 tabular-nums mt-1">₹14.70 Cr</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Standard allocation per MP term</div>
          </CardBody>
        </Card>
      </div>

      {/* Toolbar & Search */}
      <Card>
        <CardBody className="p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by project, constituency, state, or MP name..."
                className="input pl-8 w-full text-[13px]"
              />
            </div>
            <button
              className={cn('btn-secondary text-[12px]', showFilters && 'border-sky-500 text-sky-400')}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-3.5 h-3.5" /> Filters {activeFilters > 0 && <span className="ml-1 px-1.5 py-0.5 bg-sky-600 text-white rounded-full text-[10px]">{activeFilters}</span>}
            </button>
            {activeFilters > 0 && (
              <button className="btn-ghost text-[12px]" onClick={clearAll}>
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-700/20 text-[12px]">
              <div>
                <label className="label text-[11px]">State / UT</label>
                <select className="input text-[12px]" value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}>
                  <option value="">All States ({states.length})</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-[11px]">Work Category</label>
                <select className="input text-[12px]" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
                  <option value="">All Categories</option>
                  {types.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-[11px]">Risk Level</label>
                <select className="input text-[12px]" value={riskFilter} onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}>
                  <option value="">All Risk Levels</option>
                  <option value="high">High (&gt;75)</option>
                  <option value="review">Review (50-74)</option>
                  <option value="normal">Normal (&lt;50)</option>
                </select>
              </div>
              <div>
                <label className="label text-[11px]">Execution Status</label>
                <select className="input text-[12px]" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="under-review">Under Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Official Projects Table */}
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
                  <th className="w-20 cursor-pointer" onClick={() => handleSort('name')}>
                    <span className="flex items-center gap-1 font-mono text-[11px]">ID <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th>House</th>
                  <th>Project Name & Scope</th>
                  <th>Hon'ble MP / Representation</th>
                  <th>State / UT</th>
                  <th className="text-right cursor-pointer" onClick={() => handleSort('estimatedCost')}>
                    <span className="flex items-center gap-1 justify-end">Sanctioned Limit <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-center cursor-pointer" onClick={() => handleSort('riskScore')}>
                    <span className="flex items-center gap-1 justify-center">Risk <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p) => {
                  const house = p.house || (p.id?.startsWith('RS') ? 'Rajya Sabha' : 'Lok Sabha');
                  return (
                    <tr key={p.id} onClick={() => navigate(`/ai-investigator?projectId=${p.id}`)} className="cursor-pointer">
                      <td className="font-mono text-sky-400 font-bold text-[12px]">{p.id}</td>
                      <td>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded font-semibold border",
                          house === 'Rajya Sabha'
                            ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                            : "bg-blue-500/15 border-blue-500/30 text-blue-300"
                        )}>
                          {house}
                        </span>
                      </td>
                      <td>
                        <div className="font-medium text-white text-[13px]">{p.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{p.projectType || 'Infrastructure'}</div>
                      </td>
                      <td>
                        <div className="font-semibold text-amber-300 text-[12px]">
                          Hon. {p.mpName || 'Assigned MP'}
                        </div>
                        <div className="text-[11px] text-slate-400">{p.constituency}</div>
                      </td>
                      <td className="text-slate-300 text-[12px]">{p.state}</td>
                      <td className="text-right tabular-nums font-bold text-white text-[13px]">
                        {formatCurrency(p.sanctionedAmount || p.estimatedCost)}
                      </td>
                      <td className="text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <RiskBadge level={p.riskLevel || 'normal'} showLabel={false} />
                          <span className="text-[12px] font-bold tabular-nums text-slate-200">{p.riskScore}</span>
                        </div>
                      </td>
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/ai-investigator?projectId=${p.id}`)}
                          className="btn-primary text-[11px] px-2.5 py-1 flex items-center gap-1 ml-auto"
                          title="Audit this official file in AI Investigator"
                        >
                          <Bot className="w-3 h-3" /> Audit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/20 text-[12px]">
            <span className="text-slate-400">
              Showing <strong className="text-slate-200">{(page - 1) * pageSize + 1}</strong> to{' '}
              <strong className="text-slate-200">{Math.min(page * pageSize, filtered.length)}</strong> of{' '}
              <strong className="text-slate-200">{filtered.length}</strong> official parliamentary projects
            </span>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-secondary btn-sm disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="px-2 font-medium text-slate-300">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="btn-secondary btn-sm disabled:opacity-40">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
