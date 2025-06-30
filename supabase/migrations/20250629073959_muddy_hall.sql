/*
  # Sample Data for Climate Monitoring System

  1. Sample monitoring stations
  2. Sample climate readings
  3. Sample disaster predictions
  4. Sample alerts
*/

-- Insert sample monitoring stations
INSERT INTO monitoring_stations (name, location, latitude, longitude, station_type) VALUES
  ('Pacific Coast Station', 'California, USA', 36.7783, -119.4179, 'seismic'),
  ('Bay of Bengal Monitor', 'Bay of Bengal', 15.0000, 90.0000, 'oceanic'),
  ('San Andreas Observatory', 'San Francisco, USA', 37.7749, -122.4194, 'seismic'),
  ('Atlantic Hurricane Center', 'Miami, USA', 25.7617, -80.1918, 'atmospheric'),
  ('Tokyo Seismic Station', 'Tokyo, Japan', 35.6762, 139.6503, 'seismic'),
  ('Caribbean Weather Station', 'Caribbean Sea', 18.0000, -66.0000, 'atmospheric');

-- Insert sample climate readings (last 15 days)
INSERT INTO climate_readings (station_id, temperature, humidity, pressure, wind_speed, wind_direction, recorded_at)
SELECT 
  (SELECT id FROM monitoring_stations ORDER BY random() LIMIT 1),
  20 + random() * 15,  -- Temperature between 20-35°C
  40 + random() * 40,  -- Humidity between 40-80%
  1000 + random() * 30, -- Pressure between 1000-1030 hPa
  5 + random() * 20,   -- Wind speed between 5-25 m/s
  random() * 360,      -- Wind direction 0-360 degrees
  now() - interval '1 day' * generate_series(0, 14) - interval '1 hour' * floor(random() * 24)
FROM generate_series(1, 100); -- 100 random readings

-- Insert sample disaster predictions
INSERT INTO disaster_predictions (disaster_type, location, probability, severity, confidence, timeframe, trigger_factors, expires_at) VALUES
  ('tsunami', 'Pacific Coast Region', 68, 'moderate', 82, '72-96 hours', 
   '["Rapid pressure drop", "Seismic activity increase", "Ocean temperature anomaly"]'::jsonb,
   now() + interval '4 days'),
  ('cyclone', 'Bay of Bengal', 45, 'low', 73, '5-7 days',
   '["Sea surface temperature", "Wind pattern changes", "Atmospheric pressure gradient"]'::jsonb,
   now() + interval '7 days'),
  ('earthquake', 'San Andreas Fault Zone', 23, 'high', 61, '7-14 days',
   '["Micro-seismic activity", "Ground deformation", "Stress accumulation"]'::jsonb,
   now() + interval '14 days'),
  ('hurricane', 'North Atlantic', 58, 'moderate', 67, '10-15 days',
   '["Ocean temperature", "Wind shear patterns", "Atmospheric instability"]'::jsonb,
   now() + interval '15 days');

-- Insert sample alerts
INSERT INTO alerts (title, description, severity, location, disaster_type, confidence, time_to_impact) VALUES
  ('Severe Pressure Drop Detected', 
   'Atmospheric pressure has dropped by 15 hPa in the last 6 hours in the Pacific Coast region.',
   'critical', 'Pacific Coast, California', 'tsunami', 89, '48-72 hours'),
  ('Seismic Activity Surge',
   'Multiple micro-earthquakes detected along San Andreas Fault. Pattern matches pre-event signatures.',
   'critical', 'San Andreas Fault Zone', 'earthquake', 76, '5-10 days'),
  ('Ocean Temperature Anomaly',
   'Sea surface temperature 2.3°C above normal in Bay of Bengal region.',
   'warning', 'Bay of Bengal', 'cyclone', 64, '7-14 days'),
  ('Wind Pattern Shift',
   'Significant change in upper-level wind patterns detected in Atlantic region.',
   'warning', 'North Atlantic', 'hurricane', 58, '10-15 days'),
  ('System Status Update',
   'Climate monitoring systems running normally. All sensors operational.',
   'info', 'Global Network', null, null, null);