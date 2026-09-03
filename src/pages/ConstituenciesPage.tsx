import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Landmark, AlertCircle, TrendingUp, CheckCircle2, IndianRupee, Download, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import {
  officialMPAllocations,
  officialRajyaSabhaAllocations,
  allParliamentAllocations,
  officialMpladsSummary,
  parliamentSummary,
} from '@/data/officialMpladsData';
import { formatCurrency, formatCurrencyShort } from '@/utils/format';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/Toast';

export default function ConstituenciesPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeHouse, setActiveHouse] = useState<'all' | 'Lok Sabha' | 'Rajya Sabha'>('all');
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [filterAugmentedOnly, setFilterAugmentedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'amount-desc' | 'amount-asc' | 'state' | 'constituency'>('amount-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const currentDataset = useMemo(() => {
    if (activeHouse === 'Lok Sabha') {
      return allParliamentAllocations.filter((m) => m.house === 'Lok Sabha');
    }
    if (activeHouse === 'Rajya Sabha') {
      return allParliamentAllocations.filter((m) => m.house === 'Rajya Sabha');
    }
    return allParliamentAllocations;
  }, [activeHouse]);

  const states = useMemo(() => {
    return Array.from(new Set(allParliamentAllocations.map((c) => c.state))).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = currentDataset.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesConst = c.constituency.toLowerCase().includes(q);
        const matchesMP = c.mpName.toLowerCase().includes(q);
        const matchesState = c.state.toLowerCase().includes(q);
        if (!matchesConst && !matchesMP && !matchesState) return false;
      }
      if (selectedState && c.state !== selectedState) return false;
      if (filterAugmentedOnly && c.isBaseline) return false;
      return true;
    });

    result = result.sort((a, b) => {
      if (sortBy === 'amount-desc') return b.allocatedAmount - a.allocatedAmount;
      if (sortBy === 'amount-asc') return a.allocatedAmount - b.allocatedAmount;
      if (sortBy === 'state') return a.state.localeCompare(b.state);
      if (sortBy === 'constituency') return a.constituency.localeCompare(b.constituency);
      return 0;
    });

    return result;
  }, [currentDataset, search, selectedState, filterAugmentedOnly, sortBy]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="animate-fade-in space-y-6 stagger-children">
      <PageHeader
        title="MPLADS Constituency Fund Allocation"
        subtitle="Official MoSPI Allocated Limits across all 543 Parliamentary Constituencies of India"
        actions={
          <button
            className="btn-secondary"
            onClick={() => toast('info', 'Exporting Registry', 'Exporting 543 MP allocation data to CSV')}
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        }
      />

      {/* House Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 flex-wrap">
        <button
          onClick={() => { setActiveHouse('all'); setCurrentPage(1); }}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold text-[13px] transition-all flex items-center gap-2",
            activeHouse === 'all'
              ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
              : "bg-slate-800/60 text-slate-400 hover:text-white"
          )}
        >
          <Landmark className="w-4 h-4" />
          <span>All Parliament (774 MPs)</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-200 font-mono">₹11,697.5 Cr</span>
        </button>

        <button
          onClick={() => { setActiveHouse('Lok Sabha'); setCurrentPage(1); }}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold text-[13px] transition-all flex items-center gap-2",
            activeHouse === 'Lok Sabha'
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-800/60 text-slate-400 hover:text-white"
          )}
        >
          <span>Lok Sabha (543 Constituencies)</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 font-mono">₹8,333.7 Cr</span>
        </button>

        <button
          onClick={() => { setActiveHouse('Rajya Sabha'); setCurrentPage(1); }}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold text-[13px] transition-all flex items-center gap-2",
            activeHouse === 'Rajya Sabha'
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "bg-slate-800/60 text-slate-400 hover:text-white"
          )}
        >
          <span>Rajya Sabha (231 State MPs)</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 font-mono">₹3,363.8 Cr</span>
        </button>
      </div>

      {/* Official Summary Top Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-sky-500">
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Allocated Fund</div>
            <div className="text-[24px] font-bold text-sky-400 tabular-nums mt-1 animate-number">
              {activeHouse === 'all'
                ? '₹11,697.5 Cr'
                : activeHouse === 'Lok Sabha'
                ? '₹8,333.7 Cr'
                : '₹3,363.8 Cr'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {activeHouse === 'all'
                ? 'Grand Total across 774 Parliament MPs'
                : activeHouse === 'Lok Sabha'
                ? 'Total across 543 Lok Sabha seats'
                : 'Total across 231 Rajya Sabha seats'}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Baseline Allocation</div>
            <div className="text-[24px] font-bold text-slate-100 tabular-nums mt-1 animate-number">₹14.70 Cr</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Standard per MP term (387 LS + 54 RS)</div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Surplus / Carried-over</div>
            <div className="text-[24px] font-bold text-amber-400 tabular-nums mt-1 animate-number">
              {activeHouse === 'all' ? '333 MPs' : activeHouse === 'Lok Sabha' ? '156 Seats' : '177 MPs'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Accumulated prior funds (&gt;₹14.7 Cr)</div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Highest Allocation</div>
            <div className="text-[24px] font-bold text-red-400 tabular-nums mt-1 animate-number">
              {activeHouse === 'Rajya Sabha' ? '₹31.09 Cr' : '₹32.75 Cr'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {activeHouse === 'Rajya Sabha' ? 'Kerala (Shri Abdul Wahab)' : 'Malkajgiri (Eatala Rajender)'}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Accumulated Callout */}
      {activeHouse !== 'Rajya Sabha' && (
        <Card>
          <CardHeader
            title="High Fund Accumulation Alert (Carried-Forward Balance)"
            subtitle="Constituencies with significant unspent allocations from previous tenures requiring early review"
          />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {officialMpladsSummary.topAccumulatedConstituencies.slice(0, 4).map((c) => (
                <div key={c.constituency} className="p-3.5 rounded-lg border hover-lift" style={{ background: 'rgba(217, 119, 6, 0.08)', borderColor: 'rgba(217, 119, 6, 0.2)' }}>
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold mb-1">
                    <span>{c.state}</span>
                    <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(217, 119, 6, 0.2)', color: '#fcd34d' }}>{c.excessRatio}</span>
                  </div>
                  <div className="text-[14px] font-bold text-white">{c.constituency}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">MP: {c.mp}</div>
                  <div className="text-[16px] font-bold text-sky-400 tabular-nums mt-2">{formatCurrency(c.amount)}</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by MP Name, Constituency, or State..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="input pl-9"
                />
              </div>

              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setCurrentPage(1); }}
                className="input w-auto min-w-[170px]"
              >
                <option value="">All States & UTs ({states.length})</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <label className="flex items-center gap-2 text-[12px] font-medium text-slate-300 cursor-pointer select-none px-3 py-2 border rounded-md" style={{ background: 'rgba(30, 41, 59, 0.5)', borderColor: 'rgba(148, 163, 184, 0.12)' }}>
                <input
                  type="checkbox"
                  checked={filterAugmentedOnly}
                  onChange={(e) => { setFilterAugmentedOnly(e.target.checked); setCurrentPage(1); }}
                  className="rounded text-sky-400"
                />
                <span>Only show Surplus Funds (&gt;₹14.7Cr)</span>
              </label>

            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input w-auto text-[12px]"
              >
                <option value="amount-desc">Highest Allocation</option>
                <option value="amount-asc">Lowest Allocation</option>
                <option value="state">State Name (A-Z)</option>
                <option value="constituency">Constituency Name (A-Z)</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Parliamentary Allocation Table */}
      <Card>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="table-base table-row-hover">
            <thead>
              <tr>
                <th className="w-14">Sr. No.</th>
                <th>House</th>
                <th>Constituency / Representation</th>
                <th>Hon'ble Member of Parliament</th>
                <th>State / UT</th>
                <th className="text-right">Allocated Limit (₹)</th>
                <th className="text-center">Allocation Type</th>
                <th className="text-right">Variance</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item, idx) => {
                const variance = Math.round(((item.allocatedAmount - 147000000) / 147000000) * 1000) / 10;
                return (
                  <tr key={item.id || `${item.house}-${item.srNo}-${idx}`}>
                    <td className="text-slate-400 tabular-nums font-mono text-[11px]">{item.srNo}</td>
                    <td>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded font-semibold border",
                        item.house === 'Rajya Sabha'
                          ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                          : "bg-blue-500/15 border-blue-500/30 text-blue-300"
                      )}>
                        {item.house}
                      </span>
                    </td>
                    <td className="font-bold text-sky-400 text-[13px]">{item.constituency}</td>
                    <td className="text-slate-100 font-medium">
                      {item.mpName}
                      {item.mpType && item.mpType !== 'Elected MP' && (
                        <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                          {item.mpType}
                        </span>
                      )}
                    </td>
                    <td className="text-slate-400 text-[12px]">{item.state}</td>
                    <td className="text-right tabular-nums font-bold text-white text-[13px]">
                      {formatCurrency(item.allocatedAmount)}
                    </td>
                    <td className="text-center">
                      {item.isBaseline ? (
                        <span className="badge badge-risk-normal text-[10px]">Standard Baseline</span>
                      ) : (
                        <span className="badge badge-risk-watch text-[10px]">Carried-over Surplus</span>
                      )}
                    </td>
                    <td className="text-right tabular-nums text-[12px]">
                      {variance > 0 ? (
                        <span className="text-amber-400 font-semibold">+{variance}%</span>
                      ) : variance < 0 ? (
                        <span className="text-slate-500">{variance}%</span>
                      ) : (
                        <span className="text-slate-400 font-normal">0.0%</span>
                      )}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => navigate(`/ai-investigator?projectId=${item.id}`)}
                        className="btn-primary text-[11px] px-2.5 py-1 flex items-center gap-1 ml-auto"
                        title="Run AI Vigilance Audit on this MP"
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

        {/* Pagination */}
        <div className="p-4 border-t border-slate-700/20 flex items-center justify-between text-[12px] text-slate-500">
          <div>
            Showing <strong className="text-slate-100">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-slate-100">{Math.min(currentPage * itemsPerPage, filtered.length)}</strong> of{' '}
            <strong className="text-slate-100">{filtered.length}</strong> official constituencies
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="btn-secondary btn-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 font-medium">Page {currentPage} of {totalPages || 1}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="btn-secondary btn-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
