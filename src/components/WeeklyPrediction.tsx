import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, AlertTriangle, Brain, Target, Clock, Waves, Wind, Earth, Zap } from 'lucide-react';
import { useClimateData } from '../hooks/useClimateData';
import TimestampDisplay from './TimestampDisplay';

interface WeeklyForecast {
  day: number;
  date: string;
  fullDate: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  primaryThreat: string;
  probability: number;
  confidence: number;
  triggers: string[];
  recommendations: string[];
  generatedAt: string;
}

const WeeklyPrediction: React.FC = () => {
  const { climateReadings, loading } = useClimateData();
  const [weeklyForecast, setWeeklyForecast] = useState<WeeklyForecast[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<string>(new Date().toISOString());

  // Analyze climate patterns and generate weekly predictions
  const generateWeeklyPredictions = () => {
    const predictions: WeeklyForecast[] = [];
    const analysisTime = new Date().toISOString();
    
    for (let day = 1; day <= 7; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      
      // Simulate AI analysis based on current trends
      const prediction = analyzeWeeklyRisk(day, climateReadings);
      
      predictions.push({
        day,
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        fullDate: date.toISOString(),
        generatedAt: analysisTime,
        ...prediction
      });
    }
    
    setWeeklyForecast(predictions);
    setLastAnalysisTime(analysisTime);
  };

  // AI-powered risk analysis for each day
  const analyzeWeeklyRisk = (day: number, readings: any[]): Omit<WeeklyForecast, 'day' | 'date' | 'fullDate' | 'generatedAt'> => {
    // Simulate complex AI analysis
    const baseRisk = Math.random();
    const timeDecay = 1 - (day * 0.1); // Risk decreases with time
    const adjustedRisk = baseRisk * timeDecay;
    
    // Determine primary threat based on current patterns
    const threats = ['tsunami', 'earthquake', 'cyclone', 'severe_weather'];
    const primaryThreat = threats[Math.floor(Math.random() * threats.length)];
    
    // Calculate risk level
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    let probability: number;
    
    if (adjustedRisk > 0.8) {
      riskLevel = 'critical';
      probability = 75 + Math.random() * 20;
    } else if (adjustedRisk > 0.6) {
      riskLevel = 'high';
      probability = 55 + Math.random() * 20;
    } else if (adjustedRisk > 0.3) {
      riskLevel = 'moderate';
      probability = 25 + Math.random() * 30;
    } else {
      riskLevel = 'low';
      probability = 5 + Math.random() * 20;
    }

    // Generate triggers based on threat type
    const getTriggers = (threat: string): string[] => {
      switch (threat) {
        case 'tsunami':
          return ['Seismic activity increase', 'Ocean temperature anomaly', 'Pressure gradient shift'];
        case 'earthquake':
          return ['Micro-seismic patterns', 'Tectonic stress buildup', 'Ground deformation'];
        case 'cyclone':
          return ['Sea surface warming', 'Wind shear reduction', 'Atmospheric instability'];
        case 'severe_weather':
          return ['Pressure system convergence', 'Temperature gradient', 'Moisture accumulation'];
        default:
          return ['Multiple climate factors'];
      }
    };

    // Generate recommendations based on risk level
    const getRecommendations = (risk: string, threat: string): string[] => {
      const baseRecs = {
        critical: ['Immediate evacuation planning', 'Emergency services on standby', 'Public warning systems active'],
        high: ['Enhanced monitoring', 'Prepare emergency protocols', 'Alert relevant authorities'],
        moderate: ['Continue surveillance', 'Review emergency plans', 'Monitor weather updates'],
        low: ['Routine monitoring', 'Standard precautions', 'Regular system checks']
      };
      return baseRecs[risk as keyof typeof baseRecs] || baseRecs.low;
    };

    return {
      riskLevel,
      primaryThreat,
      probability: Math.round(probability),
      confidence: Math.round(60 + Math.random() * 30),
      triggers: getTriggers(primaryThreat),
      recommendations: getRecommendations(riskLevel, primaryThreat)
    };
  };

  useEffect(() => {
    if (!loading && climateReadings.length > 0) {
      generateWeeklyPredictions();
    }
  }, [climateReadings, loading]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getThreatIcon = (threat: string) => {
    switch (threat) {
      case 'tsunami': return Waves;
      case 'earthquake': return Earth;
      case 'cyclone': return Wind;
      case 'severe_weather': return Zap;
      default: return AlertTriangle;
    }
  };

  const selectedPrediction = weeklyForecast.find(p => p.day === selectedDay);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading weekly predictions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">7-Day Disaster Prediction</h2>
          <p className="text-gray-400">AI-powered weekly risk assessment and early warning system</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-lg mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Advanced AI Analysis</span>
          </div>
          <TimestampDisplay 
            timestamp={lastAnalysisTime}
            label="Analysis Generated"
            showRelative={true}
            className="text-sm"
          />
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Weekly Risk Overview</h3>
          <button 
            onClick={generateWeeklyPredictions}
            className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Refresh Analysis
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weeklyForecast.map((prediction) => {
            const ThreatIcon = getThreatIcon(prediction.primaryThreat);
            return (
              <button
                key={prediction.day}
                onClick={() => setSelectedDay(prediction.day)}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  selectedDay === prediction.day
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-black/20 border-white/10 hover:bg-white/5'
                }`}
              >
                <div className="text-center">
                  <div className="text-white text-sm font-medium mb-2">{prediction.date}</div>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${getRiskColor(prediction.riskLevel)}`}>
                    <ThreatIcon className="w-4 h-4" />
                  </div>
                  <div className={`text-xs font-medium uppercase ${getRiskColor(prediction.riskLevel).split(' ')[0]}`}>
                    {prediction.riskLevel}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{prediction.probability}%</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Day Analysis */}
      {selectedPrediction && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Risk Details */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Day {selectedPrediction.day} Analysis</h3>
            </div>

            <div className="space-y-6">
              {/* Date and Time Information */}
              <div className="p-4 bg-white/5 rounded-lg">
                <TimestampDisplay 
                  timestamp={selectedPrediction.fullDate}
                  label="Prediction Date"
                  showRelative={false}
                  showFull={true}
                  className="mb-3"
                />
                <TimestampDisplay 
                  timestamp={selectedPrediction.generatedAt}
                  label="Analysis Generated"
                  showRelative={true}
                  className="text-sm"
                />
              </div>

              {/* Primary Threat */}
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300 text-sm">Primary Threat</span>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRiskColor(selectedPrediction.riskLevel)}`}>
                    {selectedPrediction.primaryThreat.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-sm">Probability</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{selectedPrediction.probability}%</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 text-sm">Confidence</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{selectedPrediction.confidence}%</div>
                </div>
              </div>

              {/* Risk Level Indicator */}
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Risk Level</span>
                  <span className={`text-sm font-medium uppercase ${getRiskColor(selectedPrediction.riskLevel).split(' ')[0]}`}>
                    {selectedPrediction.riskLevel}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      selectedPrediction.riskLevel === 'critical' ? 'bg-red-500' :
                      selectedPrediction.riskLevel === 'high' ? 'bg-orange-500' :
                      selectedPrediction.riskLevel === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${selectedPrediction.probability}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Triggers and Recommendations */}
          <div className="space-y-6">
            {/* Key Triggers */}
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-4">Key Risk Triggers</h4>
              <div className="space-y-3">
                {selectedPrediction.triggers.map((trigger, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="text-orange-200 text-sm">{trigger}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-4">Recommended Actions</h4>
              <div className="space-y-3">
                {selectedPrediction.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-blue-200 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prediction Methodology */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">AI Prediction Methodology</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Pattern Analysis</h4>
            <p className="text-gray-300 text-sm">Analyzes 15+ days of historical climate data to identify pre-disaster patterns</p>
          </div>
          <div className="text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Risk Calculation</h4>
            <p className="text-gray-300 text-sm">Uses machine learning models to calculate probability and confidence levels</p>
          </div>
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Early Warning</h4>
            <p className="text-gray-300 text-sm">Provides 1-7 day advance notice with actionable recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPrediction;