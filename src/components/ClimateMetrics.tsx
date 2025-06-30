import React from 'react';
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const ClimateMetrics: React.FC = () => {
  const metrics = [
    {
      name: 'Seismic Activity',
      value: '2.3',
      unit: 'magnitude',
      trend: 'up',
      status: 'normal',
      change: '+0.1'
    },
    {
      name: 'Ocean Temperature',
      value: '26.8',
      unit: '°C',
      trend: 'up',
      status: 'warning',
      change: '+1.2'
    },
    {
      name: 'Pressure Gradient',
      value: '8.2',
      unit: 'hPa/km',
      trend: 'down',
      status: 'critical',
      change: '-3.1'
    },
    {
      name: 'Wind Shear',
      value: '12.5',
      unit: 'm/s',
      trend: 'up',
      status: 'normal',
      change: '+2.3'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return AlertTriangle;
      case 'warning': return Activity;
      default: return CheckCircle;
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Climate Metrics</h3>
        <div className="text-gray-400 text-sm">Last updated: 2 min ago</div>
      </div>

      <div className="space-y-4 mb-8">
        {metrics.map((metric, index) => {
          const StatusIcon = getStatusIcon(metric.status);
          return (
            <div key={index} className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">{metric.name}</span>
                <StatusIcon className={`w-4 h-4 ${getStatusColor(metric.status).split(' ')[0]}`} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  <span className="text-gray-400 text-sm ml-1">{metric.unit}</span>
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === 'up' ? 'text-red-400' : 'text-green-400'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span>{metric.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Assessment */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-500/20">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <span className="text-orange-300 font-medium">Risk Assessment</span>
        </div>
        <p className="text-orange-200 text-sm">
          Elevated atmospheric pressure gradient detected. Monitor for potential storm system development over next 48-72 hours.
        </p>
      </div>
    </div>
  );
};

export default ClimateMetrics;