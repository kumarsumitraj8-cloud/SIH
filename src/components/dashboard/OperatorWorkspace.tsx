import React, { useState, useRef, useEffect } from 'react';
import { LandRecord, LanguageCode, RecordType } from '../../types/landRecord';
import { 
  Upload, Sliders, Play, RotateCw, Contrast, Sun, 
  Sparkles, CheckCircle2, FileImage, Cpu, Eye, ArrowRight, RefreshCw 
} from 'lucide-react';
import { DEFAULT_FILTERS, FilterOptions, processImageCanvas } from '../../services/imagePreprocessor';
import { runOcrPipeline, OcrProcessingProgress } from '../../services/ocrEngine';
import { createSampleScanSvg } from '../../services/sampleData';
import { convertLandArea } from '../../services/ulpinService';

interface OperatorWorkspaceProps {
  records: LandRecord[];
  onAddRecord: (newRecord: LandRecord) => void;
  onSelectRecordForHitl: (record: LandRecord) => void;
}

export const OperatorWorkspace: React.FC<OperatorWorkspaceProps> = ({
  records,
  onAddRecord,
  onSelectRecordForHitl
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    createSampleScanSvg('अधिकार अभिलेख (खतौनी)', 'हिंदी (Hindi)', '५२१/२', 'रामपुर (Rampur)')
  );
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('hi');
  const [selectedDocType, setSelectedDocType] = useState<RecordType>('KHATAUNI');
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProcessingProgress | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Re-apply filters whenever image or filter parameters change
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedImage;
    img.onload = async () => {
      imageObjRef.current = img;
      if (canvasRef.current) {
        const processed = await processImageCanvas(img, filters);
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          canvasRef.current.width = processed.width;
          canvasRef.current.height = processed.height;
          ctx.drawImage(processed, 0, 0);
        }
      }
    };
  }, [selectedImage, filters]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadPreset = (type: RecordType, title: string, lang: LanguageCode, khasra: string, village: string) => {
    setSelectedDocType(type);
    setSelectedLanguage(lang);
    setSelectedImage(createSampleScanSvg(title, lang.toUpperCase(), khasra, village));
  };

  const handleExecuteOcr = async () => {
    setIsProcessing(true);
    setOcrProgress({ status: 'Starting Multilingual Vision Transformer & Indic OCR...', progress: 10 });

    try {
      const canvas = canvasRef.current;
      const targetSource = canvas || selectedImage;

      const extracted = await runOcrPipeline(targetSource, selectedLanguage, (progress) => {
        setOcrProgress(progress);
      });

      const newRecord: LandRecord = {
        id: `REC-${selectedLanguage.toUpperCase()}-${Date.now().toString().slice(-4)}`,
        ulpin: extracted.ulpin || `IN-${selectedLanguage.toUpperCase()}-28-984210`,
        recordType: selectedDocType,
        language: selectedLanguage,
        state: extracted.state || 'Uttar Pradesh',
        district: extracted.district || 'Varanasi',
        tehsil: extracted.tehsil || 'Sadar',
        village: extracted.village || 'Rampur',
        pincode: extracted.pincode || '221002',
        censusVillageCode: '208149',
        khasraNumber: extracted.khasraNumber || { value: '521/2', confidence: 95 },
        khataNumber: extracted.khataNumber || { value: '00245', confidence: 94 },
        landClassification: extracted.landClassification || { value: 'AGRICULTURAL_IRRIGATED', confidence: 95 },
        irrigationStatus: 'IRRIGATED',
        area: extracted.area || {
          value: { value: 1.65, confidence: 96 },
          unit: { value: 'HECTARE', confidence: 98 },
          ...convertLandArea(1.65, 'HECTARE', 'UP')
        },
        calculatedShareSum: extracted.calculatedShareSum || 100,
        owners: extracted.owners || [],
        mutations: [],
        encumbrance: { isEncumbered: false, status: 'NO_ENCUMBRANCE' },
        litigation: { hasDispute: false },
        scanImageUrl: selectedImage,
        originalFileName: `Scan_${selectedDocType}_${Date.now()}.png`,
        uploadTimestamp: new Date().toISOString(),
        ocrEngine: 'INDIC_BERT_HTR',
        overallConfidence: extracted.overallConfidence || 94,
        status: (extracted.overallConfidence || 94) < 90 ? 'HITL_REVIEW_NEEDED' : 'PENDING_TEHSILDAR_APPROVAL',
        cadastralPolygon: {
          parcelId: `POLYGON-${Date.now().toString().slice(-4)}`,
          khasraNo: extracted.khasraNumber?.value || '521/2',
          coordinates: [
            [25.3170, 82.9740],
            [25.3190, 82.9745],
            [25.3185, 82.9770],
            [25.3168, 82.9760]
          ],
          center: [25.3178, 82.9754],
          areaHectares: extracted.area?.standardHectares || 1.65,
          adjacentParcels: ['521/1', '522', '520'],
          colorStatus: 'NORMAL'
        },
        blockchainHash: 'PENDING_BLOCK_CREATION',
        previousHash: '0000a3901bca7621ef9842109849201948201948291048201948201948201948',
        verifiedByOperator: 'OP_DIGITIZER_DEMO'
      };

      onAddRecord(newRecord);
      setIsProcessing(false);
      setOcrProgress(null);
      onSelectRecordForHitl(newRecord);
    } catch (err) {
      console.error('OCR pipeline failed', err);
      setIsProcessing(false);
      setOcrProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" /> Automated Multilingual Digitization Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pre-process damaged/faded scans, enhance contrast with Otsu thresholding, and trigger IndicBERT HTR.
          </p>
        </div>

        {/* Preset Sample Quick Loaders */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs text-slate-400 font-semibold">Load Sample:</span>
          <button
            onClick={() => loadPreset('KHATAUNI', 'अधिकार अभिलेख (खतौनी)', 'hi', '४१२/१', 'रामपुर (UP)')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            UP Khatauni (Hindi)
          </button>
          <button
            onClick={() => loadPreset('SATBARA_7_12', 'गाव नमुना ७/१२', 'mr', '८४/२अ', 'वाघोली (MH)')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            MH 7/12 (Marathi)
          </button>
          <button
            onClick={() => loadPreset('PAHANI_ROR_1B', 'పహానీ / ఆర్.ఓ.ఆర్', 'te', '214/AA', 'మామిడిపల్లి (TS)')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            TS Pahani (Telugu)
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Upload & Filter Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Upload Dropzone */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Ingest Document Scan / Cadastral Map
            </label>
            <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 text-center transition bg-slate-900/40 cursor-pointer">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
              <p className="text-xs font-semibold text-slate-200">Click or drag &amp; drop land record</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, TIFF, PDF (Handwritten &amp; Printed)</p>
            </div>
          </div>

          {/* Record Metadata Settings */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Extraction Configurations
            </h3>
            
            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Script / Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as LanguageCode)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="hi">हिंदी (Devanagari - Hindi/Bhojpuri)</option>
                <option value="mr">मराठी (Devanagari - Marathi)</option>
                <option value="te">తెలుగు (Telugu Script)</option>
                <option value="ta">தமிழ் (Tamil Script)</option>
                <option value="bn">বাংলা (Bengali Script)</option>
                <option value="en">English (Legacy Revenue Register)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Land Record Format</label>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value as RecordType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="KHATAUNI">Khatauni / Khatiyan (UP, Bihar, MP)</option>
                <option value="SATBARA_7_12">7/12 Extract / Satbara (Maharashtra, Gujarat)</option>
                <option value="PAHANI_ROR_1B">Pahani / ROR-1B (Telangana, AP)</option>
                <option value="JAMABANDI">Jamabandi (Punjab, Haryana, Rajasthan)</option>
                <option value="BHUNAKSHA_MAP">Cadastral Map (BhuNaksha Spatial Polygon)</option>
              </select>
            </div>
          </div>

          {/* Computer Vision Pre-processing Sliders */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Image Enhancement
              </h3>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Brightness */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Brightness</span>
                <span>{filters.brightness}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={filters.brightness}
                onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Adaptive Contrast</span>
                <span>{filters.contrast}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={filters.contrast}
                onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Otsu Binarize Threshold */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Otsu Binarization (Black/White)</span>
                <span>{filters.binarizeThreshold}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={filters.binarizeThreshold}
                onChange={(e) => setFilters({ ...filters, binarizeThreshold: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Rotation / Deskew */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Deskew / Rotation Angle</span>
                <span>{filters.rotationAngle}°</span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="0.5"
                value={filters.rotationAngle}
                onChange={(e) => setFilters({ ...filters, rotationAngle: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Invert */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-300">Invert Colors (Dark Mode Scan)</span>
              <input
                type="checkbox"
                checked={filters.invert}
                onChange={(e) => setFilters({ ...filters, invert: e.target.checked })}
                className="accent-emerald-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Trigger OCR Action Button */}
          <button
            onClick={handleExecuteOcr}
            disabled={isProcessing}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all ${
              isProcessing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Running Indic AI OCR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Run Multilingual Extraction
              </>
            )}
          </button>

          {/* Processing Progress Bar */}
          {ocrProgress && (
            <div className="glass-panel p-3 rounded-xl border border-emerald-500/30 space-y-1.5 animate-fadeIn">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400 font-medium">{ocrProgress.status}</span>
                <span className="text-slate-300 font-mono font-bold">{ocrProgress.progress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${ocrProgress.progress}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Right: Live Interactive Canvas Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileImage className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Enhanced Document Canvas (Live Filter View)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Resolution: 800 x 1100 px (300 DPI Standard)
              </span>
            </div>

            {/* Live Processed Canvas Viewport */}
            <div className="relative flex-1 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-auto flex items-center justify-center p-4">
              <canvas
                ref={canvasRef}
                className="max-h-[650px] w-auto shadow-2xl rounded-lg border border-slate-700/50"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Batch Ingestion Queue */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Active Queue ({records.length} Documents)</h3>
            <p className="text-xs text-slate-400">Click any document to open side-by-side Human-in-the-Loop (HITL) Inspector</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {records.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectRecordForHitl(rec)}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">{rec.ulpin}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  rec.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                  rec.status === 'HITL_REVIEW_NEEDED' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {rec.status === 'HITL_REVIEW_NEEDED' ? 'Review Needed' : rec.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                  Khasra {rec.khasraNumber.value}
                </h4>
                <p className="text-xs text-slate-400">{rec.village}, {rec.district} ({rec.state})</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400">
                <span>Confidence: <strong className="text-white">{rec.overallConfidence}%</strong></span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                  Inspect <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
