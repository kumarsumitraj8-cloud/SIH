import React from 'react';
import { UserRole, LanguageCode } from '../../types/landRecord';
import { ShieldCheck, Layers, FileSearch, CheckCircle2, Globe2, Bell, Database, MapPin, Code2 } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingHitlCount: number;
  pendingApprovalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setRole,
  language,
  setLanguage,
  activeTab,
  setActiveTab,
  pendingHitlCount,
  pendingApprovalCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
      {/* Top Gov Tricolor Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500" />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & National Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('admin')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-lg">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  BhoomiSetu <span className="text-emerald-400 text-sm font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">AI 2.0</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Ministry of Rural Development • Dept of Land Resources (DoLR) • DILRMP
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>National Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('operator')}
              className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'operator'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Digitization &amp; OCR</span>
              {pendingHitlCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-500 text-slate-950 font-bold rounded-full">
                  {pendingHitlCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tehsildar')}
              className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tehsildar'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Officer Approvals</span>
              {pendingApprovalCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-cyan-400 text-slate-950 font-bold rounded-full">
                  {pendingApprovalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('gis')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'gis'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Cadastral GIS</span>
            </button>

            <button
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'citizen'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('blockchain')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'blockchain'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Blockchain Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'api'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>API Hub</span>
            </button>
          </nav>

          {/* Role & Language Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Language Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer"
              >
                <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
                <option value="mr" className="bg-slate-900 text-white">मराठी (Marathi)</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
                <option value="bn" className="bg-slate-900 text-white">বাংলা (Bengali)</option>
                <option value="gu" className="bg-slate-900 text-white">ગુજરાતી (Gujarati)</option>
                <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
                <option value="en" className="bg-slate-900 text-white">English</option>
              </select>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Active Role</span>
                <select
                  value={currentRole}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer"
                >
                  <option value="ADMIN_DOLR" className="bg-slate-900 text-white">National Admin (DoLR)</option>
                  <option value="OPERATOR" className="bg-slate-900 text-white">Digitization Operator</option>
                  <option value="TEHSILDAR" className="bg-slate-900 text-white">Tehsildar / Revenue Officer</option>
                  <option value="CITIZEN" className="bg-slate-900 text-white">Public Citizen</option>
                </select>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
