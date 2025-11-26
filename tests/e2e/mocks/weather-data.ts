/**
 * Weather System Mock Data Generators
 *
 * Provides realistic mock data for weather controls and system state testing.
 */

export type WeatherType = 'clear' | 'rain' | 'snow' | 'windy' | 'storm';

export interface WeatherState {
  type: WeatherType;
  intensity: number; // 0-1
  temperature: number; // Celsius
  humidity: number; // Percentage
  windSpeed: number; // km/h
  visibility: number; // meters
  timestamp: number;
}

export interface WeatherImpact {
  surfaceFriction: number; // 0-1
  visibility: number; // 0-1
  windStrength: number; // 0-1
  wetness: number; // 0-1
  bounceModifier: number; // 0-1
}

/**
 * Generate weather state for a given weather type
 */
export function generateWeatherState(type: WeatherType, intensity: number = 0.5): WeatherState {
  const baseStates: Record<WeatherType, Partial<WeatherState>> = {
    clear: {
      temperature: 22,
      humidity: 45,
      windSpeed: 5,
      visibility: 10000
    },
    rain: {
      temperature: 18,
      humidity: 85,
      windSpeed: 15,
      visibility: 5000
    },
    snow: {
      temperature: -2,
      humidity: 70,
      windSpeed: 10,
      visibility: 3000
    },
    windy: {
      temperature: 20,
      humidity: 50,
      windSpeed: 35,
      visibility: 8000
    },
    storm: {
      temperature: 16,
      humidity: 95,
      windSpeed: 45,
      visibility: 1000
    }
  };

  const baseState = baseStates[type];

  return {
    type,
    intensity,
    temperature: baseState.temperature! + (Math.random() - 0.5) * 4,
    humidity: Math.max(0, Math.min(100, baseState.humidity! + (Math.random() - 0.5) * 10)),
    windSpeed: Math.max(0, baseState.windSpeed! * (0.8 + Math.random() * 0.4)),
    visibility: baseState.visibility! * (0.9 + Math.random() * 0.2),
    timestamp: Date.now()
  };
}

/**
 * Calculate gameplay impact based on weather
 */
export function calculateWeatherImpact(state: WeatherState): WeatherImpact {
  const impacts: Record<WeatherType, WeatherImpact> = {
    clear: {
      surfaceFriction: 1.0,
      visibility: 1.0,
      windStrength: 0.1,
      wetness: 0.0,
      bounceModifier: 1.0
    },
    rain: {
      surfaceFriction: 0.7,
      visibility: 0.6,
      windStrength: 0.3,
      wetness: 0.8,
      bounceModifier: 0.85
    },
    snow: {
      surfaceFriction: 0.5,
      visibility: 0.4,
      windStrength: 0.2,
      wetness: 0.3,
      bounceModifier: 0.7
    },
    windy: {
      surfaceFriction: 1.0,
      visibility: 0.9,
      windStrength: 0.8,
      wetness: 0.0,
      bounceModifier: 0.95
    },
    storm: {
      surfaceFriction: 0.6,
      visibility: 0.3,
      windStrength: 0.9,
      wetness: 1.0,
      bounceModifier: 0.75
    }
  };

  const baseImpact = impacts[state.type];

  // Apply intensity modifier
  return {
    surfaceFriction: baseImpact.surfaceFriction * (1 - state.intensity * 0.3),
    visibility: baseImpact.visibility * (1 - state.intensity * 0.4),
    windStrength: baseImpact.windStrength * state.intensity,
    wetness: baseImpact.wetness * state.intensity,
    bounceModifier: baseImpact.bounceModifier * (1 - state.intensity * 0.2)
  };
}

/**
 * Get weather transition states for animation testing
 */
export function generateWeatherTransition(
  from: WeatherType,
  to: WeatherType,
  steps: number = 10
): WeatherState[] {
  const transition: WeatherState[] = [];

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const intensity = 0.5 + Math.sin(progress * Math.PI) * 0.3;

    // Interpolate between weather types
    if (progress < 0.5) {
      transition.push(generateWeatherState(from, 1 - progress * 2));
    } else {
      transition.push(generateWeatherState(to, (progress - 0.5) * 2));
    }
  }

  return transition;
}

/**
 * Mock localStorage for weather preferences
 */
export function mockWeatherLocalStorage() {
  return {
    'weather-preferences': JSON.stringify({
      lastWeather: 'clear',
      lastIntensity: 0.5,
      autoTransition: false,
      transitionDuration: 2000
    })
  };
}

/**
 * Setup weather API mock routes
 */
export function setupWeatherMockAPI(page: any) {
  let currentWeather: WeatherState = generateWeatherState('clear', 0.5);

  return page.route('**/api/weather/**', (route: any) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes('/current') && method === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentWeather)
      });
    } else if (url.includes('/update') && method === 'POST') {
      const body = route.request().postDataJSON();
      currentWeather = generateWeatherState(body.type, body.intensity);
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentWeather)
      });
    } else if (url.includes('/impact') && method === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(calculateWeatherImpact(currentWeather))
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentWeather)
      });
    }
  });
}
