import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Landmark, AlertCircle, TrendingUp, CheckCircle2, IndianRupee, Download } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { officialMPAllocations, officialMpladsSummary, stateAllocationSummaries } from '@/data/officialMpladsData';
import { formatCurrency, formatCurrencyShort } from '@/utils/format';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/Toast';

export default function ConstituenciesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [filterAugmentedOnly, setFilterAugmentedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'amount-desc' | 'amount-asc' | 'state' | 'constituency'>('amount-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const states = useMemo(() => {
    return Array.from(new Set(officialMPAllocations.map((c) => c.state))).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = officialMPAllocations.filter((c) => {
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
  }, [search, selectedState, filterAugmentedOnly, sortBy]);

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

      {/* Official Summary Top Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-sky-500">
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Allocated Fund</div>
            <div className="text-[24px] font-bold text-sky-400 tabular-nums mt-1 animate-number">₹8,332.7 Cr</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Grand Total across 543 Lok Sabha seats</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Baseline Allocation</div>
            <div className="text-[24px] font-bold text-slate-100 tabular-nums mt-1 animate-number">₹14.70 Cr</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Standard per MP (387 Constituencies)</div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Surplus / Carried-over</div>
            <div className="text-[24px] font-bold text-amber-400 tabular-nums mt-1 animate-number">156 Seats</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Accumulated prior funds (&gt;₹14.7 Cr)</div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardBody className="p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Highest Allocation</div>
            <div className="text-[24px] font-bold text-red-400 tabular-nums mt-1 animate-number">₹32.75 Cr</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Malkajgiri, Telangana (+122.8% carryover)</div>
          </CardBody>
        </Card>

      </div>

      {/* Top 4 Accumulated Constituencies Callout */}
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
                <option value="">All States & UTs (36)</option>
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

      {/* 543 Constituencies Table */}
      <Card>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="table-base table-row-hover">
            <thead>
              <tr>
                <th className="w-16">Sr. No.</th>
                <th>Constituency</th>
                <th>Hon'ble Member of Parliament</th>
                <th>State / UT</th>
                <th className="text-right">Allocated Amount (₹)</th>
                <th className="text-center">Allocation Type</th>
                <th className="text-right">Variance vs Baseline</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr key={item.srNo}>
                  <td className="text-slate-400 tabular-nums font-mono text-[11px]">{item.srNo}</td>
                  <td className="font-bold text-sky-400 text-[13px]">{item.constituency}</td>
                  <td className="text-slate-100 font-medium">{item.mpName}</td>
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
                    {item.variancePercentage > 0 ? (
                      <span className="text-amber-400 font-semibold">+{item.variancePercentage}%</span>
                    ) : item.variancePercentage < 0 ? (
                      <span className="text-slate-500">{item.variancePercentage}%</span>
                    ) : (
                      <span className="text-slate-400 font-normal">0.0%</span>
                    )}
                  </td>
                </tr>
              ))}
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
