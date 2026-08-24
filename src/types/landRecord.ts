export type RecordType = 
  | 'KHATAUNI'       // UP, MP, Bihar, Uttarakhand
  | 'JAMABANDI'      // Punjab, Haryana, Rajasthan, HP
  | 'SATBARA_7_12'   // Maharashtra, Gujarat
  | 'PAHANI_ROR_1B'  // Telangana, Andhra Pradesh
  | 'PATTA_CHITTA'   // Tamil Nadu, Kerala
  | 'BHUNAKSHA_MAP'; // Cadastral Spatial Map

export type LanguageCode = 'hi' | 'mr' | 'te' | 'ta' | 'bn' | 'gu' | 'kn' | 'en';

export type UserRole = 'OPERATOR' | 'TEHSILDAR' | 'ADMIN_DOLR' | 'CITIZEN';

export type RecordStatus = 
  | 'PENDING_PROCESSING'
  | 'PROCESSING'
  | 'HITL_REVIEW_NEEDED'
  | 'VERIFIED_BY_OPERATOR'
  | 'PENDING_TEHSILDAR_APPROVAL'
  | 'APPROVED'
  | 'REJECTED';

export type LandClassification = 
  | 'AGRICULTURAL_IRRIGATED'
  | 'AGRICULTURAL_UNIRRIGATED'
  | 'NON_AGRICULTURAL_RESIDENTIAL'
  | 'NON_AGRICULTURAL_COMMERCIAL'
  | 'GOVT_RESERVED_FOREST'
  | 'WATER_BODY_WETLAND'
  | 'GRAM_PANCHAYAT_COMMUNITY';

export interface BoundingBox {
  x: number; // percentage (0-100) or pixels
  y: number;
  width: number;
  height: number;
}

export interface ExtractedField<T> {
  value: T;
  rawValue?: string;
  confidence: number; // 0 to 100
  boundingBox?: BoundingBox;
  isFlagged?: boolean;
  flagReason?: string;
  isCorrected?: boolean;
  originalValue?: T;
}

export interface LandOwner {
  id: string;
  name: ExtractedField<string>;
  relationType: ExtractedField<'S/O' | 'D/O' | 'W/O' | 'C/O'>;
  relativeName: ExtractedField<string>;
  shareFraction: ExtractedField<string>; // e.g. "1/2", "1/4", "3/8"
  sharePercentage: number; // 50.0%
  areaShareHectares: number;
  aadharMasked: string; // "XXXX-XXXX-4921"
  panMasked?: string;
  gender: 'M' | 'F' | 'Other';
  isDisputed?: boolean;
}

export interface AreaDetail {
  value: ExtractedField<number>;
  unit: ExtractedField<'HECTARE' | 'ACRE' | 'BIGHA' | 'KATHA' | 'GUNTHA' | 'SQ_METER'>;
  standardHectares: number;
  standardAcres: number;
  standardSqMeters: number;
}

export interface MutationEntry {
  mutationNumber: string;
  date: string;
  type: 'SALE_DEED' | 'INHERITANCE' | 'GIFT' | 'PARTITION' | 'COURT_DECREE' | 'GOVT_ACQUISITION';
  fromParty: string;
  toParty: string;
  tehsildarOrderNo: string;
  status: 'MUTATED_AND_VERIFIED' | 'PENDING' | 'DISPUTED';
}

export interface Encumbrance {
  isEncumbered: boolean;
  bankOrFinancialInstitution?: string;
  loanAmount?: number;
  mortgageDate?: string;
  chargeId?: string;
  status: 'ACTIVE_LIEN' | 'NOC_ISSUED' | 'NO_ENCUMBRANCE';
}

export interface LitigationAlert {
  hasDispute: boolean;
  courtType?: 'HIGH_COURT' | 'DISTRICT_COURT' | 'REVENUE_COURT' | 'CIVIL_JUDGE';
  caseNumber?: string;
  petitioners?: string[];
  stayOrderActive?: boolean;
  summary?: string;
}

export interface CadastralPolygon {
  parcelId: string;
  khasraNo: string;
  coordinates: [number, number][]; // [lat, lng]
  center: [number, number];
  areaHectares: number;
  adjacentParcels: string[];
  colorStatus: 'NORMAL' | 'DISPUTED' | 'GOVT_PROTECTED' | 'PENDING_APPROVAL';
}

export interface LandRecord {
  id: string;
  ulpin: string; // 14-character alphanumeric Bhu-Aadhaar: e.g. "IN-UP-28-984210"
  recordType: RecordType;
  language: LanguageCode;
  
  // Location Hierarchy
  state: string;
  district: string;
  tehsil: string;
  village: string; // Mauza / Gram
  pincode: string;
  censusVillageCode: string;

  // Record Identifiers
  khasraNumber: ExtractedField<string>; // Plot/Survey No
  khataNumber: ExtractedField<string>;  // Account/Khata No
  khewatNumber?: ExtractedField<string>;
  subDivisionNo?: ExtractedField<string>;

  // Land Details
  landClassification: ExtractedField<LandClassification>;
  soilType?: string;
  irrigationStatus: 'IRRIGATED' | 'UNIRRIGATED' | 'SEMI_IRRIGATED';
  area: AreaDetail;
  calculatedShareSum: number; // Percentage check (should be 100%)

  // Owners & Holdings
  owners: LandOwner[];
  
  // Mutations & Legal
  mutations: MutationEntry[];
  encumbrance: Encumbrance;
  litigation: LitigationAlert;

  // Document & Processing Meta
  scanImageUrl: string;
  originalFileName: string;
  uploadTimestamp: string;
  processedTimestamp?: string;
  ocrEngine: 'TESSERACT_INDIC' | 'INDIC_BERT_HTR' | 'HYBRID_VISION_TRANSFORMER';
  overallConfidence: number; // 0 - 100
  status: RecordStatus;
  
  // Cadastral Spatial Link
  cadastralPolygon?: CadastralPolygon;

  // Audit and Blockchain
  blockchainHash: string;
  previousHash: string;
  verifiedByOperator?: string;
  approvedByTehsildar?: string;
  digitalSignatureHash?: string;
  approvalRemarks?: string;
}

export interface BlockchainBlock {
  blockIndex: number;
  timestamp: string;
  recordId: string;
  ulpin: string;
  khasraNo: string;
  action: 'SCAN_INGESTION' | 'OCR_EXTRACTION' | 'OPERATOR_HITL_CORRECTION' | 'TEHSILDAR_DIGITAL_APPROVAL' | 'REVENUE_COURT_MUTATION';
  performedBy: string;
  role: UserRole;
  dataHash: string;
  previousHash: string;
  currentHash: string;
  nonce: number;
}

export interface ValidationResult {
  passed: boolean;
  ruleCode: string;
  ruleName: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  suggestedAction?: string;
}
