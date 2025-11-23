import { faker } from '@faker-js/faker';

/**
 * Performance Metrics Faker
 * Generates realistic performance metrics for testing and benchmarking
 */

export interface PerformanceMetrics {
  navigation: NavigationMetrics;
  coreWebVitals: CoreWebVitals;
  resources: ResourceMetrics;
  runtime: RuntimeMetrics;
  custom: CustomMetrics;
}

export interface NavigationMetrics {
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  speedIndex: number;
}

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  inp: number; // Interaction to Next Paint
}

export interface ResourceMetrics {
  totalSize: number;
  javascript: number;
  css: number;
  images: number;
  fonts: number;
  other: number;
  requestCount: number;
  cachedResources: number;
}

export interface RuntimeMetrics {
  jsHeapSize: number;
  jsHeapSizeLimit: number;
  fps: number;
  longTasks: number;
  layoutShifts: number;
}

export interface CustomMetrics {
  courtStatusUpdate: number;
  weatherAPIResponse: number;
  chartRenderTime: number;
  websocketLatency: number;
  chatMessageRender: number;
}

/**
 * Generate realistic navigation metrics
 */
export function generateNavigationMetrics(
  baseline: 'excellent' | 'good' | 'acceptable' | 'poor' = 'good'
): NavigationMetrics {
  const baseMultipliers = {
    excellent: 0.6,
    good: 1.0,
    acceptable: 1.5,
    poor: 2.5
  };

  const multiplier = baseMultipliers[baseline];

  return {
    domContentLoaded: faker.number.int({ min: 800, max: 1500 }) * multiplier,
    loadComplete: faker.number.int({ min: 1500, max: 2500 }) * multiplier,
    firstPaint: faker.number.int({ min: 400, max: 800 }) * multiplier,
    firstContentfulPaint: faker.number.int({ min: 600, max: 1200 }) * multiplier,
    timeToInteractive: faker.number.int({ min: 2000, max: 3500 }) * multiplier,
    totalBlockingTime: faker.number.int({ min: 100, max: 300 }) * multiplier,
    speedIndex: faker.number.int({ min: 2000, max: 3500 }) * multiplier
  };
}

/**
 * Generate Core Web Vitals
 */
export function generateCoreWebVitals(
  quality: 'good' | 'needs-improvement' | 'poor' = 'good'
): CoreWebVitals {
  const ranges = {
    good: {
      lcp: { min: 1200, max: 2400 },
      fid: { min: 30, max: 90 },
      cls: { min: 0.01, max: 0.08 },
      fcp: { min: 800, max: 1600 },
      ttfb: { min: 200, max: 700 },
      inp: { min: 50, max: 180 }
    },
    'needs-improvement': {
      lcp: { min: 2500, max: 3900 },
      fid: { min: 100, max: 280 },
      cls: { min: 0.11, max: 0.24 },
      fcp: { min: 1800, max: 2900 },
      ttfb: { min: 800, max: 1700 },
      inp: { min: 200, max: 450 }
    },
    poor: {
      lcp: { min: 4000, max: 6000 },
      fid: { min: 300, max: 500 },
      cls: { min: 0.25, max: 0.5 },
      fcp: { min: 3000, max: 5000 },
      ttfb: { min: 1800, max: 3000 },
      inp: { min: 500, max: 800 }
    }
  };

  const range = ranges[quality];

  return {
    lcp: faker.number.int(range.lcp),
    fid: faker.number.int(range.fid),
    cls: parseFloat(faker.number.float(range.cls).toFixed(3)),
    fcp: faker.number.int(range.fcp),
    ttfb: faker.number.int(range.ttfb),
    inp: faker.number.int(range.inp)
  };
}

/**
 * Generate resource metrics
 */
export function generateResourceMetrics(
  size: 'small' | 'medium' | 'large' = 'medium'
): ResourceMetrics {
  const baseSize = {
    small: 800,
    medium: 1500,
    large: 3000
  }[size];

  const javascript = faker.number.int({ min: 200, max: 400 });
  const css = faker.number.int({ min: 50, max: 120 });
  const images = faker.number.int({ min: 400, max: 1200 });
  const fonts = faker.number.int({ min: 80, max: 180 });
  const other = faker.number.int({ min: 50, max: 150 });

  return {
    totalSize: javascript + css + images + fonts + other,
    javascript,
    css,
    images,
    fonts,
    other,
    requestCount: faker.number.int({ min: 20, max: 60 }),
    cachedResources: faker.number.int({ min: 5, max: 30 })
  };
}

/**
 * Generate runtime metrics
 */
export function generateRuntimeMetrics(
  load: 'light' | 'medium' | 'heavy' = 'medium'
): RuntimeMetrics {
  const loadFactors = {
    light: 0.5,
    medium: 1.0,
    heavy: 2.0
  };

  const factor = loadFactors[load];

  const heapSize = faker.number.int({ min: 100, max: 300 }) * factor;

  return {
    jsHeapSize: heapSize * 1024 * 1024, // Convert to bytes
    jsHeapSizeLimit: 2048 * 1024 * 1024, // 2GB limit
    fps: Math.max(30, 60 - (factor * 10)),
    longTasks: faker.number.int({ min: 0, max: 5 }) * factor,
    layoutShifts: faker.number.int({ min: 0, max: 3 }) * factor
  };
}

/**
 * Generate custom application-specific metrics
 */
export function generateCustomMetrics(): CustomMetrics {
  return {
    courtStatusUpdate: faker.number.int({ min: 100, max: 500 }),
    weatherAPIResponse: faker.number.int({ min: 1000, max: 3000 }),
    chartRenderTime: faker.number.int({ min: 300, max: 1000 }),
    websocketLatency: faker.number.int({ min: 50, max: 200 }),
    chatMessageRender: faker.number.int({ min: 50, max: 150 })
  };
}

