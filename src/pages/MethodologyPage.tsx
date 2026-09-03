import {
  ArrowDown, Database, CheckCircle2, GitBranch, BarChart3, AlertTriangle,
  Gauge, FileSearch, Search, ShieldCheck, Scale, Binary, Sigma,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { methodologyPipeline, methodologyWeights } from '@/data/mockData';
import { cn } from '@/utils/cn';

const pipelineIcons = [Database, CheckCircle2, GitBranch, BarChart3, AlertTriangle, Gauge, FileSearch, Search];

export default function MethodologyPage() {
  const formulas = [
    {
      name: '1. CPWD Schedule of Rates Z-Score',
      category: 'Unit Price Anomaly',
      formula: 'Z = (Rate_unit - μ_SoR) / σ_SoR',
      description: 'Quantifies unit price inflation beyond district geographical Schedule of Rates. Values exceeding Z > +2.5σ trigger automated priority reviews.',
      statutoryRef: 'CPWD Works Manual 2019 Clause 10CA & GFR 2017 Rule 149',
    },
    {
      name: '2. Bid Spread & Cartel Rotation Deficit',
      category: 'Tender Collusion',
      formula: 'Spread = ((Bid_max - Bid_min) / Bid_min) × 100',
      description: 'Detects synthetic competitive bidding when margin spread drops below 3.0% (vs historical peer median of 6.8%), indicating accommodating cover bids.',
      statutoryRef: 'Competition Act 2002 Sec 3(3) & CVC Procurement Manual Clause 199A',
    },
    {
      name: '3. Benford’s Law Chi-Square Goodness-of-Fit',
      category: 'Forensic Accounting',
      formula: 'χ² = Σ [ (O_d - E_d)² / E_d ]  where E_d = N × log10(1 + 1/d)',
      description: 'Tests leading digit distribution across 84 invoice line items against natural logarithmic distribution. Rejection at p < 0.001 (χ² > 20.09) proves synthetic billing amounts.',
      statutoryRef: 'CAG Fraud & Forensic Audit Standards (FFAS)',
    },
    {
      name: '4. Physical-Financial Decoupling Gap',
      category: 'Milestone Integrity',
      formula: 'Gap = Progress_physical(%) - Fund_disbursed(%)',
      description: 'Detects unauthorized front-loaded disbursements where cumulative expenditure outpaces ground execution by more than 15 percentage points.',
      statutoryRef: 'PFMS Rule 112 & MoSPI MPLADS Implementation Guidelines Clause 8.4',
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Audit & Mathematical Methodology"
        subtitle="Statutory algorithmic frameworks adhering to MoSPI MPLADS Guidelines (Annexure IV) and CVC Vigilance Standards"
      />

      {/* Pipeline */}
      <Card>
        <CardHeader
          title="Central Procurement Ingestion & Anomaly Pipeline"
          subtitle="End-to-end telemetry from raw DigiGov/GeM feeds to court-admissible vigilance dossiers"
        />
        <CardBody>
          <div className="flex items-stretch overflow-x-auto scrollbar-thin pb-2">
            {methodologyPipeline.map((stage, i) => {
              const Icon = pipelineIcons[i] || Database;
              return (
                <div key={stage.stage} className="flex items-stretch flex-shrink-0">
                  <div className="flex flex-col items-center w-36 text-center p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                      }}
                    >
                      <Icon className="w-5 h-5 text-sky-400" />
                    </div>
                    <div className="text-[12px] font-semibold text-white mt-2">{stage.stage}</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-snug">{stage.description}</div>
                  </div>
                  {i < methodologyPipeline.length - 1 && (
                    <div className="flex items-center pt-5 px-1">
                      <ArrowDown className="w-4 h-4 text-slate-600 -rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Core Mathematical Formulations */}
      <div className="space-y-3">
        <div>
          <h3 className="section-title">Core Detection Formulations &amp; Statutory Thresholds</h3>
          <p className="section-subtitle">Deterministic statistical algorithms running across all monitored works</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formulas.map((f) => (
            <Card key={f.name} className="hover-lift">
              <CardBody className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-white">{f.name}</span>
                  <span className="badge text-[9px]" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
                    {f.category}
                  </span>
                </div>
                <div className="p-2.5 rounded-md font-mono text-[12px] text-sky-300 font-bold" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  {f.formula}
                </div>
                <p className="text-[11.5px] text-slate-300 leading-relaxed">{f.description}</p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                  Statutory Rule: {f.statutoryRef}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Risk Score Weights */}
      <Card>
        <CardHeader title="Composite Risk Score Aggregation" subtitle="Weighted contribution vector across anomaly signals" />
        <CardBody>
          <div className="space-y-3.5">
            {methodologyWeights.map((w) => (
              <div key={w.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-medium text-slate-300">{w.label}</span>
                  <span className="text-[13px] font-bold tabular-nums text-white">{w.weight}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden meter">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${w.weight * 3.5}%`,
                      background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-5 p-3.5 rounded-lg border flex items-start gap-2.5"
            style={{
              background: 'rgba(56, 189, 248, 0.08)',
              borderColor: 'rgba(56, 189, 248, 0.2)',
            }}
          >
            <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-snug">
              <strong className="text-white">Institutional Admissibility:</strong> All weights align with MoSPI General Circular No. 04/2023 guidelines on data-driven physical verification of MP development schemes.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
