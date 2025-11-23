import { chromium } from '@playwright/test';

async function monitorConsoleErrors() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Monitoring console errors at http://localhost:3000');
  console.log('📊 Real-time error reporting active\n');

  const errors = new Set();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const error = msg.text();
      if (!errors.has(error)) {
        errors.add(error);
        console.error('❌ CONSOLE ERROR DETECTED:');
        console.error(error);
        console.error('');
      }
    }
  });

  page.on('pageerror', (error) => {
    console.error('❌ PAGE ERROR:');
    console.error(error.message);
    console.error(error.stack);
    console.error('');
  });

  // Monitor homepage
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  console.log('✅ Homepage loaded - monitoring...');

  // Navigate to 3D demo
  await page.click('text=Explore 3D Demo');
  await page.waitForTimeout(30000); // Wait for loading

  console.log(`\n📊 Total unique errors found: ${errors.size}`);

  if (errors.size === 0) {
    console.log('🎉 NO CONSOLE ERRORS DETECTED!');
  }

  // Keep browser open for manual testing
  console.log('\nBrowser staying open for manual inspection...');
  await page.waitForTimeout(300000); // 5 minutes

  await browser.close();
}

monitorConsoleErrors().catch(console.error);
