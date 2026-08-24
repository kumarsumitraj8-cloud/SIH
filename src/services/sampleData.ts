import { LandRecord } from '../types/landRecord';
import { generateUlpin, convertLandArea } from './ulpinService';

// SVG Land Record Document Generators for authentic scanned visual appearance
export function createSampleScanSvg(title: string, language: string, khasra: string, village: string): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#fcf8ee; font-family:'Noto Sans Devanagari', 'Plus Jakarta Sans', serif;">
    <defs>
      <!-- Paper grain texture -->
      <filter id="paper-texture" background-color="#fdfaf3" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
        <feDiffuseLighting in="noise" lighting-color="#f6efe1" surfaceScale="1.5" result="light">
          <feDistantLight azimuth="60" elevation="50" />
        </feDiffuseLighting>
        <feBlend mode="multiply" in="SourceGraphic" in2="light" />
      </filter>
      <!-- Stamp shadow -->
      <filter id="stamp-glow">
        <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#800" flood-opacity="0.3"/>
      </filter>
    </defs>
    
    <!-- Paper Background with subtle aging -->
    <rect width="800" height="1100" fill="#fcf6e8" filter="url(#paper-texture)"/>
    <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#655543" stroke-width="2" stroke-dasharray="6,2"/>
    <rect x="30" y="30" width="740" height="1040" fill="none" stroke="#8b7355" stroke-width="1"/>
    
    <!-- Top Emblem / Gov Seal -->
    <circle cx="400" cy="90" r="35" fill="none" stroke="#255784" stroke-width="2"/>
    <circle cx="400" cy="90" r="30" fill="none" stroke="#255784" stroke-width="1" stroke-dasharray="3,2"/>
    <text x="400" y="85" text-anchor="middle" font-size="9" font-weight="bold" fill="#255784" letter-spacing="1">GOVERNMENT OF INDIA</text>
    <text x="400" y="97" text-anchor="middle" font-size="11" font-weight="bold" fill="#255784">सत्यमेव जयते</text>
    <text x="400" y="108" text-anchor="middle" font-size="8" fill="#255784">DEPT OF LAND RESOURCES</text>
    
    <!-- Header Titles -->
    <text x="400" y="150" text-anchor="middle" font-size="18" font-weight="bold" fill="#2c1a0e" letter-spacing="1">${title}</text>
    <text x="400" y="172" text-anchor="middle" font-size="12" fill="#5c4430">Digital India Land Records Modernization Programme (DILRMP)</text>
    
    <!-- Record Identifiers Bar -->
    <rect x="50" y="190" width="700" height="42" fill="#ede2cc" stroke="#baa482" stroke-width="1" rx="4"/>
    <text x="70" y="216" font-size="12" font-weight="bold" fill="#3b2b1a">ग्राम/Village: <tspan fill="#1e3a8a">${village}</tspan></text>
    <text x="320" y="216" font-size="12" font-weight="bold" fill="#3b2b1a">खसरा/Survey No: <tspan fill="#b91c1c">${khasra}</tspan></text>
    <text x="560" y="216" font-size="12" font-weight="bold" fill="#3b2b1a">भाषा/Language: <tspan fill="#047857">${language}</tspan></text>

    <!-- Table Header Columns -->
    <g transform="translate(50, 250)">
      <rect x="0" y="0" width="700" height="35" fill="#3b2b1a" rx="3"/>
      <text x="35" y="22" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">क्र. (S.No)</text>
      <text x="130" y="22" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">खातेदार का नाम (Owner)</text>
      <text x="280" y="22" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">पिता/पति (Father/Husband)</text>
      <text x="410" y="22" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">हिस्सा (Share %)</text>
      <text x="520" y="22" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">क्षेत्रफल (Area)</text>
      <text x="635" y="22" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">टिप्पणी (Remarks)</text>
      
      <!-- Grid Lines & Rows (Simulating handwritten vintage script) -->
      <rect x="0" y="35" width="700" height="260" fill="#fffdfa" stroke="#baa482" stroke-width="1"/>
      <line x1="70" y1="35" x2="70" y2="295" stroke="#d5c7b2" stroke-width="1"/>
      <line x1="200" y1="35" x2="200" y2="295" stroke="#d5c7b2" stroke-width="1"/>
      <line x1="360" y1="35" x2="360" y2="295" stroke="#d5c7b2" stroke-width="1"/>
      <line x1="460" y1="35" x2="460" y2="295" stroke="#d5c7b2" stroke-width="1"/>
      <line x1="575" y1="35" x2="575" y2="295" stroke="#d5c7b2" stroke-width="1"/>
      
      <!-- Row 1 -->
      <line x1="0" y1="100" x2="700" y2="100" stroke="#e8decb" stroke-width="1"/>
      <text x="35" y="75" text-anchor="middle" font-size="13" font-family="monospace" fill="#1e293b">1</text>
      <text x="85" y="72" font-size="13" font-weight="600" fill="#1e1b4b">रामेश्वर प्रसाद सिंह</text>
      <text x="85" y="90" font-size="10" fill="#64748b">Rameshwar Prasad</text>
      <text x="215" y="72" font-size="13" fill="#1e1b4b">स्व. हरिशंकर सिंह</text>
      <text x="215" y="90" font-size="10" fill="#64748b">S/o Late Harishankar</text>
      <text x="410" y="75" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">1/2 (50%)</text>
      <text x="520" y="75" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">1.2500 Ha</text>
      <text x="585" y="75" font-size="11" fill="#0369a1">कृषि सिंचित</text>

      <!-- Row 2 -->
      <line x1="0" y1="165" x2="700" y2="165" stroke="#e8decb" stroke-width="1"/>
      <text x="35" y="140" text-anchor="middle" font-size="13" font-family="monospace" fill="#1e293b">2</text>
      <text x="85" y="137" font-size="13" font-weight="600" fill="#1e1b4b">सुनीता देवी</text>
      <text x="85" y="155" font-size="10" fill="#64748b">Sunita Devi</text>
      <text x="215" y="137" font-size="13" fill="#1e1b4b">रामेश्वर प्रसाद सिंह</text>
      <text x="215" y="155" font-size="10" fill="#64748b">W/o Rameshwar Prasad</text>
      <text x="410" y="140" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">1/4 (25%)</text>
      <text x="520" y="140" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">0.6250 Ha</text>
      <text x="585" y="140" font-size="11" fill="#0369a1">खातेदार</text>

      <!-- Row 3 -->
      <text x="35" y="205" text-anchor="middle" font-size="13" font-family="monospace" fill="#1e293b">3</text>
      <text x="85" y="202" font-size="13" font-weight="600" fill="#1e1b4b">अजय कुमार सिंह</text>
      <text x="85" y="220" font-size="10" fill="#64748b">Ajay Kumar Singh</text>
      <text x="215" y="202" font-size="13" fill="#1e1b4b">रामेश्वर प्रसाद सिंह</text>
      <text x="215" y="220" font-size="10" fill="#64748b">S/o Rameshwar Prasad</text>
      <text x="410" y="205" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">1/4 (25%)</text>
      <text x="520" y="205" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">0.6250 Ha</text>
      <text x="585" y="205" font-size="11" fill="#0369a1">नाबालिग/दर्ज</text>
    </g>

    <!-- Mutation / Patwari Handwritten Notes Section -->
    <g transform="translate(50, 570)">
      <rect x="0" y="0" width="700" height="150" fill="#faf5eb" stroke="#c4b59d" stroke-width="1" rx="4"/>
      <text x="20" y="28" font-size="13" font-weight="bold" fill="#78350f">नामांतरण विवरण एवं आदेश (Mutation Orders &amp; Encumbrances):</text>
      <text x="20" y="55" font-size="12" fill="#334155">• आदेश पत्रांक 2024/MUT/981 दिनांक 14-04-2024: वरासत नामांतरण स्वीकृत द्वारा तहसीलदार सदर।</text>
      <text x="20" y="80" font-size="12" fill="#b91c1c">• बंधक (Lien): भारतीय स्टेट बैंक शाखा सदर कृषि ऋण रु 3,50,000/- दिनांक 10-01-2025.</text>
      <text x="20" y="105" font-size="12" fill="#047857">• लगान/माल गुजारी: ₹ 48.50 वार्षिक जमा चालान सं. 89201.</text>
      <text x="20" y="130" font-size="11" font-style="italic" fill="#64748b">हस्ताक्षर लेखपाल / पटवारी हल्का सं. 14, तहसील सदर।</text>
    </g>

    <!-- Revenue Officer Official Stamp -->
    <g transform="translate(520, 750)" filter="url(#stamp-glow)">
      <circle cx="90" cy="90" r="70" fill="#fee2e2" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,2"/>
      <circle cx="90" cy="90" r="62" fill="none" stroke="#dc2626" stroke-width="1.5"/>
      <path id="curve-top" d="M 40,90 A 50,50 0 0,1 140,90" fill="none"/>
      <text font-size="9" font-weight="bold" fill="#dc2626" letter-spacing="1">
        <textPath href="#curve-top" startOffset="50%" text-anchor="middle">TEHSILDAR SADAR OFFICE</textPath>
      </text>
      <text x="90" y="82" text-anchor="middle" font-size="11" font-weight="bold" fill="#991b1b">तहसीलदार कार्यालय</text>
      <text x="90" y="98" text-anchor="middle" font-size="9" fill="#991b1b">VERIFIED RECORD</text>
      <text x="90" y="112" text-anchor="middle" font-size="8" font-family="monospace" fill="#dc2626">DATE: 2026-08-20</text>
    </g>

    <!-- Footer Bar -->
    <rect x="50" y="970" width="700" height="40" fill="#ede2cc" rx="3"/>
    <text x="70" y="995" font-size="11" fill="#475569">ULPIN (Bhu-Aadhaar): <tspan font-family="monospace" font-weight="bold" fill="#1e3a8a">IN-UP-28-984210</tspan></text>
    <text x="690" y="995" text-anchor="end" font-size="10" fill="#475569">Page 1 of 1 | MoRD DoLR DILRMP System</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_LAND_RECORDS: LandRecord[] = [
  {
    id: 'REC-UP-2026-001',
    ulpin: 'UP282491084121',
    recordType: 'KHATAUNI',
    language: 'hi',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    tehsil: 'Sadar',
    village: 'Rampur (रामपुर)',
    pincode: '221002',
    censusVillageCode: '208149',
    khasraNumber: {
      value: '412/1',
      rawValue: '४१२/१',
      confidence: 98,
      boundingBox: { x: 42, y: 19, width: 14, height: 4 }
    },
    khataNumber: {
      value: '00189',
      rawValue: '००१८९',
      confidence: 96,
      boundingBox: { x: 10, y: 19, width: 12, height: 4 }
    },
    landClassification: {
      value: 'AGRICULTURAL_IRRIGATED',
      rawValue: 'कृषि सिंचित भूमि (कक्षा 1-क)',
      confidence: 94,
      boundingBox: { x: 74, y: 31, width: 18, height: 4 }
    },
    soilType: 'Alluvial Loam (दोमट)',
    irrigationStatus: 'IRRIGATED',
    area: {
      value: { value: 2.5000, confidence: 97, rawValue: '2.5000 हेक्टेयर' },
      unit: { value: 'HECTARE', confidence: 99 },
      ...convertLandArea(2.5000, 'HECTARE', 'UP')
    },
    calculatedShareSum: 100.00,
    owners: [
      {
        id: 'OWN-001',
        name: { value: 'Rameshwar Prasad Singh', rawValue: 'रामेश्वर प्रसाद सिंह', confidence: 97, boundingBox: { x: 12, y: 31, width: 18, height: 3 } },
        relationType: { value: 'S/O', confidence: 99 },
        relativeName: { value: 'Late Harishankar Singh', rawValue: 'स्व. हरिशंकर सिंह', confidence: 95 },
        shareFraction: { value: '1/2', rawValue: '१/२', confidence: 98 },
        sharePercentage: 50.0,
        areaShareHectares: 1.2500,
        aadharMasked: 'XXXX-XXXX-4921',
        panMasked: 'XXXXX9102K',
        gender: 'M'
      },
      {
        id: 'OWN-002',
        name: { value: 'Sunita Devi', rawValue: 'सुनीता देवी', confidence: 96, boundingBox: { x: 12, y: 37, width: 18, height: 3 } },
        relationType: { value: 'W/O', confidence: 98 },
        relativeName: { value: 'Rameshwar Prasad Singh', rawValue: 'रामेश्वर प्रसाद सिंह', confidence: 96 },
        shareFraction: { value: '1/4', rawValue: '१/४', confidence: 97 },
        sharePercentage: 25.0,
        areaShareHectares: 0.6250,
        aadharMasked: 'XXXX-XXXX-8193',
        panMasked: 'XXXXX3310J',
        gender: 'F'
      },
      {
        id: 'OWN-003',
        name: { value: 'Ajay Kumar Singh', rawValue: 'अजय कुमार सिंह', confidence: 93, boundingBox: { x: 12, y: 43, width: 18, height: 3 } },
        relationType: { value: 'S/O', confidence: 98 },
        relativeName: { value: 'Rameshwar Prasad Singh', rawValue: 'रामेश्वर प्रसाद सिंह', confidence: 95 },
        shareFraction: { value: '1/4', rawValue: '१/४', confidence: 94 },
        sharePercentage: 25.0,
        areaShareHectares: 0.6250,
        aadharMasked: 'XXXX-XXXX-1102',
        gender: 'M'
      }
    ],
    mutations: [
      {
        mutationNumber: '2024/MUT/981',
        date: '2024-04-14',
        type: 'INHERITANCE',
        fromParty: 'Late Harishankar Singh',
        toParty: 'Rameshwar Prasad Singh, Sunita Devi, Ajay Kumar Singh',
        tehsildarOrderNo: 'TEH/SDR/2024/491',
        status: 'MUTATED_AND_VERIFIED'
      }
    ],
    encumbrance: {
      isEncumbered: true,
      bankOrFinancialInstitution: 'State Bank of India (Varanasi Branch)',
      loanAmount: 350000,
      mortgageDate: '2025-01-10',
      chargeId: 'CHG-SBI-2025-984',
      status: 'ACTIVE_LIEN'
    },
    litigation: {
      hasDispute: false
    },
    scanImageUrl: createSampleScanSvg('अधिकार अभिलेख (खतौनी)', 'हिंदी (Hindi)', '४१२/१ (412/1)', 'रामपुर (Rampur)'),
    originalFileName: 'UP_Varanasi_Rampur_Khasra_412_1.pdf',
    uploadTimestamp: '2026-08-20T10:15:00.000Z',
    processedTimestamp: '2026-08-20T10:15:12.000Z',
    ocrEngine: 'INDIC_BERT_HTR',
    overallConfidence: 96,
    status: 'APPROVED',
    cadastralPolygon: {
      parcelId: 'POLYGON-UP-412-1',
      khasraNo: '412/1',
      coordinates: [
        [25.3176, 82.9739],
        [25.3190, 82.9745],
        [25.3188, 82.9768],
        [25.3172, 82.9760]
      ],
      center: [25.31815, 82.9753],
      areaHectares: 2.5000,
      adjacentParcels: ['412/2', '413', '411', '408'],
      colorStatus: 'NORMAL'
    },
    blockchainHash: '00008f1b67a213904e22ab4f248231db7218659d48b4887b411d5ca35e167389',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    verifiedByOperator: 'OP_ANIL_SHARMA_89',
    approvedByTehsildar: 'TEHSILDAR_VIKRAM_ADITYA_IAS',
    digitalSignatureHash: 'DIGISIGN_GOV_IN_2026_84920194_UP',
    approvalRemarks: 'Verified against Cadastral Map 1982 survey and verified bank charge.'
  },
  {
    id: 'REC-MH-2026-002',
    ulpin: 'MH121849108422',
    recordType: 'SATBARA_7_12',
    language: 'mr',
    state: 'Maharashtra',
    district: 'Pune',
    tehsil: 'Haveli',
    village: 'Wagholi (वाघोली)',
    pincode: '412207',
    censusVillageCode: '556120',
    khasraNumber: {
      value: '84/2A',
      rawValue: '८४/२अ',
      confidence: 94,
      boundingBox: { x: 42, y: 19, width: 14, height: 4 }
    },
    khataNumber: {
      value: '741',
      rawValue: '७४१',
      confidence: 92,
      boundingBox: { x: 10, y: 19, width: 12, height: 4 }
    },
    landClassification: {
      value: 'AGRICULTURAL_UNIRRIGATED',
      rawValue: 'जिरायत (हंगामी बागायत)',
      confidence: 91
    },
    soilType: 'Medium Black (काळी जमीन)',
    irrigationStatus: 'SEMI_IRRIGATED',
    area: {
      value: { value: 1.8000, confidence: 95 },
      unit: { value: 'HECTARE', confidence: 98 },
      ...convertLandArea(1.8000, 'HECTARE', 'MH')
    },
    calculatedShareSum: 100.00,
    owners: [
      {
        id: 'OWN-004',
        name: { value: 'Tukaram Pandurang Patil', rawValue: 'तुकाराम पांडुरंग पाटील', confidence: 95 },
        relationType: { value: 'S/O', confidence: 97 },
        relativeName: { value: 'Pandurang Patil', rawValue: 'पांडुरंग पाटील', confidence: 93 },
        shareFraction: { value: '2/3', rawValue: '२/३', confidence: 94 },
        sharePercentage: 66.67,
        areaShareHectares: 1.2000,
        aadharMasked: 'XXXX-XXXX-9401',
        gender: 'M'
      },
      {
        id: 'OWN-005',
        name: { value: 'Anusaya Tukaram Patil', rawValue: 'अनुसया तुकाराम पाटील', confidence: 93 },
        relationType: { value: 'W/O', confidence: 97 },
        relativeName: { value: 'Tukaram Patil', rawValue: 'तुकाराम पाटील', confidence: 95 },
        shareFraction: { value: '1/3', rawValue: '१/३', confidence: 92 },
        sharePercentage: 33.33,
        areaShareHectares: 0.6000,
        aadharMasked: 'XXXX-XXXX-2041',
        gender: 'F'
      }
    ],
    mutations: [],
    encumbrance: {
      isEncumbered: false,
      status: 'NO_ENCUMBRANCE'
    },
    litigation: {
      hasDispute: false
    },
    scanImageUrl: createSampleScanSvg('गाव नमुना ७/१२ (अधिकार अभिलेख)', 'मराठी (Marathi)', '८४/२अ (84/2A)', 'वाघोली (Wagholi)'),
    originalFileName: 'MH_Pune_Wagholi_7_12_84_2A.png',
    uploadTimestamp: '2026-08-21T09:30:00.000Z',
    processedTimestamp: '2026-08-21T09:30:14.000Z',
    ocrEngine: 'HYBRID_VISION_TRANSFORMER',
    overallConfidence: 93,
    status: 'PENDING_TEHSILDAR_APPROVAL',
    cadastralPolygon: {
      parcelId: 'POLYGON-MH-84-2A',
      khasraNo: '84/2A',
      coordinates: [
        [18.5780, 73.9810],
        [18.5795, 73.9825],
        [18.5788, 73.9845],
        [18.5772, 73.9830]
      ],
      center: [18.57837, 73.98275],
      areaHectares: 1.8000,
      adjacentParcels: ['84/1', '84/2B', '85', '83'],
      colorStatus: 'NORMAL'
    },
    blockchainHash: '0000a3901bca7621ef9842109849201948201948291048201948201948201948',
    previousHash: '00008f1b67a213904e22ab4f248231db7218659d48b4887b411d5ca35e167389',
    verifiedByOperator: 'OP_SUNIL_DESHMUKH_12'
  },
  {
    id: 'REC-TS-2026-003',
    ulpin: 'TS362149108423',
    recordType: 'PAHANI_ROR_1B',
    language: 'te',
    state: 'Telangana',
    district: 'Rangareddy',
    tehsil: 'Shamshabad',
    village: 'Mamidipally (మామిడిపల్లి)',
    pincode: '501218',
    censusVillageCode: '574102',
    khasraNumber: {
      value: '214/AA',
      rawValue: '౨౧౪/ఎఎ',
      confidence: 78,
      isFlagged: true,
      flagReason: 'Low OCR clarity due to ink bleed on handwritten survey sub-division',
      boundingBox: { x: 42, y: 19, width: 14, height: 4 }
    },
    khataNumber: {
      value: '1042',
      rawValue: '౧౦౪౨',
      confidence: 81
    },
    landClassification: {
      value: 'GOVT_RESERVED_FOREST',
      rawValue: 'రిజర్వ్ ఫారెస్ట్ భూమి (Forest Buffer)',
      confidence: 89,
      isFlagged: true,
      flagReason: 'Reserved Government land classification. Requires special scrutiny.'
    },
    irrigationStatus: 'UNIRRIGATED',
    area: {
      value: { value: 3.4500, confidence: 76, isFlagged: true, flagReason: 'Fractional math mismatch with Khatiyan' },
      unit: { value: 'ACRE', confidence: 95 },
      ...convertLandArea(3.4500, 'ACRE', 'TS')
    },
    calculatedShareSum: 115.00, // Intentional mismatch for HITL demonstration
    owners: [
      {
        id: 'OWN-006',
        name: { value: 'K. Venkataiah Goud', rawValue: 'కె. వెంకటయ్య గౌడ్', confidence: 74, isFlagged: true, flagReason: 'Handwritten Telugu script smudged' },
        relationType: { value: 'S/O', confidence: 90 },
        relativeName: { value: 'Narsimha Goud', rawValue: 'నర్సింహ గౌడ్', confidence: 76 },
        shareFraction: { value: '3/4', rawValue: '3/4', confidence: 78 },
        sharePercentage: 75.0,
        areaShareHectares: 1.0470,
        aadharMasked: 'XXXX-XXXX-3891',
        gender: 'M'
      },
      {
        id: 'OWN-007',
        name: { value: 'K. Balraj Goud', rawValue: 'కె. బలరాజ్ గౌడ్', confidence: 82 },
        relationType: { value: 'S/O', confidence: 91 },
        relativeName: { value: 'Narsimha Goud', rawValue: 'నర్సింహ గౌడ్', confidence: 80 },
        shareFraction: { value: '2/5', rawValue: '2/5', confidence: 72, isFlagged: true, flagReason: 'Fraction sums to 115% (>100%)' },
        sharePercentage: 40.0,
        areaShareHectares: 0.5580,
        aadharMasked: 'XXXX-XXXX-6102',
        gender: 'M'
      }
    ],
    mutations: [],
    encumbrance: {
      isEncumbered: false,
      status: 'NO_ENCUMBRANCE'
    },
    litigation: {
      hasDispute: true,
      courtType: 'HIGH_COURT',
      caseNumber: 'WP/2025/11904',
      petitioners: ['Forest Dept Govt of TS', 'K. Venkataiah'],
      stayOrderActive: true,
      summary: 'Writ petition on demarcation of Forest buffer zone vs Patta boundaries. High Court stay order in effect.'
    },
    scanImageUrl: createSampleScanSvg('పహానీ / ఆర్.ఓ.ఆర్ - 1బి (Pahani ROR-1B)', 'తెలుగు (Telugu)', '214/AA', 'మామిడిపల్లి (Mamidipally)'),
    originalFileName: 'TS_Rangareddy_Mamidipally_Pahani_214AA.jpg',
    uploadTimestamp: '2026-08-22T14:20:00.000Z',
    ocrEngine: 'TESSERACT_INDIC',
    overallConfidence: 77,
    status: 'HITL_REVIEW_NEEDED',
    cadastralPolygon: {
      parcelId: 'POLYGON-TS-214-AA',
      khasraNo: '214/AA',
      coordinates: [
        [17.2400, 78.4280],
        [17.2420, 78.4310],
        [17.2390, 78.4335],
        [17.2370, 78.4300]
      ],
      center: [17.2395, 78.4306],
      areaHectares: 1.3961,
      adjacentParcels: ['214/A', '214/B', '215', '213'],
      colorStatus: 'DISPUTED'
    },
    blockchainHash: '0000c82910482019482019482019482019482019482019482019482019482019',
    previousHash: '0000a3901bca7621ef9842109849201948201948291048201948201948201948'
  },
  {
    id: 'REC-BR-2026-004',
    ulpin: 'BR101849108108',
    recordType: 'KHATAUNI',
    language: 'hi',
    state: 'Bihar',
    district: 'Patna',
    tehsil: 'Danapur',
    village: 'Khagaul (खगौल)',
    pincode: '801105',
    censusVillageCode: '241908',
    khasraNumber: {
      value: '108/2',
      rawValue: '१०८/२',
      confidence: 96
    },
    khataNumber: {
      value: '312',
      rawValue: '३१२',
      confidence: 94
    },
    landClassification: {
      value: 'NON_AGRICULTURAL_RESIDENTIAL',
      rawValue: 'आवासीय / गैर-कृषि',
      confidence: 95
    },
    irrigationStatus: 'UNIRRIGATED',
    area: {
      value: { value: 10.0, confidence: 95 },
      unit: { value: 'KATHA', confidence: 97 },
      ...convertLandArea(10.0, 'KATHA', 'BR')
    },
    calculatedShareSum: 100.00,
    owners: [
      {
        id: 'OWN-008',
        name: { value: 'Manoj Kumar Sharma', rawValue: 'मनोज कुमार शर्मा', confidence: 96 },
        relationType: { value: 'S/O', confidence: 99 },
        relativeName: { value: 'Kashi Nath Sharma', rawValue: 'काशी नाथ शर्मा', confidence: 94 },
        shareFraction: { value: '1/1', rawValue: '१/१ (पूर्ण)', confidence: 98 },
        sharePercentage: 100.0,
        areaShareHectares: 0.1264,
        aadharMasked: 'XXXX-XXXX-7140',
        gender: 'M'
      }
    ],
    mutations: [
      {
        mutationNumber: '2025/MUT/DN/418',
        date: '2025-06-19',
        type: 'SALE_DEED',
        fromParty: 'Rajeshwar Mishra',
        toParty: 'Manoj Kumar Sharma',
        tehsildarOrderNo: 'CO/DANAPUR/2025/112',
        status: 'MUTATED_AND_VERIFIED'
      }
    ],
    encumbrance: {
      isEncumbered: false,
      status: 'NO_ENCUMBRANCE'
    },
    litigation: {
      hasDispute: false
    },
    scanImageUrl: createSampleScanSvg('जमाबंदी / खतियान पंजी', 'हिंदी (Hindi)', '१०८/२ (108/2)', 'खगौल (Khagaul)'),
    originalFileName: 'BR_Patna_Danapur_Khagaul_108_2.pdf',
    uploadTimestamp: '2026-08-23T11:00:00.000Z',
    processedTimestamp: '2026-08-23T11:00:10.000Z',
    ocrEngine: 'INDIC_BERT_HTR',
    overallConfidence: 95,
    status: 'PENDING_TEHSILDAR_APPROVAL',
    cadastralPolygon: {
      parcelId: 'POLYGON-BR-108-2',
      khasraNo: '108/2',
      coordinates: [
        [25.5820, 85.0450],
        [25.5835, 85.0465],
        [25.5828, 85.0480],
        [25.5815, 85.0465]
      ],
      center: [25.58245, 85.0465],
      areaHectares: 0.1264,
      adjacentParcels: ['108/1', '109', '107'],
      colorStatus: 'NORMAL'
    },
    blockchainHash: '0000d92019482019482019482019482019482019482019482019482019482019',
    previousHash: '0000c82910482019482019482019482019482019482019482019482019482019',
    verifiedByOperator: 'OP_PRIYA_VERMA_04'
  }
];
