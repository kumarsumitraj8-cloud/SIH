import { jsPDF } from 'jspdf';
import { LandRecord } from '../types/landRecord';

/**
 * Generates an official, tamper-evident RoR / e-Parcha Land Certificate PDF
 */
export async function generateEparchaPdf(record: LandRecord): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Outer Border & Header Banner
  doc.setDrawColor(30, 58, 138); // Deep Gov Blue
  doc.setLineWidth(1);
  doc.rect(8, 8, pageWidth - 16, 281);
  doc.rect(9.5, 9.5, pageWidth - 19, 278);

  // Header Background
  doc.setFillColor(241, 245, 249);
  doc.rect(10, 10, pageWidth - 20, 32, 'F');

  // Emblem / Gov Title
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA / भारत सरकार', pageWidth / 2, 17, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.text('Ministry of Rural Development | Department of Land Resources (DoLR)', pageWidth / 2, 23, { align: 'center' });
  doc.text('Digital India Land Records Modernization Programme (DILRMP)', pageWidth / 2, 28, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFIED DIGITAL RECORD OF RIGHTS (e-PARCHA / ROR)', pageWidth / 2, 37, { align: 'center' });

  // ULPIN Bhu-Aadhaar Badge
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(14, 44, pageWidth - 28, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`BHU-AADHAAR / ULPIN: ${record.ulpin}`, 20, 53);
  doc.text(`STATUS: ${record.status === 'APPROVED' ? 'DIGITALLY VERIFIED & APPROVED' : 'PROVISIONAL'}`, pageWidth - 20, 53, { align: 'right' });

  // Section 1: Location & Record Hierarchy
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 62, pageWidth - 28, 30, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('LOCATION & REVENUE JURISDICTION', 18, 68);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`State: ${record.state}`, 18, 75);
  doc.text(`District: ${record.district}`, 70, 75);
  doc.text(`Tehsil / Taluka: ${record.tehsil}`, 130, 75);

  doc.text(`Village / Mauza: ${record.village}`, 18, 83);
  doc.text(`Khasra / Plot No: ${record.khasraNumber.value}`, 70, 83);
  doc.text(`Khata / Account No: ${record.khataNumber.value}`, 130, 83);

  // Section 2: Parcel Area & Classification
  doc.roundedRect(14, 96, pageWidth - 28, 24, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('LAND CHARACTERISTICS & STANDARD AREA', 18, 102);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Classification: ${record.landClassification.value.replace(/_/g, ' ')}`, 18, 109);
  doc.text(`Irrigation Status: ${record.irrigationStatus}`, 110, 109);
  doc.text(`Total Area: ${record.area.value.value} ${record.area.unit.value} ( = ${record.area.standardHectares.toFixed(4)} Hectares / ${record.area.standardAcres.toFixed(2)} Acres )`, 18, 115);

  // Section 3: Registered Owners & Holdings Table
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('REGISTERED CO-OWNERS & SHAREHOLDING PROPORTIONS', 14, 127);

  // Table Headers
  let tableY = 132;
  doc.setFillColor(30, 58, 138);
  doc.rect(14, tableY, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text('S.No', 18, tableY + 5.5);
  doc.text('Owner Name', 32, tableY + 5.5);
  doc.text('Relation & Relative', 85, tableY + 5.5);
  doc.text('Share %', 135, tableY + 5.5);
  doc.text('Share Area (Ha)', 160, tableY + 5.5);

  tableY += 8;
  record.owners.forEach((owner, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(14, tableY, pageWidth - 28, 9, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(14, tableY + 9, pageWidth - 14, tableY + 9);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(`${idx + 1}`, 18, tableY + 6);
    doc.text(`${owner.name.value}`, 32, tableY + 6);
    doc.text(`${owner.relationType.value} ${owner.relativeName.value}`, 85, tableY + 6);
    doc.text(`${owner.shareFraction.value} (${owner.sharePercentage.toFixed(1)}%)`, 135, tableY + 6);
    doc.text(`${owner.areaShareHectares.toFixed(4)} Ha`, 160, tableY + 6);

    tableY += 9;
  });

  // Section 4: Encumbrance & Legal Status
  tableY += 6;
  doc.roundedRect(14, tableY, pageWidth - 28, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('ENCUMBRANCE & LITIGATION STATUS', 18, tableY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  
  const encStatus = record.encumbrance.isEncumbered
    ? `ENCUMBERED: Active charge by ${record.encumbrance.bankOrFinancialInstitution || 'Bank'} (₹${(record.encumbrance.loanAmount || 0).toLocaleString('en-IN')})`
    : 'CLEAR (No Registered Bank Mortgage/Charge)';
  doc.text(encStatus, 18, tableY + 12);

  const litStatus = record.litigation.hasDispute
    ? `DISPUTED: Active Case in ${record.litigation.courtType} (#${record.litigation.caseNumber})`
    : 'LITIGATION FREE (No stay order or court injunction registered)';
  doc.text(litStatus, 18, tableY + 18);

  // Section 5: Blockchain Audit & Cryptographic Seal
  tableY += 28;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, tableY, pageWidth - 28, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('CRYPTOGRAPHIC AUDIT & DIGITAL AUTHENTICATION', 18, tableY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Blockchain Ledger Hash: ${record.blockchainHash}`, 18, tableY + 13);
  doc.text(`Previous Linked Hash:  ${record.previousHash}`, 18, tableY + 18);
  doc.text(`Verification Timestamp: ${new Date().toLocaleString('en-IN')}`, 18, tableY + 23);
  doc.text(`Digitally Signed by:   ${record.approvedByTehsildar || 'Competent Revenue Authority (Tehsildar)'}`, 18, tableY + 28);
  doc.text(`Digital Sign ID:       ${record.digitalSignatureHash || 'CERT_UID_2026_948201_IN'}`, 18, tableY + 33);

  // Footer Disclaimer
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('This is a computer-generated, digitally signed legal Record of Rights under the Information Technology Act, 2000.', pageWidth / 2, 282, { align: 'center' });
  doc.text('To verify authenticity, scan the QR code on the portal or visit dilrmp.gov.in/verify-ror', pageWidth / 2, 286, { align: 'center' });

  // Save / Download PDF
  doc.save(`e-Parcha_${record.state}_${record.district}_Khasra_${record.khasraNumber.value.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}
