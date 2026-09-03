import { useState } from 'react';
import { Modal } from './Modal';
import { Share2, Users, Building2, Landmark, AlertTriangle, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CollusionNetworkModalProps {
  open: boolean;
  onClose: () => void;
}

export function CollusionNetworkModal({ open, onClose }: CollusionNetworkModalProps) {
  const [selectedEntity, setSelectedEntity] = useState<'director' | 'abc' | 'kaveri' | 'apex'>('director');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Inter-District Cartel & Collusion Network Matrix"
      subtitle="Cross-Constituency Bid Rotation & Common Director Correlation Engine"
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-slate-400">
            Source: MCA21 Ministry of Corporate Affairs + Central e-Procurement Ingestion
          </span>
          <button className="btn-secondary btn-sm" onClick={onClose}>
            Close Inspection
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Top Summary Header */}
        <div
          className="p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
            borderColor: 'rgba(234, 88, 12, 0.25)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
                boxShadow: '0 0 20px -4px rgba(234, 88, 12, 0.5)',
              }}
            >
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-white">
                Western Maharashtra MPLADS Civil Works Syndicate
              </div>
              <div className="text-[11px] text-slate-300">
                Coordinated bid rotation across <strong className="text-white">Pune, Shirur &amp; Baramati</strong> Lok Sabha seats.
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="badge badge-risk-high text-[11px]">
              CARTEL CONFIDENCE: 94%
            </span>
            <div className="text-[10px] text-slate-400 mt-1">4 Tenders Rigged · Aggregate Value: ₹14.8 Cr</div>
          </div>
        </div>

        {/* Visual Node-Link Diagram (SVG & Grid Representation) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Interactive Entities */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Syndicate Nodes (Click to Inspect)
            </div>

            <button
              onClick={() => setSelectedEntity('director')}
              className={cn(
                'w-full p-3 rounded-lg border text-left transition-all',
                selectedEntity === 'director'
                  ? 'border-sky-400 bg-sky-500/15 shadow-glow'
                  : 'border-slate-700/30 bg-slate-900/50 hover:bg-slate-800/40'
              )}
            >
              <div className="flex items-center gap-2 text-sky-400 text-[12px] font-bold">
                <Users className="w-4 h-4" />
                <span>Rameshwar Rao (DIN: 08472911)</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Common Board Member in both L1 and L2 entities
              </div>
              <span className="badge badge-risk-high text-[9px] mt-2">NEXUS HUB</span>
            </button>

            <button
              onClick={() => setSelectedEntity('abc')}
              className={cn(
                'w-full p-3 rounded-lg border text-left transition-all',
                selectedEntity === 'abc'
                  ? 'border-sky-400 bg-sky-500/15 shadow-glow'
                  : 'border-slate-700/30 bg-slate-900/50 hover:bg-slate-800/40'
              )}
            >
              <div className="flex items-center gap-2 text-white text-[12px] font-bold">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>ABC Infrastructure Ltd.</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                L1 Winner in Pune (₹4.92 Cr) · Cover bidder in Shirur
              </div>
            </button>

            <button
              onClick={() => setSelectedEntity('kaveri')}
              className={cn(
                'w-full p-3 rounded-lg border text-left transition-all',
                selectedEntity === 'kaveri'
                  ? 'border-sky-400 bg-sky-500/15 shadow-glow'
                  : 'border-slate-700/30 bg-slate-900/50 hover:bg-slate-800/40'
              )}
            >
              <div className="flex items-center gap-2 text-white text-[12px] font-bold">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Kaveri Civil Engg Pvt. Ltd.</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                L1 Winner in Shirur (₹5.18 Cr) · Cover bidder in Pune
              </div>
            </button>
          </div>

          {/* Right Two Columns: Evidence Dossier for Selected Node */}
          <div className="lg:col-span-2 rounded-xl border p-4" style={{ background: 'rgba(15, 23, 42, 0.7)', borderColor: 'rgba(148, 163, 184, 0.12)' }}>
            <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Forensic Evidence Trail</span>
              <span className="text-sky-400 font-mono text-[11px]">MCA21 Verification Match</span>
            </div>

            {selectedEntity === 'director' && (
              <div className="space-y-3 animate-fade-in text-[12.5px]">
                <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
                  <div className="font-bold text-sky-300 text-[13px]">
                    Directorship Overlap Detected (DIN: 08472911)
                  </div>
                  <p className="text-slate-300 text-[12px] mt-1">
                    Corporate filings with Registrar of Companies (RoC Pune) confirm Sri Rameshwar Rao holds{' '}
                    <strong>40.0% paid-up equity</strong> in ABC Infrastructure Ltd. while simultaneously acting as{' '}
                    <strong>Designated Partner with 35.0% profit-share</strong> in Kaveri Civil Engg.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded bg-slate-800/40 border border-slate-700/20">
                    <div className="text-[10px] text-slate-400 uppercase">Shared Operating Address</div>
                    <div className="text-[12px] font-semibold text-white mt-0.5">
                      Plot 42, MIDC Bhosari, Pune - 411026
                    </div>
                    <div className="text-[10px] text-red-400 mt-1">Both entities registered at exact same premises</div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-800/40 border border-slate-700/20">
                    <div className="text-[10px] text-slate-400 uppercase">Shared Authorized Signatory Phone</div>
                    <div className="text-[12px] font-semibold text-white mt-0.5 font-mono">
                      +91 98230 XXXXX
                    </div>
                    <div className="text-[10px] text-red-400 mt-1">Same OTP contact used for e-Tender portal logins</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 mt-3">
                  <div className="font-bold text-amber-400 text-[12px]">
                    Constitutional Violation: Competition Act 2002 Section 3(3)
                  </div>
                  <p className="text-[11.5px] text-slate-300 mt-0.5">
                    Submitting bids by companies having common directors or cross-shareholding without declaring joint venture constitutes illegal bid rigging and cover bidding.
                  </p>
                </div>
              </div>
            )}

            {selectedEntity === 'abc' && (
              <div className="space-y-3 animate-fade-in text-[12.5px]">
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                  <div className="font-bold text-white text-[13px]">ABC Infrastructure Ltd. Performance Footprint</div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-[11px]">
                    <div>
                      <span className="text-slate-400">Total Bids:</span> <strong className="text-white">18</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Awards Won:</span> <strong className="text-emerald-400">12 (67%)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Co-Bidder in 8:</span> <strong className="text-amber-400">Kaveri Civil</strong>
                    </div>
                  </div>
                </div>
                <div className="text-[12px] text-slate-300 leading-relaxed">
                  In Pune Constituency (T-9281), ABC Infra bid ₹49,20,000 to win L1, while Kaveri Civil bid ₹49,80,000 (just 1.2% higher) to ensure synthetic quorum without competition.
                </div>
              </div>
            )}

            {selectedEntity === 'kaveri' && (
              <div className="space-y-3 animate-fade-in text-[12.5px]">
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                  <div className="font-bold text-white text-[13px]">Kaveri Civil Engg Reciprocal Payout</div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-[11px]">
                    <div>
                      <span className="text-slate-400">Total Bids:</span> <strong className="text-white">15</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Awards Won:</span> <strong className="text-emerald-400">11 (73%)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Co-Bidder in 8:</span> <strong className="text-amber-400">ABC Infra</strong>
                    </div>
                  </div>
                </div>
                <div className="text-[12px] text-slate-300 leading-relaxed">
                  In Shirur Constituency (T-9104, 35 km away), roles reversed: Kaveri Civil bid ₹51,80,000 to win, while ABC Infra submitted a deliberate cover bid of ₹52,40,000 (+1.1%).
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
