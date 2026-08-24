import React, { useState } from 'react';
import { Mic, X, Volume2, Sparkles, Check, ArrowRight } from 'lucide-react';
import { LandRecord } from '../../types/landRecord';

interface IndicVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (record: LandRecord) => void;
  records: LandRecord[];
  onNavigateTab: (tab: string) => void;
}

interface VoiceCommand {
  language: string;
  queryText: string;
  translatedMeaning: string;
  targetRecordId?: string;
  targetTab?: string;
}

export const IndicVoiceAssistant: React.FC<IndicVoiceAssistantProps> = ({
  isOpen,
  onClose,
  onSelectRecord,
  records,
  onNavigateTab
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [activeLang, setActiveLang] = useState<string>('hi');

  if (!isOpen) return null;

  const sampleCommands: VoiceCommand[] = [
    {
      language: 'Hindi (हिंदी)',
      queryText: 'वाराणसी रामपुर का खसरा ४१२/१ खतौनी दिखाओ',
      translatedMeaning: 'Show Khatauni for Khasra 412/1 in Rampur, Varanasi',
      targetRecordId: 'REC-UP-2026-001',
      targetTab: 'citizen'
    },
    {
      language: 'Marathi (मराठी)',
      queryText: 'पुण्यातील वाघोली ८४/२अ चा ७/१२ दाखवा',
      translatedMeaning: 'Show 7/12 Satbara for 84/2A in Wagholi, Pune',
      targetRecordId: 'REC-MH-2026-002',
      targetTab: 'citizen'
    },
    {
      language: 'Telugu (తెలుగు)',
      queryText: 'మామిడిపల్లి సర్వే 214/AA పహానీ రికార్డు చూపించు',
      translatedMeaning: 'Show Pahani Record for Survey 214/AA Mamidipally',
      targetRecordId: 'REC-TS-2026-003',
      targetTab: 'citizen'
    },
    {
      language: 'English',
      queryText: 'Check GIS boundary and court stay orders for disputed forest buffer',
      translatedMeaning: 'Inspect GIS Cadastral Map for disputed parcels',
      targetRecordId: 'REC-TS-2026-003',
      targetTab: 'gis'
    }
  ];

  const handleExecuteVoiceQuery = (cmd: VoiceCommand) => {
    setIsListening(true);
    setRecognizedText(cmd.queryText);

    setTimeout(() => {
      setIsListening(false);
      if (cmd.targetRecordId) {
        const found = records.find(r => r.id === cmd.targetRecordId);
        if (found) onSelectRecord(found);
      }
      if (cmd.targetTab) {
        onNavigateTab(cmd.targetTab);
      }
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-800/80 light:hover:bg-slate-200 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> BhashaSetu Indic Voice AI
          </span>
          <h3 className="text-xl font-extrabold text-slate-100 dark:text-white light:text-slate-900">
            Multilingual Voice Land Assistant
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Speak in your regional language to locate Khasra numbers, check mutation status, or view BhuNaksha GIS maps.
          </p>
        </div>

        {/* Pulsing Voice Orb Visualizer */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? 'bg-gradient-to-tr from-emerald-500 to-cyan-400 animate-voice-ripple shadow-2xl text-slate-950'
              : 'bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:scale-105'
          }`}>
            <Mic className="w-10 h-10" />
          </div>

          <div className="mt-3 text-center">
            {isListening ? (
              <span className="text-xs font-bold text-emerald-400 animate-pulse">
                Listening &amp; Translating: "{recognizedText}"...
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Click any voice prompt below or tap to speak
              </span>
            )}
          </div>
        </div>

        {/* Clickable Preset Speech Prompts */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
            Suggested Voice Queries (बहुभाषी उदाहरण):
          </span>

          <div className="space-y-2">
            {sampleCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteVoiceQuery(cmd)}
                className="w-full p-3 rounded-xl bg-slate-900/70 dark:bg-slate-900/70 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-emerald-500/60 transition text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400">
                      {cmd.language}
                    </span>
                    <span className="text-xs font-bold text-slate-100 dark:text-white light:text-slate-900 group-hover:text-emerald-400 transition">
                      "{cmd.queryText}"
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{cmd.translatedMeaning}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
