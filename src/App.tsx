import React, { useState, useEffect } from 'react';
import { LandRecord, UserRole, LanguageCode } from './types/landRecord';
import { INITIAL_LAND_RECORDS } from './services/sampleData';
import { Header } from './components/common/Header';
import { RightPageSwitcher, UserPersona } from './components/common/RightPageSwitcher';
import { IndicVoiceAssistant } from './components/common/IndicVoiceAssistant';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { OperatorWorkspace } from './components/dashboard/OperatorWorkspace';
import { HitlInspector } from './components/dashboard/HitlInspector';
import { TehsildarReviewPortal } from './components/dashboard/TehsildarReviewPortal';
import { CadastralGisViewer } from './components/dashboard/CadastralGisViewer';
import { CitizenPortal } from './components/dashboard/CitizenPortal';
import { CitizenMutationPortal } from './components/dashboard/CitizenMutationPortal';
import { DocumentCompareSlider } from './components/dashboard/DocumentCompareSlider';
import { BlockchainLedgerView } from './components/dashboard/BlockchainLedgerView';
import { ApiIntegrationHub } from './components/dashboard/ApiIntegrationHub';
import { ShieldCheck } from 'lucide-react';

export function App() {
  const [records, setRecords] = useState<LandRecord[]>(INITIAL_LAND_RECORDS);
  const [activeTab, setActiveTab] = useState<string>('admin');
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN_DOLR');
  const [persona, setPersona] = useState<UserPersona>('OFFICER');
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [selectedRecordForHitl, setSelectedRecordForHitl] = useState<LandRecord | null>(null);

  // Sync theme to root html element class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const pendingHitlCount = records.filter(r => r.status === 'HITL_REVIEW_NEEDED').length;
  const pendingApprovalCount = records.filter(r => r.status === 'PENDING_TEHSILDAR_APPROVAL').length;

  const handleAddRecord = (newRecord: LandRecord) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  const handleUpdateRecord = (updated: LandRecord) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedRecordForHitl(null);
  };

  const handleApproveRecord = (recordId: string, remarks: string) => {
    setRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'APPROVED',
          approvedByTehsildar: 'TEHSILDAR_VIKRAM_ADITYA_IAS',
          digitalSignatureHash: `DIGISIGN_GOV_IN_${Date.now()}_APPROVED`,
          approvalRemarks: remarks
        };
      }
      return r;
    }));
  };

  const handleRejectRecord = (recordId: string, remarks: string) => {
    setRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'HITL_REVIEW_NEEDED',
          approvalRemarks: `FLAGGED BY TEHSILDAR: ${remarks}`
        };
      }
      return r;
    }));
  };

  const handleSelectRecordFromAnywhere = (rec: LandRecord) => {
    setSelectedRecordForHitl(rec);
    setActiveTab('hitl');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans selection:bg-emerald-500 selection:text-white ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Universal Navigation Header */}
      <Header
        currentRole={currentRole}
        setRole={(role) => {
          setCurrentRole(role);
          if (role === 'ADMIN_DOLR') setActiveTab('admin');
          else if (role === 'OPERATOR') setActiveTab('operator');
          else if (role === 'TEHSILDAR') setActiveTab('tehsildar');
        }}
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingHitlCount={pendingHitlCount}
        pendingApprovalCount={pendingApprovalCount}
        theme={theme}
        setTheme={setTheme}
        persona={persona}
        setPersona={setPersona}
        onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
      />

      {/* Floating Right-Side Page Switcher Dock */}
      <RightPageSwitcher
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        persona={persona}
        setPersona={setPersona}
        pendingHitlCount={pendingHitlCount}
        pendingApprovalCount={pendingApprovalCount}
        onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
      />

      {/* Multilingual Voice Assistant Modal */}
      <IndicVoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSelectRecord={handleSelectRecordFromAnywhere}
        records={records}
        onNavigateTab={setActiveTab}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pr-4 md:pr-18">
        
        {activeTab === 'admin' && (
          <AdminDashboard
            records={records}
            onSelectRecord={handleSelectRecordFromAnywhere}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'operator' && (
          <OperatorWorkspace
            records={records}
            onAddRecord={handleAddRecord}
            onSelectRecordForHitl={(rec) => {
              setSelectedRecordForHitl(rec);
              setActiveTab('hitl');
            }}
          />
        )}

        {activeTab === 'hitl' && (
          <HitlInspector
            record={selectedRecordForHitl || records[0]}
            onUpdateRecord={handleUpdateRecord}
            onBack={() => setActiveTab('operator')}
          />
        )}

        {activeTab === 'tehsildar' && (
          <TehsildarReviewPortal
            records={records}
            onApproveRecord={handleApproveRecord}
            onRejectRecord={handleRejectRecord}
          />
        )}

        {activeTab === 'gis' && (
          <CadastralGisViewer
            records={records}
            onSelectRecord={handleSelectRecordFromAnywhere}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenPortal
            records={records}
          />
        )}

        {activeTab === 'mutation' && (
          <CitizenMutationPortal />
        )}

        {activeTab === 'compare' && (
          <DocumentCompareSlider
            record={selectedRecordForHitl || records[0]}
          />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainLedgerView />
        )}

        {activeTab === 'api' && (
          <ApiIntegrationHub />
        )}

      </main>

      {/* Official Footer */}
      <footer className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border-t border-slate-800 dark:border-slate-800 light:border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <p className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-bold">
                BhoomiSetu AI • Intelligent Land Record Digitization &amp; Validation System
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 light:text-slate-600">
                Department of Land Resources (DoLR), Ministry of Rural Development, Government of India
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DLT Node Active</span>
            </span>
            <span>ULPIN Compliant (14-Digit Bhu-Aadhaar)</span>
            <span>DILRMP 2.0 Framework</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
