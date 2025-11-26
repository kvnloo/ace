import { chromium, Browser, Page } from 'playwright';

interface ElementPosition {
  element: string;
  testId?: string;
  position: {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  };
  computedStyle: {
    position: string;
    zIndex: string;
  };
}

async function testFPSMonitor() {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🚀 Starting FPS Monitor Test...\n');

    // Launch browser
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Navigate to the app
    console.log('📍 Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'e2e/screenshots/01-landing-page.png' });
    console.log('✅ Screenshot saved: 01-landing-page.png\n');

    // Click "Explore 3D Demo" button
    console.log('🖱️  Looking for "Explore 3D Demo" button...');
    const exploreButton = page.locator('button:has-text("Explore 3D Demo"), a:has-text("Explore 3D Demo")').first();

    if (await exploreButton.count() > 0) {
      console.log('✅ Found "Explore 3D Demo" button, clicking...');
      await exploreButton.click();
      // Wait for navigation
      await page.waitForLoadState('networkidle');
    } else {
      console.log('⚠️  "Explore 3D Demo" button not found, trying "COURT VIEW" nav...');
      const courtViewNav = page.locator('a:has-text("COURT VIEW")').first();
      if (await courtViewNav.count() > 0) {
        await courtViewNav.click();
        await page.waitForLoadState('networkidle');
      }
    }

    // Wait a moment for navigation
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2e/screenshots/02-after-explore-click.png' });
    console.log('✅ Screenshot saved: 02-after-explore-click.png\n');

    // Wait for loading screen to appear and then disappear
    console.log('⏳ Waiting for loading screen...');
    const loadingScreen = page.locator('[data-testid="loading-screen"], .loading-screen').first();

    if (await loadingScreen.count() > 0) {
      console.log('✅ Loading screen found, waiting for it to disappear...');
      await loadingScreen.waitFor({ state: 'hidden', timeout: 30000 });
      console.log('✅ Loading screen disappeared\n');
    } else {
      console.log('⚠️  Loading screen not found, assuming already loaded\n');
    }

    // Wait for page to stabilize
    await page.waitForTimeout(2000);

    // Take screenshot after loading completes
    console.log('📸 Taking screenshot after loading completes...');
    await page.screenshot({ path: 'e2e/screenshots/03-loading-complete.png' });
    console.log('✅ Screenshot saved: 03-loading-complete.png\n');

    // Find FPS monitor
    console.log('🔍 Looking for FPS monitor (data-testid="fps-meter")...');
    const fpsMeter = page.locator('[data-testid="fps-meter"]');
    const fpsCount = await fpsMeter.count();

    if (fpsCount === 0) {
      console.log('❌ FPS monitor not found!\n');
      return;
    }

    console.log(`✅ Found ${fpsCount} FPS monitor element(s)\n`);

    // Get FPS monitor bounding box
    const fpsBox = await fpsMeter.boundingBox();
    if (!fpsBox) {
      console.log('❌ Could not get FPS monitor bounding box\n');
      return;
    }

    const fpsStyle = await fpsMeter.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        zIndex: computed.zIndex,
      };
    });

    const fpsPosition: ElementPosition = {
      element: 'FPS Monitor',
      testId: 'fps-meter',
      position: {
        top: fpsBox.y,
        left: fpsBox.x,
        right: fpsBox.x + fpsBox.width,
        bottom: fpsBox.y + fpsBox.height,
        width: fpsBox.width,
        height: fpsBox.height,
      },
      computedStyle: fpsStyle,
    };

    console.log('📊 FPS Monitor Position:');
    console.log(`   Top: ${fpsPosition.position.top}px`);
    console.log(`   Left: ${fpsPosition.position.left}px`);
    console.log(`   Right: ${fpsPosition.position.right}px`);
    console.log(`   Bottom: ${fpsPosition.position.bottom}px`);
    console.log(`   Width: ${fpsPosition.position.width}px`);
    console.log(`   Height: ${fpsPosition.position.height}px`);
    console.log(`   Position: ${fpsPosition.computedStyle.position}`);
    console.log(`   Z-Index: ${fpsPosition.computedStyle.zIndex}\n`);

    // Find all fixed position elements
    console.log('🔍 Finding all fixed position elements...');
    const allFixedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const fixedElements: Array<{
        tag: string;
        testId: string | null;
        className: string;
        position: DOMRect;
        computedStyle: { position: string; zIndex: string };
      }> = [];

      elements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (computed.position === 'fixed' || computed.position === 'absolute') {
          const rect = el.getBoundingClientRect();
          // Only include visible elements
          if (rect.width > 0 && rect.height > 0) {
            fixedElements.push({
              tag: el.tagName.toLowerCase(),
              testId: el.getAttribute('data-testid'),
              className: el.className.toString(),
              position: {
                top: rect.top,
                left: rect.left,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height,
                x: rect.x,
                y: rect.y,
              } as DOMRect,
              computedStyle: {
                position: computed.position,
                zIndex: computed.zIndex,
              },
            });
          }
        }
      });

      return fixedElements;
    });

    console.log(`✅ Found ${allFixedElements.length} fixed/absolute position elements:\n`);

    const overlayElements: ElementPosition[] = allFixedElements.map((el) => ({
      element: `${el.tag}${el.testId ? `[data-testid="${el.testId}"]` : ''}${el.className ? `.${el.className.split(' ')[0]}` : ''}`,
      testId: el.testId || undefined,
      position: {
        top: el.position.top,
        left: el.position.left,
        right: el.position.right,
        bottom: el.position.bottom,
        width: el.position.width,
        height: el.position.height,
      },
      computedStyle: el.computedStyle,
    }));

    overlayElements.forEach((el, index) => {
      console.log(`${index + 1}. ${el.element}`);
      console.log(`   Top: ${el.position.top}px, Left: ${el.position.left}px`);
      console.log(`   Right: ${el.position.right}px, Bottom: ${el.position.bottom}px`);
      console.log(`   Size: ${el.position.width}px × ${el.position.height}px`);
      console.log(`   Position: ${el.computedStyle.position}, Z-Index: ${el.computedStyle.zIndex}\n`);
    });

    // Check for overlaps
    console.log('🔍 Checking for overlaps with FPS monitor...\n');

    function doBoxesOverlap(box1: ElementPosition['position'], box2: ElementPosition['position']): boolean {
      return !(
        box1.right < box2.left ||
        box1.left > box2.right ||
        box1.bottom < box2.top ||
        box1.top > box2.bottom
      );
    }

    const overlaps = overlayElements.filter((el) => {
      if (el.testId === 'fps-meter') return false; // Don't check against itself
      return doBoxesOverlap(fpsPosition.position, el.position);
    });

    if (overlaps.length > 0) {
      console.log(`⚠️  Found ${overlaps.length} overlapping elements:\n`);
      overlaps.forEach((el, index) => {
        console.log(`${index + 1}. ${el.element}`);
        console.log(`   Position: ${el.position.top}px, ${el.position.left}px`);
        console.log(`   Z-Index: ${el.computedStyle.zIndex} (FPS: ${fpsPosition.computedStyle.zIndex})\n`);
      });
    } else {
      console.log('✅ No overlapping elements found!\n');
    }

    // Highlight FPS monitor and take screenshot
    console.log('📸 Taking screenshot with FPS monitor highlighted...');
    await page.evaluate(() => {
      const fps = document.querySelector('[data-testid="fps-meter"]') as HTMLElement;
      if (fps) {
        fps.style.outline = '3px solid red';
        fps.style.outlineOffset = '2px';
      }
    });
    await page.screenshot({ path: 'e2e/screenshots/04-fps-highlighted.png' });
    console.log('✅ Screenshot saved: 04-fps-highlighted.png\n');

    // Summary
    console.log('📋 Test Summary:');
    console.log(`   FPS Monitor: ${fpsPosition.position.top}px, ${fpsPosition.position.left}px`);
    console.log(`   Fixed Elements: ${allFixedElements.length}`);
    console.log(`   Overlaps: ${overlaps.length}`);
    console.log(`   Status: ${overlaps.length === 0 ? '✅ PASS' : '⚠️  NEEDS REVIEW'}\n`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    if (page) {
      await page.screenshot({ path: 'e2e/screenshots/error.png' });
      console.log('📸 Error screenshot saved: error.png');
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testFPSMonitor().catch(console.error);
