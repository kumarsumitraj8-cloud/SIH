import React from 'react';
import { LandRecord } from '../../types/landRecord';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, ShieldCheck, CheckCircle, AlertTriangle, 
  FileText, Clock, Sparkles, Building2, MapPin, Award
} from 'lucide-react';

interface AdminDashboardProps {
  records: LandRecord[];
  onSelectRecord: (record: LandRecord) => void;
  onNavigateTab: (tab: string) => void;
}

const STATE_PROGRESS_DATA = [
  { state: 'Uttar Pradesh', completed: 94.2, pending: 5.8, records: '12.4M' },
  { state: 'Maharashtra', completed: 91.8, pending: 8.2, records: '9.8M' },
  { state: 'Telangana', completed: 96.5, pending: 3.5, records: '6.2M' },
  { state: 'Bihar', completed: 84.1, pending: 15.9, records: '7.5M' },
  { state: 'Madhya Pradesh', completed: 89.4, pending: 10.6, records: '8.1M' },
  { state: 'Tamil Nadu', completed: 93.0, pending: 7.0, records: '5.9M' }
];

const ACCURACY_BY_LANGUAGE = [
  { language: 'Hindi (Devanagari)', accuracy: 96.8, volume: '18.2M' },
  { language: 'Marathi (Devanagari)', accuracy: 95.4, volume: '9.8M' },
  { language: 'Telugu (Telugu Script)', accuracy: 94.9, volume: '6.2M' },
  { language: 'Tamil (Tamil Script)', accuracy: 95.1, volume: '5.9M' },
  { language: 'Bengali (Bangla)', accuracy: 93.8, volume: '4.1M' },
  { language: 'English (Printed)', accuracy: 99.2, volume: '4.0M' }
];

const ANOMALY_DISTRIBUTION = [
  { name: 'Share Proportion Mismatch', value: 38, color: '#f59e0b' },
  { name: 'Protected / Forest Encroachment', value: 24, color: '#ef4444' },
  { name: 'Court Stay / Revenue Dispute', value: 21, color: '#ec4899' },
  { name: 'Duplicate Khasra Collisions', value: 17, color: '#8b5cf6' }
];

