import { faker } from '@faker-js/faker';

/**
 * User Session and Preference Generator
 * Generates realistic user data and sessions for E2E testing
 */

export type UserRole = 'guest' | 'member' | 'staff' | 'admin';
export type Theme = 'light' | 'dark' | 'auto';

export interface UserPreferences {
  theme: Theme;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    courtAvailability: boolean;
    weatherAlerts: boolean;
    bookingReminders: boolean;
    maintenanceUpdates: boolean;
    systemAlerts?: boolean;
    bmsAlerts?: boolean;
  };
  dashboard: {
    defaultView: string;
    widgets: string[];
    layout: 'grid' | 'list';
    refreshInterval: number;
  };
  bookings: {
    defaultDuration: number;
    preferredCourts: string[];
    preferredTimeSlots: string[];
    autoConfirm: boolean;
    reminderTime: number;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
  units: {
    temperature: 'celsius' | 'fahrenheit';
    distance: 'metric' | 'imperial';
    speed: 'kmh' | 'mph';
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  preferences: UserPreferences;
  favorites: {
    courts: string[];
    partners: string[];
  };
  statistics: {
    totalBookings: number;
    hoursPlayed: number;
    favoriteCourtType: 'hard' | 'clay' | 'grass' | 'carpet' | null;
    averageSessionDuration: number;
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en',
  timezone: 'UTC',
  notifications: {
    email: true,
    push: false,
    sms: false,
    courtAvailability: true,
    weatherAlerts: true,
    bookingReminders: true,
    maintenanceUpdates: false
  },
  dashboard: {
    defaultView: 'courts',
    widgets: ['weather', 'court-status'],
    layout: 'grid',
    refreshInterval: 30
  },
  bookings: {
    defaultDuration: 60,
    preferredCourts: [],
    preferredTimeSlots: [],
    autoConfirm: false,
    reminderTime: 60
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    screenReader: false
  },
  units: {
    temperature: 'celsius',
    distance: 'metric',
    speed: 'kmh'
  }
};

/**
 * Generate a random user
 */
export function generateUser(role: UserRole = 'member'): User {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: `user-${faker.string.uuid()}`,
    username: faker.internet.userName({ firstName, lastName }),
    email: faker.internet.email({ firstName, lastName }),
    role,
    preferences: generatePreferences(role),
    favorites: {
      courts: faker.helpers.arrayElements(
        ['court-001', 'court-002', 'court-003', 'court-004', 'court-005'],
        faker.number.int({ min: 0, max: 3 })
      ),
      partners: Array.from(
        { length: faker.number.int({ min: 0, max: 5 }) },
        () => `user-${faker.string.uuid()}`
      )
    },
    statistics: generateStatistics(role)
  };
}

/**
 * Generate user preferences based on role
 */
export function generatePreferences(role: UserRole): UserPreferences {
  const prefs = { ...DEFAULT_PREFERENCES };

  // Customize based on role
  if (role === 'admin' || role === 'staff') {
    prefs.notifications.systemAlerts = true;
    prefs.notifications.bmsAlerts = true;
    prefs.dashboard.widgets = [
      'weather',
      'court-status',
      'bms-sensors',
      'recent-bookings',
      'system-health'
    ];
    prefs.dashboard.defaultView = role === 'admin' ? 'admin' : 'maintenance';
    prefs.dashboard.refreshInterval = 15;
  }

  // Random customizations
  prefs.theme = faker.helpers.arrayElement(['light', 'dark', 'auto'] as const);
  prefs.language = faker.helpers.arrayElement(['en', 'es', 'fr', 'de']);
  prefs.timezone = faker.location.timeZone();

  prefs.bookings.defaultDuration = faker.helpers.arrayElement([60, 90, 120]);
  prefs.bookings.autoConfirm = faker.datatype.boolean();

  prefs.units.temperature = faker.helpers.arrayElement(['celsius', 'fahrenheit'] as const);

  return prefs;
}

/**
 * Generate user statistics
 */
export function generateStatistics(role: UserRole): User['statistics'] {
  const baseBookings = role === 'guest' ? 0 : faker.number.int({ min: 5, max: 200 });
  const hoursPerBooking = faker.number.float({ min: 1, max: 2, precision: 0.5 });

  return {
    totalBookings: baseBookings,
    hoursPlayed: parseFloat((baseBookings * hoursPerBooking).toFixed(1)),
    favoriteCourtType: baseBookings > 0
      ? faker.helpers.arrayElement(['hard', 'clay', 'grass', 'carpet'] as const)
      : null,
    averageSessionDuration: faker.number.int({ min: 60, max: 120 })
  };
}

/**
 * Generate user session data
 */
export interface UserSession {
  sessionId: string;
  userId: string;
  startTime: string;
  lastActivity: string;
  ipAddress: string;
  userAgent: string;
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
  };
  actions: Array<{
    timestamp: string;
    type: string;
    details: any;
  }>;
}

