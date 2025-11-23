const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();

    if (type === 'error') {
      errors.push(text);
      console.log('❌ ERROR:', text);
    } else if (type === 'warning') {
      warnings.push(text);
    }
  });

  page.on('pageerror', error => {
    errors.push('Page Error: ' + error.message);
    console.log('🔥 PAGE ERROR:', error.message);
  });

  console.log('\n📍 Navigating to http://localhost:3002...');
  await page.goto('http://localhost:3002', { waitUntil: 'domcontentloaded' });

  console.log('🖱️  Clicking Court View...');
  await page.click('text=Court View');

  console.log('⏳ Waiting 5 seconds for errors to appear...\n');
  await page.waitForTimeout(5000);

  const canvas = await page.locator('canvas').count();

  console.log('\n=== CONSOLE ERROR SUMMARY ===');
  console.log(`Canvas Found: ${canvas > 0 ? 'YES' : 'NO'}`);
  console.log(`Total Errors: ${errors.length}`);
  console.log(`Total Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
  }

  await browser.close();
})();
