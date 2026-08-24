import React, { useState } from 'react';
import { LandRecord } from '../../types/landRecord';
import { 
  CheckCircle2, XCircle, ShieldCheck, AlertTriangle, FileText, 
  Download, Sparkles, User, MapPin, Building, Scale, ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateEparchaPdf } from '../../services/certificateGenerator';
import { blockchainLedger } from '../../services/blockchainService';

interface TehsildarReviewPortalProps {
  records: LandRecord[];
  onApproveRecord: (recordId: string, remarks: string) => void;
  onRejectRecord: (recordId: string, remarks: string) => void;
}

export const TehsildarReviewPortal: React.FC<TehsildarReviewPortalProps> = ({
  records,
  onApproveRecord,
  onRejectRecord
}) => {
  const [selectedRecord, setSelectedRecord] = useState<LandRecord | null>(
    records.find(r => r.status === 'PENDING_TEHSILDAR_APPROVAL') || records[0] || null
  );
  const [remarks, setRemarks] = useState<string>('Digitally verified against Cadastral Map 1982 survey and Land Revenue Code regulations.');
  const [isSigning, setIsSigning] = useState<boolean>(false);

  const pendingList = records.filter(r => r.status === 'PENDING_TEHSILDAR_APPROVAL' || r.status === 'HITL_REVIEW_NEEDED');
  const approvedList = records.filter(r => r.status === 'APPROVED');

  const handleDigitalSignOff = async () => {
    if (!selectedRecord) return;
    setIsSigning(true);

    try {
      // 1. Commit to Blockchain Ledger
      await blockchainLedger.addBlock({
        recordId: selectedRecord.id,
        ulpin: selectedRecord.ulpin,
        khasraNo: selectedRecord.khasraNumber.value,
        action: 'TEHSILDAR_DIGITAL_APPROVAL',
        performedBy: 'TEHSILDAR_VIKRAM_ADITYA_IAS',
        role: 'TEHSILDAR',
        recordData: selectedRecord
      });

      // 2. Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // 3. Update Record State
      onApproveRecord(selectedRecord.id, remarks);
      setIsSigning(false);
    } catch (e) {
      console.error('Digital signature failed', e);
      setIsSigning(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Officer Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Revenue Jurisdiction
            </span>
            <span className="text-xs text-slate-400">Tehsil Sadar Office</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Tehsildar Digital Sign-Off &amp; Approvals
          </h2>
          <p className="text-xs text-slate-400">
            Review AI confidence diagnostics, resolve boundary litigation alerts, and issue cryptographic legal certificates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Pending In Queue</span>
            <span className="text-lg font-extrabold text-cyan-400">{pendingList.length} Records</span>
          </div>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pending Queue List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Awaiting Officer Verification ({pendingList.length})
          </h3>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {pendingList.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  selectedRecord?.id === rec.id
                    ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-emerald-400">{rec.ulpin}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    rec.status === 'PENDING_TEHSILDAR_APPROVAL'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {rec.status === 'PENDING_TEHSILDAR_APPROVAL' ? 'Ready for Sign-Off' : 'Review Needed'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">Khasra {rec.khasraNumber.value} ({rec.village})</h4>
                <p className="text-xs text-slate-400">{rec.owners[0]?.name.value} + {rec.owners.length - 1} others</p>

                <div className="flex items-center justify-between text-[11px] pt-2 mt-2 border-t border-slate-800/80 text-slate-400">
                  <span>Area: <strong className="text-slate-200">{rec.area.value.value} {rec.area.unit.value}</strong></span>
                  <span className="text-cyan-400 font-bold">{rec.overallConfidence}% AI Confidence</span>
                </div>
              </div>
            ))}

            {pendingList.length === 0 && (
              <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                <p className="text-xs font-bold text-slate-300">All records in this jurisdiction approved!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Inspection & Digital Sign-off Panel (8 Cols) */}
        {selectedRecord ? (
          <div className="lg:col-span-8 space-y-4">
            
            {/* Record Inspection Header Card */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
                    Bhu-Aadhaar ULPIN: {selectedRecord.ulpin}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Khasra No. {selectedRecord.khasraNumber.value} • Khata No. {selectedRecord.khataNumber.value}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedRecord.village}, Tehsil {selectedRecord.tehsil}, {selectedRecord.district}, {selectedRecord.state} (PIN: {selectedRecord.pincode})
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => generateEparchaPdf(selectedRecord)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" /> Preview e-Parcha (PDF)
                  </button>
                </div>
              </div>

              {/* Area and Classification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Standard Area</span>
                  <span className="text-sm font-extrabold text-white">
                    {selectedRecord.area.standardHectares.toFixed(4)} Hectares
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    (= {selectedRecord.area.standardAcres.toFixed(2)} Acres)
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Land Classification</span>
                  <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                    {selectedRecord.landClassification.value.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Irrigation: {selectedRecord.irrigationStatus}</span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Share Sum Check</span>
                  <span className={`text-sm font-extrabold ${selectedRecord.calculatedShareSum === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedRecord.calculatedShareSum.toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {selectedRecord.calculatedShareSum === 100 ? 'Math Verified' : 'Share Inconsistency'}
                  </span>
                </div>
              </div>

              {/* Registered Owners Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Shareholders &amp; Co-Tenants
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2 rounded-l-lg">Owner Name</th>
                        <th className="p-2">Relation</th>
                        <th className="p-2">Share Fraction</th>
                        <th className="p-2">Share %</th>
                        <th className="p-2 rounded-r-lg">Holding Area</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-medium">
                      {selectedRecord.owners.map((owner, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="p-2 font-semibold text-white">{owner.name.value}</td>
                          <td className="p-2 text-slate-400">{owner.relationType.value} {owner.relativeName.value}</td>
                          <td className="p-2 font-mono text-cyan-400">{owner.shareFraction.value}</td>
                          <td className="p-2 font-bold text-emerald-400">{owner.sharePercentage.toFixed(1)}%</td>
                          <td className="p-2 font-mono text-slate-200">{owner.areaShareHectares.toFixed(4)} Ha</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Encumbrance & Litigation Alerts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Financial Charge / Bank Lien
                  </span>
                  {selectedRecord.encumbrance.isEncumbered ? (
                    <div className="text-xs text-amber-400 font-medium">
                      ⚠️ Active Charge: {selectedRecord.encumbrance.bankOrFinancialInstitution} (₹{(selectedRecord.encumbrance.loanAmount || 0).toLocaleString('en-IN')})
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-400 font-medium">
                      ✓ Clear of Encumbrances (No Bank Lien)
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Judicial Stay / Revenue Dispute
                  </span>
                  {selectedRecord.litigation.hasDispute ? (
                    <div className="text-xs text-red-400 font-medium">
                      ⚠️ Active Dispute in {selectedRecord.litigation.courtType} ({selectedRecord.litigation.caseNumber})
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-400 font-medium">
                      ✓ Litigation Free (No Injunctions)
                    </div>
                  )}
                </div>
              </div>

              {/* Tehsildar Sign-Off Dialog */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-emerald-500/30 space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200 block mb-1">
                    Officer Approval Remarks &amp; Legal Endorsement
                  </label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Enter official sign-off notes..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Applies Aadhaar-based DSC (Digital Signature Certificate)</span>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => onRejectRecord(selectedRecord.id, remarks)}
                      className="px-4 py-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 font-bold rounded-xl text-xs border border-red-500/30 transition cursor-pointer flex-1 sm:flex-initial"
                    >
                      <XCircle className="w-4 h-4 inline mr-1" /> Flag Discrepancy
                    </button>

                    <button
                      onClick={handleDigitalSignOff}
                      disabled={isSigning || selectedRecord.status === 'APPROVED'}
                      className={`px-6 py-2.5 font-bold rounded-xl text-xs transition shadow-xl flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-initial ${
                        selectedRecord.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 cursor-default'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20'
                      }`}
                    >
                      {isSigning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                          <span>Issuing Blockchain Seal...</span>
                        </>
                      ) : selectedRecord.status === 'APPROVED' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Record Digitally Certified &amp; Approved
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> Issue Digital Signature &amp; Approve
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 rounded-2xl glass-panel border border-slate-800 text-center">
            <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-slate-300">Select a record from the queue to review</h3>
          </div>
        )}

      </div>

    </div>
  );
};
