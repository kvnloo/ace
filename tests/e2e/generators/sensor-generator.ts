import { faker } from '@faker-js/faker';

/**
 * BMS Sensor Data Generator
 * Generates realistic sensor readings and historical data
 */

export type SensorType =
  | 'temperature'
  | 'humidity'
  | 'light'
  | 'motion'
  | 'co2'
  | 'pressure'
  | 'soil-moisture'
  | 'power'
  | 'door';

export interface SensorReading {
  id: string;
  type: SensorType;
  name: string;
  location: {
    courtId?: string;
    zone: string;
    position: string;
  };
  currentReading: {
    value: number | boolean | string;
    unit?: string;
    timestamp: string;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
  };
  thresholds?: {
    min?: number;
    max?: number;
    warningMin?: number;
    warningMax?: number;
    optimal?: {
      min: number;
      max: number;
    };
  };
  status: 'normal' | 'warning' | 'critical' | 'offline';
  calibrationDate: string;
  nextCalibration: string;
  accuracy?: number;
  updateFrequency: number;
}

const SENSOR_CONFIGS = {
  temperature: {
    unit: 'celsius',
    min: -10,
    max: 50,
    optimal: { min: 20, max: 26 },
    accuracy: 0.1,
    updateFrequency: 30
  },
  humidity: {
    unit: 'percent',
    min: 0,
    max: 100,
    optimal: { min: 45, max: 65 },
    accuracy: 2,
    updateFrequency: 30
  },
  light: {
    unit: 'lux',
    min: 0,
    max: 2000,
    optimal: { min: 750, max: 1200 },
    accuracy: 10,
    updateFrequency: 30
  },
  co2: {
    unit: 'ppm',
    min: 400,
    max: 5000,
    optimal: { min: 400, max: 800 },
    accuracy: 50,
    updateFrequency: 60
  },
  pressure: {
    unit: 'hPa',
    min: 980,
    max: 1050,
    optimal: { min: 1000, max: 1030 },
    accuracy: 0.5,
    updateFrequency: 60
  },
  'soil-moisture': {
    unit: 'percent',
    min: 0,
    max: 100,
    optimal: { min: 35, max: 55 },
    accuracy: 3,
    updateFrequency: 120
  },
  power: {
    unit: 'kW',
    min: 0,
    max: 200,
    accuracy: 0.5,
    updateFrequency: 10
  }
};

/**
 * Generate sensor reading within normal range
 */
export function generateNormalReading(type: SensorType): number {
  const config = SENSOR_CONFIGS[type];
  if (!config || !config.optimal) {
    return faker.number.float({ min: 0, max: 100, precision: 0.1 });
  }

  return faker.number.float({
    min: config.optimal.min,
    max: config.optimal.max,
    precision: config.accuracy || 0.1
  });
}

/**
 * Generate sensor reading outside normal range (warning)
 */
export function generateWarningReading(type: SensorType): number {
  const config = SENSOR_CONFIGS[type];
  if (!config) return 0;

  const isHigh = faker.datatype.boolean();

  if (isHigh) {
    return faker.number.float({
      min: config.optimal?.max || config.max * 0.8,
      max: config.max,
      precision: config.accuracy || 0.1
    });
  } else {
    return faker.number.float({
      min: config.min,
      max: config.optimal?.min || config.max * 0.2,
      precision: config.accuracy || 0.1
    });
  }
}

/**
 * Generate single sensor
 */
