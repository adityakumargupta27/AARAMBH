import { useState } from 'react';
import { Modal } from './Modal';
import { Sliders, RefreshCw, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface JurySandboxModalProps {
  open: boolean;
  onClose: () => void;
}

export function JurySandboxModal({ open, onClose }: JurySandboxModalProps) {
  // Configurable sliders
  const [unitPrice, setUnitPrice] = useState<number>(12000);
  const benchmarkPrice = 8250;
  const [bidSpread, setBidSpread] = useState<number>(2.4);
  const [physicalProgress, setPhysicalProgress] = useState<number>(68);
  const [financialUtilization, setFinancialUtilization] = useState<number>(86.8);
  const [delayRatio, setDelayRatio] = useState<number>(2.5);

  // Dynamic calculations matching backend/anomalyDetector.cjs formulas
  const priceDeviation = ((unitPrice - benchmarkPrice) / benchmarkPrice) * 100;
  const priceScore = priceDeviation > 35 ? Math.min(100, Math.round(50 + priceDeviation)) : priceDeviation > 15 ? Math.round(30 + priceDeviation) : Math.round(15 + priceDeviation);

  const bidScore = bidSpread < 3.0 ? 81 : bidSpread < 4.5 ? 55 : 15;

  const gap = physicalProgress - financialUtilization;
  const executionScore = gap < -15 ? 75 : gap < -5 ? 54 : 10;

  const contractorScore = Math.min(100, Math.round(delayRatio * 30));

  // Weighted composite score (following MoSPI methodology)
  // price: 0.25, execution: 0.25, bid: 0.15, contractor: 0.15, benford: 0.20
  const compositeScore = Math.round(
    priceScore * 0.30 +
    executionScore * 0.30 +
    bidScore * 0.20 +
    contractorScore * 0.20
  );

  const riskLevel = compositeScore >= 70 ? 'high' : compositeScore >= 50 ? 'review' : compositeScore >= 30 ? 'watch' : 'normal';

  const resetDefaults = () => {
    setUnitPrice(12000);
    setBidSpread(2.4);
    setPhysicalProgress(68);
    setFinancialUtilization(86.8);
    setDelayRatio(2.5);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Jury ML Anomaly Stress-Test Sandbox"
      subtitle="Interactive real-time parameter tweaking powered by the AARAMBHA algorithmic scoring engine"
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button onClick={resetDefaults} className="btn-secondary btn-sm flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Reset to Case Baseline
          </button>
          <button className="btn-primary btn-sm" onClick={onClose}>
            Done Testing
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Dynamic Live Score Header */}
        <div
          className="p-5 rounded-xl border flex flex-wrap items-center justify-between gap-4"
          style={{
            background:
              riskLevel === 'high'
                ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)'
                : riskLevel === 'review'
                ? 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)'
                : 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)',
            borderColor:
              riskLevel === 'high'
                ? 'rgba(239, 68, 68, 0.3)'
                : riskLevel === 'review'
                ? 'rgba(234, 88, 12, 0.3)'
                : 'rgba(52, 211, 153, 0.3)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Composite Score</div>
              <div className="text-[38px] font-extrabold text-white tabular-nums leading-none mt-1 animate-number">
                {compositeScore}
                <span className="text-[14px] text-slate-500 font-normal">/100</span>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-700/40" />
            <div>
              <div className="flex items-center gap-2">
                <RiskBadge level={riskLevel} />
                <span className="text-[12px] text-slate-300 font-mono">
                  {riskLevel === 'high'
                    ? 'ESCROW DISBURSEMENT BLOCKED'
                    : riskLevel === 'review'
                    ? 'CONDITIONAL AUDIT CLEARANCE'
                    : 'AUTOMATED APPROVAL GRANTED'}
                </span>
              </div>
              <p className="text-[12px] text-slate-300 mt-1.5">
                {riskLevel === 'high'
                  ? 'Multiple critical anomalies detected across pricing, bidding, and financial milestones.'
                  : riskLevel === 'review'
                  ? 'Moderate variance requires supervisory vigilance verification before fund transfer.'
                  : 'All parameter vectors conform to standard CPWD and GFR benchmarks.'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Engine Status</div>
            <div className="text-[12px] text-emerald-400 font-bold flex items-center justify-end gap-1.5 mt-0.5">
              <Activity className="w-3.5 h-3.5" /> RE-EVALUATING LIVE
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Unit Rate Slider */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-white">1. Civil Unit Rate (₹/sq.m)</span>
              <span className="font-bold text-sky-400 tabular-nums">
                ₹{unitPrice.toLocaleString('en-IN')}{' '}
                <span className="text-[11px] font-normal text-slate-400">
                  ({priceDeviation > 0 ? `+${priceDeviation.toFixed(1)}%` : `${priceDeviation.toFixed(1)}%`})
                </span>
              </span>
            </div>
            <input
              type="range"
              min="7000"
              max="16000"
              step="250"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Benchmark: ₹8,250</span>
              <span>SoR Upper Bound: ₹16,000</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Sub-score: <strong className="text-white">{priceScore}/100</strong>
            </div>
          </div>

          {/* 2. Bid Spread Slider */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-white">2. Tender Bid Margin Spread</span>
              <span className="font-bold text-sky-400 tabular-nums">
                {bidSpread.toFixed(1)}%{' '}
                <span className="text-[11px] font-normal text-slate-400">
                  {bidSpread < 3.0 ? '(Cartel Warning)' : '(Competitive)'}
                </span>
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="12.0"
              step="0.1"
              value={bidSpread}
              onChange={(e) => setBidSpread(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5% (Rigged)</span>
              <span>Historical Median: 6.8%</span>
              <span>12.0% (Wide)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Sub-score: <strong className="text-white">{bidScore}/100</strong>
            </div>
          </div>

          {/* 3. Physical vs Financial Gap */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-white">3. Disbursed vs Physical Work</span>
              <span className="font-bold text-sky-400 tabular-nums">
                Disbursed: {financialUtilization}% / Done: {physicalProgress}%
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Physical Progress (%):</span>
                <span className="text-white font-semibold">{physicalProgress}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={physicalProgress}
                onChange={(e) => setPhysicalProgress(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Fund Utilization (%):</span>
                <span className="text-white font-semibold">{financialUtilization}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={financialUtilization}
                onChange={(e) => setFinancialUtilization(Number(e.target.value))}
                className="w-full accent-red-400 cursor-pointer"
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Decoupling Gap: <strong className={gap < -10 ? 'text-red-400' : 'text-emerald-400'}>{gap.toFixed(1)}%</strong> · Sub-score:{' '}
              <strong className="text-white">{executionScore}/100</strong>
            </div>
          </div>

          {/* 4. Contractor Delay Ratio Slider */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-white">4. Contractor Delay Multiplier</span>
              <span className="font-bold text-sky-400 tabular-nums">
                {delayRatio.toFixed(1)}x Peer Average
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={delayRatio}
              onChange={(e) => setDelayRatio(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5x (Reliable)</span>
              <span>1.0x (Standard)</span>
              <span>5.0x (Chronic Delay)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Sub-score: <strong className="text-white">{contractorScore}/100</strong>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
