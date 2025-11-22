#!/usr/bin/env node
/**
 * Performance Regression Testing Script
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASELINE_FILE = path.join(__dirname, '../tests/performance/baseline.json');
const RESULTS_FILE = path.join(__dirname, '../tests/performance/latest-results.json');
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

const THRESHOLDS = {
  loadTime: 0.10, fps: 0.05, memory: 0.15, interactionLatency: 0.10,
  firstContentfulPaint: 0.10, largestContentfulPaint: 0.15, 
  timeToInteractive: 0.10, totalBlockingTime: 0.20,
  bundleSize: { total: 0.05, js: 0.05, css: 0.10 }
};

async function measurePerformance(page) {
  const metrics = { loadTime: 0, fps: 0, memory: 0, interactionLatency: 0,
    firstContentfulPaint: 0, largestContentfulPaint: 0, timeToInteractive: 0, totalBlockingTime: 0 };
  
  const startTime = Date.now();
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { timeout: 30000 });
  await page.waitForTimeout(2000);
  metrics.loadTime = Date.now() - startTime;

  const perfMetrics = await page.evaluate(() => new Promise((resolve) => {
    const perfEntries = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
    let lcp = 0, fps = 0, frameCount = 0;
    let lastTime = performance.now();
    
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      lcp = (entries[entries.length - 1]?.renderTime || entries[entries.length - 1]?.loadTime) || 0;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    function measureFPS() {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0; lastTime = currentTime;
      }
      if (performance.now() - startMeasure < 5000) requestAnimationFrame(measureFPS);
      else resolve({ fcp: fcp?.startTime || 0, lcp, tti: perfEntries?.domInteractive || 0, fps });
    }
    const startMeasure = performance.now();
    requestAnimationFrame(measureFPS);
  }));

  Object.assign(metrics, perfMetrics);
  
  const memMetrics = await page.evaluate(() => performance.memory ? 
    { usedJSHeapSize: performance.memory.usedJSHeapSize } : null);
  if (memMetrics) metrics.memory = Math.round(memMetrics.usedJSHeapSize / 1024 / 1024);

  const intStart = Date.now();
  await page.mouse.move(400, 300);
  await page.mouse.down();
  await page.mouse.move(600, 300);
  await page.mouse.up();
  await page.waitForTimeout(500);
  metrics.interactionLatency = Date.now() - intStart;

  metrics.totalBlockingTime = await page.evaluate(() => new Promise((resolve) => {
    let tbt = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach(e => { if (e.duration > 50) tbt += e.duration - 50; });
    }).observe({ entryTypes: ['longtask'] });
    setTimeout(() => resolve(tbt), 3000);
  }));

  return metrics;
}

function getBundleSize() {
  const distPath = path.join(__dirname, '../dist');
  if (!fs.existsSync(distPath)) return null;
  
  let totalSize = 0, jsSize = 0, cssSize = 0;
  function scan(dir) {
    fs.readdirSync(dir).forEach(file => {
      const fp = path.join(dir, file);
      const stats = fs.statSync(fp);
      if (stats.isDirectory()) scan(fp);
      else {
        totalSize += stats.size;
        if (file.endsWith('.js')) jsSize += stats.size;
        else if (file.endsWith('.css')) cssSize += stats.size;
      }
    });
  }
  scan(distPath);
  return { total: Math.round(totalSize/1024), js: Math.round(jsSize/1024), css: Math.round(cssSize/1024) };
}

function detectRegressions(baseline, current) {
  const status = { passed: true, regressions: [], improvements: [], details: {} };
  const metrics = [
    { name: 'loadTime', inverse: false, unit: 'ms' },
    { name: 'fps', inverse: true, unit: '' },
    { name: 'memory', inverse: false, unit: 'MB' },
    { name: 'interactionLatency', inverse: false, unit: 'ms' },
    { name: 'firstContentfulPaint', inverse: false, unit: 'ms' },
    { name: 'largestContentfulPaint', inverse: false, unit: 'ms' },
    { name: 'timeToInteractive', inverse: false, unit: 'ms' },
    { name: 'totalBlockingTime', inverse: false, unit: 'ms' }
  ];

  metrics.forEach(({ name, inverse, unit }) => {
    const base = baseline[name], cur = current[name], threshold = THRESHOLDS[name];
    if (!base || !cur) return;
    const change = inverse ? (base - cur) / base : (cur - base) / base;
    const detail = { metric: name, baseline: base, current: cur, 
      change: `${(change * 100).toFixed(2)}%`, threshold: `${(threshold * 100).toFixed(0)}%`, unit };
    status.details[name] = detail;
    if (change > threshold) { status.regressions.push(detail); status.passed = false; }
    else if (change < -0.05) status.improvements.push(detail);
  });

  if (baseline.bundleSize && current.bundleSize) {
    ['total', 'js', 'css'].forEach(type => {
      const base = baseline.bundleSize[type], cur = current.bundleSize[type];
      const threshold = THRESHOLDS.bundleSize[type];
      const change = (cur - base) / base;
      const detail = { metric: `bundleSize.${type}`, baseline: base, current: cur,
        change: `${(change * 100).toFixed(2)}%`, threshold: `${(threshold * 100).toFixed(0)}%`, unit: 'KB' };
      status.details[`bundleSize.${type}`] = detail;
      if (change > threshold) { status.regressions.push(detail); status.passed = false; }
      else if (change < -0.05) status.improvements.push(detail);
    });
  }
  return status;
}

function printResults(status) {
  console.log('\n📊 Performance Test Results\n═══════════════════════════════════════════════════════════\n');
  Object.entries(status.details).forEach(([name, d]) => {
    const icon = status.regressions.find(r => r.metric === name) ? '❌' : 
      status.improvements.find(i => i.metric === name) ? '✅' : '⚪';
    console.log(`${icon} ${name.padEnd(25)} ${d.baseline}${d.unit} → ${d.current}${d.unit} (${d.change})`);
  });
  
  if (status.regressions.length > 0) {
    console.log('\n⚠️  PERFORMANCE REGRESSIONS DETECTED:\n');
    status.regressions.forEach(r => 
      console.log(`   ❌ ${r.metric}: ${r.baseline}${r.unit} → ${r.current}${r.unit} (${r.change}, threshold: ${r.threshold})`));
  }
  
  if (status.improvements.length > 0) {
    console.log('\n🎉 PERFORMANCE IMPROVEMENTS:\n');
    status.improvements.forEach(i => 
      console.log(`   ✅ ${i.metric}: ${i.baseline}${i.unit} → ${i.current}${i.unit} (${i.change})`));
  }
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
  console.log(status.passed ? '✅ All performance tests PASSED\n' : '❌ Performance tests FAILED - regressions detected\n');
}

async function runPerformanceTests() {
  console.log('🚀 Running Performance Regression Tests...\n');
  if (!fs.existsSync(BASELINE_FILE)) {
    console.error('❌ No baseline found. Run "npm run perf:baseline" first.');
    process.exit(1);
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
  console.log(`📋 Baseline from: ${new Date(baseline.timestamp).toLocaleString()}\n`);

  const bundleSize = getBundleSize();
  const browser = await chromium.launch({ args: ['--enable-precise-memory-info'] });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  console.log('🔍 Measuring current performance...\n');
  const metrics = await measurePerformance(page);
  metrics.bundleSize = bundleSize;
  metrics.timestamp = new Date().toISOString();

  await context.close();
  await browser.close();

  const resultsDir = path.dirname(RESULTS_FILE);
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(metrics, null, 2));

  const status = detectRegressions(baseline, metrics);
  printResults(status);
  process.exit(status.passed ? 0 : 1);
}

runPerformanceTests().catch(error => {
  console.error('❌ Performance test failed:', error);
  process.exit(1);
});