const MONTHLY_VOLUME_DATA = [
  { month: 'Mar', digitized: 2.1, autoApproved: 1.6 },
  { month: 'Apr', digitized: 2.8, autoApproved: 2.2 },
  { month: 'May', digitized: 3.5, autoApproved: 2.9 },
  { month: 'Jun', digitized: 4.4, autoApproved: 3.8 },
  { month: 'Jul', digitized: 5.2, autoApproved: 4.6 },
  { month: 'Aug', digitized: 6.8, autoApproved: 6.1 }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  records,
  onSelectRecord,
  onNavigateTab
}) => {
  const totalApproved = records.filter(r => r.status === 'APPROVED').length;
  const totalHitl = records.filter(r => r.status === 'HITL_REVIEW_NEEDED').length;
  const totalPending = records.filter(r => r.status === 'PENDING_TEHSILDAR_APPROVAL').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner with Scheme Highlights */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 border border-emerald-500/20 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> DILRMP 2.0 AI Mission
              </span>
              <span className="text-xs text-slate-400">National Real-Time Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Intelligent Land Record Digitization &amp; Validation System
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Automated Multilingual OCR, Cadastral GIS Vectorization, and Cross-Database Anomaly Detection for Ministry of Rural Development.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('operator')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Start Ingestion Batch
            </button>
            <button
              onClick={() => onNavigateTab('gis')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4" /> View BhuNaksha GIS
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Digitized</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">48.2 Million</div>
            <div className="flex items-center text-xs text-emerald-400 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+18.4% this quarter across 28 States</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OCR Accuracy</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">96.4%</div>
            <div className="flex items-center text-xs text-cyan-400 mt-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              <span>Exceeds Target (≥95.0% PRD Standard)</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Effort Reduced</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">74.2%</div>
            <div className="flex items-center text-xs text-purple-400 mt-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Saves ~140,000 officer hours/month</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Frauds Prevented</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">14,290</div>
            <div className="flex items-center text-xs text-amber-400 mt-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              <span>Encroachments &amp; Math errors caught</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Processing Volume Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Digitization &amp; Auto-Approval Velocity</h3>
              <p className="text-xs text-slate-400">Monthly record ingestion in millions vs straight-through processing</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
              Live Pipeline
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_VOLUME_DATA}>
                <defs>
                  <linearGradient id="colorDigi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit="M" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="digitized" stroke="#10b981" fillOpacity={1} fill="url(#colorDigi)" name="Total Digitized (M)" />
                <Area type="monotone" dataKey="autoApproved" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAuto)" name="Auto Approved (M)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly Distribution */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Rule-Engine Anomaly Distribution</h3>
            <p className="text-xs text-slate-400 mb-2">Automated flags caught before registry commit</p>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ANOMALY_DISTRIBUTION}
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {ANOMALY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-1.5 text-xs">
            {ANOMALY_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate max-w-[180px]">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* State Progress & Multilingual Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* State-wise Progress Table */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" /> State-wise DILRMP Modernization Status
            </h3>
            <span className="text-xs text-slate-400">DoLR National Target 100%</span>
          </div>
          <div className="space-y-3">
            {STATE_PROGRESS_DATA.map((st, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-200">{st.state}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 font-mono">{st.records} parcels</span>
                    <span className="font-bold text-emerald-400">{st.completed}% Completed</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                    style={{ width: `${st.completed}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multilingual OCR Accuracy by Script */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Indic OCR &amp; HTR Script Performance
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">Benchmarked on 50M+ Records</span>
          </div>
          <div className="space-y-3">
            {ACCURACY_BY_LANGUAGE.map((lang, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-200">{lang.language}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400">{lang.volume} scans</span>
                    <span className="font-bold text-cyan-400">{lang.accuracy}% AI Confidence</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                    style={{ width: `${lang.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Active Records Ingested List */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Ingestion Batches</h3>
            <p className="text-xs text-slate-400">Click any record to inspect OCR bounding boxes, math checks, and blockchain hashes</p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold">
              {totalApproved} Approved
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-semibold">
              {totalHitl} Needs Review
            </span>
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-semibold">
              {totalPending} Officer Queue
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="p-3 rounded-l-lg">ULPIN / Record ID</th>
                <th className="p-3">State &amp; District</th>
                <th className="p-3">Khasra / Plot</th>
                <th className="p-3">Type &amp; Language</th>
                <th className="p-3">Primary Owner</th>
                <th className="p-3">AI Confidence</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {records.map((rec) => (
                <tr 
                  key={rec.id}
                  onClick={() => onSelectRecord(rec)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    {rec.ulpin}
                    <span className="block text-[10px] text-slate-500 font-normal">{rec.id}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-slate-100 font-semibold">{rec.state}</span>
                    <span className="block text-[10px] text-slate-400">{rec.district}, {rec.village}</span>
                  </td>
                  <td className="p-3 font-bold text-white">{rec.khasraNumber.value}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">
                      {rec.recordType}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5 uppercase">{rec.language}</span>
                  </td>
                  <td className="p-3 text-slate-200">
                    {rec.owners[0]?.name.value || 'N/A'}
                    <span className="block text-[10px] text-slate-500">
                      {rec.owners.length > 1 ? `+ ${rec.owners.length - 1} co-owners` : 'Single Owner'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1.5">
                      <span className={`font-bold ${rec.overallConfidence >= 90 ? 'text-emerald-400' : rec.overallConfidence >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                        {rec.overallConfidence}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      rec.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      rec.status === 'HITL_REVIEW_NEEDED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {rec.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectRecord(rec); }}
                      className="px-3 py-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-bold rounded-lg text-[11px] transition-all cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
