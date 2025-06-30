/*
  # Climate Monitoring Database Schema

  1. New Tables
    - `monitoring_stations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `station_type` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)

    - `climate_readings`
      - `id` (uuid, primary key)
      - `station_id` (uuid, foreign key)
      - `temperature` (decimal)
      - `humidity` (decimal)
      - `pressure` (decimal)
      - `wind_speed` (decimal)
      - `wind_direction` (decimal)
      - `recorded_at` (timestamp)
      - `created_at` (timestamp)

    - `disaster_predictions`
      - `id` (uuid, primary key)
      - `disaster_type` (text)
      - `location` (text)
      - `probability` (integer)
      - `severity` (text)
      - `confidence` (integer)
      - `timeframe` (text)
      - `trigger_factors` (jsonb)
      - `predicted_at` (timestamp)
      - `expires_at` (timestamp)
      - `is_active` (boolean)

    - `alerts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `severity` (text)
      - `location` (text)
      - `disaster_type` (text)
      - `confidence` (integer)
      - `time_to_impact` (text)
      - `is_read` (boolean)
      - `is_resolved` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write data
    - Add policies for public read access to monitoring data
*/

-- Create monitoring stations table
CREATE TABLE IF NOT EXISTS monitoring_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  station_type text NOT NULL DEFAULT 'weather',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create climate readings table
CREATE TABLE IF NOT EXISTS climate_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id uuid REFERENCES monitoring_stations(id) ON DELETE CASCADE,
  temperature decimal(5, 2),
  humidity decimal(5, 2),
  pressure decimal(7, 2),
  wind_speed decimal(5, 2),
  wind_direction decimal(5, 2),
  recorded_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create disaster predictions table
CREATE TABLE IF NOT EXISTS disaster_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_type text NOT NULL,
  location text NOT NULL,
  probability integer NOT NULL CHECK (probability >= 0 AND probability <= 100),
  severity text NOT NULL DEFAULT 'low',
  confidence integer NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  timeframe text NOT NULL,
  trigger_factors jsonb DEFAULT '[]'::jsonb,
  predicted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_active boolean DEFAULT true
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  location text NOT NULL,
  disaster_type text,
  confidence integer CHECK (confidence >= 0 AND confidence <= 100),
  time_to_impact text,
  is_read boolean DEFAULT false,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE monitoring_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE climate_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE disaster_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for monitoring stations
CREATE POLICY "Public can read monitoring stations"
  ON monitoring_stations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage monitoring stations"
  ON monitoring_stations
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for climate readings
CREATE POLICY "Public can read climate readings"
  ON climate_readings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert climate readings"
  ON climate_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for disaster predictions
CREATE POLICY "Public can read disaster predictions"
  ON disaster_predictions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage disaster predictions"
  ON disaster_predictions
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for alerts
CREATE POLICY "Public can read alerts"
  ON alerts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_climate_readings_station_recorded 
  ON climate_readings(station_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_climate_readings_recorded_at 
  ON climate_readings(recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_disaster_predictions_active 
  ON disaster_predictions(is_active, predicted_at DESC);

CREATE INDEX IF NOT EXISTS idx_alerts_severity_created 
  ON alerts(severity, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_alerts_unread 
  ON alerts(is_read, created_at DESC) WHERE is_read = false;