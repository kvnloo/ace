#!/usr/bin/env node

/**
 * Performance Baseline Capture Script
 * Measures current application performance metrics to establish baseline
 */

import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASELINE_FILE = path.join(__dirname, '../tests/performance/baseline.json');
const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const RUNS = 3; // Number of test runs to average

/**
 * Measure performance metrics for the 3D scene
 */
async function measurePerformance(page) {
  const metrics = {
    loadTime: 0,
    fps: 0,
    memory: 0,
    interactionLatency: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    timeToInteractive: 0,
    totalBlockingTime: 0,
  };

  // Navigate and wait for load
  const startTime = Date.now();
  await page.goto(APP_URL, { waitUntil: 'networkidle' });

  // Wait for 3D scene to be ready
  await page.waitForSelector('canvas', { timeout: 30000 });
  await page.waitForTimeout(2000); // Allow scene to fully initialize

  metrics.loadTime = Date.now() - startTime;

  // Get Web Vitals and performance metrics
  const performanceMetrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      // Get performance entries
      const perfEntries = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');

      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');

      // Use PerformanceObserver for LCP
      let lcp = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcp = lastEntry.renderTime || lastEntry.loadTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure FPS
      let frameCount = 0;
      let lastTime = performance.now();
      let fps = 0;

      function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        const elapsed = currentTime - lastTime;

        if (elapsed >= 1000) {
          fps = Math.round((frameCount * 1000) / elapsed);
          frameCount = 0;
          lastTime = currentTime;
        }

        if (performance.now() - startMeasure < 5000) {
          requestAnimationFrame(measureFPS);
        } else {
          resolve({
            fcp: fcp?.startTime || 0,
            lcp: lcp,
            tti: perfEntries?.domInteractive || 0,
            tbt: 0, // Calculated separately
            fps: fps,
          });
        }
      }

      const startMeasure = performance.now();
      requestAnimationFrame(measureFPS);
    });
  });

  metrics.firstContentfulPaint = performanceMetrics.fcp;
  metrics.largestContentfulPaint = performanceMetrics.lcp;
  metrics.timeToInteractive = performanceMetrics.tti;
  metrics.fps = performanceMetrics.fps;

  // Measure memory usage
  const memoryMetrics = await page.evaluate(() => {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  });

  if (memoryMetrics) {
    metrics.memory = Math.round(memoryMetrics.usedJSHeapSize / 1024 / 1024); // MB
  }

  // Measure interaction latency (camera rotation)
  const interactionStart = Date.now();
  await page.mouse.move(400, 300);
  await page.mouse.down();
  await page.mouse.move(600, 300);
  await page.mouse.up();
  await page.waitForTimeout(500);
  metrics.interactionLatency = Date.now() - interactionStart;

  // Get Total Blocking Time
  const tbt = await page.evaluate(() => {
    return new Promise((resolve) => {
      let totalBlockingTime = 0;

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            totalBlockingTime += entry.duration - 50;
          }
        });
      }).observe({ entryTypes: ['longtask'] });

      setTimeout(() => resolve(totalBlockingTime), 3000);
    });
  });

  metrics.totalBlockingTime = tbt;

  return metrics;
}

/**
 * Get bundle size metrics
 */
async function getBundleSize() {
  const distPath = path.join(__dirname, '../dist');

  if (!fs.existsSync(distPath)) {
    console.warn('⚠️  Dist folder not found. Run "npm run build" first.');
    return null;
  }

  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;

  function getDirectorySize(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        getDirectorySize(filePath);
      } else {
        totalSize += stats.size;

        if (file.endsWith('.js')) {
          jsSize += stats.size;
        } else if (file.endsWith('.css')) {
          cssSize += stats.size;
        }
      }
    });
  }

  getDirectorySize(distPath);

  return {
    total: Math.round(totalSize / 1024), // KB
    js: Math.round(jsSize / 1024),
    css: Math.round(cssSize / 1024),
  };
}

/**
 * Run performance baseline capture
 */
async function captureBaseline() {
  console.log('🔍 Capturing Performance Baseline...\n');

  // Get bundle size
  const bundleSize = await getBundleSize();
  if (bundleSize) {
    console.log('📦 Bundle Size:');
    console.log(`   Total: ${bundleSize.total} KB`);
    console.log(`   JS: ${bundleSize.js} KB`);
    console.log(`   CSS: ${bundleSize.css} KB\n`);
  }

  // Launch browser
  const browser = await chromium.launch({
    args: ['--enable-precise-memory-info'],
  });

  const allMetrics = [];

  console.log(`🏃 Running ${RUNS} performance measurement runs...\n`);

  for (let i = 0; i < RUNS; i++) {
    console.log(`   Run ${i + 1}/${RUNS}...`);

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();

    try {
      const metrics = await measurePerformance(page);
      allMetrics.push(metrics);
      console.log(`   ✅ Load: ${metrics.loadTime}ms, FPS: ${metrics.fps}, Memory: ${metrics.memory}MB`);
    } catch (error) {
      console.error(`   ❌ Run ${i + 1} failed:`, error.message);
    }

    await context.close();
  }

  await browser.close();

  if (allMetrics.length === 0) {
    console.error('❌ No successful measurements captured');
    process.exit(1);
  }

  // Calculate averages
  const baseline = {
    loadTime: Math.round(average(allMetrics.map(m => m.loadTime))),
    fps: Math.round(average(allMetrics.map(m => m.fps))),
    memory: Math.round(average(allMetrics.map(m => m.memory))),
    interactionLatency: Math.round(average(allMetrics.map(m => m.interactionLatency))),
    firstContentfulPaint: Math.round(average(allMetrics.map(m => m.firstContentfulPaint))),
    largestContentfulPaint: Math.round(average(allMetrics.map(m => m.largestContentfulPaint))),
    timeToInteractive: Math.round(average(allMetrics.map(m => m.timeToInteractive))),
    totalBlockingTime: Math.round(average(allMetrics.map(m => m.totalBlockingTime))),
    bundleSize: bundleSize,
    timestamp: new Date().toISOString(),
    runs: RUNS,
  };

  // Save baseline
  const baselineDir = path.dirname(BASELINE_FILE);
  if (!fs.existsSync(baselineDir)) {
    fs.mkdirSync(baselineDir, { recursive: true });
  }

  fs.writeFileSync(BASELINE_FILE, JSON.stringify(baseline, null, 2));

  console.log('\n✅ Baseline Captured Successfully!\n');
  console.log('📊 Performance Baseline:');
  console.log(`   Load Time: ${baseline.loadTime}ms`);
  console.log(`   FPS: ${baseline.fps}`);
  console.log(`   Memory: ${baseline.memory}MB`);
  console.log(`   Interaction Latency: ${baseline.interactionLatency}ms`);
  console.log(`   First Contentful Paint: ${baseline.firstContentfulPaint}ms`);
  console.log(`   Largest Contentful Paint: ${baseline.largestContentfulPaint}ms`);
  console.log(`   Time to Interactive: ${baseline.timeToInteractive}ms`);
  console.log(`   Total Blocking Time: ${baseline.totalBlockingTime}ms`);

  if (bundleSize) {
    console.log(`   Bundle Size: ${bundleSize.total}KB (JS: ${bundleSize.js}KB, CSS: ${bundleSize.css}KB)`);
  }

  console.log(`\n📁 Baseline saved to: ${BASELINE_FILE}`);
}

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Run baseline capture
captureBaseline().catch(error => {
  console.error('❌ Baseline capture failed:', error);
  process.exit(1);
});
