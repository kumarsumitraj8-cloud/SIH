import React, { useState } from 'react';
import { LandRecord, UserRole, LanguageCode } from './types/landRecord';
import { INITIAL_LAND_RECORDS } from './services/sampleData';
import { Header } from './components/common/Header';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { OperatorWorkspace } from './components/dashboard/OperatorWorkspace';
import { HitlInspector } from './components/dashboard/HitlInspector';
import { TehsildarReviewPortal } from './components/dashboard/TehsildarReviewPortal';
import { CadastralGisViewer } from './components/dashboard/CadastralGisViewer';
import { CitizenPortal } from './components/dashboard/CitizenPortal';
import { BlockchainLedgerView } from './components/dashboard/BlockchainLedgerView';
import { ApiIntegrationHub } from './components/dashboard/ApiIntegrationHub';
import { ShieldCheck, Heart, Sparkles, Building2, Globe } from 'lucide-react';

export function App() {
  const [records, setRecords] = useState<LandRecord[]>(INITIAL_LAND_RECORDS);
  const [activeTab, setActiveTab] = useState<string>('admin');
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN_DOLR');
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [selectedRecordForHitl, setSelectedRecordForHitl] = useState<LandRecord | null>(null);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Universal Gov Navigation Header */}
      <Header
        currentRole={currentRole}
        setRole={(role) => {
          setCurrentRole(role);
          if (role === 'ADMIN_DOLR') setActiveTab('admin');
          else if (role === 'OPERATOR') setActiveTab('operator');
          else if (role === 'TEHSILDAR') setActiveTab('tehsildar');
          else if (role === 'CITIZEN') setActiveTab('citizen');
        }}
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingHitlCount={pendingHitlCount}
        pendingApprovalCount={pendingApprovalCount}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
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

        {activeTab === 'blockchain' && (
          <BlockchainLedgerView />
        )}

        {activeTab === 'api' && (
          <ApiIntegrationHub />
        )}

      </main>

      {/* Official Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-200 font-bold">
                BhoomiSetu AI • Intelligent Land Record Digitization &amp; Validation System
              </p>
              <p className="text-[11px] text-slate-400">
                Department of Land Resources (DoLR), Ministry of Rural Development, Government of India
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
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
