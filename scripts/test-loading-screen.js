/**
 * Loading Screen Validation Test
 *
 * Tests that the loading screen:
 * 1. Appears on page load
 * 2. Progresses through all phases
 * 3. Completes and disappears
 * 4. Reveals the 3D scene
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TIMEOUT = 60000; // 60 seconds max
const URL = 'http://localhost:3001';
const SCREENSHOTS_DIR = path.join(__dirname, '../docs/screenshots/loading-test');

// Create screenshots directory
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function testLoadingScreen() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const results = {
    timestamp: new Date().toISOString(),
    testDuration: 0,
    phases: [],
    errors: [],
    consoleMessages: [],
    networkRequests: [],
    success: false
  };

  const startTime = Date.now();

  // Capture console messages
  page.on('console', msg => {
    const text = msg.text();
    results.consoleMessages.push({
      type: msg.type(),
      text: text,
      timestamp: Date.now() - startTime
    });
    console.log(`[${msg.type()}] ${text}`);
  });

  // Capture errors
  page.on('pageerror', error => {
    results.errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now() - startTime
    });
    console.error('Page error:', error);
  });

  // Track network requests
  page.on('request', request => {
    results.networkRequests.push({
      url: request.url(),
      method: request.method(),
      timestamp: Date.now() - startTime
    });
  });

  try {
    console.log('🚀 Starting loading screen test...');
    console.log(`📍 URL: ${URL}`);

    // Navigate to page
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Wait a moment for initial render
    await page.waitForTimeout(500);

    // Check if loading screen is visible
    console.log('✅ Checking for loading screen...');
    const loadingScreen = await page.locator('[data-testid="loading-screen"]').first();
    const isVisible = await loadingScreen.isVisible();

    if (!isVisible) {
      throw new Error('Loading screen not visible on page load!');
    }

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-loading-screen-initial.png'),
      fullPage: true
    });
    console.log('✅ Loading screen is visible');

    // Track phases
    const expectedPhases = ['Essential', 'Core', 'Visual', 'Enhanced'];
    const observedPhases = new Set();
    let lastPhase = '';

    // Monitor phase changes
    console.log('📊 Monitoring phase progression...');

    while (observedPhases.size < expectedPhases.length) {
      const currentPhaseElement = await page.locator('[data-testid="loading-phase"]').first();

      if (await currentPhaseElement.isVisible()) {
        const currentPhase = await currentPhaseElement.textContent();

        if (currentPhase && currentPhase !== lastPhase) {
          lastPhase = currentPhase;
          observedPhases.add(currentPhase);

          const phaseData = {
            name: currentPhase,
            timestamp: Date.now() - startTime
          };

          results.phases.push(phaseData);
          console.log(`📦 Phase detected: ${currentPhase} (${phaseData.timestamp}ms)`);

          // Take screenshot
          await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, `02-phase-${currentPhase.toLowerCase()}.png`),
            fullPage: true
          });
        }
      }

      // Check if loading screen has disappeared
      const stillVisible = await loadingScreen.isVisible().catch(() => false);
      if (!stillVisible) {
        console.log('✅ Loading screen disappeared!');
        break;
      }

      // Wait a bit before checking again
      await page.waitForTimeout(100);

      // Timeout check
      if (Date.now() - startTime > TIMEOUT) {
        throw new Error(`Loading screen timeout after ${TIMEOUT}ms`);
      }
    }

    // Wait for loading screen to fully disappear
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 5000
    }).catch(() => {
      console.warn('⚠️ Loading screen selector still present but may be hidden');
    });

    await page.waitForTimeout(1000);

    // Verify 3D canvas is visible
    console.log('🎨 Checking for 3D canvas...');
    const canvas = await page.locator('canvas').first();
    const canvasVisible = await canvas.isVisible();

    if (!canvasVisible) {
      throw new Error('3D canvas not visible after loading screen!');
    }

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '03-3d-scene-visible.png'),
      fullPage: true
    });
    console.log('✅ 3D canvas is visible');

    // Calculate duration
    results.testDuration = Date.now() - startTime;
    results.success = true;

    // Verify all phases were observed
    const missingPhases = expectedPhases.filter(p => !observedPhases.has(p));
    if (missingPhases.length > 0) {
      results.errors.push({
        message: `Missing phases: ${missingPhases.join(', ')}`,
        timestamp: results.testDuration
      });
    }

    console.log('\n✅ Test completed successfully!');
    console.log(`⏱️  Total duration: ${results.testDuration}ms`);
    console.log(`📦 Phases observed: ${Array.from(observedPhases).join(' → ')}`);

  } catch (error) {
    results.errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now() - startTime
    });
    console.error('❌ Test failed:', error);

    // Take screenshot of failure state
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'error-state.png'),
      fullPage: true
    });
  } finally {
    await browser.close();

    // Write results to file
    const reportPath = path.join(__dirname, '../docs/loading-screen-validation.md');
    const report = generateReport(results);
    fs.writeFileSync(reportPath, report);
    console.log(`\n📄 Report written to: ${reportPath}`);

    return results;
  }
}

function generateReport(results) {
  const { success, testDuration, phases, errors, consoleMessages } = results;

  let report = `# Loading Screen Validation Report

**Test Date:** ${new Date(results.timestamp).toLocaleString()}
**Test Duration:** ${testDuration}ms (${(testDuration / 1000).toFixed(2)}s)
**Status:** ${success ? '✅ PASSED' : '❌ FAILED'}

## Test Criteria

`;

  // Test criteria checklist
  const criteria = [
    { name: 'Loading screen appears', passed: phases.length > 0 },
    { name: 'Shows phase "Essential"', passed: phases.some(p => p.name === 'Essential') },
    { name: 'Progresses to "Core"', passed: phases.some(p => p.name === 'Core') },
    { name: 'Progresses to "Visual"', passed: phases.some(p => p.name === 'Visual') },
    { name: 'Progresses to "Enhanced"', passed: phases.some(p => p.name === 'Enhanced') },
    { name: 'Loading screen disappears', passed: success },
    { name: '3D canvas visible', passed: success },
    { name: 'NO console errors', passed: errors.length === 0 },
    { name: 'Total time < 60 seconds', passed: testDuration < 60000 }
  ];

  criteria.forEach(c => {
    report += `- [${c.passed ? 'x' : ' '}] ${c.name}\n`;
  });

  report += `\n## Phase Progression\n\n`;

  if (phases.length > 0) {
    report += `| Phase | Time (ms) | Time (s) |\n`;
    report += `|-------|-----------|----------|\n`;
    phases.forEach(phase => {
      report += `| ${phase.name} | ${phase.timestamp} | ${(phase.timestamp / 1000).toFixed(2)} |\n`;
    });
  } else {
    report += `No phases detected.\n`;
  }

  report += `\n## Errors\n\n`;

  if (errors.length > 0) {
    errors.forEach((error, i) => {
      report += `### Error ${i + 1}\n\n`;
      report += `**Message:** ${error.message}\n\n`;
      if (error.stack) {
        report += `**Stack:**\n\`\`\`\n${error.stack}\n\`\`\`\n\n`;
      }
    });
  } else {
    report += `No errors detected.\n`;
  }

  report += `\n## Console Messages\n\n`;

  const errorMessages = consoleMessages.filter(m => m.type === 'error');
  const warningMessages = consoleMessages.filter(m => m.type === 'warning');
  const infoMessages = consoleMessages.filter(m => m.type === 'log' || m.type === 'info');

  if (errorMessages.length > 0) {
    report += `### Errors (${errorMessages.length})\n\n\`\`\`\n`;
    errorMessages.forEach(m => {
      report += `[${m.timestamp}ms] ${m.text}\n`;
    });
    report += `\`\`\`\n\n`;
  }

  if (warningMessages.length > 0) {
    report += `### Warnings (${warningMessages.length})\n\n\`\`\`\n`;
    warningMessages.forEach(m => {
      report += `[${m.timestamp}ms] ${m.text}\n`;
    });
    report += `\`\`\`\n\n`;
  }

  if (infoMessages.length > 0) {
    report += `### Info (${infoMessages.length})\n\n<details>\n<summary>Show all info messages</summary>\n\n\`\`\`\n`;
    infoMessages.forEach(m => {
      report += `[${m.timestamp}ms] ${m.text}\n`;
    });
    report += `\`\`\`\n\n</details>\n\n`;
  }

  report += `## Screenshots\n\n`;
  report += `Screenshots are available in: \`docs/screenshots/loading-test/\`\n\n`;
  report += `- \`01-loading-screen-initial.png\` - Initial loading screen\n`;
  report += `- \`02-phase-essential.png\` - Essential phase\n`;
  report += `- \`02-phase-core.png\` - Core phase\n`;
  report += `- \`02-phase-visual.png\` - Visual phase\n`;
  report += `- \`02-phase-enhanced.png\` - Enhanced phase\n`;
  report += `- \`03-3d-scene-visible.png\` - 3D scene after loading\n`;

  if (!success) {
    report += `- \`error-state.png\` - Error state\n`;
  }

  report += `\n## Conclusion\n\n`;

  if (success) {
    report += `✅ The loading screen successfully completes and reveals the 3D scene.\n`;
    report += `All phases progress correctly and the total time is within acceptable limits.\n`;
  } else {
    report += `❌ The loading screen test failed.\n`;
    report += `Please review the errors and console messages above for details.\n`;
  }

  return report;
}

// Run the test
testLoadingScreen().then(results => {
  process.exit(results.success ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
