import React from 'react';
import { MapPin, AlertCircle, Cloud, Waves } from 'lucide-react';

const LiveMap: React.FC = () => {
  const riskZones = [
    { id: 1, name: 'Pacific Coast', risk: 'high', type: 'tsunami', lat: 35, lng: 139 },
    { id: 2, name: 'Bay of Bengal', risk: 'medium', type: 'cyclone', lat: 21, lng: 89 },
    { id: 3, name: 'San Andreas Fault', risk: 'high', type: 'earthquake', lat: 34, lng: -118 },
    { id: 4, name: 'Caribbean Sea', risk: 'low', type: 'hurricane', lat: 18, lng: -66 },
  ];

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Global Risk Monitor</h3>
        <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Live Data</span>
        </div>
      </div>

      {/* Simulated World Map */}
      <div className="relative bg-gradient-to-br from-blue-900/50 to-green-900/50 rounded-lg h-80 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Risk Zones */}
        {riskZones.map((zone) => (
          <div
            key={zone.id}
            className={`absolute w-4 h-4 rounded-full animate-pulse cursor-pointer ${
              zone.risk === 'high' ? 'bg-red-500' : zone.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 60 + 20}%`,
            }}
            title={zone.name}
          >
            <div className={`absolute inset-0 rounded-full animate-ping ${
              zone.risk === 'high' ? 'bg-red-500' : zone.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
          </div>
        ))}

        {/* Map Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/60 text-6xl font-light">🗺️</div>
        </div>
      </div>

      {/* Risk Zone List */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold mb-3">Active Risk Zones</h4>
        {riskZones.map((zone) => (
          <div key={zone.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                zone.risk === 'high' ? 'bg-red-500' : zone.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <div>
                <p className="text-white font-medium">{zone.name}</p>
                <p className="text-gray-400 text-sm capitalize">{zone.type} risk</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              zone.risk === 'high' ? 'bg-red-500/20 text-red-300' : 
              zone.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
            }`}>
              {zone.risk.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMap;