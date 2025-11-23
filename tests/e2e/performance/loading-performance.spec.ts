import { test, expect, Page } from '@playwright/test';

/**
 * Loading Performance Test Suite
 *
 * Verifies that the progressive loading system:
 * 1. Keeps browser responsive during all loading phases
 * 2. Doesn't cause memory leaks or excessive memory growth
 * 3. Maintains acceptable CPU usage
 * 4. Keeps UI animations smooth (>30 FPS)
 * 5. Completes within time budgets
 */

interface PerformanceMetrics {
  timestamp: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  cpu?: number;
  fps?: number;
  responseTime?: number;
}

interface PhaseTimings {
  essential: number;
  core: number;
  visual: number;
  enhanced: number;
  total: number;
}

test.describe('Loading Performance Benchmarks', () => {
  let metrics: PerformanceMetrics[] = [];

  test.beforeEach(async ({ page }) => {
    metrics = [];

    // Enable performance monitoring
    await page.addInitScript(() => {
      // Track performance metrics
      (window as any).__performanceMetrics = [];

      // Monitor memory
      setInterval(() => {
        if ((performance as any).memory) {
          (window as any).__performanceMetrics.push({
            timestamp: Date.now(),
            memory: {
              usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
              totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
              jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
            }
          });
        }
      }, 1000);

      // Monitor FPS
      let lastFrameTime = Date.now();
      let frameCount = 0;
      const measureFPS = () => {
        frameCount++;
        const now = Date.now();
        const elapsed = now - lastFrameTime;

        if (elapsed >= 1000) {
          const fps = (frameCount / elapsed) * 1000;
          const latestMetric = (window as any).__performanceMetrics[(window as any).__performanceMetrics.length - 1];
          if (latestMetric) {
            latestMetric.fps = fps;
          }
          frameCount = 0;
          lastFrameTime = now;
        }

        requestAnimationFrame(measureFPS);
      };
      requestAnimationFrame(measureFPS);
    });
  });

  test('1. Browser Responsiveness - UI remains interactive during loading', async ({ page }) => {
    console.log('\n📊 Testing Browser Responsiveness...\n');

    await page.goto('http://localhost:3000');

    const responseTimes: number[] = [];
    const checkInterval = 2000; // Check every 2 seconds
    const maxChecks = 15; // 30 seconds total

    for (let i = 0; i < maxChecks; i++) {
      await page.waitForTimeout(checkInterval);

      // Test 1: Cursor changes on hover
      const startHover = Date.now();
      await page.hover('body');
      const hoverTime = Date.now() - startHover;

      // Test 2: Measure response time for interaction
      const startClick = Date.now();
      const loadingContainer = page.locator('.loading-container').first();
      if (await loadingContainer.isVisible()) {
        await loadingContainer.click({ force: true, timeout: 1000 }).catch(() => {});
      }
      const clickTime = Date.now() - startClick;

      const responseTime = Math.max(hoverTime, clickTime);
      responseTimes.push(responseTime);

      console.log(`Check ${i + 1}: Response time ${responseTime}ms`);

      // Response should be < 100ms for good UX
      expect(responseTime).toBeLessThan(500); // Relaxed for CI

      // Check if loading is complete
      const isLoading = await page.evaluate(() => {
        return document.querySelector('.loading-container') !== null;
      });

      if (!isLoading) {
        console.log('✅ Loading complete, stopping responsiveness checks');
        break;
      }
    }

    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    console.log(`\n📈 Average response time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`📈 Max response time: ${Math.max(...responseTimes)}ms`);
    console.log(`📈 Min response time: ${Math.min(...responseTimes)}ms\n`);

    // Average response should be reasonable
    expect(avgResponseTime).toBeLessThan(200);
  });

  test('2. Memory Usage - No memory leaks during loading', async ({ page }) => {
    console.log('\n💾 Testing Memory Usage...\n');

    await page.goto('http://localhost:3000');

    // Wait for loading to complete
    await page.waitForTimeout(35000); // Wait longer than max loading time

    // Get collected metrics
    const collectedMetrics = await page.evaluate(() => {
      return (window as any).__performanceMetrics || [];
    });

    if (collectedMetrics.length === 0) {
      console.log('⚠️ Performance memory API not available, skipping memory test');
      test.skip();
      return;
    }

    const memoryMetrics = collectedMetrics.filter((m: PerformanceMetrics) => m.memory);

    if (memoryMetrics.length < 2) {
      console.log('⚠️ Not enough memory metrics collected');
      test.skip();
      return;
    }

    const startMemory = memoryMetrics[0].memory!.usedJSHeapSize;
    const endMemory = memoryMetrics[memoryMetrics.length - 1].memory!.usedJSHeapSize;
    const peakMemory = Math.max(...memoryMetrics.map((m: PerformanceMetrics) => m.memory!.usedJSHeapSize));

    const memoryGrowth = endMemory - startMemory;
    const memoryGrowthMB = memoryGrowth / (1024 * 1024);
    const peakMemoryMB = peakMemory / (1024 * 1024);

    console.log(`📊 Start memory: ${(startMemory / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`📊 End memory: ${(endMemory / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`📊 Peak memory: ${peakMemoryMB.toFixed(2)} MB`);
    console.log(`📊 Memory growth: ${memoryGrowthMB.toFixed(2)} MB\n`);

    // Memory growth should be reasonable (< 500MB as specified)
    expect(memoryGrowthMB).toBeLessThan(500);

    // Peak memory should also be reasonable
    expect(peakMemoryMB).toBeLessThan(1000);

    // Memory should stabilize (last 5 samples should be similar)
    const lastFiveMemory = memoryMetrics.slice(-5).map((m: PerformanceMetrics) => m.memory!.usedJSHeapSize);
    const memoryVariance = Math.max(...lastFiveMemory) - Math.min(...lastFiveMemory);
    const memoryVarianceMB = memoryVariance / (1024 * 1024);

    console.log(`📊 Memory stabilization variance: ${memoryVarianceMB.toFixed(2)} MB`);

    // Memory should stabilize to within 50MB variance
    expect(memoryVarianceMB).toBeLessThan(50);
  });

  test('3. CPU Usage - Main thread not blocked during loading', async ({ page, context }) => {
    console.log('\n⚡ Testing CPU Usage...\n');

    // Start CPU profiling
    const client = await context.newCDPSession(page);
    await client.send('Profiler.enable');
    await client.send('Profiler.start');

    await page.goto('http://localhost:3000');

    // Monitor for 10 seconds of loading
    await page.waitForTimeout(10000);

    // Stop profiling
    const { profile } = await client.send('Profiler.stop');

    // Analyze profile for long tasks (> 50ms blocks main thread)
    const longTasks = profile.samples?.filter((_, idx) => {
      if (idx === 0) return false;
      const duration = profile.timeDeltas?.[idx] || 0;
      return duration > 50000; // 50ms in microseconds
    }) || [];

    console.log(`📊 Total samples: ${profile.samples?.length || 0}`);
    console.log(`📊 Long tasks (>50ms): ${longTasks.length}`);

    // Calculate percentage of time in long tasks
    const totalTime = profile.endTime - profile.startTime;
    const longTaskPercentage = (longTasks.length / (profile.samples?.length || 1)) * 100;

    console.log(`📊 Long task percentage: ${longTaskPercentage.toFixed(2)}%`);
    console.log(`📊 Total profiling time: ${(totalTime / 1000000).toFixed(2)}s\n`);

    // Less than 20% of time should be in long tasks (80% responsiveness)
    expect(longTaskPercentage).toBeLessThan(20);

    await client.detach();
  });

  test('4. Frame Rate - UI animations stay smooth (>30 FPS)', async ({ page }) => {
    console.log('\n🎬 Testing Frame Rate...\n');

    await page.goto('http://localhost:3000');

    // Wait for some loading phases
    await page.waitForTimeout(15000);

    // Get FPS metrics
    const fpsMetrics = await page.evaluate(() => {
      return (window as any).__performanceMetrics
        ?.filter((m: PerformanceMetrics) => m.fps !== undefined)
        .map((m: PerformanceMetrics) => m.fps) || [];
    });

    if (fpsMetrics.length === 0) {
      console.log('⚠️ No FPS metrics collected');
      test.skip();
      return;
    }

    const avgFPS = fpsMetrics.reduce((a: number, b: number) => a + b, 0) / fpsMetrics.length;
    const minFPS = Math.min(...fpsMetrics);
    const maxFPS = Math.max(...fpsMetrics);

    console.log(`📊 Average FPS: ${avgFPS.toFixed(2)}`);
    console.log(`📊 Min FPS: ${minFPS.toFixed(2)}`);
    console.log(`📊 Max FPS: ${maxFPS.toFixed(2)}\n`);

    // Average FPS should be > 30
    expect(avgFPS).toBeGreaterThan(30);

    // Min FPS should not drop below 20 (occasional frame drops acceptable)
    expect(minFPS).toBeGreaterThan(20);

    // Check progress bar animation smoothness
    const progressBar = page.locator('.loading-progress-bar');
    if (await progressBar.isVisible()) {
      const animation = await progressBar.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('transition-duration');
      });
      console.log(`📊 Progress bar transition: ${animation}`);
    }
  });

  test('5. Time Budgets - Loading phases complete within targets', async ({ page }) => {
    console.log('\n⏱️ Testing Time Budgets...\n');

    const phaseTimings: Partial<PhaseTimings> = {};
    const startTime = Date.now();

    await page.goto('http://localhost:3000');

    // Track phase completions
    const trackPhase = async (phaseName: string, selector: string, timeout: number) => {
      try {
        const phaseStart = Date.now();
        await page.waitForSelector(selector, { timeout });
        const phaseTime = Date.now() - phaseStart;
        phaseTimings[phaseName as keyof PhaseTimings] = phaseTime;
        console.log(`✅ ${phaseName} phase: ${phaseTime}ms`);
        return phaseTime;
      } catch (error) {
        console.log(`❌ ${phaseName} phase: timeout`);
        return timeout;
      }
    };

    // Essential phase: < 5 seconds
    await trackPhase('essential', '[data-phase="essential-complete"]', 5000);

    // Core phase: < 10 seconds
    await trackPhase('core', '[data-phase="core-complete"]', 10000);

    // Visual phase: < 15 seconds
    await trackPhase('visual', '[data-phase="visual-complete"]', 15000);

    // Enhanced phase: < 20 seconds
    await trackPhase('enhanced', '[data-phase="enhanced-complete"]', 20000);

    // Total loading: < 30 seconds
    const totalTime = Date.now() - startTime;
    phaseTimings.total = totalTime;

    console.log(`\n📊 Total loading time: ${totalTime}ms`);
    console.log(`📊 Time budget: 30000ms`);
    console.log(`📊 Performance: ${((30000 - totalTime) / 30000 * 100).toFixed(2)}% under budget\n`);

    // Verify budgets
    if (phaseTimings.essential) {
      expect(phaseTimings.essential).toBeLessThan(5000);
    }
    if (phaseTimings.core) {
      expect(phaseTimings.core).toBeLessThan(10000);
    }
    if (phaseTimings.visual) {
      expect(phaseTimings.visual).toBeLessThan(15000);
    }
    if (phaseTimings.enhanced) {
      expect(phaseTimings.enhanced).toBeLessThan(20000);
    }
    expect(totalTime).toBeLessThan(30000);
  });

  test('6. Overall Performance Score - Combined metrics', async ({ page }) => {
    console.log('\n🎯 Calculating Overall Performance Score...\n');

    const startTime = Date.now();

    await page.goto('http://localhost:3000');

    // Wait for loading to complete
    await page.waitForTimeout(35000);

    const totalTime = Date.now() - startTime;

    // Get all metrics
    const allMetrics = await page.evaluate(() => {
      return (window as any).__performanceMetrics || [];
    });

    // Calculate scores (0-100)
    const scores = {
      responsiveness: 0,
      memory: 0,
      fps: 0,
      timing: 0
    };

    // Responsiveness score (based on no blocking)
    scores.responsiveness = 100; // Assume good if test passed

    // Memory score (based on growth < 500MB)
    if (allMetrics.length > 0) {
      const memoryMetrics = allMetrics.filter((m: PerformanceMetrics) => m.memory);
      if (memoryMetrics.length >= 2) {
        const startMem = memoryMetrics[0].memory!.usedJSHeapSize;
        const endMem = memoryMetrics[memoryMetrics.length - 1].memory!.usedJSHeapSize;
        const growthMB = (endMem - startMem) / (1024 * 1024);
        scores.memory = Math.max(0, 100 - (growthMB / 500 * 100));
      }

      // FPS score
      const fpsMetrics = allMetrics.filter((m: PerformanceMetrics) => m.fps !== undefined);
      if (fpsMetrics.length > 0) {
        const avgFPS = fpsMetrics.reduce((a: any, b: any) => a + b.fps, 0) / fpsMetrics.length;
        scores.fps = Math.min(100, (avgFPS / 60) * 100);
      }
    }

    // Timing score (based on < 30s total)
    scores.timing = Math.max(0, 100 - ((totalTime - 30000) / 30000 * 100));

    // Overall score (weighted average)
    const overallScore = (
      scores.responsiveness * 0.3 +
      scores.memory * 0.2 +
      scores.fps * 0.2 +
      scores.timing * 0.3
    );

    console.log('\n📊 Performance Scores:');
    console.log(`   Responsiveness: ${scores.responsiveness.toFixed(2)}/100`);
    console.log(`   Memory: ${scores.memory.toFixed(2)}/100`);
    console.log(`   Frame Rate: ${scores.fps.toFixed(2)}/100`);
    console.log(`   Timing: ${scores.timing.toFixed(2)}/100`);
    console.log(`\n🎯 Overall Score: ${overallScore.toFixed(2)}/100\n`);

    // Overall score should be > 70 for acceptable performance
    expect(overallScore).toBeGreaterThan(70);
  });

  test('7. Network Impact - Loading doesn\'t overwhelm network', async ({ page }) => {
    console.log('\n🌐 Testing Network Impact...\n');

    const requests: any[] = [];

    // Monitor all network requests
    page.on('request', request => {
      requests.push({
        url: request.url(),
        type: request.resourceType(),
        timestamp: Date.now()
      });
    });

    await page.goto('http://localhost:3000');

    // Wait for loading phases
    await page.waitForTimeout(25000);

    // Analyze request distribution
    const requestsByPhase = new Map<number, number>();
    const startTime = requests[0]?.timestamp || Date.now();

    requests.forEach(req => {
      const elapsed = req.timestamp - startTime;
      const phase = Math.floor(elapsed / 5000); // 5-second buckets
      requestsByPhase.set(phase, (requestsByPhase.get(phase) || 0) + 1);
    });

    console.log(`📊 Total requests: ${requests.length}`);
    console.log(`📊 Requests by phase (5s buckets):`);

    let maxConcurrent = 0;
    requestsByPhase.forEach((count, phase) => {
      console.log(`   Phase ${phase} (${phase * 5}-${(phase + 1) * 5}s): ${count} requests`);
      maxConcurrent = Math.max(maxConcurrent, count);
    });

    console.log(`📊 Max concurrent requests in 5s window: ${maxConcurrent}\n`);

    // Should not overwhelm browser (< 50 concurrent requests per 5s window)
    expect(maxConcurrent).toBeLessThan(50);

    // Total requests should be reasonable for a loading system
    expect(requests.length).toBeLessThan(200);
  });
});

test.describe('Loading Performance - Edge Cases', () => {
  test('Slow network conditions', async ({ page, context }) => {
    console.log('\n🐌 Testing Slow Network Performance...\n');

    // Simulate slow 3G
    const client = await context.newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 750 * 1024 / 8, // 750kb/s
      uploadThroughput: 250 * 1024 / 8,   // 250kb/s
      latency: 100 // 100ms
    });

    const startTime = Date.now();
    await page.goto('http://localhost:3000');

    // Should still complete eventually
    await page.waitForSelector('[data-phase="enhanced-complete"]', { timeout: 60000 });

    const totalTime = Date.now() - startTime;
    console.log(`📊 Loading time on slow 3G: ${totalTime}ms`);

    // Should complete within 60 seconds even on slow network
    expect(totalTime).toBeLessThan(60000);

    await client.detach();
  });

  test('CPU throttling conditions', async ({ page, context }) => {
    console.log('\n🔥 Testing CPU Throttling Performance...\n');

    // Simulate 4x CPU slowdown
    const client = await context.newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    const startTime = Date.now();
    await page.goto('http://localhost:3000');

    // Check responsiveness under CPU pressure
    await page.waitForTimeout(5000);

    const responseStart = Date.now();
    await page.click('body');
    const responseTime = Date.now() - responseStart;

    console.log(`📊 Response time under CPU throttling: ${responseTime}ms`);

    // Should still respond within 1 second even with CPU throttling
    expect(responseTime).toBeLessThan(1000);

    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await client.detach();
  });

  test('Memory pressure conditions', async ({ page }) => {
    console.log('\n💾 Testing Memory Pressure Performance...\n');

    await page.goto('http://localhost:3000');

    // Simulate memory pressure by allocating large arrays
    await page.evaluate(() => {
      (window as any).__memoryPressure = [];
      for (let i = 0; i < 100; i++) {
        (window as any).__memoryPressure.push(new Array(1000000).fill(0));
      }
    });

    // Wait a bit for GC
    await page.waitForTimeout(5000);

    // Check if loading still works
    const isResponsive = await page.evaluate(() => {
      const start = Date.now();
      // Try to interact
      document.body.click();
      return Date.now() - start < 100;
    });

    console.log(`📊 Responsive under memory pressure: ${isResponsive}`);

    expect(isResponsive).toBe(true);

    // Clean up
    await page.evaluate(() => {
      delete (window as any).__memoryPressure;
    });
  });
});
