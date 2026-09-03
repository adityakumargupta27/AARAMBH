import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileBarChart, Download, Printer, Save, FileText, ChevronRight, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { demoReports, demoInvestigationCase, demoRiskAssessment, demoContractor, demoTender, demoProject } from '@/data/mockData';
import { formatCurrency, formatCurrencyShort, formatDate, signalLabel } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader
        title="Reports & Intelligence"
        subtitle="Generate and view procurement intelligence reports."
        actions={
          <button className="btn-primary" onClick={() => setBriefOpen(true)}>
            <FileText className="w-4 h-4" /> Investigation Brief
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoReports.map((report) => (
          <Card key={report.id} hover>
            <CardBody>
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-md bg-sky-500/10 flex items-center justify-center">
                  <FileBarChart className="w-5 h-5 text-sky-400" />
                </div>
                <span className={cn(
                  'badge text-[9px]',
                  report.status === 'ready' && 'badge-risk-normal',
                  report.status === 'generating' && 'badge-risk-watch',
                  report.status === 'scheduled' && 'badge-info',
                )}>{report.status}</span>
              </div>
              <div className="text-[14px] font-semibold text-white">{report.title}</div>
              <p className="text-[12px] text-slate-500 mt-1 leading-snug">{report.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/40">
                <span className="text-[11px] text-slate-400">{formatDate(report.date)}</span>
                <button
                  className="text-[12px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                  onClick={() => toast(report.status === 'ready' ? 'success' : 'info', report.status === 'ready' ? 'Report opened' : 'Report generating', report.title)}
                >
                  {report.status === 'ready' ? 'Open' : 'Generating...'} <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Investigation Brief Modal */}
      <Modal
        open={briefOpen}
        onClose={() => setBriefOpen(false)}
        title="Investigation Brief"
        subtitle={`Case ${demoInvestigationCase.id}`}
        size="xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => toast('info', 'Saved', 'Case saved to reports.')}>
              <Save className="w-4 h-4" /> Save Case
            </button>
            <button className="btn-secondary" onClick={() => toast('info', 'Printing', 'Opening print dialog.')}>
              <Printer className="w-4 h-4" /> Print
            </button>
            <button className="btn-primary" onClick={() => toast('success', 'Downloaded', 'Investigation brief downloaded.')}>
              <Download className="w-4 h-4" /> Download
            </button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Brief Header */}
          <div className="text-center pb-4 border-b border-slate-700/30">
            <div className="text-[18px] font-bold text-white tracking-tight">AARAMBHA</div>
            <div className="text-[12px] text-slate-400 mt-0.5">Central Procurement Vigilance Brief</div>
            <div className="flex items-center justify-center gap-4 mt-3 text-[12px] text-slate-300">
              <span>Case: <strong className="text-white">{demoInvestigationCase.id}</strong></span>
              <span>Risk: <strong className="text-red-400">{demoInvestigationCase.riskScore}/100</strong></span>
              <span>Date: {formatDate('2026-09-02')}</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-1.5">Executive Summary</h4>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              Case {demoInvestigationCase.id} concerns the {demoProject.name} ({demoProject.id}) in {demoProject.state}. The project was awarded to {demoContractor.name} at {formatCurrencyShort(demoProject.awardValue)}. The risk engine generated a composite score of {demoInvestigationCase.riskScore}/100 based on {demoInvestigationCase.evidenceCount} evidence records across {demoRiskAssessment.signals.length} signal categories.
            </p>
          </div>

          {/* Risk Signals */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-2">Risk Signals</h4>
            <div className="space-y-1.5">
              {demoRiskAssessment.signals.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded text-[12px] border border-slate-800" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
                  <span className="font-medium text-slate-200">{s.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{s.finding}</span>
                    <span className="font-bold tabular-nums text-white">{s.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Summary */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-2">Evidence Summary</h4>
            <div className="grid grid-cols-3 gap-2 text-[12px]">
              <div className="p-2 rounded border border-slate-800" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
                <div className="text-[10px] text-slate-400 uppercase">Price Deviation</div>
                <div className="font-bold text-orange-400">+45.5%</div>
              </div>
              <div className="p-2 rounded border border-slate-800" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
                <div className="text-[10px] text-slate-400 uppercase">Bid Spread</div>
                <div className="font-bold text-orange-400">2.4% vs 6.8%</div>
              </div>
              <div className="p-2 rounded border border-slate-800" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
                <div className="text-[10px] text-slate-400 uppercase">Delay Rate</div>
                <div className="font-bold text-orange-400">23.8% vs 9.4%</div>
              </div>
            </div>
          </div>

          {/* Contractor History */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-2">Contractor History</h4>
            <p className="text-[12px] text-slate-300">
              {demoContractor.name} has {demoContractor.previousContracts} previous contracts ({demoContractor.completed} completed, {demoContractor.delayed} delayed, {demoContractor.cancelled} cancelled). Delay rate: {demoContractor.delayRate}% vs peer average {demoContractor.peerDelayRate}%.
            </p>
          </div>

          {/* Bid Analysis */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-2">Bid Analysis</h4>
            <p className="text-[12px] text-slate-600">
              Tender {demoTender.id} received {demoTender.bidderCount} bids. Winning bid: {formatCurrencyShort(demoTender.winningBid)}. Bid spread of {demoTender.bidSpread}% is 64.7% narrower than historical median of {demoTender.historicalMedianSpread}%.
            </p>
          </div>

          {/* Financial Analysis */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-2">Financial Analysis</h4>
            <p className="text-[12px] text-slate-600">
              Contract value: {formatCurrencyShort(demoProject.awardValue)}. Expenditure: {formatCurrencyShort(demoProject.expenditure)} ({((demoProject.expenditure / demoProject.awardValue) * 100).toFixed(1)}% utilization). Physical progress: {demoProject.physicalProgress}%. Financial utilization is ahead of physical progress by 18.8 percentage points.
            </p>
          </div>

          {/* Recommended Verification */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-2">Recommended Verification</h4>
            <ol className="list-decimal list-inside space-y-1 text-[12px] text-slate-600">
              <li>Verify BOQ specification and unit rate justification.</li>
              <li>Compare local market pricing for similar construction.</li>
              <li>Review bid evaluation record and bidder eligibility.</li>
              <li>Review contractor performance records from past contracts.</li>
              <li>Verify payment and expenditure records against physical progress.</li>
              <li>Check relevant supporting documents.</li>
            </ol>
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-slate-800/40 border border-slate-700/30 rounded text-[11px] text-slate-400 italic">
            Risk indicators are analytical signals intended for review and do not independently establish fraud, corruption or criminal liability.
          </div>
        </div>
      </Modal>
    </div>
  );
}
