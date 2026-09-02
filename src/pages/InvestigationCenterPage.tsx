import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpRight, UserPlus, Eye, AlertTriangle, CheckCircle2, Clock, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { mockInvestigationCases } from '@/data/mockData';
import { formatCurrencyShort, formatDate, signalLabel, caseStatusLabel } from '@/utils/format';
import type { InvestigationCase, CaseStatus } from '@/types';
import { cn } from '@/utils/cn';

const tabs: { key: CaseStatus | 'all'; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'under-review', label: 'Under Review' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'resolved', label: 'Resolved' },
];

export default function InvestigationCenterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CaseStatus | 'all'>('open');
  const [search, setSearch] = useState('');
  const [cases, setCases] = useState(mockInvestigationCases);
  const [previewCase, setPreviewCase] = useState<InvestigationCase | null>(null);
  const [statusModal, setStatusModal] = useState<InvestigationCase | null>(null);

  const summary = {
    open: cases.filter((c) => c.status === 'open').length,
    underReview: cases.filter((c) => c.status === 'under-review').length,
    escalated: cases.filter((c) => c.status === 'escalated').length,
    resolved: cases.filter((c) => c.status === 'resolved').length,
  };

  const filtered = useMemo(() => {
    return cases
      .filter((c) => c.status === activeTab)
      .filter((c) => {
        if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.projectName.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [cases, activeTab, search]);

  const updateStatus = (caseId: string, newStatus: CaseStatus) => {
    setCases(cases.map((c) => c.id === caseId ? { ...c, status: newStatus } : c));
    toast('success', 'Status updated', `Case ${caseId} moved to ${caseStatusLabel(newStatus)}.`);
    setStatusModal(null);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Investigation Center" subtitle="Review evidence-backed procurement anomalies." />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Open Cases', value: summary.open, icon: Clock, color: 'text-navy-600' },
          { label: 'Under Review', value: summary.underReview, icon: Eye, color: 'text-amber-600' },
          { label: 'Escalated', value: summary.escalated, icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Resolved', value: summary.resolved, icon: CheckCircle2, color: 'text-emerald-600' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardBody className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{s.label}</div>
                    <div className={cn('text-[22px] font-bold tabular-nums mt-1', s.color)}>{s.value}</div>
                  </div>
                  <Icon className={cn('w-6 h-6', s.color, 'opacity-30')} />
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.key
                ? 'text-navy-800 border-navy-700'
                : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
            )}
          >
            {tab.label}
            <span className={cn(
              'ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
              activeTab === tab.key ? 'bg-navy-100 text-navy-700' : 'bg-slate-100 text-slate-500'
            )}>
              {cases.filter((c) => c.status === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cases..." className="input pl-8" />
        </div>
      </div>

      {/* Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <Card className="md:col-span-2">
            <CardBody>
              <div className="text-center py-8 text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-[13px]">No cases in this category.</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          filtered.map((c) => (
            <Card key={c.id} hover onClick={() => setPreviewCase(c)}>
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-800 text-[14px]">{c.id}</span>
                    <RiskBadge level={c.riskLevel} />
                  </div>
                  <div className="text-right">
                    <div className="text-[20px] font-bold text-red-600 tabular-nums">{c.riskScore}</div>
                    <div className="text-[10px] text-slate-400">/ 100</div>
                  </div>
                </div>

                <div className="text-[14px] font-medium text-slate-900 mb-1">{c.projectName}</div>
                <div className="text-[12px] text-slate-500">{c.contractorName} · {c.state}</div>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="badge badge-risk-high">{signalLabel(c.primarySignal)}</span>
                  {c.secondarySignals.slice(0, 2).map((s) => (
                    <span key={s} className="badge badge-neutral">{signalLabel(s)}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 text-[11px] text-slate-400">
                  <span>Detected: {formatDate(c.detectedDate)}</span>
                  <span>Reviewer: {c.assignedReviewer}</span>
                  <span>{c.evidenceCount} evidence records</span>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Preview Drawer */}
      <Drawer
        open={!!previewCase}
        onClose={() => setPreviewCase(null)}
        title={previewCase?.id}
        subtitle={previewCase?.projectName}
        footer={
          <>
            {previewCase && previewCase.status === 'open' && (
              <button className="btn-secondary" onClick={() => setStatusModal(previewCase)}>
                <Eye className="w-4 h-4" /> Mark Under Review
              </button>
            )}
            <button className="btn-primary" onClick={() => previewCase && navigate(`/investigations/${previewCase.id}`)}>
              <ArrowUpRight className="w-4 h-4" /> Investigate
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
                <div className="text-[13px] font-medium">{previewCase.contractorName}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-[10px] text-slate-400 uppercase">State</div>
                <div className="text-[13px] font-medium">{previewCase.state}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-[10px] text-slate-400 uppercase">Case Value</div>
                <div className="text-[13px] font-medium">{formatCurrencyShort(previewCase.caseValue)}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-[10px] text-slate-400 uppercase">Evidence</div>
                <div className="text-[13px] font-medium">{previewCase.evidenceCount} records</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-[10px] text-slate-400 uppercase">Detected</div>
                <div className="text-[13px] font-medium">{formatDate(previewCase.detectedDate)}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-[10px] text-slate-400 uppercase">Reviewer</div>
                <div className="text-[13px] font-medium">{previewCase.assignedReviewer}</div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Risk Signals</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[12px] font-medium">{signalLabel(previewCase.primarySignal)}</span>
                </div>
                {previewCase.secondarySignals.map((s) => (
                  <div key={s} className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="text-[12px]">{signalLabel(s)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Status Confirmation Modal */}
      <Modal
        open={!!statusModal}
        onClose={() => setStatusModal(null)}
        title="Confirm Status Change"
        size="sm"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setStatusModal(null)}>Cancel</button>
            <button className="btn-primary" onClick={() => statusModal && updateStatus(statusModal.id, 'under-review')}>
              Confirm
            </button>
          </>
        }
      >
        <p className="text-[13px] text-slate-600">
          Move case <span className="font-semibold text-slate-900">{statusModal?.id}</span> to "Under Review"?
          This will update the case status and notify assigned reviewers.
        </p>
      </Modal>
    </div>
  );
}
