import { faker } from '@faker-js/faker';

/**
 * Court Configuration Generator
 * Generates random court data for E2E testing
 */

export interface Court {
  id: string;
  name: string;
  type: 'hard' | 'clay' | 'grass' | 'carpet';
  surface: string;
  status: 'available' | 'playing' | 'maintenance' | 'reserved' | 'offline';
  lighting: string;
  hasRoof: boolean;
  capacity: number;
  hourlyRate: number;
  lastMaintenance: string;
  nextMaintenance: string;
  features: string[];
  bookings: any[];
  location: {
    lat: number;
    lng: number;
    building: string;
    floor: number;
  };
  sensors: {
    temperature?: string;
    humidity?: string;
    light?: string;
    moisture?: string;
  };
}

const SURFACE_MATERIALS = {
  hard: ['DecoTurf', 'Plexipave', 'Rebound Ace', 'GreenSet'],
  clay: ['Red Clay', 'Green Clay', 'Har-Tru'],
  grass: ['Rye Grass', 'Perennial Ryegrass'],
  carpet: ['Synthetic Turf', 'Indoor Carpet']
};

const LIGHTING_TYPES = ['LED', 'Halogen', 'Natural + LED', 'Fluorescent'];

const FEATURES = [
  'line-calling',
  'hawkeye',
  'scoreboard',
  'climate-control',
  'natural-grass',
  'drainage-system',
  'ball-machine',
  'practice-wall',
  'wide-court',
  'spectator-seating'
];

const BUILDINGS = [
  'Main Complex',
  'Indoor Complex',
  'Outdoor Courts',
  'Practice Facility',
  'Tournament Arena'
];

/**
 * Generate a single random court
 */
export function generateCourt(index: number): Court {
  const type = faker.helpers.arrayElement(['hard', 'clay', 'grass', 'carpet'] as const);
  const status = faker.helpers.arrayElement([
    'available',
    'playing',
    'maintenance',
    'reserved',
    'offline'
  ] as const);
  const hasRoof = faker.datatype.boolean();

  return {
    id: `court-${String(index).padStart(3, '0')}`,
    name: `Court ${index}`,
    type,
    surface: faker.helpers.arrayElement(SURFACE_MATERIALS[type]),
    status,
    lighting: faker.helpers.arrayElement(LIGHTING_TYPES),
    hasRoof,
    capacity: faker.helpers.arrayElement([2, 4]),
    hourlyRate: faker.number.int({ min: 30, max: 70 }),
    lastMaintenance: faker.date.recent({ days: 30 }).toISOString(),
    nextMaintenance: faker.date.future({ years: 0.25 }).toISOString(),
    features: faker.helpers.arrayElements(FEATURES, faker.number.int({ min: 2, max: 5 })),
    bookings: [],
    location: {
      lat: faker.location.latitude({ min: 40.7, max: 40.75 }),
      lng: faker.location.longitude({ min: -74.01, max: -74.00 }),
      building: faker.helpers.arrayElement(BUILDINGS),
      floor: faker.number.int({ min: 0, max: 3 })
    },
    sensors: {
      temperature: `sensor-temp-${String(index).padStart(3, '0')}`,
      humidity: `sensor-hum-${String(index).padStart(3, '0')}`,
      light: `sensor-light-${String(index).padStart(3, '0')}`,
      ...(type === 'grass' && { moisture: `sensor-moisture-${String(index).padStart(3, '0')}` })
    }
  };
}

/**
 * Generate multiple courts
 */
export function generateCourts(count: number): Court[] {
  return Array.from({ length: count }, (_, i) => generateCourt(i + 1));
}

/**
 * Generate court with specific status
 */
export function generateCourtWithStatus(
  index: number,
  status: Court['status']
): Court {
  const court = generateCourt(index);
  court.status = status;

  // Add realistic data based on status
  if (status === 'playing') {
    court.bookings = [
      {
        id: `booking-${faker.string.alphanumeric(6)}`,
        startTime: faker.date.recent().toISOString(),
        endTime: faker.date.soon({ days: 0.1 }).toISOString(),
        players: [faker.string.uuid(), faker.string.uuid()],
        status: 'in-progress'
      }
    ];
  }

  if (status === 'maintenance') {
    court.maintenanceReason = faker.helpers.arrayElement([
      'Surface reseeding',
      'Line repainting',
      'Net replacement',
      'Drainage repair',
      'Lighting upgrade'
    ]);
    court.maintenanceStart = faker.date.recent({ days: 2 }).toISOString();
    court.maintenanceEnd = faker.date.soon({ days: 3 }).toISOString();
  }

  return court;
}

/**
 * Generate realistic court dataset for testing
 */
export function generateRealisticCourtSet(): Court[] {
  return [
    generateCourtWithStatus(1, 'available'),
    generateCourtWithStatus(2, 'available'),
    generateCourtWithStatus(3, 'playing'),
    generateCourtWithStatus(4, 'available'),
    generateCourtWithStatus(5, 'maintenance'),
    generateCourtWithStatus(6, 'available'),
    generateCourtWithStatus(7, 'reserved'),
    generateCourtWithStatus(8, 'available'),
    generateCourtWithStatus(9, 'playing'),
    generateCourtWithStatus(10, 'offline')
  ];
}

/**
 * Generate court update events for real-time testing
 */
export function generateCourtUpdate(courtId: string): {
  courtId: string;
  previousStatus: Court['status'];
  newStatus: Court['status'];
  timestamp: string;
} {
  const statuses: Court['status'][] = ['available', 'playing', 'maintenance', 'reserved', 'offline'];
  const previousStatus = faker.helpers.arrayElement(statuses);
  const newStatus = faker.helpers.arrayElement(statuses.filter(s => s !== previousStatus));

  return {
    courtId,
    previousStatus,
    newStatus,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate large dataset for performance testing
 */
export function generateLargeCourtDataset(count: number = 100): Court[] {
  return generateCourts(count);
}