export function generateSensor(
  index: number,
  type: SensorType,
  courtId?: string
): SensorReading {
  const config = SENSOR_CONFIGS[type];
  const value = generateNormalReading(type);

  return {
    id: `sensor-${type}-${String(index).padStart(3, '0')}`,
    type,
    name: `${courtId ? `Court ${courtId.split('-')[1]}` : 'Building'} - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    location: {
      ...(courtId && { courtId }),
      zone: faker.helpers.arrayElement(['playing-area', 'entrance', 'hvac-system', 'subsurface']),
      position: faker.helpers.arrayElement(['center', 'wall', 'ceiling', 'underground'])
    },
    currentReading: {
      value,
      unit: config?.unit,
      timestamp: new Date().toISOString(),
      quality: faker.helpers.arrayElement(['excellent', 'good', 'fair'] as const)
    },
    thresholds: config ? {
      min: config.min,
      max: config.max,
      warningMin: config.optimal ? config.optimal.min - (config.optimal.min * 0.1) : undefined,
      warningMax: config.optimal ? config.optimal.max + (config.optimal.max * 0.1) : undefined,
      optimal: config.optimal
    } : undefined,
    status: 'normal',
    calibrationDate: faker.date.past({ years: 0.25 }).toISOString(),
    nextCalibration: faker.date.future({ years: 0.25 }).toISOString(),
    accuracy: config?.accuracy,
    updateFrequency: config?.updateFrequency || 30
  };
}

/**
 * Generate sensor with specific status
 */
export function generateSensorWithStatus(
  index: number,
  type: SensorType,
  status: SensorReading['status'],
  courtId?: string
): SensorReading {
  const sensor = generateSensor(index, type, courtId);
  sensor.status = status;

  if (status === 'warning') {
    sensor.currentReading.value = generateWarningReading(type);
  } else if (status === 'critical') {
    const config = SENSOR_CONFIGS[type];
    sensor.currentReading.value = faker.number.float({
      min: config.max * 1.1,
      max: config.max * 1.5,
      precision: config.accuracy || 0.1
    });
  } else if (status === 'offline') {
    sensor.currentReading.quality = 'poor';
  }

  return sensor;
}

/**
 * Generate full sensor set for a court
 */
export function generateCourtSensors(courtId: string, index: number): SensorReading[] {
  return [
    generateSensor(index * 10 + 1, 'temperature', courtId),
    generateSensor(index * 10 + 2, 'humidity', courtId),
    generateSensor(index * 10 + 3, 'light', courtId),
    generateSensor(index * 10 + 4, 'motion', courtId)
  ];
}

/**
 * Generate historical sensor data
 */
export function generateHistoricalData(
  sensorId: string,
  hours: number = 24
): Array<{ timestamp: string; value: number }> {
  const data: Array<{ timestamp: string; value: number }> = [];
  const now = new Date();
  const baseValue = faker.number.float({ min: 18, max: 25, precision: 0.1 });

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);

    // Simulate realistic temperature patterns
    const hourOfDay = timestamp.getHours();
    let value = baseValue;

    // Day/night variation
    if (hourOfDay >= 6 && hourOfDay <= 18) {
      value += faker.number.float({ min: 0, max: 3, precision: 0.1 }); // Warmer during day
    } else {
      value -= faker.number.float({ min: 0, max: 2, precision: 0.1 }); // Cooler at night
    }

    // Add some noise
    value += faker.number.float({ min: -0.5, max: 0.5, precision: 0.1 });

    data.push({
      timestamp: timestamp.toISOString(),
      value: parseFloat(value.toFixed(1))
    });
  }

  return data;
}

/**
 * Generate sensor alert
 */
export function generateSensorAlert(
  sensorId: string,
  severity: 'low' | 'medium' | 'high' | 'critical'
): {
  id: string;
  sensorId: string;
  type: 'warning' | 'critical';
  severity: string;
  condition: string;
  message: string;
  triggeredAt: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
  actions: Array<{
    type: string;
    target: string;
    status: 'pending' | 'sent' | 'completed' | 'failed';
  }>;
} {
  return {
    id: `alert-${faker.string.alphanumeric(6)}`,
    sensorId,
    type: severity === 'critical' ? 'critical' : 'warning',
    severity,
    condition: faker.helpers.arrayElement([
      'value approaching max threshold',
      'value exceeds max threshold',
      'sensor offline',
      'rapid fluctuation detected',
      'calibration required'
    ]),
    message: faker.helpers.arrayElement([
      'Temperature rising rapidly',
      'Humidity too high',
      'Insufficient lighting',
      'Poor air quality - ventilation needed',
      'Sensor malfunction detected'
    ]),
    triggeredAt: faker.date.recent({ days: 1 }).toISOString(),
    acknowledgedAt: faker.datatype.boolean() ? faker.date.recent({ days: 0.5 }).toISOString() : null,
    resolvedAt: null,
    actions: [
      {
        type: 'notification',
        target: 'facility-manager',
        status: 'sent'
      },
      {
        type: 'hvac-adjustment',
        target: 'cooling-system',
        status: faker.helpers.arrayElement(['pending', 'completed'] as const)
      }
    ]
  };
}

/**
 * Simulate sensor data stream (for real-time testing)
 */
export function* streamSensorData(
  sensorId: string,
  type: SensorType,
  durationSeconds: number = 60,
  updateFrequency: number = 1
): Generator<{ timestamp: string; value: number }> {
  const iterations = durationSeconds / updateFrequency;
  let baseValue = generateNormalReading(type);

  for (let i = 0; i < iterations; i++) {
    // Simulate gradual drift
    const drift = faker.number.float({ min: -0.2, max: 0.2, precision: 0.01 });
    baseValue += drift;

    // Keep within reasonable bounds
    const config = SENSOR_CONFIGS[type];
    if (config && config.optimal) {
      baseValue = Math.max(config.optimal.min, Math.min(config.optimal.max, baseValue));
    }

    yield {
      timestamp: new Date(Date.now() + i * updateFrequency * 1000).toISOString(),
      value: parseFloat(baseValue.toFixed(2))
    };
  }
}

/**
 * Generate large sensor dataset for performance testing
 */
export function generateLargeSensorDataset(count: number = 100): SensorReading[] {
  const sensors: SensorReading[] = [];
  const types: SensorType[] = ['temperature', 'humidity', 'light', 'co2', 'pressure'];

  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(types);
    sensors.push(generateSensor(i, type));
  }

  return sensors;
}

/**
 * Generate sensors with mixed statuses for testing alerts
 */
export function generateMixedStatusSensors(count: number = 20): SensorReading[] {
  const sensors: SensorReading[] = [];
  const types: SensorType[] = ['temperature', 'humidity', 'light', 'co2'];
  const statuses: SensorReading['status'][] = ['normal', 'warning', 'critical', 'offline'];

  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(types);
    const status = faker.helpers.arrayElement(statuses);
    sensors.push(generateSensorWithStatus(i, type, status));
  }

  return sensors;
}
