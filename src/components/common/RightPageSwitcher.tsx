import React, { useState } from 'react';
import { 
  Database, FileSearch, CheckCircle2, MapPin, Globe2, 
  ShieldCheck, Code2, Split, ClipboardList, Mic, 
  ChevronLeft, ChevronRight, Sparkles, Building2, Users 
} from 'lucide-react';

export type UserPersona = 'OFFICER' | 'CITIZEN';

interface NavTabItem {
  id: string;
  label: string;
  icon: any;
  color: string;
  badge?: number;
}

interface RightPageSwitcherProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  persona: UserPersona;
  setPersona: (p: UserPersona) => void;
  pendingHitlCount: number;
  pendingApprovalCount: number;
  onOpenVoiceAssistant: () => void;
}

export const RightPageSwitcher: React.FC<RightPageSwitcherProps> = ({
  activeTab,
  setActiveTab,
  persona,
  setPersona,
  pendingHitlCount,
  pendingApprovalCount,
  onOpenVoiceAssistant
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const officerTabs: NavTabItem[] = [
    { id: 'admin', label: 'National Dashboard', icon: Database, color: 'text-emerald-400' },
    { id: 'operator', label: 'Digitization & OCR', icon: FileSearch, color: 'text-cyan-400', badge: pendingHitlCount },
    { id: 'hitl', label: 'HITL Inspector', icon: Sparkles, color: 'text-amber-400' },
    { id: 'tehsildar', label: 'Officer Sign-Off', icon: CheckCircle2, color: 'text-emerald-400', badge: pendingApprovalCount },
    { id: 'gis', label: 'Cadastral GIS Map', icon: MapPin, color: 'text-blue-400' },
    { id: 'compare', label: 'Scan Comparator', icon: Split, color: 'text-purple-400' },
    { id: 'blockchain', label: 'Blockchain Ledger', icon: ShieldCheck, color: 'text-teal-400' },
    { id: 'api', label: 'Integration API Hub', icon: Code2, color: 'text-indigo-400' }
  ];

  const citizenTabs: NavTabItem[] = [
    { id: 'citizen', label: 'Public Land Search', icon: Globe2, color: 'text-emerald-400' },
    { id: 'mutation', label: 'BhoomiSamadhan (Mutation)', icon: ClipboardList, color: 'text-cyan-400' },
    { id: 'gis', label: 'View Parcel on Map', icon: MapPin, color: 'text-blue-400' },
    { id: 'compare', label: 'Inspect Scanned Register', icon: Split, color: 'text-purple-400' }
  ];

  const currentTabs = persona === 'OFFICER' ? officerTabs : citizenTabs;

  return (
    <aside aria-label="Quick Page Switcher" className={`fixed right-4 top-24 z-40 transition-all duration-300 ${isExpanded ? 'w-56' : 'w-14'} hidden md:block`}>
      <div className="glass-panel p-2.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col space-y-3">
        
        {/* Dock Header & Toggle Button */}
        <div className="flex items-center justify-between px-1.5 pb-2 border-b border-slate-700/40 dark:border-slate-800 light:border-slate-200">
          {isExpanded ? (
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-600">
                {persona === 'OFFICER' ? '🏛️ Officer Suite' : '👥 Citizen Portal'}
              </span>
            </div>
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400 mx-auto" />
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-slate-800/60 light:hover:bg-slate-200 text-slate-400 hover:text-white transition cursor-pointer"
            title={isExpanded ? 'Collapse Switcher' : 'Expand Switcher'}
          >
            {isExpanded ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Persona Mode Switcher Pills */}
        {isExpanded && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/60 dark:bg-slate-950/80 light:bg-slate-100 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300 text-[11px] font-bold">
            <button
              onClick={() => {
                setPersona('OFFICER');
                setActiveTab('admin');
              }}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                persona === 'OFFICER'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3 h-3 shrink-0" />
              <span>Officer</span>
            </button>

            <button
              onClick={() => {
                setPersona('CITIZEN');
                setActiveTab('citizen');
              }}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                persona === 'CITIZEN'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-900'
              }`}
            >
              <Users className="w-3 h-3 shrink-0" />
              <span>Citizen</span>
            </button>
          </div>
        )}

        {/* Navigation List Items */}
        <div className="space-y-1">
          {currentTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-xs font-semibold ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
                    : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/60 dark:hover:bg-slate-800/80 light:hover:bg-slate-200'
                }`}
                title={tab.label}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : tab.color}`} />
                  {isExpanded && <span className="truncate">{tab.label}</span>}
                </div>

                {/* Badge Notification */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${
                    isActive ? 'bg-slate-950 text-emerald-400' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Voice Assistant Floating Action Button in Dock */}
        <div className="pt-2 border-t border-slate-700/40 dark:border-slate-800 light:border-slate-200">
          <button
            onClick={onOpenVoiceAssistant}
            className="w-full py-2 px-2.5 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 hover:from-emerald-500 hover:to-indigo-600 hover:text-white dark:text-emerald-300 light:text-emerald-800 font-bold rounded-xl text-xs transition-all border border-emerald-500/30 flex items-center justify-center space-x-2 cursor-pointer shadow-md"
          >
            <Mic className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            {isExpanded && <span>Indic Voice Help</span>}
          </button>
        </div>

      </div>
    </aside>
  );
};
