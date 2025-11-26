import { test, expect } from '@playwright/test';

test('FPS monitor overlay position', async ({ page }) => {
  // Navigate to the running dev server (uses baseURL from config: http://localhost:3000)
  await page.goto('/');

  // Wait for page to load completely
  await page.waitForLoadState('networkidle');

  // Wait a bit more for any animations to settle
  await page.waitForTimeout(2000);

  // Take screenshot of full page
  await page.screenshot({
    path: 'e2e/screenshots/fps-overlay-position.png',
    fullPage: true
  });

  // Find all fixed-position elements
  const fixedElements = await page.evaluate(() => {
    const elements: Array<{
      selector: string;
      position: { top: string; left: string; right: string; bottom: string };
      computed: { top: number; left: number; width: number; height: number };
      zIndex: string;
      testId: string | null;
    }> = [];

    const allElements = document.querySelectorAll('*');

    allElements.forEach((el, index) => {
      const styles = window.getComputedStyle(el);
      if (styles.position === 'fixed') {
        const rect = el.getBoundingClientRect();
        elements.push({
          selector: el.tagName.toLowerCase() +
                   (el.id ? `#${el.id}` : '') +
                   (el.className ? `.${Array.from(el.classList).join('.')}` : ''),
          position: {
            top: styles.top,
            left: styles.left,
            right: styles.right,
            bottom: styles.bottom
          },
          computed: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          },
          zIndex: styles.zIndex,
          testId: el.getAttribute('data-testid')
        });
      }
    });

    return elements;
  });

  console.log('\n=== All Fixed Position Elements ===');
  fixedElements.forEach((el, i) => {
    console.log(`\nElement ${i + 1}:`);
    console.log(`  Selector: ${el.selector}`);
    console.log(`  Test ID: ${el.testId || 'none'}`);
    console.log(`  CSS Position: top=${el.position.top}, left=${el.position.left}, right=${el.position.right}, bottom=${el.position.bottom}`);
    console.log(`  Computed Position: top=${el.computed.top}px, left=${el.computed.left}px`);
    console.log(`  Size: ${el.computed.width}px × ${el.computed.height}px`);
    console.log(`  Z-Index: ${el.zIndex}`);
  });

  // Specifically locate the FPS meter
  const fpsMeter = await page.locator('[data-testid="fps-meter"]');
  const fpsExists = await fpsMeter.count() > 0;

  if (fpsExists) {
    const fpsBox = await fpsMeter.boundingBox();
    const fpsStyles = await fpsMeter.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        top: styles.top,
        left: styles.left,
        right: styles.right,
        bottom: styles.bottom,
        zIndex: styles.zIndex,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity
      };
    });

    console.log('\n=== FPS Meter [data-testid="fps-meter"] ===');
    console.log(`  Found: YES`);
    console.log(`  CSS Styles:`);
    console.log(`    position: ${fpsStyles.position}`);
    console.log(`    top: ${fpsStyles.top}`);
    console.log(`    left: ${fpsStyles.left}`);
    console.log(`    right: ${fpsStyles.right}`);
    console.log(`    bottom: ${fpsStyles.bottom}`);
    console.log(`    z-index: ${fpsStyles.zIndex}`);
    console.log(`    display: ${fpsStyles.display}`);
    console.log(`    visibility: ${fpsStyles.visibility}`);
    console.log(`    opacity: ${fpsStyles.opacity}`);

    if (fpsBox) {
      console.log(`  Computed Position:`);
      console.log(`    top: ${fpsBox.y}px`);
      console.log(`    left: ${fpsBox.x}px`);
      console.log(`    width: ${fpsBox.width}px`);
      console.log(`    height: ${fpsBox.height}px`);

      // Check for overlapping elements
      const overlapping = fixedElements.filter(el => {
        if (el.testId === 'fps-meter') return false;

        const elRight = el.computed.left + el.computed.width;
        const elBottom = el.computed.top + el.computed.height;
        const fpsRight = fpsBox.x + fpsBox.width;
        const fpsBottom = fpsBox.y + fpsBox.height;

        return !(elRight < fpsBox.x ||
                el.computed.left > fpsRight ||
                elBottom < fpsBox.y ||
                el.computed.top > fpsBottom);
      });

      if (overlapping.length > 0) {
        console.log('\n  ⚠️  Overlapping Elements:');
        overlapping.forEach(el => {
          console.log(`    - ${el.selector} (z-index: ${el.zIndex})`);
          console.log(`      Position: ${el.computed.left}, ${el.computed.top}`);
        });
      } else {
        console.log('\n  ✅ No overlapping elements detected');
      }
    } else {
      console.log('  ⚠️  Element exists but has no bounding box (may be hidden)');
    }
  } else {
    console.log('\n=== FPS Meter [data-testid="fps-meter"] ===');
    console.log('  Found: NO');
    console.log('  ⚠️  Element not found in DOM');
  }

  // Additional check: Look for any element containing "FPS" text
  const fpsTextElements = await page.evaluate(() => {
    const elements: Array<{ text: string; selector: string; position: any }> = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      if (node.textContent && /fps/i.test(node.textContent)) {
        const parent = node.parentElement;
        if (parent) {
          const rect = parent.getBoundingClientRect();
          const styles = window.getComputedStyle(parent);
          elements.push({
            text: node.textContent.trim(),
            selector: parent.tagName.toLowerCase() +
                     (parent.id ? `#${parent.id}` : '') +
                     (parent.className ? `.${Array.from(parent.classList).join('.')}` : ''),
            position: {
              position: styles.position,
              top: rect.top,
              left: rect.left,
              zIndex: styles.zIndex
            }
          });
        }
      }
    }
    return elements;
  });

  if (fpsTextElements.length > 0) {
    console.log('\n=== Elements containing "FPS" text ===');
    fpsTextElements.forEach((el, i) => {
      console.log(`\n  ${i + 1}. ${el.selector}`);
      console.log(`     Text: "${el.text.substring(0, 50)}..."`);
      console.log(`     Position: ${el.position.position}, top=${el.position.top}px, left=${el.position.left}px`);
      console.log(`     Z-Index: ${el.position.zIndex}`);
    });
  }

  console.log('\n=== Screenshot saved to: e2e/screenshots/fps-overlay-position.png ===\n');
});
