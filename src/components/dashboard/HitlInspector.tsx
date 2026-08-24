import React, { useState, useEffect } from 'react';
import { LandRecord, LandOwner, LandClassification } from '../../types/landRecord';
import { validateLandRecord } from '../../services/validationEngine';
import { convertLandArea } from '../../services/ulpinService';
import { 
  CheckCircle, AlertCircle, AlertTriangle, Save, 
  ArrowLeft, FileText, UserCheck, ShieldAlert, Sparkles, Scale, Info 
} from 'lucide-react';

interface HitlInspectorProps {
  record: LandRecord;
  onUpdateRecord: (updated: LandRecord) => void;
  onBack: () => void;
}

export const HitlInspector: React.FC<HitlInspectorProps> = ({
  record,
  onUpdateRecord,
  onBack
}) => {
  const [formData, setFormData] = useState<LandRecord>({ ...record });
  const [activeHighlightField, setActiveHighlightField] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    setFormData({ ...record });
  }, [record]);

  // Recalculate validation rules on the fly
  const validationResults = validateLandRecord(formData);
  const criticalErrors = validationResults.filter(v => !v.passed && v.severity === 'CRITICAL');
  const warnings = validationResults.filter(v => !v.passed && v.severity === 'WARNING');

  // Recalculate total share percentage sum
  const currentTotalShare = formData.owners.reduce((sum, o) => sum + (Number(o.sharePercentage) || 0), 0);
  const isShareSumValid = Math.abs(currentTotalShare - 100) < 0.1;

  const handleKhasraChange = (newVal: string) => {
    setFormData(prev => ({
      ...prev,
      khasraNumber: { ...prev.khasraNumber, value: newVal, isCorrected: true }
    }));
  };

  const handleKhataChange = (newVal: string) => {
    setFormData(prev => ({
      ...prev,
      khataNumber: { ...prev.khataNumber, value: newVal, isCorrected: true }
    }));
  };

  const handleAreaChange = (newVal: number, unit: any) => {
    const converted = convertLandArea(newVal, unit, formData.state);
    setFormData(prev => ({
      ...prev,
      area: {
        ...prev.area,
        value: { ...prev.area.value, value: newVal, isCorrected: true },
        unit: { ...prev.area.unit, value: unit },
        ...converted
      }
    }));
  };

  const handleOwnerShareChange = (ownerId: string, fractionStr: string, percentage: number) => {
    const updatedOwners = formData.owners.map(owner => {
      if (owner.id === ownerId) {
        return {
          ...owner,
          shareFraction: { ...owner.shareFraction, value: fractionStr, isCorrected: true },
          sharePercentage: percentage,
          areaShareHectares: (formData.area.standardHectares * percentage) / 100
        };
      }
      return owner;
    });

    const newSum = updatedOwners.reduce((s, o) => s + (o.sharePercentage || 0), 0);

    setFormData(prev => ({
      ...prev,
      owners: updatedOwners,
      calculatedShareSum: newSum
    }));
  };

  const handleOwnerNameChange = (ownerId: string, newName: string) => {
    const updatedOwners = formData.owners.map(owner => {
      if (owner.id === ownerId) {
        return {
          ...owner,
          name: { ...owner.name, value: newName, isCorrected: true }
        };
      }
      return owner;
    });
    setFormData(prev => ({ ...prev, owners: updatedOwners }));
  };

  const handleSaveAndSubmit = () => {
    const updated: LandRecord = {
      ...formData,
      status: criticalErrors.length > 0 ? 'HITL_REVIEW_NEEDED' : 'PENDING_TEHSILDAR_APPROVAL',
      verifiedByOperator: 'OP_VERIFIED_HITL'
    };
    onUpdateRecord(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Top Action Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-emerald-400">{formData.ulpin}</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-300">{formData.state} &gt; {formData.district} &gt; {formData.village}</span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Human-in-the-Loop (HITL) Verification Studio
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">AI Confidence</span>
            <span className={`text-sm font-extrabold ${formData.overallConfidence >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {formData.overallConfidence}% Overall Score
            </span>
          </div>

          <button
            onClick={handleSaveAndSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Saved & Verified!' : 'Save & Submit to Tehsildar'}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: High-Res Scan with Interactive Bounding Boxes (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Original Scanned Document
            </span>
            <span className="text-[10px] text-slate-400">Hover fields to locate on document</span>
          </div>

          <div className="relative flex-1 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
            <div className="relative inline-block max-h-[620px]">
              <img
                src={formData.scanImageUrl}
                alt="Original Land Record Scan"
                className="max-h-[620px] w-auto rounded shadow-xl object-contain"
              />

              {/* Highlight Bounding Box Overlays */}
              {activeHighlightField === 'khasra' && (
                <div 
                  className="absolute border-2 border-emerald-400 bg-emerald-500/25 rounded animate-pulse"
                  style={{ left: '38%', top: '17%', width: '24%', height: '5%' }}
                />
              )}
              {activeHighlightField === 'khata' && (
                <div 
                  className="absolute border-2 border-cyan-400 bg-cyan-500/25 rounded animate-pulse"
                  style={{ left: '8%', top: '17%', width: '22%', height: '5%' }}
                />
              )}
              {activeHighlightField === 'owners' && (
                <div 
                  className="absolute border-2 border-amber-400 bg-amber-500/25 rounded animate-pulse"
                  style={{ left: '6%', top: '27%', width: '88%', height: '23%' }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Extracted Fields & Active Learning (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Mathematical Consistency Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isShareSumValid 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : 'bg-amber-950/50 border-amber-500/50 text-amber-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                {isShareSumValid ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {isShareSumValid ? 'Mathematical Share Consistency: Valid' : 'Discrepancy Detected: Shareholder Proportion Mismatch'}
                  </h4>
                  <p className="text-xs opacity-90">
                    Total Share Sum: <strong>{currentTotalShare.toFixed(2)}%</strong> (Standard requirement: 100.00%)
                  </p>
                </div>
              </div>
              {!isShareSumValid && (
                <button
                  onClick={() => {
                    // Quick Auto-normalize
                    const count = formData.owners.length;
                    const equalShare = 100 / count;
                    const updated = formData.owners.map(o => ({
                      ...o,
                      sharePercentage: equalShare,
                      shareFraction: { ...o.shareFraction, value: `1/${count}`, isCorrected: true },
                      areaShareHectares: (formData.area.standardHectares * equalShare) / 100
                    }));
                    setFormData(prev => ({ ...prev, owners: updated, calculatedShareSum: 100 }));
                  }}
                  className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-amber-400 cursor-pointer"
                >
                  Auto-Balance
                </button>
              )}
            </div>
          </div>

          {/* Section 1: Record Identifiers */}
          <div 
            className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3"
            onMouseEnter={() => setActiveHighlightField('khasra')}
            onMouseLeave={() => setActiveHighlightField(null)}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Land Record Coordinates &amp; Identifiers</span>
              <span className="text-[10px] text-emerald-400 font-mono">ULPIN: {formData.ulpin}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Khasra No */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400">Khasra / Survey No.</label>
                  <span className="text-[10px] text-emerald-400 font-bold">{formData.khasraNumber.confidence}% AI</span>
                </div>
                <input
                  type="text"
                  value={formData.khasraNumber.value}
                  onChange={(e) => handleKhasraChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Khata No */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400">Khata / Account No.</label>
                  <span className="text-[10px] text-emerald-400 font-bold">{formData.khataNumber.confidence}% AI</span>
                </div>
                <input
                  type="text"
                  value={formData.khataNumber.value}
                  onChange={(e) => handleKhataChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Land Classification */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400">Land Classification</label>
                  <span className="text-[10px] text-emerald-400 font-bold">{formData.landClassification.confidence}% AI</span>
                </div>
                <select
                  value={formData.landClassification.value}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    landClassification: { ...prev.landClassification, value: e.target.value as LandClassification, isCorrected: true }
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="AGRICULTURAL_IRRIGATED">Agricultural Irrigated</option>
                  <option value="AGRICULTURAL_UNIRRIGATED">Agricultural Unirrigated</option>
                  <option value="NON_AGRICULTURAL_RESIDENTIAL">Residential Non-Agri</option>
                  <option value="NON_AGRICULTURAL_COMMERCIAL">Commercial Non-Agri</option>
                  <option value="GOVT_RESERVED_FOREST">Govt Reserved Forest Zone</option>
                  <option value="WATER_BODY_WETLAND">Water Body / Wetland</option>
                </select>
              </div>
            </div>

            {/* Total Area & Standard Unit Converter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Total Recorded Area</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.area.value.value}
                    onChange={(e) => handleAreaChange(Number(e.target.value), formData.area.unit.value)}
                    className="w-2/3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={formData.area.unit.value}
                    onChange={(e) => handleAreaChange(formData.area.value.value, e.target.value)}
                    className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="HECTARE">Hectares</option>
                    <option value="ACRE">Acres</option>
                    <option value="BIGHA">Bigha</option>
                    <option value="KATHA">Katha</option>
                    <option value="GUNTHA">Guntha</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Standard Standardized Area:</span>
                <span className="text-xs font-bold text-emerald-400">
                  {formData.area.standardHectares.toFixed(4)} Ha = {formData.area.standardAcres.toFixed(2)} Acres ({formData.area.standardSqMeters.toLocaleString('en-IN')} m²)
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Registered Co-Owners */}
          <div 
            className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3"
            onMouseEnter={() => setActiveHighlightField('owners')}
            onMouseLeave={() => setActiveHighlightField(null)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Registered Co-Owners &amp; Shares
              </h3>
              <span className="text-xs text-slate-400">{formData.owners.length} Shareholders</span>
            </div>

            <div className="space-y-3">
              {formData.owners.map((owner, idx) => (
                <div key={owner.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Owner #{idx + 1}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{owner.name.confidence}% OCR</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Full Name</label>
                      <input
                        type="text"
                        value={owner.name.value}
                        onChange={(e) => handleOwnerNameChange(owner.id, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Relation &amp; Relative Name</label>
                      <div className="flex space-x-1.5">
                        <span className="bg-slate-800 px-2 py-1.5 text-[11px] rounded text-slate-300 font-mono font-bold">
                          {owner.relationType.value}
                        </span>
                        <input
                          type="text"
                          value={owner.relativeName.value}
                          readOnly
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Fractional Share</label>
                      <input
                        type="text"
                        value={owner.shareFraction.value}
                        onChange={(e) => {
                          const frac = e.target.value;
                          let pct = owner.sharePercentage;
                          if (frac === '1/2') pct = 50;
                          else if (frac === '1/4') pct = 25;
                          else if (frac === '1/3') pct = 33.33;
                          else if (frac === '2/3') pct = 66.67;
                          else if (frac === '1/1') pct = 100;
                          handleOwnerShareChange(owner.id, frac, pct);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Share %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={owner.sharePercentage}
                        onChange={(e) => handleOwnerShareChange(owner.id, owner.shareFraction.value, Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Calculated Area (Ha)</label>
                      <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200">
                        {owner.areaShareHectares.toFixed(4)} Ha
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Rule-Engine Cross Validation Alerts */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-purple-400" /> Automated Rule-Engine Diagnostics
            </h3>

            <div className="space-y-1.5">
              {validationResults.map((rule, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-start space-x-2 text-xs ${
                    rule.passed 
                      ? 'bg-slate-900/50 border-slate-800/80 text-slate-300' 
                      : rule.severity === 'CRITICAL'
                        ? 'bg-red-950/40 border-red-500/40 text-red-300'
                        : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {rule.passed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : rule.severity === 'CRITICAL' ? (
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">{rule.ruleName}</span>
                    <span className="opacity-90">{rule.description}</span>
                    {rule.suggestedAction && (
                      <span className="block text-[11px] text-cyan-300 mt-0.5 font-medium">
                        💡 Suggestion: {rule.suggestedAction}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
