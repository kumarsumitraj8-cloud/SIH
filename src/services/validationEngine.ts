import { LandRecord, ValidationResult } from '../types/landRecord';

export function validateLandRecord(record: LandRecord): ValidationResult[] {
  const results: ValidationResult[] = [];

  // 1. Mathematical Consistency: Share Sum Check
  const totalSharePercentage = record.owners.reduce((sum, owner) => sum + (owner.sharePercentage || 0), 0);
  const roundedShare = Math.round(totalSharePercentage * 100) / 100;

  if (Math.abs(roundedShare - 100) > 0.01) {
    results.push({
      passed: false,
      ruleCode: 'RULE_MATH_SHARE_MISMATCH',
      ruleName: 'Shareholder Proportion Consistency',
      severity: 'CRITICAL',
      description: `Cumulative shareholder percentages sum to ${roundedShare}% instead of exactly 100.00%.`,
      suggestedAction: 'Re-verify fractional shares (hissa) extracted from column 4 of the revenue register.'
    });
  } else {
    results.push({
      passed: true,
      ruleCode: 'RULE_MATH_SHARE_MISMATCH',
      ruleName: 'Shareholder Proportion Consistency',
      severity: 'INFO',
      description: 'Shareholder percentages sum perfectly to 100.00%.'
    });
  }

  // 2. Area Value Sanity Check
  if (!record.area.value.value || record.area.value.value <= 0) {
    results.push({
      passed: false,
      ruleCode: 'RULE_AREA_ZERO_OR_NULL',
      ruleName: 'Parcel Area Integrity',
      severity: 'CRITICAL',
      description: 'Recorded parcel area is zero, negative, or unreadable.',
      suggestedAction: 'Manual inspection required to verify area numbers in local units.'
    });
  } else {
    results.push({
      passed: true,
      ruleCode: 'RULE_AREA_ZERO_OR_NULL',
      ruleName: 'Parcel Area Integrity',
      severity: 'INFO',
      description: `Valid area detected: ${record.area.value.value} ${record.area.unit.value} (${record.area.standardHectares.toFixed(4)} Ha).`
    });
  }

  // 3. Protected / Ecologically Sensitive Land Alert
  if (
    record.landClassification.value === 'GOVT_RESERVED_FOREST' ||
    record.landClassification.value === 'WATER_BODY_WETLAND' ||
    record.landClassification.value === 'GRAM_PANCHAYAT_COMMUNITY'
  ) {
    results.push({
      passed: false,
      ruleCode: 'RULE_PROTECTED_LAND_ALERT',
      ruleName: 'Government Protected Land Warning',
      severity: 'WARNING',
      description: `Land category is classified as '${record.landClassification.value}'. Private alienation or mutation is strictly restricted under State Land Revenue Code.`,
      suggestedAction: 'Escalate to Tehsildar for verification against Gaon Sabha / Forest Dept Gazette.'
    });
  }

  // 4. Litigation and Court Stay Order Cross-Check
  if (record.litigation && record.litigation.hasDispute) {
    results.push({
      passed: false,
      ruleCode: 'RULE_LITIGATION_STAY_ACTIVE',
      ruleName: 'Active Litigation / Injunction Alert',
      severity: 'CRITICAL',
      description: `Litigation pending in ${record.litigation.courtType || 'Revenue Court'}: Case #${record.litigation.caseNumber || 'N/A'}. ${record.litigation.summary || 'Stay order active.'}`,
      suggestedAction: 'No transfer or e-Parcha issuance permitted until judicial clearance certificate is uploaded.'
    });
  }

  // 5. Active Bank Lien / Encumbrance Warning
  if (record.encumbrance && record.encumbrance.isEncumbered && record.encumbrance.status === 'ACTIVE_LIEN') {
    results.push({
      passed: true,
      ruleCode: 'RULE_BANK_LIEN_DETECTED',
      ruleName: 'Financial Institution Charge Notice',
      severity: 'WARNING',
      description: `Active lien held by ${record.encumbrance.bankOrFinancialInstitution || 'Bank'} for loan ₹${(record.encumbrance.loanAmount || 0).toLocaleString('en-IN')}.`,
      suggestedAction: 'Ensure Bank NOC is recorded before certifying mutation.'
    });
  }

  // 6. OCR Confidence & Ambiguity Threshold
  if (record.overallConfidence < 85) {
    results.push({
      passed: false,
      ruleCode: 'RULE_LOW_CONFIDENCE_OCR',
      ruleName: 'AI Model Extraction Confidence',
      severity: 'WARNING',
      description: `Overall OCR extraction confidence is ${record.overallConfidence}%, which is below the 85% automated approval threshold.`,
      suggestedAction: 'Requires Human-in-the-Loop (HITL) manual operator verification before Tehsildar sign-off.'
    });
  } else {
    results.push({
      passed: true,
      ruleCode: 'RULE_LOW_CONFIDENCE_OCR',
      ruleName: 'AI Model Extraction Confidence',
      severity: 'INFO',
      description: `High confidence extraction achieved (${record.overallConfidence}%). Meets automated validation standard.`
    });
  }

  // 7. Aadhaar / KYC Masking Verification
  const unmaskedAadhaar = record.owners.some(o => o.aadharMasked && !o.aadharMasked.startsWith('XXXX-XXXX-'));
  if (unmaskedAadhaar) {
    results.push({
      passed: false,
      ruleCode: 'RULE_PRIVACY_KYC_COMPLIANCE',
      ruleName: 'Aadhaar Privacy / Data Protection Compliance',
      severity: 'CRITICAL',
      description: 'Found unmasked Aadhaar number. Violates UIDAI & Digital Personal Data Protection (DPDP) Act guidelines.',
      suggestedAction: 'Auto-mask first 8 digits before storing or rendering on public portals.'
    });
  }

  return results;
}
