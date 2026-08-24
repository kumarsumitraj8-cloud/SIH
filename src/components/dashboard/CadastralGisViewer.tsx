import React, { useState, useEffect } from 'react';
import { LandRecord } from '../../types/landRecord';
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Layers, Info, Navigation, Search, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { generateEparchaPdf } from '../../services/certificateGenerator';

interface CadastralGisViewerProps {
  records: LandRecord[];
  onSelectRecord: (record: LandRecord) => void;
}

// Fix default Leaflet icon paths in Vite/React
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const CadastralGisViewer: React.FC<CadastralGisViewerProps> = ({
  records,
  onSelectRecord
}) => {
  const [selectedRecord, setSelectedRecord] = useState<LandRecord>(records[0]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    records[0]?.cadastralPolygon?.center || [25.31815, 82.9753]
  );
  const [mapZoom, setMapZoom] = useState<number>(17);
  const [tileLayerType, setTileLayerType] = useState<'osm' | 'satellite'>('osm');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectParcel = (rec: LandRecord) => {
    setSelectedRecord(rec);
    if (rec.cadastralPolygon) {
      setMapCenter(rec.cadastralPolygon.center);
      setMapZoom(18);
    }
  };

  const getPolygonColor = (rec: LandRecord) => {
    if (rec.litigation?.hasDispute) return '#ef4444'; // Red for Disputed
    if (rec.landClassification.value === 'GOVT_RESERVED_FOREST') return '#f59e0b'; // Amber for Forest
    if (rec.status === 'APPROVED') return '#10b981'; // Emerald for Approved
    return '#06b6d4'; // Cyan for Pending Review
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top GIS Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              BhuNaksha Spatial Vector Engine
            </span>
            <span className="text-xs text-slate-400">NIC / DoLR Cadastral GIS</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" /> Cadastral Map &amp; Geo-Referenced Parcel Viewer
          </h2>
          <p className="text-xs text-slate-400">
            Interactive polygon overlays, coordinate georeferencing, and cross-linking to Record of Rights (RoR).
          </p>
        </div>

        {/* Layer & Map Controls */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex space-x-1">
            <button
              onClick={() => setTileLayerType('osm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                tileLayerType === 'osm' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Street Map
            </button>
            <button
              onClick={() => setTileLayerType('satellite')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                tileLayerType === 'satellite' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite Layer
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Map Viewport (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-3 rounded-2xl border border-slate-800 flex flex-col h-[650px]">
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Live Vector Parcels ({records.length} Geo-Referenced Plots)
            </span>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Approved</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> In Review</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Disputed</span>
            </div>
          </div>

          <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-700/80 z-0">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <MapController center={mapCenter} zoom={mapZoom} />

              {tileLayerType === 'osm' ? (
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              ) : (
                <TileLayer
                  attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              )}

              {/* Render Parcel Polygons */}
              {records.map((rec) => {
                if (!rec.cadastralPolygon) return null;
                const isSelected = selectedRecord?.id === rec.id;
                const polyColor = getPolygonColor(rec);

                return (
                  <React.Fragment key={rec.id}>
                    <Polygon
                      positions={rec.cadastralPolygon.coordinates}
                      pathOptions={{
                        color: polyColor,
                        fillColor: polyColor,
                        fillOpacity: isSelected ? 0.6 : 0.35,
                        weight: isSelected ? 3 : 1.5,
                        dashArray: rec.litigation?.hasDispute ? '5,5' : undefined
                      }}
                      eventHandlers={{
                        click: () => handleSelectParcel(rec)
                      }}
                    >
                      <Popup>
                        <div className="p-1 text-slate-900 font-sans text-xs">
                          <strong className="block text-emerald-800 text-sm">Khasra #{rec.khasraNumber.value}</strong>
                          <span className="block text-[11px] font-mono text-slate-600">ULPIN: {rec.ulpin}</span>
                          <span className="block text-slate-700 mt-1">Village: {rec.village}, {rec.district}</span>
                          <span className="block text-slate-700">Area: {rec.area.standardHectares.toFixed(4)} Ha</span>
                          <span className="block font-bold text-slate-800 mt-1">Primary Owner: {rec.owners[0]?.name.value}</span>
                        </div>
                      </Popup>
                    </Polygon>

                    <Marker 
                      position={rec.cadastralPolygon.center}
                      icon={customMarkerIcon}
                      eventHandlers={{ click: () => handleSelectParcel(rec) }}
                    />
                  </React.Fragment>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Right Inspector Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Location Switcher */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Jump to Geo-Survey Location
            </h3>
            
            <div className="grid grid-cols-2 gap-2 pt-1">
              {records.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => handleSelectParcel(rec)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    selectedRecord?.id === rec.id
                      ? 'bg-slate-800 border-emerald-500 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold text-white block">Khasra {rec.khasraNumber.value}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{rec.village} ({rec.state})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Parcel Deep Details Card */}
          {selectedRecord && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    ULPIN: {selectedRecord.ulpin}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Plot Khasra {selectedRecord.khasraNumber.value}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedRecord.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {selectedRecord.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Spatial Metadata */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                  <span className="text-slate-400">Jurisdiction:</span>
                  <span className="font-semibold text-right">{selectedRecord.village}, {selectedRecord.tehsil}, {selectedRecord.state}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                  <span className="text-slate-400">Centroid Coordinates:</span>
                  <span className="font-mono text-emerald-400 text-right">
                    {selectedRecord.cadastralPolygon?.center[0].toFixed(5)}° N, {selectedRecord.cadastralPolygon?.center[1].toFixed(5)}° E
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                  <span className="text-slate-400">Calculated GIS Area:</span>
                  <span className="font-bold text-white">
                    {selectedRecord.area.standardHectares.toFixed(4)} Ha ({selectedRecord.area.standardAcres.toFixed(2)} Acres)
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                  <span className="text-slate-400">Land Zoning:</span>
                  <span className="font-semibold text-emerald-400">{selectedRecord.landClassification.value.replace(/_/g, ' ')}</span>
                </div>

                <div className="flex justify-between py-1 text-slate-300">
                  <span className="text-slate-400">Adjacent Parcels:</span>
                  <span className="font-mono text-slate-300">{selectedRecord.cadastralPolygon?.adjacentParcels.join(', ') || 'N/A'}</span>
                </div>
              </div>

              {/* Owners List Summary */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Registered Title Holders</span>
                <div className="space-y-1.5">
                  {selectedRecord.owners.map((owner, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-200 block">{owner.name.value}</span>
                        <span className="text-[10px] text-slate-500">{owner.relationType.value} {owner.relativeName.value}</span>
                      </div>
                      <span className="font-bold text-emerald-400 font-mono">{owner.sharePercentage.toFixed(1)}% ({owner.areaShareHectares.toFixed(3)} Ha)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex space-x-2">
                <button
                  onClick={() => generateEparchaPdf(selectedRecord)}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Download e-Parcha
                </button>
                <button
                  onClick={() => onSelectRecord(selectedRecord)}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition cursor-pointer"
                >
                  Full Inspection
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
