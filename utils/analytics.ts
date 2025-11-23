/**
 * Performance Analytics Module
 *
 * Tracks Core Web Vitals and performance metrics:
 * - LCP (Largest Contentful Paint): Measures when the largest content element is painted
 * - FCP (First Contentful Paint): Measures when first content is painted
 * - CLS (Cumulative Layout Shift): Measures visual stability
 * - TTFB (Time To First Byte): Measures server response time
 * - INP (Interaction to Next Paint): Measures interactivity responsiveness
 *
 * Privacy-first approach: Metrics are logged locally in development only.
 * Ready for future analytics integration without tracking user data.
 */

import { onLCP, onFCP, onCLS, onTTFB, onINP, type Metric } from 'web-vitals';

/**
 * Metric thresholds for performance evaluation
 * Based on Google Web Vitals recommendations
 */
const METRIC_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // milliseconds
  FCP: { good: 1800, poor: 3000 }, // milliseconds
  CLS: { good: 0.1, poor: 0.25 }, // unitless
  TTFB: { good: 800, poor: 1800 }, // milliseconds
  INP: { good: 200, poor: 500 }, // milliseconds
};

/**
 * Categorize metric value as "good", "needs improvement", or "poor"
 */
function categorizeMetric(name: string, value: number): string {
  const threshold = METRIC_THRESHOLDS[name as keyof typeof METRIC_THRESHOLDS];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Format metric value for display with appropriate units
 */
function formatMetricValue(name: string, value: number): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3);
    case 'LCP':
    case 'FCP':
    case 'TTFB':
    case 'INP':
      return `${value.toFixed(0)}ms`;
    default:
      return value.toString();
  }
}

/**
 * Log metric to console with styling and categorization
 */
function logMetric(metric: Metric): void {
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) return;

  const category = categorizeMetric(metric.name, metric.value as number);
  const formattedValue = formatMetricValue(metric.name, metric.value as number);

  // Define colors based on performance category
  const categoryColors = {
    good: '#10b981', // green
    'needs-improvement': '#f59e0b', // amber
    poor: '#ef4444', // red
    unknown: '#6b7280', // gray
  };

  const color = categoryColors[category as keyof typeof categoryColors] || categoryColors.unknown;

  console.group(`%c⚡ Web Vital: ${metric.name}`, `color: ${color}; font-weight: bold;`);
  console.log(`Value: ${formattedValue}`);
  console.log(`Category: ${category}`);
  console.log(
    `Threshold (good): ${formatMetricValue(metric.name, METRIC_THRESHOLDS[metric.name as keyof typeof METRIC_THRESHOLDS].good)}`
  );
  console.log(`ID: ${metric.id}`);
  console.log(`Delta: ${metric.delta.toFixed(0)}ms`);
  console.groupEnd();
}

/**
 * Prepare metric data for analytics integration
 * Currently returns the metric object; can be extended for API calls
 */
function prepareMetricForAnalytics(metric: Metric): Record<string, unknown> {
  return {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
    entries: metric.entries,
    rating: categorizeMetric(metric.name, metric.value as number),
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
}

/**
 * Send metric to analytics backend (stub for future implementation)
 * This function is non-blocking and will be called after metrics are collected
 */
async function sendMetricToAnalytics(metric: Metric): Promise<void> {
  // Privacy-first: Only prepare data, don't send anywhere yet
  // Future implementations can send to analytics service here
  const analyticsData = prepareMetricForAnalytics(metric);

  // Placeholder for future analytics integration
  // Example:
  // await fetch('/api/analytics', {
  //   method: 'POST',
  //   body: JSON.stringify(analyticsData),
  //   keepalive: true, // Ensure request completes even if page unloads
  // }).catch(() => {
  //   // Silently fail to not impact user experience
  // });

  if (process.env.NODE_ENV === 'development') {
    // In development, make the analytics data available in console
    (window as any).__WEB_VITALS__ = (window as any).__WEB_VITALS__ || [];
    (window as any).__WEB_VITALS__.push(analyticsData);
  }
}

/**
 * Initialize Web Vitals tracking
 * Registers callbacks for all Core Web Vitals metrics
 * Non-blocking implementation using async callbacks
 */
export function initializeAnalytics(): void {
  // Only initialize in browser environment
  if (typeof window === 'undefined') return;

  // Track LCP (Largest Contentful Paint)
  onLCP((metric: Metric) => {
    logMetric(metric);
    // Non-blocking: use setTimeout to avoid blocking main thread
    setTimeout(() => sendMetricToAnalytics(metric), 0);
  });

  // Track FCP (First Contentful Paint)
  onFCP((metric: Metric) => {
    logMetric(metric);
    setTimeout(() => sendMetricToAnalytics(metric), 0);
  });

  // Track CLS (Cumulative Layout Shift)
  onCLS((metric: Metric) => {
    logMetric(metric);
    setTimeout(() => sendMetricToAnalytics(metric), 0);
  });

  // Track TTFB (Time To First Byte)
  onTTFB((metric: Metric) => {
    logMetric(metric);
    setTimeout(() => sendMetricToAnalytics(metric), 0);
  });

  // Track INP (Interaction to Next Paint)
  // Modern replacement for FID with more comprehensive interactivity data
  onINP((metric: Metric) => {
    logMetric(metric);
    setTimeout(() => sendMetricToAnalytics(metric), 0);
  });

  // Log initialization in development
  if (process.env.NODE_ENV === 'development') {
    console.log('%c✓ Performance analytics initialized', 'color: #3b82f6; font-weight: bold;');
    console.log(
      '%cOpen DevTools and look for "⚡ Web Vital" logs to see performance metrics',
      'color: #6b7280; font-style: italic;'
    );
  }
}

/**
 * Get all collected metrics (for development/debugging)
 * Returns metrics from the window.__WEB_VITALS__ array
 */
export function getCollectedMetrics(): Record<string, unknown>[] {
  if (typeof window === 'undefined') return [];
  return (window as any).__WEB_VITALS__ || [];
}

/**
 * Clear all collected metrics
 */
export function clearCollectedMetrics(): void {
  if (typeof window !== 'undefined') {
    (window as any).__WEB_VITALS__ = [];
  }
}

/**
 * Get performance summary for console output
 */
export function getPerformanceSummary(): void {
  if (typeof window === 'undefined') return;

  const metrics = getCollectedMetrics();
  if (metrics.length === 0) {
    console.log('No metrics collected yet');
    return;
  }

  console.group('%c📊 Performance Summary', 'color: #8b5cf6; font-weight: bold; font-size: 14px;');
  metrics.forEach((metric) => {
    const rating = (metric as any).rating || 'unknown';
    const colors = {
      good: '#10b981',
      'needs-improvement': '#f59e0b',
      poor: '#ef4444',
      unknown: '#6b7280',
    };
    const color = colors[rating as keyof typeof colors] || colors.unknown;
    console.log(
      `%c${(metric as any).name}: ${(metric as any).value?.toFixed((metric as any).name === 'CLS' ? 3 : 0)} %c[${rating}]`,
      'font-weight: bold;',
      `color: ${color};`
    );
  });
  console.groupEnd();
}

export default {
  initializeAnalytics,
  getCollectedMetrics,
  clearCollectedMetrics,
  getPerformanceSummary,
};
