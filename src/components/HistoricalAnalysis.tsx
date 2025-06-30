import React, { useState } from 'react';
import { Calendar, TrendingUp, BarChart3, Filter, Download } from 'lucide-react';

const HistoricalAnalysis: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('15-days');
  const [selectedMetric, setSelectedMetric] = useState('temperature');

  const periods = [
    { value: '7-days', label: '7 Days' },
    { value: '15-days', label: '15 Days' },
    { value: '30-days', label: '30 Days' },
    { value: '90-days', label: '90 Days' }
  ];

  const metrics = [
    { value: 'temperature', label: 'Temperature', color: 'orange' },
    { value: 'pressure', label: 'Atmospheric Pressure', color: 'purple' },
    { value: 'humidity', label: 'Humidity', color: 'blue' },
    { value: 'wind', label: 'Wind Patterns', color: 'green' }
  ];

  // Simulated historical data
  const generateChartData = () => {
    const days = selectedPeriod === '7-days' ? 7 : selectedPeriod === '15-days' ? 15 : selectedPeriod === '30-days' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      value: Math.random() * 100 + 50,
      anomaly: Math.random() > 0.8
    }));
  };

  const chartData = generateChartData();
  const anomalies = chartData.filter(d => d.anomaly);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Time Period:</span>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value} className="bg-gray-800">
                {period.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Metric Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <button
            key={metric.value}
            onClick={() => setSelectedMetric(metric.value)}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              selectedMetric === metric.value
                ? `bg-${metric.color}-500/20 border-${metric.color}-500/50 text-${metric.color}-300`
                : 'bg-black/20 border-white/10 text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="text-center">
              <BarChart3 className={`w-6 h-6 mx-auto mb-2 ${
                selectedMetric === metric.value ? `text-${metric.color}-400` : 'text-gray-400'
              }`} />
              <p className="font-medium">{metric.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Chart Visualization */}
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {metrics.find(m => m.value === selectedMetric)?.label} Trends
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">Normal Range</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">Anomalies</span>
            </div>
          </div>
        </div>

        {/* Simulated Chart */}
        <div className="h-64 bg-gradient-to-t from-gray-900/50 to-transparent rounded-lg p-4 relative overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
            {chartData.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{ height: '100%' }}
              >
                <div
                  className={`w-3 rounded-t transition-all duration-500 ${
                    data.anomaly ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ height: `${data.value}%` }}
                  title={`Day ${data.day}: ${data.value.toFixed(1)}`}
                ></div>
                {index % 3 === 0 && (
                  <span className="text-gray-400 text-xs mt-2">{data.day}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Detected Anomalies */}
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Detected Anomalies</h3>
          <div className="space-y-3">
            {anomalies.slice(0, 5).map((anomaly, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div>
                  <p className="text-red-300 font-medium">Day {anomaly.day}</p>
                  <p className="text-gray-400 text-sm">Unusual {selectedMetric} reading</p>
                </div>
                <div className="text-red-400 font-bold">
                  {anomaly.value.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Analysis */}
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Pattern Analysis</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">Trend Detected</span>
              </div>
              <p className="text-gray-300 text-sm">
                Rising {selectedMetric} pattern observed over last 5 days. Similar patterns preceded major weather events in historical data.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-medium">Correlation Found</span>
              </div>
              <p className="text-gray-300 text-sm">
                Strong correlation with seismic activity patterns from 2019 event. Confidence level: 78%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalAnalysis;