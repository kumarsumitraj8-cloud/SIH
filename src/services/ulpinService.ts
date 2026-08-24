/**
 * ULPIN (Unique Land Parcel Identification Number / Bhu-Aadhaar) Generator
 * Based on DoLR / NIC Spatial Standards (14-digit Geo-referenced Hash)
 */

export function generateUlpin(
  lat: number,
  lng: number,
  stateCode: string,
  districtCode: string,
  khasraNo: string
): string {
  // Convert lat/lng to micro-arc second integer hash
  const latInt = Math.floor((Math.abs(lat) * 100000) % 10000);
  const lngInt = Math.floor((Math.abs(lng) * 100000) % 10000);
  
  // Format Khasra numeric hash
  const khasraClean = khasraNo.replace(/[^0-9]/g, '').slice(0, 4).padStart(4, '0');
  
  const rawString = `${stateCode.toUpperCase().slice(0, 2)}${districtCode.slice(0, 2)}${latInt}${lngInt}${khasraClean}`;
  
  // Generate 14-character standard string
  return rawString.slice(0, 14).toUpperCase();
}

/**
 * Area Conversion Matrix for Regional Land Units to SI Standard (Hectares, Acres, Sq. Meters)
 */
export interface ConvertedArea {
  standardHectares: number;
  standardAcres: number;
  standardSqMeters: number;
  hectares: number;
  acres: number;
  sqMeters: number;
  formattedString: string;
}

export function convertLandArea(
  value: number,
  unit: 'HECTARE' | 'ACRE' | 'BIGHA' | 'KATHA' | 'GUNTHA' | 'SQ_METER',
  state: string = 'UP'
): ConvertedArea {
  let hectares = 0;

  // Regional Bigha standards
  let bighaInHectares = 0.2529; // Standard Pakka Bigha (UP, Bihar)
  if (state.toLowerCase().includes('bengal') || state.toLowerCase().includes('wb')) {
    bighaInHectares = 0.1338;
  } else if (state.toLowerCase().includes('raj') || state.toLowerCase().includes('rajasthan')) {
    bighaInHectares = 0.1619;
  } else if (state.toLowerCase().includes('mp') || state.toLowerCase().includes('madhya')) {
    bighaInHectares = 0.2500;
  }

  switch (unit) {
    case 'HECTARE':
      hectares = value;
      break;
    case 'ACRE':
      hectares = value * 0.404686;
      break;
    case 'BIGHA':
      hectares = value * bighaInHectares;
      break;
    case 'KATHA':
      hectares = (value / 20) * bighaInHectares;
      break;
    case 'GUNTHA':
      hectares = value * 0.010117; // 1 Guntha = 101.17 m² = ~0.010117 Hectares
      break;
    case 'SQ_METER':
      hectares = value / 10000;
      break;
    default:
      hectares = value;
  }

  const acres = hectares * 2.47105;
  const sqMeters = hectares * 10000;

  const stdHa = Number(hectares.toFixed(4));
  const stdAc = Number(acres.toFixed(3));
  const stdSq = Number(sqMeters.toFixed(1));

  return {
    standardHectares: stdHa,
    standardAcres: stdAc,
    standardSqMeters: stdSq,
    hectares: stdHa,
    acres: stdAc,
    sqMeters: stdSq,
    formattedString: `${stdHa.toFixed(4)} Ha (${stdAc.toFixed(2)} Acres / ${stdSq.toLocaleString('en-IN')} m²)`
  };
}
