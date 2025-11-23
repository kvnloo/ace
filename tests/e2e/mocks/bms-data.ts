/**
 * BMS Mock Data Generators
 *
 * Provides realistic mock data for BMS sensor readings, system status,
 * and control room monitoring tests.
 */

export interface SensorReading {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: number;
  location: string;
}

export interface SystemStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  uptime: number;
  lastCheck: number;
  alerts: Alert[];
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

export interface BMSData {
  temperature: SensorReading[];
  humidity: SensorReading[];
  lighting: SensorReading[];
  systems: SystemStatus[];
  alerts: Alert[];
}

/**
 * Generate realistic temperature readings
 */
export function generateTemperatureReadings(count: number = 5): SensorReading[] {
  const locations = ['Court 1', 'Court 2', 'Gym', 'Vertical Farm', 'BMS Room'];
  return Array.from({ length: count }, (_, i) => ({
    id: `temp-${i + 1}`,
    name: `Temperature Sensor ${i + 1}`,
    value: 20 + Math.random() * 8, // 20-28°C
    unit: '°C',
    status: Math.random() > 0.9 ? 'warning' : 'normal',
    timestamp: Date.now() - Math.random() * 60000,
    location: locations[i % locations.length]
  }));
}

/**
 * Generate realistic humidity readings
 */
export function generateHumidityReadings(count: number = 5): SensorReading[] {
  const locations = ['Court 1', 'Court 2', 'Gym', 'Vertical Farm', 'BMS Room'];
  return Array.from({ length: count }, (_, i) => ({
    id: `hum-${i + 1}`,
    name: `Humidity Sensor ${i + 1}`,
    value: 40 + Math.random() * 30, // 40-70%
    unit: '%',
    status: Math.random() > 0.95 ? 'critical' : 'normal',
    timestamp: Date.now() - Math.random() * 60000,
    location: locations[i % locations.length]
  }));
}

/**
 * Generate realistic lighting readings
 */
export function generateLightingReadings(count: number = 5): SensorReading[] {
  const locations = ['Court 1', 'Court 2', 'Gym', 'Vertical Farm', 'BMS Room'];
  return Array.from({ length: count }, (_, i) => ({
    id: `light-${i + 1}`,
    name: `Light Sensor ${i + 1}`,
    value: 300 + Math.random() * 500, // 300-800 lux
    unit: 'lux',
    status: 'normal',
    timestamp: Date.now() - Math.random() * 60000,
    location: locations[i % locations.length]
  }));
}

/**
 * Generate system status data
 */
export function generateSystemStatuses(count: number = 4): SystemStatus[] {
  const systems = ['HVAC', 'Lighting Control', 'Access Control', 'Energy Management'];
  return Array.from({ length: count }, (_, i) => ({
    id: `sys-${i + 1}`,
    name: systems[i % systems.length],
    status: Math.random() > 0.95 ? 'error' : 'online',
    uptime: Math.floor(Math.random() * 30 * 24 * 60 * 60), // Up to 30 days in seconds
    lastCheck: Date.now() - Math.random() * 300000, // Within last 5 minutes
    alerts: []
  }));
}

/**
 * Generate alerts
 */
export function generateAlerts(count: number = 3): Alert[] {
  const messages = [
    'Temperature exceeds threshold in Court 1',
    'Humidity sensor calibration required',
    'HVAC filter replacement needed',
    'Energy consumption spike detected',
    'Access control system update available'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `alert-${i + 1}`,
    severity: i === 0 ? 'critical' : (Math.random() > 0.5 ? 'warning' : 'info'),
    message: messages[i % messages.length],
    timestamp: Date.now() - Math.random() * 3600000, // Within last hour
    acknowledged: Math.random() > 0.5
  }));
}

/**
 * Generate complete BMS mock data
 */
export function generateBMSData(): BMSData {
  return {
    temperature: generateTemperatureReadings(5),
    humidity: generateHumidityReadings(5),
    lighting: generateLightingReadings(5),
    systems: generateSystemStatuses(4),
    alerts: generateAlerts(3)
  };
}

/**
 * Generate updated sensor reading (simulating real-time update)
 */
export function updateSensorReading(reading: SensorReading): SensorReading {
  const variation = (Math.random() - 0.5) * 2; // ±1 unit variation
  return {
    ...reading,
    value: Math.max(0, reading.value + variation),
    timestamp: Date.now(),
    status: Math.random() > 0.95 ? 'warning' : 'normal'
  };
}

/**
 * Mock API response interceptor setup
 */
export function setupBMSMockAPI(page: any) {
  return page.route('**/api/bms/**', (route: any) => {
    const url = route.request().url();

    if (url.includes('/sensors/temperature')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateTemperatureReadings())
      });
    } else if (url.includes('/sensors/humidity')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateHumidityReadings())
      });
    } else if (url.includes('/sensors/lighting')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateLightingReadings())
      });
    } else if (url.includes('/systems/status')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateSystemStatuses())
      });
    } else if (url.includes('/alerts')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateAlerts())
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateBMSData())
      });
    }
  });
}
