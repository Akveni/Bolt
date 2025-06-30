import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface MonitoringStation {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  station_type: string;
  is_active: boolean;
  created_at: string;
}

export interface ClimateReading {
  id: string;
  station_id: string;
  temperature: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  recorded_at: string;
  created_at: string;
}

export interface DisasterPrediction {
  id: string;
  disaster_type: string;
  location: string;
  probability: number;
  severity: string;
  confidence: number;
  timeframe: string;
  trigger_factors: string[];
  predicted_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: string;
  location: string;
  disaster_type: string | null;
  confidence: number | null;
  time_to_impact: string | null;
  is_read: boolean;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
}