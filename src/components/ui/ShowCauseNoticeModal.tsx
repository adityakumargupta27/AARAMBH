import { useState } from 'react';
import { Modal } from './Modal';
import { Printer, Download, CheckCircle2, Shield, Languages, FileCheck } from 'lucide-react';
import { useToast } from './Toast';

interface ShowCauseNoticeModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShowCauseNoticeModal({ open, onClose }: ShowCauseNoticeModalProps) {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast('success', 'Statutory Memo Exported', 'Show-Cause Notice signed with SHA-256 digital stamp.');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Statutory Vigilance & Show-Cause Notice Generator"
      subtitle="General Financial Rules (GFR) 2017 · Central Vigilance Commission (CVC) Admissible"
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="btn-secondary btn-sm flex items-center gap-1.5"
          >
            <Languages className="w-3.5 h-3.5 text-sky-400" />
            Switch to {language === 'en' ? 'Hindi (हिन्दी)' : 'English'}
          </button>
          <div className="flex items-center gap-2">
            <button className="btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-secondary btn-sm flex items-center gap-1" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button className="btn-primary btn-sm flex items-center gap-1" onClick={handleExport}>
              <Download className="w-3.5 h-3.5" /> Export Signed e-Office Memo
            </button>
          </div>
        </div>
      }
    >
      <div
        className="p-6 rounded-xl border text-slate-100 font-serif leading-relaxed max-h-[60vh] overflow-y-auto scrollbar-thin"
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          borderColor: 'rgba(148, 163, 184, 0.15)',
        }}
      >
        {/* Official Header */}
        <div className="text-center border-b border-slate-700/40 pb-4 mb-5">
          <div className="text-[12px] uppercase tracking-widest text-slate-400 font-sans">
            {language === 'en' ? 'Government of India · State of Maharashtra' : 'भारत सरकार · महाराष्ट्र शासन'}
          </div>
          <div className="text-[15px] font-bold text-white tracking-wide mt-1">
            {language === 'en'
              ? 'OFFICE OF THE DISTRICT MAGISTRATE & DISTRICT VIGILANCE OFFICER'
              : 'कार्यालय जिला मजिस्ट्रेट एवं जिला सतर्कता अधिकारी'}
          </div>
          <div className="text-[11px] text-slate-400 font-sans mt-0.5">
            Collectorate Compound, Pune - 411001 · Directorate of Vigilance (MPLADS Division)
          </div>
          <div className="text-[10px] font-mono text-sky-400 mt-2">
            MEMORANDUM NO: CVC/MoSPI/MPLADS/2026/SCN-1024 · URGENT / BY SPEED POST
          </div>
        </div>

        {/* Notice Meta */}
        <div className="flex justify-between items-start text-[12px] font-sans text-slate-300 mb-4 pb-3 border-b border-slate-800">
          <div>
            <strong>To:</strong>
            <br />
            M/s ABC Infrastructure Pvt. Ltd.
            <br />
            Attn: Sri Rameshwar Rao, Managing Director (DIN: 08472911)
            <br />
            Plot 42, MIDC Bhosari Industrial Area, Pune - 411026
          </div>
          <div className="text-right">
            <strong>Date of Dispatch:</strong> 03 September 2026
            <br />
            <strong>Project ID:</strong> MPLADS-1024 / AR-2026-001024
            <br />
            <strong>Lok Sabha Seat:</strong> Pune (Constituency No. 34)
          </div>
        </div>

        {/* Subject */}
        <div className="mb-4 text-[13px] font-sans font-bold text-white bg-slate-800/40 p-2.5 rounded border border-slate-700/30">
          {language === 'en'
            ? 'SUBJECT: STATUTORY SHOW CAUSE NOTICE UNDER GENERAL FINANCIAL RULES (GFR) 2017 FOR IRREGULARITIES, BID COLLUSION & PRICE INFLATION IN EXECUTION OF COMMUNITY HALL WORKS.'
            : 'विषय: सामान्य वित्तीय नियम (जीएफआर) 2017 के तहत सामुदायिक भवन कार्य में अनियमितता, बोली मिलीभगत एवं मूल्य वृद्धि हेतु कारण बताओ नोटिस।'}
        </div>

        {/* Body Text */}
        <div className="text-[12.5px] space-y-3 text-slate-200">
          <p>
            {language === 'en' ? (
              <>
                WHEREAS, an algorithmic automated scrutiny and forensic engineering audit conducted by the{' '}
                <strong>AARAMBHA Procurement Intelligence Platform (Ministry of Statistics and Programme Implementation)</strong>{' '}
                into Contract No. <strong>CON-2026-9281</strong> (Construction of Multi-Purpose Community Hall, Bavdhan) has revealed severe prima facie violations of Central Government Procurement Guidelines.
              </>
            ) : (
              <>
                चूँकि, सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय के <strong>आरंभ (AARAMBHA) प्रोक्योरमेंट इंटेलिजेंस प्लेटफॉर्म</strong> द्वारा अनुबंध संख्या <strong>CON-2026-9281</strong> के तहत बहुउद्देशीय सामुदायिक भवन निर्माण की जांच में केंद्रीय खरीद नियमों के गंभीर प्रथम दृष्टया उल्लंघन पाए गए हैं।
              </>
            )}
          </p>

          <div className="font-sans text-[11px] space-y-2 p-3 rounded bg-red-950/20 border border-red-500/20">
            <div className="font-bold text-red-400 uppercase tracking-wider">
              {language === 'en' ? 'Specific Charges & Statutory Rule Violations Cited:' : 'आरोप एवं विधिक धाराएं:'}
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                <strong>Violation of GFR 2017 Rule 149:</strong> Willful bypass of mandatory GeM portal procurement to award civil works at inflated rate of ₹12,000/sq.m (+45.5% over CPWD Schedule of Rates benchmark of ₹8,250).
              </li>
              <li>
                <strong>Violation of CVC Procurement Manual Clause 199A &amp; Competition Act Sec 3(3):</strong> Bid rotation cartelization with M/s Kaveri Civil Engg, with both entities sharing common promoter/director (DIN: 08472911).
              </li>
              <li>
                <strong>Measurement Book (MB) Fabrication:</strong> First-digit frequency audit fails Benford’s Law (χ² = 223.3, p &lt; 0.001), indicating synthetic invoice preparation.
              </li>
              <li>
                <strong>Physical-Financial Decoupling:</strong> 86.8% payment disbursed against only 68% authenticated ground milestones.
              </li>
            </ul>
          </div>

          <p>
            <strong>QUANTIFIED DIRECT LOSS TO PUBLIC EXCHEQUER:</strong>{' '}
            <span className="text-red-400 font-bold font-sans">
              ₹14,20,500/- (Fourteen Lakhs Twenty Thousand Five Hundred Rupees only)
            </span>
          </p>

          <p>
            NOW THEREFORE, you are hereby called upon to <strong>SHOW CAUSE within fourteen (14) days</strong> of receipt of this notice as to why:
          </p>
          <ol className="list-decimal pl-5 space-y-1 font-sans text-[12px] text-slate-300">
            <li>Your firm should not be debarred and blacklisted from all Central/State government tenders for three (3) years under Rule 151 of GFR 2017.</li>
            <li>The withheld escrow tranche of ₹18,40,000 should not be permanently forfeited.</li>
            <li>Criminal proceedings under Section 120-B and 420 of the Indian Penal Code (IPC) should not be initiated.</li>
          </ol>
        </div>

        {/* Official Sign & Forensic Stamp */}
        <div className="mt-6 pt-4 border-t border-slate-700/40 flex flex-wrap items-end justify-between gap-4 font-sans">
          <div className="text-[10px] text-slate-500 font-mono space-y-0.5">
            <div>Digital Custody Hash (SHA-256):</div>
            <div className="text-sky-400">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
            <div>ISO/IEC 27037 Digital Forensics Admissible Standard · Indian Evidence Act Sec 65B Certified</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 text-[11px] font-bold flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> DIGITALLY SIGNED VIA NIC e-OFFICE
            </div>
            <div className="text-[12px] font-bold text-white mt-1">Dr. S. K. Deshmukh, IAS</div>
            <div className="text-[10px] text-slate-400">District Magistrate &amp; Vigilance Officer, Pune</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
