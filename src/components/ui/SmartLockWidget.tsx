import { useState } from 'react';
import { ShieldAlert, Lock, CheckCircle2, XCircle, AlertTriangle, FileText, Share2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardBody } from './Card';

interface SmartLockWidgetProps {
  onOpenNoticeModal: () => void;
  onOpenSyndicateModal: () => void;
}

export function SmartLockWidget({ onOpenNoticeModal, onOpenSyndicateModal }: SmartLockWidgetProps) {
  const [overrideNotice, setOverrideNotice] = useState(false);

  const gates = [
    {
      id: 'GATE-01',
      name: 'Physical Ground Truth & Geo-Tag Inspection',
      status: 'FAIL',
      severity: 'CRITICAL',
      finding: 'GPS EXIF Mismatch: Site completion photo geotagged 18.4 km outside sanction polygon.',
      authority: 'MoSPI MPLADS Inspection Rule 8.4',
    },
    {
      id: 'GATE-02',
      name: 'Contractor Syndicate & Common Board Check',
      status: 'FAIL',
      severity: 'HIGH',
      finding: 'Common Board Member (DIN: 08472911) detected between L1 winner and L2 cover bidder.',
      authority: 'CVC Procurement Manual Section 199A',
    },
    {
      id: 'GATE-03',
      name: 'Measurement Book (MB) Benford Forensic Test',
      status: 'FAIL',
      severity: 'HIGH',
      finding: 'First-digit Chi-Square test (χ² = 223.3) indicates fabricated billing line-items.',
      authority: 'CAG Fraud & Forensic Audit Standards',
    },
    {
      id: 'GATE-04',
      name: 'Agreement Ceiling vs Sanction Reconciliation',
      status: 'FAIL',
      severity: 'CRITICAL',
      finding: 'Agreement Value ₹82,00,000 exceeds District Sanction Limit of ₹49,20,000 (+66.7%).',
      authority: 'GFR 2017 Rule 149 & Rule 173',
    },
  ];

  return (
    <Card className="border-l-4 border-l-red-500 overflow-hidden" glow="red">
      <div
        className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.14) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderBottom: '1px solid rgba(220, 38, 38, 0.2)',
        }}
      >
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
              boxShadow: '0 0 25px -4px rgba(239, 68, 68, 0.5)',
            }}
          >
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-bold text-white tracking-tight">
                PFMS Pre-Disbursement Smart Lock Engaged
              </span>
              <span className="badge badge-risk-high text-[10px]">
                AUTOMATIC ESCROW HOLD
              </span>
            </div>
            <p className="text-[12px] text-slate-300 mt-1">
              Statutory Authority: <strong className="text-white">PFMS Rule 112 &amp; GFR 2017 Clause 21</strong> · Next Tranche Disbursal Blocked
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-red-400">
            Funds Safeguarded From Leakage
          </div>
          <div className="text-[22px] font-bold text-white tabular-nums animate-number">
            ₹18,40,000
          </div>
          <div className="text-[11px] text-slate-400">Tranche 3 of 4 (Electronic FTO #MH2026-9921)</div>
        </div>
      </div>

      <CardBody className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
            4-Gate Automated Pre-Disbursement Verification Status
          </h4>
          <span className="text-[11px] text-red-400 font-medium">
            4 of 4 Institutional Gates Failed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gates.map((gate) => (
            <div
              key={gate.id}
              className="p-3 rounded-lg border flex items-start gap-2.5 transition-all hover-lift"
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderColor: 'rgba(239, 68, 68, 0.25)',
              }}
            >
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px] mb-0.5">
                  <span className="font-semibold text-white truncate">{gate.name}</span>
                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-wide">{gate.severity}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{gate.finding}</p>
                <div className="text-[9px] text-slate-500 mt-1.5 font-mono">{gate.authority}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Toolbar */}
        <div
          className="mt-4 pt-3.5 flex flex-wrap items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}
        >
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Fund transfer will remain suspended until statutory inquiry clearance.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSyndicateModal}
              className="btn-secondary btn-sm flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              Cross-Constituency Cartel Matrix
            </button>
            <button
              onClick={onOpenNoticeModal}
              className="btn-primary btn-sm flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Generate GFR 2017 Show-Cause Notice
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
