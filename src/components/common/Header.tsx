import React from 'react';
import { UserRole, LanguageCode } from '../../types/landRecord';
import { UserPersona } from './RightPageSwitcher';
import { 
  ShieldCheck, Layers, FileSearch, CheckCircle2, Globe2, 
  Database, MapPin, Code2, Sun, Moon, Mic, Split, ClipboardList, Building2, Users 
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingHitlCount: number;
  pendingApprovalCount: number;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  persona: UserPersona;
  setPersona: (p: UserPersona) => void;
  onOpenVoiceAssistant: () => void;
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
  theme,
  setTheme,
  persona,
  setPersona,
  onOpenVoiceAssistant,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 backdrop-blur-xl border-b border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl transition-colors">
      {/* Top Gov Tricolor Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500" />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & National Identity */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveTab(persona === 'OFFICER' ? 'admin' : 'citizen')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-lg group-hover:scale-105 transition-transform shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 light:from-slate-900 light:to-slate-700 bg-clip-text text-transparent">
                  BhoomiSetu <span className="text-emerald-500 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">AI 2.0</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 light:text-slate-600 font-medium tracking-wide">
                Ministry of Rural Development • Dept of Land Resources (DoLR) • DILRMP
              </p>
            </div>
          </div>

          {/* Persona Switcher Badge (Officer vs Citizen) */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 p-1 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300">
            <button
              onClick={() => {
                setPersona('OFFICER');
                setActiveTab('admin');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                persona === 'OFFICER'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>Officer Portal</span>
            </button>

            <button
              onClick={() => {
                setPersona('CITIZEN');
                setActiveTab('citizen');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                persona === 'CITIZEN'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>Citizen Portal</span>
            </button>
          </div>

          {/* Action Tools: Voice Search, Theme Toggle, Language, Role */}
          <div className="flex items-center space-x-2.5">
            
            {/* Voice Assistant Trigger */}
            <button
              onClick={onOpenVoiceAssistant}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 dark:text-emerald-300 light:text-emerald-700 light:hover:text-white rounded-xl border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Open Multilingual Voice Assistant"
            >
              <Mic className="w-4 h-4 shrink-0 animate-pulse" />
              <span className="hidden md:inline">Voice AI</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-amber-400 light:hover:text-amber-600 transition cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 px-2 py-1.5 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs">
              <Globe2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-slate-300 dark:text-slate-300 light:text-slate-800 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="hi" className="bg-slate-900 text-white light:bg-white light:text-black">हिंदी (Hindi)</option>
                <option value="mr" className="bg-slate-900 text-white light:bg-white light:text-black">मराठी (Marathi)</option>
                <option value="te" className="bg-slate-900 text-white light:bg-white light:text-black">తెలుగు (Telugu)</option>
                <option value="ta" className="bg-slate-900 text-white light:bg-white light:text-black">தமிழ் (Tamil)</option>
                <option value="bn" className="bg-slate-900 text-white light:bg-white light:text-black">বাংলা (Bengali)</option>
                <option value="en" className="bg-slate-900 text-white light:bg-white light:text-black">English</option>
              </select>
            </div>

            {/* Active Role Selector (Officer Mode only) */}
            {persona === 'OFFICER' && (
              <div className="hidden lg:flex items-center space-x-2 bg-slate-950 dark:bg-slate-950 light:bg-slate-100 px-3 py-1 rounded-xl border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <div className="text-right">
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Role</span>
                  <select
                    value={currentRole}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="bg-transparent text-xs font-bold text-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="ADMIN_DOLR" className="bg-slate-900 text-white light:bg-white light:text-black">National Admin</option>
                    <option value="OPERATOR" className="bg-slate-900 text-white light:bg-white light:text-black">Operator</option>
                    <option value="TEHSILDAR" className="bg-slate-900 text-white light:bg-white light:text-black">Tehsildar</option>
                  </select>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
