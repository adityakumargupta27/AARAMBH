import React, { useState } from 'react';
import { Printer, Download, Copy, Check, FileText, ShieldAlert, Scale, Building2, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface VigilanceReportModalProps {
  open: boolean;
  onClose: () => void;
  caseData?: {
    id: string;
    projectName: string;
    contractorName: string;
    state: string;
    constituency: string;
    riskScore: number;
    sanctionedAmount: number;
    awardValue: number;
    disbursedAmount: number;
    physicalProgress?: number;
  };
}

export function VigilanceReportModal({ open, onClose, caseData }: VigilanceReportModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const data = caseData
    ? {
        ...caseData,
        physicalProgress: caseData.physicalProgress ?? 68,
      }
    : {
        id: 'AR-2026-001024',
        projectName: 'Construction of Community Hall & Skill Center (MPLADS-1024)',
        contractorName: 'ABC Infrastructure Pvt Ltd',
        state: 'Maharashtra',
        constituency: 'Pune',
        riskScore: 82,
        sanctionedAmount: 5200000,
        awardValue: 4920000,
        disbursedAmount: 4270000,
        physicalProgress: 68,
      };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const reportText = `CONFIDENTIAL VIGILANCE AUDIT REPORT (FORM VIG-01)
Reference: CVC/MoSPI/MPLADS/2026/${data.id}
Date: 04 September 2026
Project: ${data.projectName}
Constituency: ${data.constituency}, ${data.state}
Executing Agency: ${data.contractorName}
Composite Risk Index: ${data.riskScore}/100 (HIGH PRIORITY REVIEW)

1. EXECUTIVE AUDIT SUMMARY:
During routine surveillance of MPLADS allocations across ${data.constituency}, automated algorithmic inspection flagged substantial statutory non-compliances in Tender T-9281. The initial sanctioned amount was ₹${(data.sanctionedAmount / 100000).toFixed(2)} Lakhs, awarded at ₹${(data.awardValue / 100000).toFixed(2)} Lakhs. Subsequent documentation reveals an unapproved agreement value escalation to ₹82.00 Lakhs (+66.7% over sanctioned baseline).

2. KEY FORENSIC FINDINGS:
• Civil Unit Rate: ₹12,000/unit (+45.5% over regional CPWD Schedule of Rates benchmark of ₹8,250/unit) without required Superintending Engineer variation sanction.
• Tender Cartelization: Bidding spread across 5 participants is restricted to 2.4% (against regional baseline median of 6.8%). MCA21 records reveal shared directorship (DIN: 08472911) between L1 winner and L2 bidder.
• Disbursement-Execution Divergence: Ground physical execution stands at ${data.physicalProgress}%, whereas financial disbursements have reached 86.8% (₹${(data.disbursedAmount / 100000).toFixed(2)} Lakhs), yielding an uncertified gap of +18.8%.

3. STATUTORY INFRACTIONS:
• Rule 173 of General Financial Rules (GFR) 2017: Violation of transparent competition and anti-cartelization principles.
• Rule 149 of GFR 2017: Payout released prior to electronic measurement book (MB) sign-off.
• Section 10CA of CPWD Works Manual: Unauthorized price escalation without documented rate analysis.
• Section 199A of CVC Vigilance Manual: Common registered corporate address and director syndication.

4. OPERATIVE DIRECTIONS & RECOMMENDED ACTION:
1. Immediate PFMS Escrow Hold: Freeze remaining ₹18.40 Lakhs pre-disbursement tranche.
2. Statutory Show-Cause Notice: Issue formal 7-day notice under GFR Rule 173.
3. Departmental Inquiry: Constitute Joint Inspection Committee comprising PWD Executive Engineer and District Vigilance Officer.

Signed:
Central Vigilance Inspection Cell
Ministry of Statistics and Programme Implementation (MoSPI)`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast('success', 'Report Copied', 'Official Vigilance Audit Memo copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const reportText = `GOVERNMENT OF INDIA\nCENTRAL VIGILANCE COMMISSION & MoSPI\nCONFIDENTIAL FORENSIC AUDIT MEMORANDUM\nRef: CVC/MoSPI/MPLADS/2026/${data.id}\n\nProject: ${data.projectName}\nContractor: ${data.contractorName}\nRisk Index: ${data.riskScore}/100\n\n[Full Official Inspection Dossier Exported Successfully]`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vigilance_Audit_Report_${data.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast('success', 'Report Downloaded', `Vigilance_Audit_Report_${data.id}.txt saved.`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Official Vigilance Inspection & Audit Report"
      subtitle={`Form VIG-01 • Case Reference: ${data.id}`}
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] text-slate-400">
            Official Document • Valid for Statutory Vigilance Review
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary flex items-center gap-1.5" onClick={handleCopy}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Memo'}</span>
            </button>
            <button className="btn-secondary flex items-center gap-1.5" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5" />
              <span>Print Memo</span>
            </button>
            <button className="btn-primary flex items-center gap-1.5" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Report</span>
            </button>
          </div>
        </div>
      }
    >
      {/* Report Content styled like an authentic Government of India Vigilance Inspection Memo */}
      <div className="space-y-6 text-slate-200 print:text-black print:bg-white p-2">
        {/* Government Letterhead Header */}
        <div className="text-center border-b border-slate-700/60 pb-4 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            Government of India • Ministry of Statistics and Programme Implementation (MoSPI)
          </div>
          <h2 className="text-[18px] font-bold tracking-tight text-white font-serif">
            CENTRAL VIGILANCE INSPECTION CELL
          </h2>
          <div className="text-[12px] text-slate-300 font-medium">
            Forensic Audit &amp; Procurement Vigilance Directorate
          </div>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1 font-mono">
            <span>MEMO NO: <strong>CVC/MoSPI/MPLADS/2026/{data.id}</strong></span>
            <span>•</span>
            <span>DATE OF INSPECTION: <strong>04 SEPTEMBER 2026</strong></span>
            <span>•</span>
            <span className="text-red-400 font-bold">CLASSIFICATION: CONFIDENTIAL</span>
          </div>
        </div>

        {/* Case Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Target Project</div>
            <div className="text-[12px] font-bold text-white truncate">{data.projectName}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Executing Contractor</div>
            <div className="text-[12px] font-bold text-white truncate">{data.contractorName}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Constituency / State</div>
            <div className="text-[12px] font-bold text-white">{data.constituency}, {data.state}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Risk Evaluation</div>
            <div className="text-[12px] font-bold text-red-400">{data.riskScore}/100 (HIGH PRIORITY)</div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-[13px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> 1. Executive Summary &amp; Background
          </h3>
          <p className="text-[13px] leading-relaxed text-slate-300 text-justify">
            Pursuant to risk indicators generated by the Central Procurement Intelligence Engine regarding MPLADS funding allocations in <strong>{data.constituency} ({data.state})</strong>, this audit inspection was conducted on Work Order <strong>WO-9281</strong> awarded to <strong>{data.contractorName}</strong>. The original sanctioned budget was established at <strong>₹{(data.sanctionedAmount / 100000).toFixed(2)} Lakhs</strong> with an awarded tender value of <strong>₹{(data.awardValue / 100000).toFixed(2)} Lakhs</strong>. Subsequent field verification and database reconciliation reveal multiple high-severity statutory and fiscal deviations requiring immediate administrative intervention.
          </p>
        </div>

        {/* 2. Core Factual Findings Table */}
        <div className="space-y-2.5">
          <h3 className="text-[13px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4" /> 2. Factual Matrix &amp; Comparative Evidence
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-700/60">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-2.5">Inspection Parameter</th>
                  <th className="p-2.5">Authorized Norm / Benchmark</th>
                  <th className="p-2.5">Observed Case Value</th>
                  <th className="p-2.5">Deviation</th>
                  <th className="p-2.5">Statutory Infraction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-2.5 font-medium text-white">Civil Construction Unit Rate</td>
                  <td className="p-2.5 text-slate-400">₹8,250 / unit (CPWD SoR)</td>
                  <td className="p-2.5 font-bold text-red-300">₹12,000 / unit</td>
                  <td className="p-2.5 text-red-400 font-bold">+45.5% Overrun</td>
                  <td className="p-2.5 text-amber-300">CPWD Manual Sec. 10CA</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-white">Tender L1–L5 Bid Spread</td>
                  <td className="p-2.5 text-slate-400">6.8% (Historical Median)</td>
                  <td className="p-2.5 font-bold text-amber-300">2.4% Spread</td>
                  <td className="p-2.5 text-amber-400 font-bold">-64.7% Deficit</td>
                  <td className="p-2.5 text-amber-300">Rule 173 GFR 2017</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-white">Physical vs Financial Progress</td>
                  <td className="p-2.5 text-slate-400">Milestone Parity (±5%)</td>
                  <td className="p-2.5 font-bold text-red-300">68% Phys. / 86.8% Fin.</td>
                  <td className="p-2.5 text-red-400 font-bold">+18.8% Disparity</td>
                  <td className="p-2.5 text-amber-300">Rule 149 GFR 2017</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-white">Contractual Value Escalation</td>
                  <td className="p-2.5 text-slate-400">₹49,20,000 (Tender Award)</td>
                  <td className="p-2.5 font-bold text-red-300">₹82,00,000 (Agreement)</td>
                  <td className="p-2.5 text-red-400 font-bold">+66.7% Over Award</td>
                  <td className="p-2.5 text-amber-300">GFR Rule 173 (ii)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-white">Corporate Bidder Linkages</td>
                  <td className="p-2.5 text-slate-400">Arm&apos;s Length Bidding</td>
                  <td className="p-2.5 font-bold text-amber-300">Shared DIN: 08472911</td>
                  <td className="p-2.5 text-amber-400 font-bold">L1–L2 Directorship Overlap</td>
                  <td className="p-2.5 text-amber-300">CVC Manual Sec. 199A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Detailed Forensic Assessment */}
        <div className="space-y-2">
          <h3 className="text-[13px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> 3. Forensic Evaluation &amp; Legal Standard Breaches
          </h3>
          <div className="space-y-2 text-[12px] text-slate-300 leading-relaxed">
            <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
              <strong className="text-white">A. Arbitrary Unit Price Inflation: </strong>
              The executing agency billed civil concrete works at ₹12,000 per unit, representing a 45.5% deviation above the regional CPWD Schedule of Rates (₹8,250). Under Section 10CA of the CPWD Works Manual, any rate variation in excess of 15% requires a detailed engineering rate analysis approved by the Superintending Engineer. No variation sanction exists in file records.
            </div>
            <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
              <strong className="text-white">B. Cartel Coordination &amp; Synthetic Bid Spread: </strong>
              Tender T-9281 demonstrates classical bid rotation characteristics. The spread among 5 participating bidders is confined to a tight 2.4% band. Cross-referencing Ministry of Corporate Affairs (MCA21) director registry confirms that Sri Rameshwar Rao (DIN: 08472911) sits on the board of both L1 winner (ABC Infrastructure) and L2 bidder (Kalyan Infratech), violating competitive neutrality under Rule 173 of GFR 2017.
            </div>
            <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
              <strong className="text-white">C. Pre-Mature Milestone Disbursement: </strong>
              Total funds released to date amount to ₹42.70 Lakhs (86.8% of award value), whereas physical measurement book (MB) records verify on-ground completion at only 68%. This leaves ₹18.40 Lakhs in public outlays unverified, in contravention of Rule 149 of GFR 2017.
            </div>
          </div>
        </div>

        {/* 4. Operative Recommendations */}
        <div className="space-y-2">
          <h3 className="text-[13px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> 4. Operative Directives &amp; Action Plan
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-[12px] text-slate-300 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <li>
              <strong className="text-white">PFMS Pre-Disbursement Lock: </strong>
              Immediately engage the Zero-Leakage Escrow Gate on the Public Financial Management System (PFMS) to withhold the remaining tranche of <strong>₹18,40,000</strong> until physical verification is completed.
            </li>
            <li>
              <strong className="text-white">Statutory Show-Cause Notice: </strong>
              Issue a formal 7-day Show-Cause Notice under Rule 173 of GFR 2017 calling upon ABC Infrastructure Pvt Ltd to justify the 45.5% unit rate inflation and clarify the common directorship with L2 bidders.
            </li>
            <li>
              <strong className="text-white">Joint Site Inspection: </strong>
              Direct the District Collector, Pune, to constitute a Joint Verification Committee comprising the Executive Engineer (PWD) and District Vigilance Officer to conduct physical re-measurement.
            </li>
          </ol>
        </div>

        {/* Sign-off Signature Block */}
        <div className="pt-6 border-t border-slate-700/60 flex items-end justify-between">
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <div>Authenticated &amp; Generated via: <strong>AARAMBHA Procurement Intelligence Platform</strong></div>
            <div>Central Public Procurement Portal (CPPP) &amp; MoSPI National Database Integration</div>
            <div>Digital Verification Hash: <span className="font-mono text-slate-300">0x8F92...B41E</span></div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-[12px] font-serif font-bold text-slate-200">
              [ Digitally Signed &amp; Approved ]
            </div>
            <div className="text-[13px] font-bold text-white">Chief Vigilance &amp; Audit Officer</div>
            <div className="text-[11px] text-slate-400">MoSPI Central Vigilance Inspection Wing</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