export function generateUserSession(userId: string): UserSession {
  const deviceType = faker.helpers.arrayElement(['desktop', 'mobile', 'tablet'] as const);
  const startTime = faker.date.recent({ days: 1 });

  return {
    sessionId: `session-${faker.string.alphanumeric(16)}`,
    userId,
    startTime: startTime.toISOString(),
    lastActivity: faker.date.between({
      from: startTime,
      to: new Date()
    }).toISOString(),
    ipAddress: faker.internet.ipv4(),
    userAgent: faker.internet.userAgent(),
    device: {
      type: deviceType,
      os: deviceType === 'mobile'
        ? faker.helpers.arrayElement(['iOS', 'Android'])
        : faker.helpers.arrayElement(['Windows', 'macOS', 'Linux']),
      browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge'])
    },
    actions: generateSessionActions(5)
  };
}

/**
 * Generate session actions
 */
export function generateSessionActions(count: number): UserSession['actions'] {
  const actionTypes = [
    'page-view',
    'court-view',
    'booking-create',
    'weather-check',
    'chat-message',
    'theme-toggle',
    'settings-update'
  ];

  return Array.from({ length: count }, () => ({
    timestamp: faker.date.recent({ days: 0.5 }).toISOString(),
    type: faker.helpers.arrayElement(actionTypes),
    details: {
      page: faker.helpers.arrayElement(['/courts', '/weather', '/bookings', '/settings']),
      duration: faker.number.int({ min: 1000, max: 60000 })
    }
  }));
}

/**
 * Generate first-time user (for onboarding tests)
 */
export function generateFirstTimeUser(): User & {
  onboarding: {
    completed: boolean;
    currentStep: number;
    steps: string[];
  };
} {
  const user = generateUser('member');

  return {
    ...user,
    statistics: {
      totalBookings: 0,
      hoursPlayed: 0,
      favoriteCourtType: null,
      averageSessionDuration: 0
    },
    onboarding: {
      completed: false,
      currentStep: 1,
      steps: ['welcome', 'preferences', 'court-tour', 'first-booking']
    }
  };
}

/**
 * Generate power user (for performance tests)
 */
export function generatePowerUser(): User {
  const user = generateUser('member');

  return {
    ...user,
    preferences: {
      ...user.preferences,
      dashboard: {
        defaultView: 'courts',
        widgets: [
          'weather',
          'court-status',
          'upcoming-bookings',
          'bms-sensors',
          'statistics',
          'leaderboard'
        ],
        layout: 'grid',
        refreshInterval: 10
      }
    },
    statistics: {
      totalBookings: 500,
      hoursPlayed: 1500,
      favoriteCourtType: 'hard',
      averageSessionDuration: 120
    }
  };
}

/**
 * Generate accessibility-focused user
 */
export function generateAccessibilityUser(): User {
  const user = generateUser('member');

  return {
    ...user,
    preferences: {
      ...user.preferences,
      accessibility: {
        highContrast: true,
        reducedMotion: true,
        largeText: true,
        screenReader: true
      }
    }
  };
}

/**
 * Generate batch of users for testing
 */
export function generateUserBatch(count: number, roleDistribution?: {
  guest?: number;
  member?: number;
  staff?: number;
  admin?: number;
}): User[] {
  const users: User[] = [];

  const dist = roleDistribution || {
    guest: 0.1,
    member: 0.7,
    staff: 0.15,
    admin: 0.05
  };

  for (let i = 0; i < count; i++) {
    const random = Math.random();
    let role: UserRole = 'member';

    if (random < dist.guest!) {
      role = 'guest';
    } else if (random < (dist.guest! + dist.member!)) {
      role = 'member';
    } else if (random < (dist.guest! + dist.member! + dist.staff!)) {
      role = 'staff';
    } else {
      role = 'admin';
    }

    users.push(generateUser(role));
  }

  return users;
}
