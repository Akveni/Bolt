import React, { useState } from 'react';
import { AlertTriangle, Waves, Wind, Earth, Target, Brain, Clock, TrendingUp } from 'lucide-react';

const DisasterPrediction: React.FC = () => {
  const [selectedDisaster, setSelectedDisaster] = useState('all');

  const disasterTypes = [
    { value: 'all', label: 'All Disasters', icon: AlertTriangle },
    { value: 'tsunami', label: 'Tsunami', icon: Waves },
    { value: 'cyclone', label: 'Cyclone', icon: Wind },
    { value: 'earthquake', label: 'Earthquake', icon: Earth }
  ];

  const predictions = [
    {
      id: 1,
      type: 'tsunami',
      location: 'Pacific Coast Region',
      probability: 68,
      timeframe: '72-96 hours',
      severity: 'moderate',
      confidence: 82,
      triggers: ['Rapid pressure drop', 'Seismic activity increase', 'Ocean temperature anomaly'],
      lastUpdate: '12 minutes ago'
    },
    {
      id: 2,
      type: 'cyclone',
      location: 'Bay of Bengal',
      probability: 45,
      timeframe: '5-7 days',
      severity: 'low',
      confidence: 73,
      triggers: ['Sea surface temperature', 'Wind pattern changes', 'Atmospheric pressure gradient'],
      lastUpdate: '8 minutes ago'
    },
    {
      id: 3,
      type: 'earthquake',
      location: 'San Andreas Fault Zone',
      probability: 23,
      timeframe: '7-14 days',
      severity: 'high',
      confidence: 61,
      triggers: ['Micro-seismic activity', 'Ground deformation', 'Stress accumulation'],
      lastUpdate: '3 minutes ago'
    }
  ];

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'tsunami': return Waves;
      case 'cyclone': return Wind;
      case 'earthquake': return Earth;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-red-400';
    if (probability >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredPredictions = selectedDisaster === 'all' 
    ? predictions 
    : predictions.filter(p => p.type === selectedDisaster);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Disaster Prediction</h2>
          <p className="text-gray-400">Advanced machine learning models analyzing climate patterns</p>
        </div>
        <div className="flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-lg">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-purple-300 font-medium">AI Analysis Active</span>
        </div>
      </div>

      {/* Disaster Type Filter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {disasterTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => setSelectedDisaster(type.value)}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                selectedDisaster === type.value
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                  : 'bg-black/20 border-white/10 text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="text-center">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  selectedDisaster === type.value ? 'text-blue-400' : 'text-gray-400'
                }`} />
                <p className="font-medium">{type.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Prediction Cards */}
      <div className="space-y-6">
        {filteredPredictions.map((prediction) => {
          const DisasterIcon = getDisasterIcon(prediction.type);
          return (
            <div key={prediction.id} className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <DisasterIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white capitalize">{prediction.type} Risk</h3>
                    <p className="text-gray-400">{prediction.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getProbabilityColor(prediction.probability)}`}>
                    {prediction.probability}%
                  </div>
                  <p className="text-gray-400 text-sm">Probability</p>
                </div>
              </div>

              {/* Prediction Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-sm font-medium">Timeframe</span>
                  </div>
                  <p className="text-white font-semibold">{prediction.timeframe}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm font-medium">Confidence</span>
                  </div>
                  <p className="text-white font-semibold">{prediction.confidence}%</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-medium">Severity</span>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getSeverityColor(prediction.severity)}`}>
                    {prediction.severity}
                  </div>
                </div>
              </div>

              {/* Trigger Factors */}
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-3">Key Trigger Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.triggers.map((trigger, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                    >
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Risk Level</span>
                  <span className={`text-sm font-medium ${getProbabilityColor(prediction.probability)}`}>
                    {prediction.probability}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      prediction.probability >= 70 ? 'bg-red-500' :
                      prediction.probability >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${prediction.probability}%` }}
                  ></div>
                </div>
              </div>

              {/* Last Update */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last updated: {prediction.lastUpdate}</span>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  View Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Model Performance */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">AI Model Performance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">87%</div>
            <p className="text-gray-300">Overall Accuracy</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">94%</div>
            <p className="text-gray-300">Early Detection Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">12%</div>
            <p className="text-gray-300">False Positive Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterPrediction;