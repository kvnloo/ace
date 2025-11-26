import { test, expect } from '@playwright/test';

test('verify tennis court grass rendering and adaptive density', async ({ page }) => {
  // Array to collect console logs
  const consoleLogs = [];
  const grassLogs = [];

  // Listen to console messages
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);

    // Collect grass-specific logs
    if (text.includes('[GrassAdaptive]')) {
      grassLogs.push(text);
      console.log('🌱', text);
    }
  });

  // Navigate to the page
  console.log('📍 Navigating to http://localhost:3001/');

  // Override baseURL for this test
  await page.goto('http://localhost:3001/', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Wait a bit for the app to initialize
  await page.waitForTimeout(2000);

  // Try to navigate to court view (look for navigation elements)
  console.log('🎾 Looking for court view navigation...');

  // Check if there's a court view button or link
  const courtButton = page.locator('button:has-text("Court"), a:has-text("Court"), [data-view="court"]').first();
  const buttonExists = await courtButton.count() > 0;

  if (buttonExists) {
    console.log('✅ Found court view button, clicking...');
    await courtButton.click();
    await page.waitForTimeout(2000);
  } else {
    console.log('ℹ️  No explicit court button found, checking if already on court view');
  }

  // Wait for WebGL/Three.js to initialize
  await page.waitForTimeout(3000);

  // Check for grass density monitor overlay
  console.log('🔍 Checking for grass density monitor overlay...');

  const overlay = page.locator('[class*="grass"], [class*="density"], [class*="monitor"]').first();
  const overlayVisible = await overlay.isVisible().catch(() => false);

  if (overlayVisible) {
    const overlayText = await overlay.textContent();
    console.log('✅ Grass density monitor found:', overlayText);
  } else {
    console.log('⚠️  Grass density monitor overlay not visible');

    // Try to find it in the DOM anyway
    const allText = await page.locator('body').textContent();
    if (allText.includes('blades') || allText.includes('FPS') || allText.includes('%')) {
      console.log('ℹ️  Found density-related text in page:',
        allText.match(/\d+k?\s*blades|FPS:\s*\d+|\d+%/gi));
    }
  }

  // Take screenshot of the grass courts
  console.log('📸 Taking screenshot...');
  await page.screenshot({
    path: '/home/kvn/workspace/evolve/repos/ace/worktrees/ace-3Dmerge/tests/grass-rendering-screenshot.png',
    fullPage: true
  });

  // Wait a bit more to collect more console logs
  await page.waitForTimeout(5000);

  // Report findings
  console.log('\n=== GRASS RENDERING REPORT ===');
  console.log(`Total console logs: ${consoleLogs.length}`);
  console.log(`Grass-specific logs: ${grassLogs.length}`);

  if (grassLogs.length > 0) {
    console.log('\n🌱 Grass Adaptive Logs:');
    grassLogs.forEach(log => console.log('  ', log));

    // Try to extract blade counts from logs
    const bladeCountMatches = grassLogs.join('\n').match(/(\d+)k?\s*blades/gi);
    if (bladeCountMatches) {
      console.log('\n📊 Blade counts found in logs:', bladeCountMatches);
    }

    // Try to extract FPS info
    const fpsMatches = grassLogs.join('\n').match(/fps[:\s]+(\d+)/gi);
    if (fpsMatches) {
      console.log('📈 FPS values:', fpsMatches);
    }
  } else {
    console.log('⚠️  No [GrassAdaptive] logs found');
    console.log('\nSample of other console logs:');
    consoleLogs.slice(0, 10).forEach(log => console.log('  ', log));
  }

  // Check DOM for blade count information
  const bodyText = await page.locator('body').textContent();
  const bladeInfo = bodyText.match(/(\d+(?:,\d{3})*)\s*(?:blades?|草)/gi);
  const fpsInfo = bodyText.match(/FPS[:\s]*(\d+)/gi);
  const percentInfo = bodyText.match(/(\d+)%\s*(?:of\s*real)?/gi);

  if (bladeInfo || fpsInfo || percentInfo) {
    console.log('\n📋 UI Display Information:');
    if (bladeInfo) console.log('  Blade counts:', bladeInfo);
    if (fpsInfo) console.log('  FPS:', fpsInfo);
    if (percentInfo) console.log('  Percentages:', percentInfo);
  }

  console.log('\n✅ Screenshot saved to: tests/grass-rendering-screenshot.png');
  console.log('=== END REPORT ===\n');
});
