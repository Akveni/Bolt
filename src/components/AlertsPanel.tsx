import React, { useState } from 'react';
import { AlertTriangle, Bell, Clock, MapPin, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import TimestampDisplay from './TimestampDisplay';

const AlertsPanel: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const severityTypes = [
    { value: 'all', label: 'All Alerts', count: 12 },
    { value: 'critical', label: 'Critical', count: 2 },
    { value: 'warning', label: 'Warning', count: 5 },
    { value: 'info', label: 'Info', count: 5 }
  ];

  const alerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'Severe Pressure Drop Detected',
      description: 'Atmospheric pressure has dropped by 15 hPa in the last 6 hours in the Pacific Coast region.',
      location: 'Pacific Coast, California',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      relatedDisaster: 'tsunami',
      confidence: 89,
      timeToImpact: '48-72 hours'
    },
    {
      id: 2,
      severity: 'critical',
      title: 'Seismic Activity Surge',
      description: 'Multiple micro-earthquakes detected along San Andreas Fault. Pattern matches pre-event signatures.',
      location: 'San Andreas Fault Zone',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      relatedDisaster: 'earthquake',
      confidence: 76,
      timeToImpact: '5-10 days'
    },
    {
      id: 3,
      severity: 'warning',
      title: 'Ocean Temperature Anomaly',
      description: 'Sea surface temperature 2.3°C above normal in Bay of Bengal region.',
      location: 'Bay of Bengal',
      timestamp: '2024-01-15T08:45:00Z',
      isRead: true,
      relatedDisaster: 'cyclone',
      confidence: 64,
      timeToImpact: '7-14 days'
    },
    {
      id: 4,
      severity: 'warning',
      title: 'Wind Pattern Shift',
      description: 'Significant change in upper-level wind patterns detected in Atlantic region.',
      location: 'North Atlantic',
      timestamp: '2024-01-15T07:20:00Z',
      isRead: false,
      relatedDisaster: 'hurricane',
      confidence: 58,
      timeToImpact: '10-15 days'
    },
    {
      id: 5,
      severity: 'info',
      title: 'System Status Update',
      description: 'Climate monitoring systems running normally. All sensors operational.',
      location: 'Global Network',
      timestamp: '2024-01-15T06:00:00Z',
      isRead: true,
      relatedDisaster: null,
      confidence: null,
      timeToImpact: null
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'info': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const filteredAlerts = selectedSeverity === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.severity === selectedSeverity);

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-8 h-8 text-blue-400" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{unreadCount}</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Active Alerts</h2>
            <p className="text-gray-400">{unreadCount} unread notifications</p>
          </div>
        </div>
        <div className="text-right">
          <button className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors mb-2">
            Mark All Read
          </button>
          <TimestampDisplay 
            timestamp={new Date().toISOString()}
            label="Current Time"
            showRelative={false}
            className="text-sm"
          />
        </div>
      </div>

      {/* Severity Filter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {severityTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedSeverity(type.value)}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              selectedSeverity === type.value
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                : 'bg-black/20 border-white/10 text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{type.count}</div>
              <p className="font-medium">{type.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const SeverityIcon = getSeverityIcon(alert.severity);
          return (
            <div
              key={alert.id}
              className={`bg-black/30 backdrop-blur-lg rounded-xl p-6 border transition-all duration-200 ${
                alert.isRead ? 'border-white/10' : 'border-blue-500/30 bg-blue-500/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                    <SeverityIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{alert.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{alert.location}</span>
                      </div>
                    </div>

                    {/* Enhanced Timestamp Display */}
                    <div className="mb-4">
                      <TimestampDisplay 
                        timestamp={alert.timestamp}
                        label="Alert Generated"
                        showRelative={true}
                        showFull={true}
                        className="bg-white/5 p-3 rounded-lg"
                      />
                    </div>

                    {/* Alert Details */}
                    {alert.relatedDisaster && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">CONFIDENCE LEVEL</p>
                          <p className="text-white font-semibold">{alert.confidence}%</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">TIME TO IMPACT</p>
                          <p className="text-white font-semibold">{alert.timeToImpact}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Statistics */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Alert Statistics (Last 24 Hours)</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">2</div>
            <p className="text-gray-300">Critical Alerts</p>
            <TimestampDisplay 
              timestamp={new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()}
              label="Last Critical"
              showRelative={true}
              className="text-xs mt-2"
            />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">5</div>
            <p className="text-gray-300">Warnings</p>
            <TimestampDisplay 
              timestamp={new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()}
              label="Last Warning"
              showRelative={true}
              className="text-xs mt-2"
            />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">18</div>
            <p className="text-gray-300">Resolved</p>
            <TimestampDisplay 
              timestamp={new Date(Date.now() - 30 * 60 * 1000).toISOString()}
              label="Last Resolved"
              showRelative={true}
              className="text-xs mt-2"
            />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">3.2m</div>
            <p className="text-gray-300">Avg Response Time</p>
            <TimestampDisplay 
              timestamp={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}
              label="Period Start"
              showRelative={true}
              className="text-xs mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;