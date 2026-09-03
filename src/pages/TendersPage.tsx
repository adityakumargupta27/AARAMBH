import { useState, useMemo } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Search, Filter, X, Download, ArrowLeft, FileText, Users, PenTool, AlertTriangle, Info } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { BidDistributionChart, ContractorParticipationChart } from '@/components/charts/Charts';
import { EmptyState } from '@/components/ui/State';

import { useToast } from '@/components/ui/Toast';
import { mockTenders, demoTender } from '@/data/mockData';
import { formatCurrency, formatCurrencyShort, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function TendersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    return mockTenders.filter((t) => {
      if (search && !t.id.toLowerCase().includes(search.toLowerCase()) && !t.projectName.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && t.tenderStatus !== statusFilter) return false;
      if (riskFilter && t.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [search, statusFilter, riskFilter]);

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader
        title="Tender Intelligence"
        subtitle="Analyze procurement opportunities, participation and award patterns."
        actions={<button className="btn-secondary" onClick={() => toast('info', 'Export started')}><Download className="w-4 h-4" /> Export</button>}
      />

      <Card>
        <CardBody className="p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tenders..." className="input pl-8" />
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
                <label className="label">Tender Status</label>
                <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                  <option value="awarded">Awarded</option>
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
          <EmptyState icon={<FileText className="w-8 h-8" />} title="No tenders found" description="Try adjusting your filters." />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="table-base table-row-hover">
              <thead>
                <tr>
                  <th>Tender ID</th>
                  <th>Project</th>
                  <th className="text-right">Tender Value</th>
                  <th className="text-center">Bidders</th>
                  <th>Closing Date</th>
                  <th>Winner</th>
                  <th className="text-right">Award Value</th>
                  <th>Risk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} onClick={() => navigate(`/tenders/${t.id}`)}>
                    <td className="font-medium text-sky-400">{t.id}</td>
                    <td className="max-w-[180px] truncate">{t.projectName}</td>
                    <td className="text-right tabular-nums">{formatCurrencyShort(t.tenderValue)}</td>
                    <td className="text-center tabular-nums">{t.bidderCount}</td>
                    <td className="text-[12px] text-slate-600">{formatDate(t.closingDate)}</td>
                    <td className="max-w-[140px] truncate">{t.winnerName}</td>
                    <td className="text-right tabular-nums">{formatCurrencyShort(t.winningBid)}</td>
                    <td><RiskBadge level={t.riskLevel} /></td>
                    <td><span className="text-[12px] capitalize text-slate-600">{t.tenderStatus}</span></td>
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

export function TenderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tender = mockTenders.find((t) => t.id === id) || demoTender;
  const bids = demoTender.bidders;

  const bidChartData = bids.map((b) => ({
    name: b.name.replace(/Pvt Ltd|Ltd|Contractors|Projects|Infra Solutions/g, '').trim(),
    amount: b.bidAmount,
    isWinner: b.status === 'winner',
  }));

  const spreadDiff = ((tender.bidSpread - tender.historicalMedianSpread) / tender.historicalMedianSpread * 100).toFixed(1);

  const navLinks = [
    { label: 'Open Project', path: `/projects/${tender.projectId}`, icon: FileText },
    { label: 'Open Winning Contractor', path: `/contractors/${tender.winnerId}`, icon: Users },
    { label: 'Open Contract', path: `/contracts/${tender.contractId}`, icon: PenTool },
    { label: 'Open Investigation', path: '/investigations/AR-2026-001024', icon: AlertTriangle },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title="Tender Detail"
        subtitle={`${tender.id} — ${tender.projectName}`}
        breadcrumbs={[{ label: 'Tenders', path: '/tenders' }, { label: tender.id }]}
        actions={<Link to="/tenders" className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Back</Link>}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Tender Value', value: formatCurrencyShort(tender.tenderValue) },
          { label: 'Bidders', value: tender.bidderCount },
          { label: 'Winning Bid', value: formatCurrencyShort(tender.winningBid) },
          { label: 'Bid Spread', value: `${tender.bidSpread}%` },
          { label: 'Hist. Median', value: `${tender.historicalMedianSpread}%` },
          { label: 'Risk Score', value: tender.riskScore },
        ].map((c) => (
          <Card key={c.label}>
            <CardBody className="p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{c.label}</div>
              <div className="text-[18px] font-bold text-white tabular-nums mt-1">{c.value}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Bid Table + Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Bid Table" subtitle="All bids ranked by amount" />
          <div className="overflow-x-auto scrollbar-thin">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Bidder</th>
                  <th className="text-right">Bid Amount</th>
                  <th className="text-right">Diff from Lowest</th>
                  <th className="text-center">Hist. Participation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((b) => (
                  <tr key={b.rank} className={cn(b.status === 'winner' && 'bg-navy-50/50')}>
                    <td className="font-semibold tabular-nums">{b.rank}</td>
                    <td className="font-medium">{b.name}</td>
                    <td className="text-right tabular-nums font-medium">{formatCurrency(b.bidAmount)}</td>
                    <td className="text-right tabular-nums text-slate-500">{b.differenceFromLowest === 0 ? '—' : `+${b.differenceFromLowest}%`}</td>
                    <td className="text-center tabular-nums">{b.historicalParticipation}</td>
                    <td>
                      {b.status === 'winner' ? (
                        <span className="badge badge-info">Winner</span>
                      ) : (
                        <span className="badge badge-neutral">Participated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Bid Distribution" subtitle="Visual comparison of bid amounts" />
          <CardBody>
            <BidDistributionChart data={bidChartData} />
            <div className="flex items-center gap-4 mt-2 text-[12px]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-navy-700" /> Winning Bid</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-steel-200" /> Other Bids</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Pattern Analysis */}
      <Card>
        <CardHeader title="Pattern Analysis" subtitle="Bid spread comparison against historical baseline" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-slate-800/40 border border-slate-700/30 rounded-md">
              <div className="text-[10px] text-slate-400 uppercase">Current Spread</div>
              <div className="text-[22px] font-bold text-white tabular-nums">{tender.bidSpread}%</div>
            </div>
            <div className="text-center p-3 bg-slate-800/40 border border-slate-700/30 rounded-md">
              <div className="text-[10px] text-slate-400 uppercase">Historical Median</div>
              <div className="text-[22px] font-bold text-white tabular-nums">{tender.historicalMedianSpread}%</div>
            </div>
            <div className="text-center p-3 bg-orange-500/10 border border-orange-500/25 rounded-md">
              <div className="text-[10px] text-orange-400 uppercase">Difference</div>
              <div className="text-[22px] font-bold text-orange-400 tabular-nums">{spreadDiff}%</div>
            </div>
            <div className="text-center p-3 bg-orange-500/10 border border-orange-500/25 rounded-md">
              <div className="text-[10px] text-orange-400 uppercase">Status</div>
              <div className="text-[14px] font-bold text-orange-400 mt-1">Review Recommended</div>
            </div>
          </div>
          <div className="p-4 bg-slate-800/40 border border-slate-700/30 rounded-md">
            <p className="text-[13px] text-slate-200">
              The current tender exhibits a narrower bid spread ({tender.bidSpread}%) than the historical comparison group ({tender.historicalMedianSpread}%). This may indicate competitive market conditions or warrants review of bidder relationships.
            </p>
          </div>
          <div className="flex items-start gap-2 mt-3 p-3 bg-amber-500/10 border border-amber-500/25 rounded-md">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-300">
              Bid-pattern anomalies do not establish collusion. Review tender documentation and bidder history.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Participation History Visualization (Prompt 05) */}
      <Card>
        <CardHeader
          title="Contractor Participation History"
          subtitle="Tender participation and award frequency across bidders in monitored region"
        />
        <CardBody>
          <ContractorParticipationChart
            data={bids.map((b) => ({
              name: b.name.replace(/Pvt Ltd|Ltd|Contractors|Projects|Infra Solutions/g, '').trim(),
              count: b.historicalParticipation,
              won: b.status === 'winner' ? Math.ceil(b.historicalParticipation * 0.45) : Math.floor(b.historicalParticipation * 0.15),
            }))}
          />
          <div className="flex items-center gap-4 mt-2 text-[12px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-600" /> Tenders Participated</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500" /> Tenders Won</span>
          </div>
        </CardBody>
      </Card>

      {/* Navigation */}

      <Card>
        <CardHeader title="Related Records" subtitle="Navigate to connected entities" />
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.label} to={link.path} className="flex items-center gap-2 p-3 rounded-md border border-slate-700/30 hover:border-navy-300 hover:bg-sky-500/10 transition-all group">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-sky-400" />
                  <span className="text-[12px] font-medium text-slate-600 group-hover:text-sky-300">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
