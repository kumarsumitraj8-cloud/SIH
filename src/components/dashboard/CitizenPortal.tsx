import React, { useState } from 'react';
import { LandRecord } from '../../types/landRecord';
import { 
  Search, ShieldCheck, Download, QrCode, FileText, 
  MapPin, User, CheckCircle2, Lock, Sparkles, Building 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { generateEparchaPdf } from '../../services/certificateGenerator';

interface CitizenPortalProps {
  records: LandRecord[];
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({ records }) => {
  const [searchMethod, setSearchMethod] = useState<'ulpin' | 'location'>('ulpin');
  const [inputUlpin, setInputUlpin] = useState<string>('UP282491084121');
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [selectedKhasra, setSelectedKhasra] = useState<string>('412/1');
  const [searchResult, setSearchResult] = useState<LandRecord | null>(records[0] || null);
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    if (searchMethod === 'ulpin') {
      const clean = inputUlpin.trim().toUpperCase();
      const found = records.find(r => r.ulpin.toUpperCase().includes(clean) || clean.includes(r.ulpin.toUpperCase()));
      setSearchResult(found || null);
    } else {
      const found = records.find(r => 
        r.state.toLowerCase() === selectedState.toLowerCase() && 
        r.khasraNumber.value.includes(selectedKhasra.trim())
      );
      setSearchResult(found || records[0] || null);
    }
  };

  const verificationUrl = searchResult 
    ? `https://dilrmp.gov.in/verify-ror?ulpin=${searchResult.ulpin}&hash=${searchResult.blockchainHash.slice(0, 16)}`
    : '';

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Citizen Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Citizen Public Portal
            </span>
            <span className="text-xs text-slate-400">Digital India Land Records (Bhulekh 2.0)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Public Land Record &amp; e-Parcha Verification Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Search, verify title ownership, check court litigation status, and download authenticated Record of Rights (RoR) instantly.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        {/* Toggle Mode */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setSearchMethod('ulpin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              searchMethod === 'ulpin'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Search by 14-Digit ULPIN (Bhu-Aadhaar)
          </button>
          <button
            onClick={() => setSearchMethod('location')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              searchMethod === 'location'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Search by State &amp; Khasra / Survey No.
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-3">
          {searchMethod === 'ulpin' ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputUlpin}
                  onChange={(e) => setInputUlpin(e.target.value)}
                  placeholder="Enter 14-digit ULPIN (e.g. UP282491084121, MH121849108422, TS362149108423)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 uppercase"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Verify Record
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Bihar">Bihar</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">District / Tehsil</label>
                <input
                  type="text"
                  defaultValue="Sadar"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Khasra / Plot No.</label>
                <input
                  type="text"
                  value={selectedKhasra}
                  onChange={(e) => setSelectedKhasra(e.target.value)}
                  placeholder="e.g. 412/1"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" /> Fetch e-Parcha
                </button>
              </div>
            </div>
          )}

          {/* Quick Clickable Suggestions */}
          <div className="flex items-center flex-wrap gap-2 text-xs pt-1">
            <span className="text-slate-400">Quick Test Records:</span>
            {records.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setInputUlpin(r.ulpin);
                  setSearchResult(r);
                  setHasSearched(true);
                }}
                className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-300 font-mono text-[11px] border border-slate-800 cursor-pointer"
              >
                {r.ulpin} ({r.state})
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Verified Record Certificate Display */}
      {hasSearched && searchResult ? (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 animate-fadeIn">
          
          {/* Certificate Header Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase text-emerald-400">Digitally Verified Record of Rights (RoR)</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Official e-Parcha
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  ULPIN: <span className="font-mono text-emerald-400">{searchResult.ulpin}</span>
                </h3>
              </div>
            </div>

            <button
              onClick={() => generateEparchaPdf(searchResult)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Official e-Parcha (PDF)
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1 & 2: Land & Title Holder Information */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Land Metadata */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Revenue Jurisdiction &amp; Parcel Area
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">State</span>
                    <strong className="text-white">{searchResult.state}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">District &amp; Tehsil</span>
                    <strong className="text-white">{searchResult.district}, {searchResult.tehsil}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Village (Mauza)</span>
                    <strong className="text-white">{searchResult.village}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Khasra / Plot No.</span>
                    <strong className="text-emerald-400 font-bold">{searchResult.khasraNumber.value}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Khata / Account No.</span>
                    <strong className="text-white">{searchResult.khataNumber.value}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Standard Area</span>
                    <strong className="text-emerald-400 font-bold">{searchResult.area.standardHectares.toFixed(4)} Ha ({searchResult.area.standardAcres.toFixed(2)} Ac)</strong>
                  </div>
                </div>
              </div>

              {/* Title Owners List */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" /> Registered Title Co-Owners
                </h4>

                <div className="space-y-2">
                  {searchResult.owners.map((owner, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-white block">{owner.name.value}</span>
                        <span className="text-[11px] text-slate-400">{owner.relationType.value} {owner.relativeName.value} • Masked Aadhaar: {owner.aadharMasked}</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[11px] font-mono">
                          {owner.shareFraction.value} ({owner.sharePercentage.toFixed(1)}%)
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">{owner.areaShareHectares.toFixed(4)} Hectares</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Encumbrance & Dispute Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Mortgage / Bank Lien</span>
                  <div className="text-xs font-semibold text-slate-200">
                    {searchResult.encumbrance.isEncumbered ? (
                      <span className="text-amber-400">⚠️ Active Lien: {searchResult.encumbrance.bankOrFinancialInstitution}</span>
                    ) : (
                      <span className="text-emerald-400">✓ No Bank Encumbrance</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Court Injunctions</span>
                  <div className="text-xs font-semibold text-slate-200">
                    {searchResult.litigation.hasDispute ? (
                      <span className="text-red-400">⚠️ Case in {searchResult.litigation.courtType}</span>
                    ) : (
                      <span className="text-emerald-400">✓ 100% Dispute-Free Title</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Column 3: Authenticity QR Code & Blockchain Seal */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-3">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Scan to Verify Authenticity
                </span>

                <div className="p-3 bg-white rounded-xl shadow-xl">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={140}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <span className="text-[10px] font-mono text-emerald-400 break-all px-2 text-center">
                  Hash: {searchResult.blockchainHash.slice(0, 24)}...
                </span>

                <p className="text-[11px] text-slate-400">
                  Cryptographically secured by Government of India DILRMP Blockchain Node.
                </p>
              </div>
            </div>

          </div>

        </div>
      ) : hasSearched && (
        <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center">
          <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">No Record Found</h3>
          <p className="text-xs text-slate-400 mt-1">Please double check the 14-digit ULPIN or Khasra number.</p>
        </div>
      )}

    </div>
  );
};
