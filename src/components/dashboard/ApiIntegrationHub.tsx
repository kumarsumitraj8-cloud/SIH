import React, { useState } from 'react';
import { Code2, Play, Copy, Check, Terminal, Globe, Shield, Sparkles } from 'lucide-react';

interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  category: 'DILRMP' | 'ULPIN' | 'AGRISTACK' | 'GIS';
  requestBody?: string;
  mockResponse: Record<string, any>;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'ep-ulpin',
    name: 'ULPIN Bhu-Aadhaar Generator',
    method: 'POST',
    path: '/api/v1/ulpin/generate-bhu-aadhaar',
    description: 'Generates 14-digit geospatial parcel identifier according to DoLR / NIC standards.',
    category: 'ULPIN',
    requestBody: JSON.stringify({
      latitude: 25.31815,
      longitude: 82.9753,
      stateCode: 'UP',
      districtCode: '28',
      khasraNumber: '412/1'
    }, null, 2),
    mockResponse: {
      status: 'SUCCESS',
      statusCode: 200,
      data: {
        ulpin: 'UP282491084121',
        standard: 'DoLR_NIC_SPATIAL_V2',
        geoCentroid: { lat: 25.31815, lng: 82.9753 },
        state: 'Uttar Pradesh',
        khasra: '412/1',
        generatedAt: '2026-08-24T13:45:00.000Z'
      }
    }
  },
  {
    id: 'ep-dilrmp',
    name: 'DILRMP Cross-Database Land Validation',
    method: 'GET',
    path: '/api/v1/dilrmp/cross-database-verify?khasra=412/1&village=208149',
    description: 'Cross-checks land parcel against State Master Registry, Court Injunctions, and Encumbrances.',
    category: 'DILRMP',
    mockResponse: {
      status: 'SUCCESS',
      isLegallyValid: true,
      masterRegistryMatch: true,
      encumbranceStatus: {
        isEncumbered: true,
        chargeHolder: 'State Bank of India',
        chargeAmount: 350000
      },
      litigationStatus: {
        hasActiveStay: false,
        pendingCases: 0
      },
      lastMutationDate: '2024-04-14'
    }
  },
  {
    id: 'ep-agristack',
    name: 'AgriStack & PM-KISAN Title Verification',
    method: 'POST',
    path: '/api/v1/agristack/pmkisan-eligibility',
    description: 'Validates agricultural landholding ceiling and e-KYC for PM-KISAN DBT benefit disbursement.',
    category: 'AGRISTACK',
    requestBody: JSON.stringify({
      ulpin: 'UP282491084121',
      aadharMasked: 'XXXX-XXXX-4921',
      claimedAreaHectares: 1.2500
    }, null, 2),
    mockResponse: {
      isEligible: true,
      farmerCategory: 'SMALL_AND_MARGINAL_FARMER',
      verifiedAreaHectares: 1.2500,
      dbtStatus: 'APPROVED_FOR_DIRECT_TRANSFER',
      stateRegistrySync: 'SYNCHRONIZED'
    }
  },
  {
    id: 'ep-gis',
    name: 'BhuNaksha Cadastral GeoJSON Fetcher',
    method: 'GET',
    path: '/api/v1/gis/cadastral-polygon?ulpin=UP282491084121',
    description: 'Returns vector polygon GeoJSON coordinates and adjacent parcel boundary IDs.',
    category: 'GIS',
    mockResponse: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[82.9739, 25.3176], [82.9745, 25.3190], [82.9768, 25.3188], [82.9760, 25.3172], [82.9739, 25.3176]]
        ]
      },
      properties: {
        ulpin: 'UP282491084121',
        khasra: '412/1',
        areaHectares: 2.5000,
        adjacentKhasras: ['412/2', '413', '411', '408']
      }
    }
  }
];

export const ApiIntegrationHub: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[0]);
  const [activeResponse, setActiveResponse] = useState<any>(API_ENDPOINTS[0].mockResponse);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleTestApi = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveResponse(selectedEndpoint.mockResponse);
      setIsLoading(false);
    }, 400);
  };

  const curlCommand = `curl -X ${selectedEndpoint.method} "https://api.dilrmp.gov.in${selectedEndpoint.path}" \\
  -H "Authorization: Bearer GOV_DILRMP_AUTH_TOKEN_2026" \\
  -H "Content-Type: application/json"${selectedEndpoint.requestBody ? ` \\\n  -d '${selectedEndpoint.requestBody.replace(/\n/g, '')}'` : ''}`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* API Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Open Interoperability Standard
            </span>
            <span className="text-xs text-slate-400">OpenAPI 3.1 &amp; GraphQL Spec</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-purple-400" /> Government Integration &amp; REST API Hub
          </h2>
          <p className="text-xs text-slate-400">
            Secure machine-to-machine connectors for DILRMP, PM-KISAN, AgriStack, and BhuNaksha GIS services.
          </p>
        </div>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Endpoint Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Available Service Connectors
          </h3>

          <div className="space-y-2">
            {API_ENDPOINTS.map((ep) => (
              <button
                key={ep.id}
                onClick={() => {
                  setSelectedEndpoint(ep);
                  setActiveResponse(ep.mockResponse);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedEndpoint.id === ep.id
                    ? 'bg-slate-800 border-purple-500 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{ep.category}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{ep.name}</h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{ep.path}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Interactive API Tester (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            
            {/* Active Endpoint Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    selectedEndpoint.method === 'POST' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {selectedEndpoint.method}
                  </span>
                  <h3 className="text-sm font-bold text-white font-mono">{selectedEndpoint.path}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedEndpoint.description}</p>
              </div>

              <button
                onClick={handleTestApi}
                disabled={isLoading}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>Send Request</span>
              </button>
            </div>

            {/* Curl Command Snippet */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-purple-400" /> cURL Command
                </span>
                <button
                  onClick={handleCopyCurl}
                  className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy cURL'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                {curlCommand}
              </pre>
            </div>

            {/* Request Body (if POST) */}
            {selectedEndpoint.requestBody && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
                  Request Payload (JSON)
                </span>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                  {selectedEndpoint.requestBody}
                </pre>
              </div>
            )}

            {/* Response Payload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">
                  Response Payload (200 OK)
                </span>
                <span className="px-2 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                  HTTP 200 OK • 18ms
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[300px]">
                {JSON.stringify(activeResponse, null, 2)}
              </pre>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