/**
 * Generate complete performance snapshot
 */
export function generatePerformanceSnapshot(
  quality: 'excellent' | 'good' | 'acceptable' | 'poor' = 'good'
): PerformanceMetrics {
  const qualityMap = {
    excellent: { nav: 'excellent', cwv: 'good', res: 'small', run: 'light' },
    good: { nav: 'good', cwv: 'good', res: 'medium', run: 'medium' },
    acceptable: { nav: 'acceptable', cwv: 'needs-improvement', res: 'medium', run: 'medium' },
    poor: { nav: 'poor', cwv: 'poor', res: 'large', run: 'heavy' }
  } as const;

  const config = qualityMap[quality];

  return {
    navigation: generateNavigationMetrics(config.nav),
    coreWebVitals: generateCoreWebVitals(config.cwv),
    resources: generateResourceMetrics(config.res),
    runtime: generateRuntimeMetrics(config.run),
    custom: generateCustomMetrics()
  };
}

/**
 * Generate Lighthouse report scores
 */
export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

export function generateLighthouseScores(
  quality: 'excellent' | 'good' | 'acceptable' | 'poor' = 'good'
): LighthouseScores {
  const ranges = {
    excellent: { min: 95, max: 100 },
    good: { min: 85, max: 94 },
    acceptable: { min: 70, max: 84 },
    poor: { min: 40, max: 69 }
  };

  const range = ranges[quality];

  return {
    performance: faker.number.int(range),
    accessibility: faker.number.int({ min: 90, max: 100 }), // Should always be high
    bestPractices: faker.number.int(range),
    seo: faker.number.int(range),
    pwa: faker.number.int({ min: range.min - 10, max: range.max - 5 })
  };
}

/**
 * Generate time-series performance data
 */
export function generatePerformanceTimeSeries(
  hours: number = 24,
  interval: number = 60 // minutes
): Array<{ timestamp: string; metrics: PerformanceMetrics }> {
  const data: Array<{ timestamp: string; metrics: PerformanceMetrics }> = [];
  const now = new Date();
  const points = (hours * 60) / interval;

  for (let i = 0; i < points; i++) {
    const timestamp = new Date(now.getTime() - (points - i) * interval * 60 * 1000);

    // Simulate performance degradation during peak hours
    const hour = timestamp.getHours();
    const isPeakHour = hour >= 9 && hour <= 17;
    const quality = isPeakHour
      ? faker.helpers.arrayElement(['good', 'acceptable'] as const)
      : faker.helpers.arrayElement(['excellent', 'good'] as const);

    data.push({
      timestamp: timestamp.toISOString(),
      metrics: generatePerformanceSnapshot(quality)
    });
  }

  return data;
}

/**
 * Generate memory leak simulation data
 */
export function generateMemoryLeakData(
  durationMinutes: number = 120
): Array<{ timestamp: string; heapSize: number }> {
  const data: Array<{ timestamp: string; heapSize: number }> = [];
  const baseHeapSize = 150; // MB
  const leakRate = 0.5; // MB per minute

  for (let i = 0; i <= durationMinutes; i++) {
    const timestamp = new Date(Date.now() + i * 60 * 1000);
    const heapSize = baseHeapSize + (leakRate * i) + faker.number.float({ min: -5, max: 5 });

    data.push({
      timestamp: timestamp.toISOString(),
      heapSize: parseFloat(heapSize.toFixed(2))
    });
  }

  return data;
}

/**
 * Generate network waterfall data
 */
export interface WaterfallEntry {
  name: string;
  type: 'document' | 'script' | 'stylesheet' | 'image' | 'font' | 'xhr' | 'other';
  startTime: number;
  duration: number;
  size: number;
  cached: boolean;
}

export function generateNetworkWaterfall(resourceCount: number = 30): WaterfallEntry[] {
  const entries: WaterfallEntry[] = [];
  let currentTime = 0;

  const types: WaterfallEntry['type'][] = [
    'document',
    'script',
    'stylesheet',
    'image',
    'font',
    'xhr',
    'other'
  ];

  for (let i = 0; i < resourceCount; i++) {
    const type = i === 0 ? 'document' : faker.helpers.arrayElement(types);
    const cached = faker.datatype.boolean({ probability: 0.3 });

    const entry: WaterfallEntry = {
      name: `/${faker.system.fileName()}`,
      type,
      startTime: currentTime,
      duration: faker.number.int({
        min: type === 'document' ? 100 : 20,
        max: type === 'image' ? 500 : 200
      }),
      size: faker.number.int({
        min: type === 'image' ? 50000 : 5000,
        max: type === 'image' ? 500000 : 100000
      }),
      cached
    };

    entries.push(entry);
    currentTime += entry.duration / 2; // Overlap resources
  }

  return entries;
}

/**
 * Generate FPS data over time (for animation testing)
 */
export function generateFPSData(
  durationSeconds: number = 60
): Array<{ timestamp: string; fps: number }> {
  const data: Array<{ timestamp: string; fps: number }> = [];

  for (let i = 0; i < durationSeconds * 10; i++) { // 10 samples per second
    const timestamp = new Date(Date.now() + i * 100);

    // Simulate FPS drops during complex animations
    const baseFPS = 60;
    const variance = faker.number.int({ min: -5, max: 2 });
    const fps = Math.max(30, Math.min(60, baseFPS + variance));

    data.push({
      timestamp: timestamp.toISOString(),
      fps
    });
  }

  return data;
}
