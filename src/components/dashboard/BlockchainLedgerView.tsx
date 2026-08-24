import React, { useState, useEffect } from 'react';
import { BlockchainBlock } from '../../types/landRecord';
import { blockchainLedger } from '../../services/blockchainService';
import { 
  ShieldCheck, Link as LinkIcon, CheckCircle2, AlertCircle, 
  Lock, RefreshCw, Cpu, Database, Award, Clock 
} from 'lucide-react';

export const BlockchainLedgerView: React.FC = () => {
  const [chain, setChain] = useState<BlockchainBlock[]>([]);
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    setChain(blockchainLedger.getChain());
  }, []);

  const handleVerifyIntegrity = async () => {
    setIsVerifying(true);
    const res = await blockchainLedger.verifyIntegrity();
    setTimeout(() => {
      setVerificationResult(res);
      setIsVerifying(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Blockchain Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              National Land Registry DLT Node
            </span>
            <span className="text-xs text-slate-400">Proof-of-Authority (PoA) Consensus</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Tamper-Evident Blockchain Audit Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Cryptographically sealed SHA-256 block ledger recording every OCR ingestion, operator edit, and Tehsildar approval.
          </p>
        </div>

        <button
          onClick={handleVerifyIntegrity}
          disabled={isVerifying}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isVerifying ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Verifying Block Hashes...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" /> Verify Chain Integrity
            </>
          )}
        </button>
      </div>

      {/* Verification Status Banner */}
      {verificationResult && (
        <div className={`p-4 rounded-2xl border animate-fadeIn flex items-center space-x-3 ${
          verificationResult.isValid 
            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' 
            : 'bg-red-950/50 border-red-500/40 text-red-300'
        }`}>
          {verificationResult.isValid ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
          )}
          <div>
            <h4 className="text-sm font-bold">
              {verificationResult.isValid ? 'Cryptographic Integrity Verified 100%' : 'Chain Integrity Alert'}
            </h4>
            <p className="text-xs opacity-90">{verificationResult.message}</p>
          </div>
        </div>
      )}

      {/* Blockchain Blocks List */}
      <div className="space-y-4">
        {chain.map((block, idx) => (
          <div key={idx} className="relative">
            
            {/* Block Card */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                    #{block.blockIndex}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Action: {block.action.replace(/_/g, ' ')}</span>
                      <span className="px-2 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                        Nonce: {block.nonce}
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Timestamp: {new Date(block.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400">Actor:</span>
                  <span className="font-bold text-emerald-400">{block.performedBy}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
                    {block.role}
                  </span>
                </div>
              </div>

              {/* Cryptographic Hashes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Previous Block Hash (Link):</span>
                  <span className="font-mono text-[11px] text-slate-400 break-all">{block.previousHash}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">Current Block Hash:</span>
                  <span className="font-mono text-[11px] text-emerald-400 font-semibold break-all">{block.currentHash}</span>
                </div>
              </div>

              {/* Record Metadata Details */}
              <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                <span>Record Ref: <strong className="text-white">{block.recordId}</strong></span>
                <span>ULPIN: <strong className="font-mono text-emerald-400">{block.ulpin}</strong></span>
                <span>Khasra: <strong className="text-white">{block.khasraNo}</strong></span>
              </div>
            </div>

            {/* Downward Link Arrow */}
            {idx < chain.length - 1 && (
              <div className="flex justify-center my-1.5">
                <div className="p-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400">
                  <LinkIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
