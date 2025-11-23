// Script to check color contrast violations
import { chromium } from '@playwright/test';
import { validateColorContrast } from '../tests/e2e/helpers/accessibility.js';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  const results = await validateColorContrast(page);

  console.log(`\n📊 Color Contrast Analysis`);
  console.log(`Total violations: ${results.violations.length}\n`);

  if (results.violations.length > 0) {
    console.log('Violations:');
    results.violations.forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.element}`);
      console.log(`     Ratio: ${v.ratio}:1 (required: ${v.required}:1)`);
      console.log(`     Gap: ${(v.required - v.ratio).toFixed(2)}\n`);
    });
  } else {
    console.log('✅ All text meets WCAG AA requirements!');
  }

  await browser.close();
})();
