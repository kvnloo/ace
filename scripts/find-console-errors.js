/**
 * Playwright script to find ALL console errors across the application
 *
 * This script:
 * 1. Opens the app in a real browser
 * 2. Captures all console messages (errors, warnings, logs)
 * 3. Navigates through different pages
 * 4. Tests user interactions
 * 5. Documents every error with full context
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000';
const OUTPUT_FILE = path.join(__dirname, '../docs/console-errors-found.md');

// Store all captured console messages
const consoleMessages = {
  errors: [],
  warnings: [],
  logs: [],
  network404s: []
};

async function captureConsoleErrors() {
  console.log('🚀 Starting browser automation...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage'] // Prevent crashes on low memory
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();

    const entry = {
      type,
      text,
      url: location.url,
      lineNumber: location.lineNumber,
      columnNumber: location.columnNumber,
      timestamp: new Date().toISOString()
    };

    if (type === 'error') {
      consoleMessages.errors.push(entry);
      console.log(`❌ Console Error: ${text}`);
    } else if (type === 'warning') {
      consoleMessages.warnings.push(entry);
      console.log(`⚠️  Console Warning: ${text}`);
    } else {
      consoleMessages.logs.push(entry);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    const entry = {
      type: 'pageerror',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    consoleMessages.errors.push(entry);
    console.log(`❌ Page Error: ${error.message}`);
  });

  // Capture network failures
  page.on('response', response => {
    if (response.status() === 404) {
      const entry = {
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        timestamp: new Date().toISOString()
      };
      consoleMessages.network404s.push(entry);
      console.log(`❌ 404 Not Found: ${response.url()}`);
    }
  });

  // Capture request failures
  page.on('requestfailed', request => {
    const entry = {
      url: request.url(),
      failure: request.failure()?.errorText || 'Unknown error',
      timestamp: new Date().toISOString()
    };
    consoleMessages.errors.push({
      type: 'requestfailed',
      text: `Request failed: ${request.url()} - ${entry.failure}`,
      ...entry
    });
    console.log(`❌ Request Failed: ${request.url()} - ${entry.failure}`);
  });

  try {
    // Test 1: Homepage
    console.log('\n📍 Testing: Homepage (/)');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for any delayed errors

    // Test 2: Facility Demo page
    console.log('\n📍 Testing: Facility Demo (/facility-demo)');
    await page.goto(`${BASE_URL}/facility-demo`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Wait for animations and errors

    // Test 3: Try navigation interactions
    console.log('\n📍 Testing: Navigation interactions');
    try {
      // Look for navigation elements
      const navButtons = await page.$$('button, a[href]');
      console.log(`Found ${navButtons.length} clickable elements`);

      // Click first few navigation items if they exist
      for (let i = 0; i < Math.min(3, navButtons.length); i++) {
        try {
          await navButtons[i].click({ timeout: 1000 });
          await page.waitForTimeout(1000);
        } catch (e) {
          // Some elements might not be clickable, that's ok
        }
      }
    } catch (e) {
      console.log('⚠️  Could not test navigation:', e.message);
    }

    // Test 4: Scroll to trigger lazy loading
    console.log('\n📍 Testing: Scroll behavior');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    // Test 5: Check for any modals or interactive elements
    console.log('\n📍 Testing: Interactive elements');
    const buttons = await page.$$('button');
    console.log(`Found ${buttons.length} buttons to test`);

    // Click a few buttons to see if they trigger errors
    for (let i = 0; i < Math.min(5, buttons.length); i++) {
      try {
        const text = await buttons[i].textContent();
        console.log(`  Clicking button: ${text?.substring(0, 30)}...`);
        await buttons[i].click({ timeout: 500 });
        await page.waitForTimeout(500);
      } catch (e) {
        // Button might not be clickable, skip
      }
    }

  } catch (error) {
    console.error('❌ Test execution error:', error.message);
    consoleMessages.errors.push({
      type: 'test-error',
      text: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }

  await browser.close();

  // Generate report
  console.log('\n📝 Generating report...');
  generateReport();

  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`   Errors: ${consoleMessages.errors.length}`);
  console.log(`   Warnings: ${consoleMessages.warnings.length}`);
  console.log(`   404s: ${consoleMessages.network404s.length}`);
  console.log(`\n✅ Report saved to: ${OUTPUT_FILE}`);
}

function generateReport() {
  let markdown = `# Console Errors Report

**Generated:** ${new Date().toISOString()}

**Test Coverage:**
- ✅ Homepage (/)
- ✅ Facility Demo (/facility-demo)
- ✅ Navigation interactions
- ✅ Scroll behavior
- ✅ Button interactions
- ✅ Network requests

---

## Summary

- **Errors:** ${consoleMessages.errors.length}
- **Warnings:** ${consoleMessages.warnings.length}
- **404 Not Found:** ${consoleMessages.network404s.length}

---

`;

  // Console Errors
  if (consoleMessages.errors.length > 0) {
    markdown += `## ❌ Console Errors (${consoleMessages.errors.length})\n\n`;

    consoleMessages.errors.forEach((error, index) => {
      markdown += `### ${index + 1}. ${error.type === 'pageerror' ? 'Page Error' : error.type === 'requestfailed' ? 'Request Failed' : 'Console Error'}\n\n`;
      markdown += `**Message:** \`${error.text || error.message}\`\n\n`;

      if (error.url) {
        markdown += `**Source:** ${error.url}`;
        if (error.lineNumber) markdown += `:${error.lineNumber}`;
        if (error.columnNumber) markdown += `:${error.columnNumber}`;
        markdown += `\n\n`;
      }

      if (error.stack) {
        markdown += `**Stack Trace:**\n\`\`\`\n${error.stack}\n\`\`\`\n\n`;
      }

      if (error.failure) {
        markdown += `**Failure Reason:** ${error.failure}\n\n`;
      }

      markdown += `**Timestamp:** ${error.timestamp}\n\n`;
      markdown += `---\n\n`;
    });
  } else {
    markdown += `## ✅ No Console Errors Found\n\n`;
  }

  // 404 Errors
  if (consoleMessages.network404s.length > 0) {
    markdown += `## 🔍 404 Not Found (${consoleMessages.network404s.length})\n\n`;

    consoleMessages.network404s.forEach((error, index) => {
      markdown += `### ${index + 1}. Missing Resource\n\n`;
      markdown += `**URL:** ${error.url}\n\n`;
      markdown += `**Status:** ${error.status} ${error.statusText}\n\n`;
      markdown += `**Timestamp:** ${error.timestamp}\n\n`;
      markdown += `---\n\n`;
    });
  }

  // Warnings
  if (consoleMessages.warnings.length > 0) {
    markdown += `## ⚠️  Console Warnings (${consoleMessages.warnings.length})\n\n`;

    // Group warnings by text to avoid duplication
    const warningGroups = {};
    consoleMessages.warnings.forEach(warning => {
      const key = warning.text;
      if (!warningGroups[key]) {
        warningGroups[key] = { count: 0, example: warning };
      }
      warningGroups[key].count++;
    });

    Object.entries(warningGroups).forEach(([text, data], index) => {
      markdown += `### ${index + 1}. ${text}\n\n`;
      markdown += `**Occurrences:** ${data.count}\n\n`;
      if (data.example.url) {
        markdown += `**Source:** ${data.example.url}`;
        if (data.example.lineNumber) markdown += `:${data.example.lineNumber}`;
        markdown += `\n\n`;
      }
      markdown += `---\n\n`;
    });
  }

  // Recommendations
  markdown += `## 🔧 Recommendations\n\n`;

  if (consoleMessages.errors.length === 0 && consoleMessages.network404s.length === 0) {
    markdown += `✅ **No critical errors found!** The application appears to be running cleanly.\n\n`;
  } else {
    markdown += `### Priority Actions:\n\n`;

    if (consoleMessages.network404s.length > 0) {
      markdown += `1. **Fix 404 Errors:** ${consoleMessages.network404s.length} resources are missing\n`;
      markdown += `   - Check file paths and ensure all assets exist\n`;
      markdown += `   - Verify public folder structure\n\n`;
    }

    const typeErrors = consoleMessages.errors.filter(e => e.text?.includes('TypeError') || e.message?.includes('TypeError'));
    if (typeErrors.length > 0) {
      markdown += `2. **Fix TypeErrors:** ${typeErrors.length} type-related errors found\n`;
      markdown += `   - Check undefined function calls\n`;
      markdown += `   - Verify object property access\n\n`;
    }

    const requestFailed = consoleMessages.errors.filter(e => e.type === 'requestfailed');
    if (requestFailed.length > 0) {
      markdown += `3. **Fix Network Requests:** ${requestFailed.length} failed requests\n`;
      markdown += `   - Check API endpoints\n`;
      markdown += `   - Verify network connectivity\n\n`;
    }
  }

  markdown += `## 📋 Next Steps\n\n`;
  markdown += `1. Review each error listed above\n`;
  markdown += `2. Identify root causes in source code\n`;
  markdown += `3. Create fixes for each issue\n`;
  markdown += `4. Re-run this script to verify fixes\n\n`;
  markdown += `---\n\n`;
  markdown += `**Script:** scripts/find-console-errors.js\n`;
  markdown += `**Run with:** \`node scripts/find-console-errors.js\`\n`;

  // Ensure docs directory exists
  const docsDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, markdown);
}

// Run the tests
captureConsoleErrors().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
