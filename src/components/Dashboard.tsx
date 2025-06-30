import React from 'react';
import { Thermometer, Droplets, Wind, Gauge, MapPin, Activity, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import LiveMap from './LiveMap';
import ClimateMetrics from './ClimateMetrics';
import TimestampDisplay from './TimestampDisplay';

const Dashboard: React.FC = () => {
  // Current timestamp for live data
  const currentTime = new Date().toISOString();
  const lastUpdateTime = new Date(Date.now() - 2 * 60 * 1000).toISOString(); // 2 minutes ago

  return (
    <div className="space-y-8">
      {/* Live Data Status */}
      <div className="bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Live Data Stream Active</span>
          </div>
          <TimestampDisplay 
            timestamp={lastUpdateTime}
            label="Last Update"
            showRelative={true}
            className="text-sm"
          />
        </div>
      </div>

      {/* Current Conditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Temperature */}
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="w-8 h-8 text-orange-400" />
            <span className="text-orange-200 text-sm font-medium">Temperature</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">28.5°C</div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+2.3°C from yesterday</span>
          </div>
          <TimestampDisplay 
            timestamp={new Date(Date.now() - 1 * 60 * 1000).toISOString()}
            label="Recorded"
            showRelative={true}
            className="text-xs"
          />
        </div>

        {/* Humidity */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <Droplets className="w-8 h-8 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">Humidity</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">73%</div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">-5% from yesterday</span>
          </div>
          <TimestampDisplay 
            timestamp={new Date(Date.now() - 3 * 60 * 1000).toISOString()}
            label="Recorded"
            showRelative={true}
            className="text-xs"
          />
        </div>

        {/* Wind Speed */}
        <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <Wind className="w-8 h-8 text-green-400" />
            <span className="text-green-200 text-sm font-medium">Wind Speed</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">15 km/h</div>
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm">SW Direction</span>
          </div>
          <TimestampDisplay 
            timestamp={new Date(Date.now() - 5 * 60 * 1000).toISOString()}
            label="Recorded"
            showRelative={true}
            className="text-xs"
          />
        </div>

        {/* Atmospheric Pressure */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <Gauge className="w-8 h-8 text-purple-400" />
            <span className="text-purple-200 text-sm font-medium">Pressure</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">1013 hPa</div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">-8 hPa rapid drop</span>
          </div>
          <TimestampDisplay 
            timestamp={new Date(Date.now() - 30 * 1000).toISOString()}
            label="Recorded"
            showRelative={true}
            className="text-xs"
          />
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Map */}
        <div className="lg:col-span-2">
          <LiveMap />
        </div>

        {/* Climate Metrics */}
        <div>
          <ClimateMetrics />
        </div>
      </div>

      {/* Data Collection Status */}
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Data Collection Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-300 font-medium">Active Sensors</span>
              <span className="text-green-400 text-2xl font-bold">24</span>
            </div>
            <TimestampDisplay 
              timestamp={new Date(Date.now() - 10 * 1000).toISOString()}
              label="Last Check"
              showRelative={true}
              className="text-xs"
            />
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 font-medium">Data Points Today</span>
              <span className="text-blue-400 text-2xl font-bold">1,247</span>
            </div>
            <TimestampDisplay 
              timestamp={currentTime}
              label="Current Time"
              showRelative={false}
              className="text-xs"
            />
          </div>
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 font-medium">System Uptime</span>
              <span className="text-purple-400 text-2xl font-bold">99.8%</span>
            </div>
            <TimestampDisplay 
              timestamp={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}
              label="Since"
              showRelative={true}
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;