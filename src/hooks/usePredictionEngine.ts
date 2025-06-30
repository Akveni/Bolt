import { useState, useEffect } from 'react';
import { useClimateData } from './useClimateData';

interface PredictionModel {
  analyzePatterns: (data: any[]) => PatternAnalysis;
  calculateRisk: (patterns: PatternAnalysis, timeframe: number) => RiskAssessment;
  generateRecommendations: (risk: RiskAssessment) => string[];
}

interface PatternAnalysis {
  temperatureTrend: 'rising' | 'falling' | 'stable';
  pressureTrend: 'rising' | 'falling' | 'stable';
  humidityTrend: 'rising' | 'falling' | 'stable';
  windPatterns: 'increasing' | 'decreasing' | 'stable';
  anomalies: number;
  volatility: number;
}

interface RiskAssessment {
  tsunamiRisk: number;
  earthquakeRisk: number;
  cycloneRisk: number;
  severeWeatherRisk: number;
  overallRisk: number;
  confidence: number;
}

export const usePredictionEngine = () => {
  const { climateReadings, getHistoricalData } = useClimateData();
  const [predictionModel, setPredictionModel] = useState<PredictionModel | null>(null);

  // Initialize the AI prediction model
  useEffect(() => {
    const model: PredictionModel = {
      analyzePatterns: (data: any[]) => {
        if (!data || data.length === 0) {
          return {
            temperatureTrend: 'stable',
            pressureTrend: 'stable',
            humidityTrend: 'stable',
            windPatterns: 'stable',
            anomalies: 0,
            volatility: 0
          };
        }

        // Analyze temperature trends
        const temperatures = data.map(d => d.temperature).filter(t => t !== null);
        const tempTrend = calculateTrend(temperatures);
        
        // Analyze pressure trends
        const pressures = data.map(d => d.pressure).filter(p => p !== null);
        const pressureTrend = calculateTrend(pressures);
        
        // Analyze humidity trends
        const humidities = data.map(d => d.humidity).filter(h => h !== null);
        const humidityTrend = calculateTrend(humidities);
        
        // Analyze wind patterns
        const windSpeeds = data.map(d => d.wind_speed).filter(w => w !== null);
        const windTrend = calculateTrend(windSpeeds);
        
        // Calculate anomalies and volatility
        const anomalies = detectAnomalies(data);
        const volatility = calculateVolatility(data);

        return {
          temperatureTrend: tempTrend,
          pressureTrend: pressureTrend,
          humidityTrend: humidityTrend,
          windPatterns: windTrend,
          anomalies,
          volatility
        };
      },

      calculateRisk: (patterns: PatternAnalysis, timeframe: number) => {
        // Tsunami risk calculation
        const tsunamiRisk = calculateTsunamiRisk(patterns, timeframe);
        
        // Earthquake risk calculation
        const earthquakeRisk = calculateEarthquakeRisk(patterns, timeframe);
        
        // Cyclone risk calculation
        const cycloneRisk = calculateCycloneRisk(patterns, timeframe);
        
        // Severe weather risk calculation
        const severeWeatherRisk = calculateSevereWeatherRisk(patterns, timeframe);
        
        // Overall risk assessment
        const overallRisk = Math.max(tsunamiRisk, earthquakeRisk, cycloneRisk, severeWeatherRisk);
        
        // Confidence calculation based on data quality and pattern strength
        const confidence = calculateConfidence(patterns);

        return {
          tsunamiRisk,
          earthquakeRisk,
          cycloneRisk,
          severeWeatherRisk,
          overallRisk,
          confidence
        };
      },

      generateRecommendations: (risk: RiskAssessment) => {
        const recommendations: string[] = [];
        
        if (risk.overallRisk > 70) {
          recommendations.push('Immediate evacuation planning required');
          recommendations.push('Emergency services on high alert');
          recommendations.push('Public warning systems activated');
        } else if (risk.overallRisk > 50) {
          recommendations.push('Enhanced monitoring protocols');
          recommendations.push('Prepare emergency response teams');
          recommendations.push('Issue weather advisories');
        } else if (risk.overallRisk > 30) {
          recommendations.push('Continue surveillance');
          recommendations.push('Review emergency procedures');
          recommendations.push('Monitor weather updates closely');
        } else {
          recommendations.push('Maintain routine monitoring');
          recommendations.push('Standard precautionary measures');
          recommendations.push('Regular system maintenance');
        }

        return recommendations;
      }
    };

    setPredictionModel(model);
  }, []);

  // Helper functions for trend analysis
  const calculateTrend = (values: number[]): 'rising' | 'falling' | 'stable' => {
    if (values.length < 2) return 'stable';
    
    const recent = values.slice(-5); // Last 5 readings
    const older = values.slice(-10, -5); // Previous 5 readings
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (change > 5) return 'rising';
    if (change < -5) return 'falling';
    return 'stable';
  };

  const detectAnomalies = (data: any[]): number => {
    // Simple anomaly detection based on standard deviation
    let anomalies = 0;
    
    ['temperature', 'pressure', 'humidity', 'wind_speed'].forEach(field => {
      const values = data.map(d => d[field]).filter(v => v !== null);
      if (values.length === 0) return;
      
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
      
      values.forEach(value => {
        if (Math.abs(value - mean) > 2 * stdDev) {
          anomalies++;
        }
      });
    });
    
    return anomalies;
  };

  const calculateVolatility = (data: any[]): number => {
    // Calculate overall data volatility
    const fields = ['temperature', 'pressure', 'humidity', 'wind_speed'];
    let totalVolatility = 0;
    
    fields.forEach(field => {
      const values = data.map(d => d[field]).filter(v => v !== null);
      if (values.length < 2) return;
      
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      const coefficientOfVariation = Math.sqrt(variance) / mean;
      
      totalVolatility += coefficientOfVariation;
    });
    
    return totalVolatility / fields.length;
  };

  // Risk calculation functions
  const calculateTsunamiRisk = (patterns: PatternAnalysis, timeframe: number): number => {
    let risk = 0;
    
    // Rapid pressure drop increases tsunami risk
    if (patterns.pressureTrend === 'falling') risk += 30;
    
    // Temperature anomalies in ocean
    if (patterns.temperatureTrend === 'rising') risk += 20;
    
    // High volatility indicates instability
    risk += patterns.volatility * 20;
    
    // Anomalies suggest unusual conditions
    risk += Math.min(patterns.anomalies * 5, 25);
    
    // Time decay - risk decreases with time
    risk *= (1 - (timeframe - 1) * 0.1);
    
    return Math.min(Math.max(risk, 0), 100);
  };

  const calculateEarthquakeRisk = (patterns: PatternAnalysis, timeframe: number): number => {
    let risk = 0;
    
    // Pressure changes can indicate tectonic activity
    if (patterns.pressureTrend !== 'stable') risk += 25;
    
    // Temperature variations in ground
    if (patterns.temperatureTrend !== 'stable') risk += 15;
    
    // High anomaly count suggests seismic activity
    risk += Math.min(patterns.anomalies * 8, 40);
    
    // Volatility indicates instability
    risk += patterns.volatility * 15;
    
    // Time decay
    risk *= (1 - (timeframe - 1) * 0.08);
    
    return Math.min(Math.max(risk, 0), 100);
  };

  const calculateCycloneRisk = (patterns: PatternAnalysis, timeframe: number): number => {
    let risk = 0;
    
    // Rising temperature increases cyclone risk
    if (patterns.temperatureTrend === 'rising') risk += 35;
    
    // Falling pressure is cyclone indicator
    if (patterns.pressureTrend === 'falling') risk += 30;
    
    // High humidity supports cyclone formation
    if (patterns.humidityTrend === 'rising') risk += 20;
    
    // Wind pattern changes
    if (patterns.windPatterns !== 'stable') risk += 15;
    
    // Time decay
    risk *= (1 - (timeframe - 1) * 0.12);
    
    return Math.min(Math.max(risk, 0), 100);
  };

  const calculateSevereWeatherRisk = (patterns: PatternAnalysis, timeframe: number): number => {
    let risk = 0;
    
    // Temperature instability
    if (patterns.temperatureTrend !== 'stable') risk += 20;
    
    // Pressure changes
    if (patterns.pressureTrend !== 'stable') risk += 25;
    
    // Humidity changes
    if (patterns.humidityTrend !== 'stable') risk += 15;
    
    // Wind changes
    if (patterns.windPatterns !== 'stable') risk += 20;
    
    // High volatility
    risk += patterns.volatility * 25;
    
    // Time decay
    risk *= (1 - (timeframe - 1) * 0.15);
    
    return Math.min(Math.max(risk, 0), 100);
  };

  const calculateConfidence = (patterns: PatternAnalysis): number => {
    let confidence = 50; // Base confidence
    
    // More data points increase confidence
    confidence += Math.min(patterns.anomalies * 2, 20);
    
    // Clear trends increase confidence
    const trendCount = [
      patterns.temperatureTrend,
      patterns.pressureTrend,
      patterns.humidityTrend,
      patterns.windPatterns
    ].filter(trend => trend !== 'stable').length;
    
    confidence += trendCount * 5;
    
    // Moderate volatility increases confidence (too low or too high reduces it)
    if (patterns.volatility > 0.1 && patterns.volatility < 0.5) {
      confidence += 15;
    }
    
    return Math.min(Math.max(confidence, 30), 95);
  };

  // Generate weekly predictions
  const generateWeeklyPredictions = async () => {
    if (!predictionModel) return [];
    
    const historicalData = await getHistoricalData(15);
    const patterns = predictionModel.analyzePatterns(historicalData);
    
    const predictions = [];
    for (let day = 1; day <= 7; day++) {
      const risk = predictionModel.calculateRisk(patterns, day);
      const recommendations = predictionModel.generateRecommendations(risk);
      
      predictions.push({
        day,
        risk,
        recommendations,
        patterns
      });
    }
    
    return predictions;
  };

  return {
    predictionModel,
    generateWeeklyPredictions,
    isReady: !!predictionModel
  };
};