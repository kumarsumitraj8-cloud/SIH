import React, { useState } from 'react';
import { 
  ClipboardList, Search, PlusCircle, CheckCircle2, Clock, 
  FileText, Upload, AlertCircle, Sparkles, ArrowRight, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MutationApplication {
  id: string;
  applicantName: string;
  mobile: string;
  type: 'INHERITANCE_VIRASAT' | 'SALE_DEED' | 'PARTITION' | 'AREA_CORRECTION';
  khasraNo: string;
  village: string;
  district: string;
  submissionDate: string;
  status: 'SUBMITTED' | 'PATWARI_VERIFICATION' | 'OBJECTION_WINDOW' | 'APPROVED_MUTATED';
  currentStep: number; // 1 to 4
  remarks?: string;
}

const INITIAL_APPLICATIONS: MutationApplication[] = [
  {
    id: 'MUT-UP-2026-981',
    applicantName: 'Rameshwar Prasad Singh',
    mobile: '98765XXXXX',
    type: 'INHERITANCE_VIRASAT',
    khasraNo: '412/1',
    village: 'Rampur',
    district: 'Varanasi',
    submissionDate: '2026-08-10',
    status: 'APPROVED_MUTATED',
    currentStep: 4,
    remarks: 'Tehsildar order issued. RoR record updated in DILRMP master database.'
  },
  {
    id: 'MUT-MH-2026-742',
    applicantName: 'Tukaram Pandurang Patil',
    mobile: '94220XXXXX',
    type: 'SALE_DEED',
    khasraNo: '84/2A',
    village: 'Wagholi',
    district: 'Pune',
    submissionDate: '2026-08-18',
    status: 'PATWARI_VERIFICATION',
    currentStep: 2,
    remarks: 'Field survey scheduled by Talathi / Circle Inspector for boundary demarcation.'
  },
  {
    id: 'MUT-TS-2026-310',
    applicantName: 'K. Venkataiah Goud',
    mobile: '98480XXXXX',
    type: 'AREA_CORRECTION',
    khasraNo: '214/AA',
    village: 'Mamidipally',
    district: 'Rangareddy',
    submissionDate: '2026-08-21',
    status: 'OBJECTION_WINDOW',
    currentStep: 3,
    remarks: 'Public notice issued in Gram Panchayat for 15-day objection period.'
  }
];

export const CitizenMutationPortal: React.FC = () => {
  const [applications, setApplications] = useState<MutationApplication[]>(INITIAL_APPLICATIONS);
  const [activeTab, setActiveTab] = useState<'track' | 'apply'>('track');
  const [searchTrackingId, setSearchTrackingId] = useState<string>('MUT-UP-2026-981');
  const [selectedApp, setSelectedApp] = useState<MutationApplication | null>(INITIAL_APPLICATIONS[0]);
  
  // New Application Form State
  const [applicantName, setApplicantName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [khasraNo, setKhasraNo] = useState<string>('');
  const [village, setVillage] = useState<string>('Rampur');
  const [district, setDistrict] = useState<string>('Varanasi');
  const [mutationType, setMutationType] = useState<MutationApplication['type']>('INHERITANCE_VIRASAT');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newGeneratedId, setNewGeneratedId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchTrackingId.trim().toUpperCase();
    const found = applications.find(a => a.id.toUpperCase().includes(clean) || clean.includes(a.id.toUpperCase()));
    setSelectedApp(found || null);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !khasraNo) return;
    setIsSubmitting(true);

    const generatedId = `MUT-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newApp: MutationApplication = {
      id: generatedId,
      applicantName,
      mobile: mobile || '98XXXXXXXX',
      type: mutationType,
      khasraNo,
      village,
      district,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
      currentStep: 1,
      remarks: 'Application ingested. AI rule-engine validated supporting documents.'
    };

    setTimeout(() => {
      setApplications(prev => [newApp, ...prev]);
      setSelectedApp(newApp);
      setNewGeneratedId(generatedId);
      setIsSubmitting(false);
      confetti({ particleCount: 70, spread: 60 });
      setActiveTab('track');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              BhoomiSamadhan e-Governance
            </span>
            <span className="text-xs text-slate-400">Digital Mutation &amp; Title Transfer</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 dark:text-white light:text-slate-900 mt-1 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-400" /> Online Land Mutation (दाखिल-खारिज) &amp; Grievance Portal
          </h2>
          <p className="text-xs text-slate-400">
            Apply online for property succession (Virasat), registry mutation, or boundary correction and track live progress.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 bg-slate-900 dark:bg-slate-900 light:bg-slate-200 p-1 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300">
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'track'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white light:hover:text-slate-900'
            }`}
          >
            Track Status
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'apply'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white light:hover:text-slate-900'
            }`}
          >
            + New Mutation Request
          </button>
        </div>
      </div>

      {/* Track Tab */}
      {activeTab === 'track' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Search & Applications List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search Box */}
            <div className="glass-panel p-4 rounded-2xl border space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-700 block">
                Track Application ID
              </label>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTrackingId}
                    onChange={(e) => setSearchTrackingId(e.target.value)}
                    placeholder="Enter Application ID (e.g. MUT-UP-2026-981)..."
                    className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-md cursor-pointer"
                >
                  Track
                </button>
              </form>
            </div>

            {/* List of Applications */}
            <div className="space-y-2.5">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                Recent Applications ({applications.length})
              </span>

              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    selectedApp?.id === app.id
                      ? 'bg-slate-800/90 dark:bg-slate-800/90 light:bg-cyan-50 border-cyan-500 shadow-lg'
                      : 'bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">{app.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      app.status === 'APPROVED_MUTATED' ? 'bg-emerald-500/20 text-emerald-400' :
                      app.status === 'PATWARI_VERIFICATION' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 dark:text-white light:text-slate-900">{app.applicantName}</h4>
                  <p className="text-[11px] text-slate-400">
                    Khasra {app.khasraNo} • {app.type.replace(/_/g, ' ')} • {app.village}, {app.district}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Live Interactive Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {selectedApp ? (
              <div className="glass-panel p-6 rounded-2xl border space-y-6 animate-fadeIn">
                
                {/* Status Summary Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">
                      APPLICATION NO: {selectedApp.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 dark:text-white light:text-slate-900">
                      {selectedApp.applicantName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Mutation Category: <strong>{selectedApp.type.replace(/_/g, ' ')}</strong> • Submitted on {selectedApp.submissionDate}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                    selectedApp.status === 'APPROVED_MUTATED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    selectedApp.status === 'PATWARI_VERIFICATION' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {selectedApp.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* 4-Step Interactive Progress Timeline */}
                <div className="space-y-6 py-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-700 block">
                    Statutory Revenue Timeline
                  </span>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700 dark:before:bg-slate-700 light:before:bg-slate-300">
                    
                    {/* Step 1 */}
                    <div className="relative">
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        selectedApp.currentStep >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        ✓
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 dark:text-white light:text-slate-900">
                          1. Application Submission &amp; AI Document Pre-Audit
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Applicant uploaded valid registered deed &amp; KYC. AI OCR verified Khasra {selectedApp.khasraNo}.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        selectedApp.currentStep >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {selectedApp.currentStep >= 2 ? '✓' : '2'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 dark:text-white light:text-slate-900">
                          2. Revenue Inspector / Patwari Field Verification
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Field demarcation report and possession verification conducted on site.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        selectedApp.currentStep >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {selectedApp.currentStep >= 3 ? '✓' : '3'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 dark:text-white light:text-slate-900">
                          3. 15-Day Public Notice &amp; Objection Clearance
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Published in Gaon Sabha notice board. No court injunctions or third-party objections received.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative">
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        selectedApp.currentStep >= 4 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {selectedApp.currentStep >= 4 ? '✓' : '4'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 dark:text-white light:text-slate-900">
                          4. Tehsildar Digital Order &amp; Blockchain Commit
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Official e-Parcha updated with new title co-owners. Immutable cryptographic hash created.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Remarks & Advisory */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 dark:bg-slate-950 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Revenue Officer Notes:
                  </span>
                  <p className="text-xs text-slate-200 dark:text-slate-200 light:text-slate-800 font-medium">
                    {selectedApp.remarks}
                  </p>
                </div>

              </div>
            ) : (
              <div className="glass-panel p-10 rounded-2xl border text-center">
                <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <h3 className="text-sm font-bold text-slate-300">Select an application to view live timeline</h3>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Apply Tab */}
      {activeTab === 'apply' && (
        <div className="max-w-2xl mx-auto glass-panel p-6 rounded-3xl border space-y-5 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-100 dark:text-white light:text-slate-900">
              Submit Digital Mutation Application (e-Namantaran)
            </h3>
            <p className="text-xs text-slate-400">
              Apply under State Land Revenue Code Section 34/35 for succession or sale transfer.
            </p>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Applicant Full Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Rameshwar Prasad Singh"
                  className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-xl px-3 py-2 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Mobile Number (for SMS Tracking)</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-xl px-3 py-2 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Mutation Type *</label>
                <select
                  value={mutationType}
                  onChange={(e) => setMutationType(e.target.value as any)}
                  className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-xl px-3 py-2 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                >
                  <option value="INHERITANCE_VIRASAT">Inheritance / Virasat (वरासत)</option>
                  <option value="SALE_DEED">Registered Sale Deed (बैनामा)</option>
                  <option value="PARTITION">Family Partition (बंटवारा)</option>
                  <option value="AREA_CORRECTION">Area / Name Correction (शुद्धि)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Khasra / Plot No *</label>
                <input
                  type="text"
                  required
                  value={khasraNo}
                  onChange={(e) => setKhasraNo(e.target.value)}
                  placeholder="e.g. 412/1"
                  className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-xl px-3 py-2 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Village / Mauza</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-xl px-3 py-2 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Attach Registered Deed / Death Certificate / Affidavit (PDF or Image)</label>
              <div className="border border-dashed border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-xl p-4 text-center bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 cursor-pointer">
                <Upload className="w-6 h-6 mx-auto text-cyan-400 mb-1" />
                <span className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 block">Click to upload supporting documents</span>
                <span className="text-[10px] text-slate-500">AI auto-extracts party names &amp; cross-checks master registry</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Submit Application &amp; Generate Tracking ID
                </>
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
