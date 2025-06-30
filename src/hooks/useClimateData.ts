import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ClimateReading, DisasterPrediction, Alert, MonitoringStation } from '../lib/supabase';

export const useClimateData = () => {
  const [climateReadings, setClimateReadings] = useState<ClimateReading[]>([]);
  const [predictions, setPredictions] = useState<DisasterPrediction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stations, setStations] = useState<MonitoringStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest climate readings
  const fetchClimateReadings = async () => {
    try {
      const { data, error } = await supabase
        .from('climate_readings')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setClimateReadings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch climate readings');
    }
  };

  // Fetch active disaster predictions
  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('disaster_predictions')
        .select('*')
        .eq('is_active', true)
        .order('predicted_at', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch predictions');
    }
  };

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    }
  };

  // Fetch monitoring stations
  const fetchStations = async () => {
    try {
      const { data, error } = await supabase
        .from('monitoring_stations')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setStations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stations');
    }
  };

  // Add new climate reading
  const addClimateReading = async (reading: Omit<ClimateReading, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('climate_readings')
        .insert([reading])
        .select()
        .single();

      if (error) throw error;
      setClimateReadings(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add climate reading');
      throw err;
    }
  };

  // Mark alert as read
  const markAlertAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;
      
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark alert as read');
    }
  };

  // Get historical data for analysis
  const getHistoricalData = async (days: number = 15) => {
    try {
      const { data, error } = await supabase
        .from('climate_readings')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch historical data');
      return [];
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchClimateReadings(),
        fetchPredictions(),
        fetchAlerts(),
        fetchStations()
      ]);
      setLoading(false);
    };

    fetchAllData();

    // Set up real-time subscriptions
    const climateSubscription = supabase
      .channel('climate_readings')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'climate_readings' },
        (payload) => {
          setClimateReadings(prev => [payload.new as ClimateReading, ...prev]);
        }
      )
      .subscribe();

    const alertsSubscription = supabase
      .channel('alerts')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAlerts(prev => [payload.new as Alert, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(prev => 
              prev.map(alert => 
                alert.id === payload.new.id ? payload.new as Alert : alert
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      climateSubscription.unsubscribe();
      alertsSubscription.unsubscribe();
    };
  }, []);

  return {
    climateReadings,
    predictions,
    alerts,
    stations,
    loading,
    error,
    addClimateReading,
    markAlertAsRead,
    getHistoricalData,
    refetch: () => {
      fetchClimateReadings();
      fetchPredictions();
      fetchAlerts();
      fetchStations();
    }
  };
};