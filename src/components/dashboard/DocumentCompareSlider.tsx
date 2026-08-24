import React, { useState } from 'react';
import { LandRecord } from '../../types/landRecord';
import { Split, Eye, Sparkles, CheckCircle2, FileText, Layers } from 'lucide-react';

interface DocumentCompareSliderProps {
  record: LandRecord;
}

export const DocumentCompareSlider: React.FC<DocumentCompareSliderProps> = ({ record }) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Visual AI Verification
            </span>
            <span className="text-xs text-slate-400">Before &amp; After Neural Reconstruction</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 dark:text-white light:text-slate-900 mt-1 flex items-center gap-2">
            <Split className="w-5 h-5 text-purple-400" /> Scanned Register vs. Clean Digitized e-Record
          </h2>
          <p className="text-xs text-slate-400">
            Slide horizontally to visually compare the raw handwritten revenue record against the AI-extracted digital typography.
          </p>
        </div>

        {/* Preset Split Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSliderPosition(0)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-slate-200 text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-800 hover:bg-slate-800 transition cursor-pointer"
          >
            100% Digitized
          </button>
          <button
            onClick={() => setSliderPosition(50)}
            className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            50 / 50 Split
          </button>
          <button
            onClick={() => setSliderPosition(100)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-slate-200 text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-800 hover:bg-slate-800 transition cursor-pointer"
          >
            100% Raw Scan
          </button>
        </div>
      </div>

      {/* Main Interactive Split Viewport */}
      <div className="glass-panel p-4 rounded-3xl border space-y-4">
        
        {/* Slider Position Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-2">
          <span className="flex items-center gap-1 font-bold text-amber-400">
            <FileText className="w-3.5 h-3.5" /> Historical Handwritten Register ({sliderPosition}%)
          </span>
          <span className="flex items-center gap-1 font-bold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" /> AI Clean Digitized Vector ({100 - sliderPosition}%)
          </span>
        </div>

        {/* Range Controller */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
        />

        {/* Visual Split Frame */}
        <div className="relative h-[650px] w-full rounded-2xl overflow-hidden border border-slate-800 dark:border-slate-800 light:border-slate-300 shadow-2xl bg-slate-950">
          
          {/* Background Layer: Clean Modern Digitized Representation */}
          <div className="absolute inset-0 bg-slate-900 dark:bg-slate-900 light:bg-slate-50 p-6 overflow-y-auto flex flex-col justify-start space-y-4 text-slate-100 dark:text-white light:text-slate-900">
            <div className="max-w-xl mx-auto w-full space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/40 dark:bg-emerald-950/40 light:bg-emerald-50 border border-emerald-500/30 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Digitally Certified e-Parcha</span>
                <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                  खसरा सं. {record.khasraNumber.value} • खाता सं. {record.khataNumber.value}
                </h3>
                <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                  {record.village}, तहसील {record.tehsil}, {record.district} ({record.state})
                </p>
              </div>

              {/* Clean Table */}
              <div className="rounded-xl overflow-hidden border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs">
                <div className="bg-slate-800 dark:bg-slate-800 light:bg-slate-200 p-2.5 font-bold flex justify-between">
                  <span>खातेदार का नाम (Registered Owner)</span>
                  <span>हिस्सा (Share %)</span>
                  <span>क्षेत्रफल (Standard Area)</span>
                </div>
                {record.owners.map((owner, idx) => (
                  <div key={idx} className="p-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 flex justify-between items-center bg-slate-950/40 dark:bg-slate-950/40 light:bg-white">
                    <div>
                      <strong className="block text-white dark:text-white light:text-slate-900">{owner.name.value}</strong>
                      <span className="text-[11px] text-slate-400">{owner.relationType.value} {owner.relativeName.value}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{owner.shareFraction.value} ({owner.sharePercentage}%)</span>
                    <span className="font-mono font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">{owner.areaShareHectares.toFixed(4)} Ha</span>
                  </div>
                ))}
              </div>

              {/* Clean Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200">
                  <span className="text-slate-400 block text-[10px]">भूमि वर्गीकरण (Classification)</span>
                  <strong className="text-emerald-400">{record.landClassification.value.replace(/_/g, ' ')}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200">
                  <span className="text-slate-400 block text-[10px]">कुल मानक क्षेत्रफल (Total Area)</span>
                  <strong className="text-white dark:text-white light:text-slate-900">{record.area.standardHectares.toFixed(4)} Hectares</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Foreground Layer (Scanned Document) Clipped by Slider */}
          <div 
            className="absolute inset-y-0 left-0 overflow-hidden transition-all duration-75 border-r-2 border-purple-400 bg-amber-50"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="w-[800px] h-full flex items-center justify-center p-4">
              <img
                src={record.scanImageUrl}
                alt="Raw Scanned Land Register"
                className="max-h-[620px] w-auto shadow-2xl object-contain"
              />
            </div>
          </div>

          {/* Draggable Divider Line Badge */}
          <div 
            className="absolute inset-y-0 w-1 bg-purple-500 pointer-events-none flex items-center justify-center"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-8 h-8 -ml-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-2xl border-2 border-white text-xs font-bold">
              ↔
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
