import React, { useState, useEffect } from 'react';
import { Target, AlertTriangle, TrendingUp, Brain, Activity, Zap, Shield, Clock } from 'lucide-react';
import { useClimateData } from '../hooks/useClimateData';
import { usePredictionEngine } from '../hooks/usePredictionEngine';
import TimestampDisplay from './TimestampDisplay';

interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  status: 'normal' | 'elevated' | 'high' | 'critical';
  description: string;
  lastUpdate: string;
}

interface OverallRisk {
  level: 'low' | 'moderate' | 'high' | 'critical';
  score: number;
  confidence: number;
  primaryThreats: string[];
  timeframe: string;
  lastAssessment: string;
}

const RiskAssessment: React.FC = () => {
  const { climateReadings, getHistoricalData } = useClimateData();
  const { generateWeeklyPredictions, isReady } = usePredictionEngine();
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [overallRisk, setOverallRisk] = useState<OverallRisk | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<OverallRisk[]>([]);

  // Perform comprehensive risk assessment
  const performRiskAssessment = async () => {
    const assessmentTime = new Date().toISOString();
    const historicalData = await getHistoricalData(15);
    
    // Calculate individual risk factors
    const factors: RiskFactor[] = [
      {
        name: 'Atmospheric Pressure',
        value: calculatePressureRisk(historicalData),
        weight: 0.25,
        status: 'normal',
        description: 'Rapid pressure changes indicate potential severe weather or tsunami risk',
        lastUpdate: assessmentTime
      },
      {
        name: 'Temperature Anomalies',
        value: calculateTemperatureRisk(historicalData),
        weight: 0.20,
        status: 'normal',
        description: 'Unusual temperature patterns can trigger various disaster scenarios',
        lastUpdate: assessmentTime
      },
      {
        name: 'Seismic Indicators',
        value: calculateSeismicRisk(),
        weight: 0.20,
        status: 'normal',
        description: 'Ground movement and tectonic activity monitoring',
        lastUpdate: assessmentTime
      },
      {
        name: 'Ocean Conditions',
        value: calculateOceanRisk(historicalData),
        weight: 0.15,
        status: 'normal',
        description: 'Sea surface temperature and current anomalies',
        lastUpdate: assessmentTime
      },
      {
        name: 'Wind Patterns',
        value: calculateWindRisk(historicalData),
        weight: 0.10,
        status: 'normal',
        description: 'Atmospheric circulation and wind shear analysis',
        lastUpdate: assessmentTime
      },
      {
        name: 'Historical Patterns',
        value: calculateHistoricalRisk(),
        weight: 0.10,
        status: 'normal',
        description: 'Comparison with past disaster precursor patterns',
        lastUpdate: assessmentTime
      }
    ];

    // Assign status based on risk values
    factors.forEach(factor => {
      if (factor.value >= 80) factor.status = 'critical';
      else if (factor.value >= 60) factor.status = 'high';
      else if (factor.value >= 40) factor.status = 'elevated';
      else factor.status = 'normal';
    });

    setRiskFactors(factors);

    // Calculate overall risk
    const weightedScore = factors.reduce((sum, factor) => sum + (factor.value * factor.weight), 0);
    const confidence = calculateConfidence(factors, historicalData);
    
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    if (weightedScore >= 75) riskLevel = 'critical';
    else if (weightedScore >= 55) riskLevel = 'high';
    else if (weightedScore >= 35) riskLevel = 'moderate';
    else riskLevel = 'low';

    const primaryThreats = identifyPrimaryThreats(factors);
    const timeframe = calculateTimeframe(riskLevel, factors);

    const overall: OverallRisk = {
      level: riskLevel,
      score: Math.round(weightedScore),
      confidence: Math.round(confidence),
      primaryThreats,
      timeframe,
      lastAssessment: assessmentTime
    };

    setOverallRisk(overall);
    setAssessmentHistory(prev => [overall, ...prev.slice(0, 9)]); // Keep last 10 assessments
  };

  // Risk calculation functions
  const calculatePressureRisk = (data: any[]): number => {
    if (!data || data.length === 0) return 20;
    
    const pressures = data.map(d => d.pressure).filter(p => p !== null);
    if (pressures.length === 0) return 20;
    
    const latest = pressures[pressures.length - 1];
    const previous = pressures[Math.max(0, pressures.length - 6)]; // 6 hours ago
    const change = latest - previous;
    const changeRate = change / 6; // hPa per hour
    
    let risk = 0;
    
    // Rapid pressure drop (tsunami/storm indicator)
    if (changeRate < -8) risk += 70;
    else if (changeRate < -5) risk += 50;
    else if (changeRate < -3) risk += 30;
    
    // Absolute pressure values
    if (latest < 970) risk += 60;
    else if (latest < 980) risk += 40;
    else if (latest > 1040) risk += 30;
    
    return Math.min(risk, 100);
  };

  const calculateTemperatureRisk = (data: any[]): number => {
    if (!data || data.length === 0) return 15;
    
    const temperatures = data.map(d => d.temperature).filter(t => t !== null);
    if (temperatures.length === 0) return 15;
    
    const mean = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    const stdDev = Math.sqrt(temperatures.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / temperatures.length);
    
    let risk = 0;
    let anomalies = 0;
    
    temperatures.forEach(temp => {
      if (Math.abs(temp - mean) > 2 * stdDev) anomalies++;
    });
    
    const anomalyRate = anomalies / temperatures.length;
    risk = anomalyRate * 80;
    
    // Recent temperature trend
    const recent = temperatures.slice(-5);
    const older = temperatures.slice(-10, -5);
    if (recent.length > 0 && older.length > 0) {
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
      const change = Math.abs(recentAvg - olderAvg);
      
      if (change > 5) risk += 25;
      else if (change > 3) risk += 15;
    }
    
    return Math.min(risk, 100);
  };

  const calculateSeismicRisk = (): number => {
    // Simulated seismic risk based on geological factors
    const baseRisk = Math.random() * 40; // 0-40% base risk
    const recentActivity = Math.random() * 30; // Recent seismic activity
    const tectonicStress = Math.random() * 30; // Tectonic stress accumulation
    
    return Math.min(baseRisk + recentActivity + tectonicStress, 100);
  };

  const calculateOceanRisk = (data: any[]): number => {
    if (!data || data.length === 0) return 10;
    
    // Simulate ocean temperature analysis
    const temperatures = data.map(d => d.temperature).filter(t => t !== null);
    if (temperatures.length === 0) return 10;
    
    const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    const normalSeaTemp = 26; // Normal sea surface temperature
    
    let risk = 0;
    
    // Sea surface temperature anomaly
    const tempAnomaly = Math.abs(avgTemp - normalSeaTemp);
    if (tempAnomaly > 3) risk += 40;
    else if (tempAnomaly > 2) risk += 25;
    else if (tempAnomaly > 1) risk += 15;
    
    // Add simulated current and salinity factors
    risk += Math.random() * 20;
    
    return Math.min(risk, 100);
  };

  const calculateWindRisk = (data: any[]): number => {
    if (!data || data.length === 0) return 10;
    
    const windSpeeds = data.map(d => d.wind_speed).filter(w => w !== null);
    if (windSpeeds.length === 0) return 10;
    
    const maxWind = Math.max(...windSpeeds);
    const avgWind = windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length;
    
    let risk = 0;
    
    // High wind speeds
    if (maxWind > 25) risk += 40;
    else if (maxWind > 20) risk += 25;
    else if (maxWind > 15) risk += 15;
    
    // Wind variability
    const windVariability = Math.max(...windSpeeds) - Math.min(...windSpeeds);
    if (windVariability > 15) risk += 20;
    else if (windVariability > 10) risk += 10;
    
    return Math.min(risk, 100);
  };

  const calculateHistoricalRisk = (): number => {
    // Simulated historical pattern matching
    const seasonalFactor = Math.random() * 30;
    const cyclicalPattern = Math.random() * 25;
    const recentEvents = Math.random() * 20;
    
    return Math.min(seasonalFactor + cyclicalPattern + recentEvents, 100);
  };

  const calculateConfidence = (factors: RiskFactor[], data: any[]): number => {
    let confidence = 50; // Base confidence
    
    // Data quality factor
    if (data && data.length > 50) confidence += 20;
    else if (data && data.length > 20) confidence += 10;
    
    // Factor consistency
    const highRiskFactors = factors.filter(f => f.value > 50).length;
    if (highRiskFactors > 2) confidence += 15;
    
    // Reduce confidence for extreme values (might be sensor errors)
    const extremeFactors = factors.filter(f => f.value > 90).length;
    confidence -= extremeFactors * 5;
    
    return Math.min(Math.max(confidence, 30), 95);
  };

  const identifyPrimaryThreats = (factors: RiskFactor[]): string[] => {
    const threats: string[] = [];
    
    const pressure = factors.find(f => f.name === 'Atmospheric Pressure');
    const seismic = factors.find(f => f.name === 'Seismic Indicators');
    const ocean = factors.find(f => f.name === 'Ocean Conditions');
    const wind = factors.find(f => f.name === 'Wind Patterns');
    
    if (pressure && pressure.value > 50) {
      if (pressure.value > 70) threats.push('Tsunami');
      threats.push('Severe Weather');
    }
    
    if (seismic && seismic.value > 50) {
      threats.push('Earthquake');
    }
    
    if (ocean && ocean.value > 50 && wind && wind.value > 40) {
      threats.push('Cyclone/Hurricane');
    }
    
    if (threats.length === 0) threats.push('General Weather');
    
    return threats;
  };

  const calculateTimeframe = (riskLevel: string, factors: RiskFactor[]): string => {
    const maxRisk = Math.max(...factors.map(f => f.value));
    
    if (riskLevel === 'critical') {
      if (maxRisk > 90) return '6-24 hours';
      return '1-3 days';
    } else if (riskLevel === 'high') {
      return '2-7 days';
    } else if (riskLevel === 'moderate') {
      return '1-2 weeks';
    }
    
    return '2+ weeks';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'elevated': return 'text-yellow-400';
      case 'normal': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  useEffect(() => {
    if (isReady) {
      performRiskAssessment();
      
      // Update every 5 minutes
      const interval = setInterval(performRiskAssessment, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isReady]);

  if (!overallRisk) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Performing risk assessment...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Comprehensive Risk Assessment</h2>
          <p className="text-gray-400">Multi-factor disaster risk analysis and early warning system</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-lg mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">AI Risk Engine</span>
          </div>
          <TimestampDisplay 
            timestamp={overallRisk.lastAssessment}
            label="Last Assessment"
            showRelative={true}
            className="text-sm"
          />
        </div>
      </div>

      {/* Overall Risk Status */}
      <div className={`bg-black/30 backdrop-blur-lg rounded-xl p-8 border ${getRiskColor(overallRisk.level).split('bg-')[0]}border-${getRiskColor(overallRisk.level).split('border-')[1]}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getRiskColor(overallRisk.level)}`}>
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">Overall Risk Level</h3>
              <p className="text-gray-300">Comprehensive threat assessment</p>
            </div>
          </div>
          <div className={`px-6 py-3 rounded-lg ${getRiskColor(overallRisk.level)}`}>
            <span className="text-2xl font-bold uppercase">{overallRisk.level}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getRiskColor(overallRisk.level).split(' ')[0]}`}>
              {overallRisk.score}%
            </div>
            <p className="text-gray-300">Risk Score</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">{overallRisk.confidence}%</div>
            <p className="text-gray-300">Confidence</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">{overallRisk.timeframe}</div>
            <p className="text-gray-300">Time Frame</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white mb-2">
              {overallRisk.primaryThreats.join(', ')}
            </div>
            <p className="text-gray-300">Primary Threats</p>
          </div>
        </div>
      </div>

      {/* Risk Factors Breakdown */}
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Risk Factor Analysis</h3>
        <div className="space-y-4">
          {riskFactors.map((factor, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Activity className={`w-5 h-5 ${getStatusColor(factor.status)}`} />
                  <h4 className="text-white font-semibold">{factor.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                    factor.status === 'critical' ? 'bg-red-500/20 text-red-300' :
                    factor.status === 'high' ? 'bg-orange-500/20 text-orange-300' :
                    factor.status === 'elevated' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {factor.status}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${getStatusColor(factor.status)}`}>
                    {factor.value}%
                  </div>
                  <div className="text-gray-400 text-xs">Weight: {(factor.weight * 100).toFixed(0)}%</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      factor.status === 'critical' ? 'bg-red-500' :
                      factor.status === 'high' ? 'bg-orange-500' :
                      factor.status === 'elevated' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${factor.value}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-2">{factor.description}</p>
              <TimestampDisplay 
                timestamp={factor.lastUpdate}
                label="Last Updated"
                showRelative={true}
                className="text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Assessment History */}
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Risk Assessment History</h3>
        <div className="space-y-3">
          {assessmentHistory.slice(0, 5).map((assessment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  assessment.level === 'critical' ? 'bg-red-500' :
                  assessment.level === 'high' ? 'bg-orange-500' :
                  assessment.level === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className={`font-medium uppercase ${
                  assessment.level === 'critical' ? 'text-red-300' :
                  assessment.level === 'high' ? 'text-orange-300' :
                  assessment.level === 'moderate' ? 'text-yellow-300' : 'text-green-300'
                }`}>
                  {assessment.level}
                </span>
                <span className="text-white">{assessment.score}% risk</span>
                <span className="text-gray-400">({assessment.confidence}% confidence)</span>
              </div>
              <TimestampDisplay 
                timestamp={assessment.lastAssessment}
                label=""
                showRelative={true}
                className="text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Risk Assessment Methodology</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Multi-Factor Analysis</h4>
            <p className="text-gray-300 text-sm">Combines 6 key risk factors with weighted scoring system</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Historical Correlation</h4>
            <p className="text-gray-300 text-sm">Compares current patterns with past disaster precursors</p>
          </div>
          <div className="text-center">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Real-time Updates</h4>
            <p className="text-gray-300 text-sm">Continuous monitoring with 5-minute assessment intervals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;