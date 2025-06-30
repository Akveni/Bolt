import React, { useState, useEffect } from 'react';
import { AlertTriangle, Cloud, Waves, Earth, TrendingUp, MapPin, Calendar, Thermometer, Droplets, Wind, Gauge, Target, Activity } from 'lucide-react';
import Dashboard from './components/Dashboard';
import HistoricalAnalysis from './components/HistoricalAnalysis';
import DisasterPrediction from './components/DisasterPrediction';
import AlertsPanel from './components/AlertsPanel';
import WeeklyPrediction from './components/WeeklyPrediction';
import PressureAnalysis from './components/PressureAnalysis';
import RiskAssessment from './components/RiskAssessment';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Live Dashboard', icon: Gauge },
    { id: 'pressure', label: 'Pressure Analysis', icon: Activity },
    { id: 'risk', label: 'Risk Assessment', icon: Target },
    { id: 'weekly', label: 'Weekly Prediction', icon: Calendar },
    { id: 'historical', label: 'Historical Analysis', icon: TrendingUp },
    { id: 'prediction', label: 'Disaster Prediction', icon: AlertTriangle },
    { id: 'alerts', label: 'Active Alerts', icon: Earth }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Earth className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ClimateWatch Pro</h1>
                <p className="text-blue-200 text-sm">Advanced Disaster Prediction System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-mono text-lg">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-blue-200 text-sm">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/10 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white bg-white/10 border-b-2 border-blue-400'
                      : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'pressure' && <PressureAnalysis />}
        {activeTab === 'risk' && <RiskAssessment />}
        {activeTab === 'weekly' && <WeeklyPrediction />}
        {activeTab === 'historical' && <HistoricalAnalysis />}
        {activeTab === 'prediction' && <DisasterPrediction />}
        {activeTab === 'alerts' && <AlertsPanel />}
      </main>
    </div>
  );
}

export default App;