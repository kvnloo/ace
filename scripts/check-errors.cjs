#!/usr/bin/env node

/**
 * Check for errors in the dev server without needing manual browser testing
 */

const puppeteer = require('puppeteer');

async function checkFor3DErrors() {
  console.log('🔍 Starting automated error check...\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Capture console errors
    const errors = [];
    const warnings = [];
    const logs = [];

    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();

      if (type === 'error') {
        errors.push(text);
        console.log('❌ ERROR:', text);
      } else if (type === 'warning') {
        warnings.push(text);
        console.log('⚠️  WARNING:', text);
      } else if (type === 'log' && text.includes('Error')) {
        logs.push(text);
        console.log('📝 LOG:', text);
      }
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      errors.push(error.message);
      console.log('🚨 PAGE ERROR:', error.message);
    });

    // Capture request failures
    page.on('requestfailed', (request) => {
      const failure = request.failure();
      if (failure) {
        console.log('🔴 REQUEST FAILED:', request.url(), '-', failure.errorText);
      }
    });

    console.log('📡 Navigating to http://localhost:3000...\n');

    // Navigate to the app
    try {
      await page.goto('http://localhost:3000', {
        waitUntil: 'networkidle2',
        timeout: 10000
      });
    } catch (navError) {
      console.log('⚠️  Navigation timeout (might be normal for SPA)');
    }

    // Wait a bit for any async errors
    await page.waitForTimeout(3000);

    // Try to navigate to 3D view
    console.log('\n🎮 Attempting to navigate to 3D demo...\n');

    // Look for the button to explore 3D demo
    try {
      await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll('button')).find(
          btn => btn.textContent.includes('Explore 3D Demo')
        );
        if (button) {
          button.click();
          return true;
        }
        return false;
      });

      // Wait for 3D scene to load or error
      await page.waitForTimeout(5000);
    } catch (clickError) {
      console.log('⚠️  Could not find or click 3D demo button');
    }

    // Check for Three.js specific errors
    const threeErrors = await page.evaluate(() => {
      const errors = [];

      // Check if Three.js is loaded
      if (typeof window.THREE === 'undefined') {
        errors.push('Three.js not loaded');
      }

      // Check for WebGL
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          errors.push('WebGL not available');
        }
      } else {
        errors.push('No canvas element found');
      }

      // Check for error messages in the DOM
      const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]');
      errorElements.forEach(el => {
        if (el.textContent) {
          errors.push('DOM Error: ' + el.textContent.substring(0, 100));
        }
      });

      return errors;
    });

    if (threeErrors.length > 0) {
      console.log('\n🔴 Three.js specific issues:');
      threeErrors.forEach(err => console.log('  -', err));
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 ERROR CHECK SUMMARY:');
    console.log('='.repeat(50));
    console.log(`❌ Errors found: ${errors.length}`);
    console.log(`⚠️  Warnings found: ${warnings.length}`);
    console.log(`📝 Error logs found: ${logs.length}`);

    if (errors.length === 0 && threeErrors.length === 0) {
      console.log('\n✅ No critical errors detected! 3D scene might be working.');
    } else {
      console.log('\n🚨 Issues detected that need fixing:');
      errors.forEach((err, i) => {
        console.log(`\n${i + 1}. ${err}`);
      });
    }

    // Save errors to file for analysis
    if (errors.length > 0) {
      const fs = require('fs');
      const errorReport = {
        timestamp: new Date().toISOString(),
        errors,
        warnings,
        threeErrors,
        logs
      };
      fs.writeFileSync('error-report.json', JSON.stringify(errorReport, null, 2));
      console.log('\n💾 Full error report saved to error-report.json');
    }

  } catch (error) {
    console.error('Script error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Check if puppeteer is installed
try {
  require.resolve('puppeteer');
  checkFor3DErrors();
} catch (e) {
  console.log('📦 Puppeteer not installed. Installing...');
  const { exec } = require('child_process');
  exec('npm install puppeteer', (error) => {
    if (error) {
      console.error('Failed to install puppeteer:', error);
      console.log('\n💡 Manual check: Open http://localhost:3000 in browser and check console for errors');
    } else {
      console.log('✅ Puppeteer installed. Running check...\n');
      checkFor3DErrors();
    }
  });
}