# BhoomiSetu AI (DILRMP 2.0)
## Intelligent Land Record Digitization & Validation System
### Ministry of Rural Development | Department of Land Resources (DoLR), Government of India

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![DILRMP](https://img.shields.io/badge/Initiative-DILRMP%202.0-blue.svg)](https://dilrmp.gov.in)
[![Tech](https://img.shields.io/badge/AI-Multilingual%20OCR%20%7C%20IndicBERT%20%7C%20BhuNaksha%20GIS-teal.svg)](#)

---

## 🌟 Executive Summary

**BhoomiSetu AI** is an enterprise-grade AI-powered land governance system engineered for the **Department of Land Resources (DoLR), Ministry of Rural Development**. It modernizes and automates the digitization, mathematical validation, cadastral mapping, and cross-database verification of legacy handwritten registers (Khatauni, Jamabandi, 7/12 Satbara, Pahani/ROR-1B, Patta/Chitta) across all major Indian regional scripts.

---

## 🏛️ Problem Statement & PRD Mapping

| PRD Requirement | Solution in BhoomiSetu AI |
| :--- | :--- |
| **Multilingual OCR for Printed & Handwritten Text** | Hybrid Vision Transformer & Tesseract Indic OCR supporting Hindi (Devanagari), Marathi, Telugu, Tamil, Bengali, and English. |
| **Automatic Extraction of Structured Fields** | Extract Khasra/Plot No, Khata/Account No, Land Classification, Area, Co-owners, Relations, and Fractional Shares. |
| **Automated Validation & Mathematical Checks** | Rule engine verifying share percentages ($\sum \text{hissa} = 100\%$), standard unit conversions (Bigha, Katha, Guntha, Acre $\to$ Hectares), and duplicate Khasra detection. |
| **Confidence Scoring & HITL Assisted Verification** | Side-by-side Human-in-the-Loop workspace with canvas bounding boxes and field-level confidence indicators. |
| **Cadastral Spatial GIS Integration** | Geo-referenced BhuNaksha parcel polygon vectorization with interactive Leaflet map overlays. |
| **Cross-Database Verification** | Cross-checking against DILRMP Master Registry, Revenue Court Dispute & Stay Order Registry, and Bank Mortgage Lien databases. |
| **ULPIN (Bhu-Aadhaar) Generation** | 14-digit geospatial parcel identifier generation complying with DoLR/NIC spatial standards. |
| **Tamper-Evident Security** | Cryptographic SHA-256 Blockchain audit ledger capturing every ingestion, OCR edit, and officer approval. |
| **Citizen Self-Service & e-Parcha** | Public search portal with verifiable QR-coded official Record of Rights (e-Parcha / RoR) PDF generation. |

---

## 🚀 Key Modules & Capabilities

1. **National DoLR Executive Telemetry Dashboard**: Real-time KPI counters, state-wise modernization progress, OCR script accuracy charts, and fraud prevention metrics.
2. **Image Preprocessing Studio**: Real-time canvas filters with Otsu binarization, adaptive contrast enhancement, and de-skew rotation for damaged/faded scans.
3. **HITL Verification Workspace**: Interactive split-screen document inspector with live mathematical balance correction and bounding-box synchronization.
4. **Tehsildar Digital Sign-Off Portal**: Revenue officer approval queue with Aadhaar-based digital signing and blockchain block anchoring.
5. **Cadastral GIS Parcel Viewer**: Interactive BhuNaksha polygon viewer with plot status color coding (Approved, Disputed, Forest Buffer).
6. **Citizen Public e-Parcha Portal**: Lookup by 14-digit ULPIN or State/District/Khasra, interactive preview, and one-click PDF certificate download.
7. **Blockchain Audit Ledger**: Visual block explorer displaying previous hash links, Merkle data hashes, and one-click cryptographic chain integrity verification.
8. **Government REST API Hub**: Interactive API console simulating endpoints for DILRMP, AgriStack, PM-KISAN, and BhuNaksha GIS.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts
- **GIS & Mapping**: Leaflet, React-Leaflet, GeoJSON Polygon Rendering
- **AI & OCR**: Tesseract.js Multilingual Engine, Indic NLP Heuristics, Canvas Image Preprocessor
- **Document Generation**: jsPDF, Dynamic QR Code Generator
- **Security & Integrity**: Web Crypto API (SHA-256 Hash-Chaining Ledger)

---

## 📦 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```

---

## 👥 Stakeholders

- **Primary**: Ministry of Rural Development, Dept of Land Resources (DoLR).
- **Secondary**: State Revenue & Survey Departments, GIS Departments, Citizens of India.

