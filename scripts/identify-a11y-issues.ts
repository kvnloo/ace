import { chromium } from '@playwright/test';

async function identifyAccessibilityIssues() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  console.log('=== ARIA LABEL ISSUES ===\n');

  // Find buttons without accessible names
  const buttonsWithoutLabels = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const issues: { html: string; text: string; hasText: boolean }[] = [];

    buttons.forEach((btn) => {
      const hasAriaLabel = btn.hasAttribute('aria-label');
      const hasAriaLabelledBy = btn.hasAttribute('aria-labelledby');
      const hasText = (btn.textContent?.trim() || '').length > 0;

      if (!hasAriaLabel && !hasAriaLabelledBy && !hasText) {
        issues.push({
          html: btn.outerHTML.substring(0, 150),
          text: btn.textContent?.trim() || '',
          hasText
        });
      }
    });

    return issues;
  });

  console.log(`Found ${buttonsWithoutLabels.length} buttons without accessible names:\n`);
  buttonsWithoutLabels.forEach((btn, idx) => {
    console.log(`${idx + 1}. ${btn.html}`);
    console.log(`   Text: "${btn.text}"`);
    console.log('');
  });

  console.log('\n=== COLOR CONTRAST ISSUES (First 10) ===\n');

  const contrastIssues = await page.evaluate(() => {
    const issues: Array<{ element: string; ratio: string; fg: string; bg: string; required: number }> = [];

    function getLuminance(r: number, g: number, b: number): number {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function getContrastRatio(lum1: number, lum2: number): number {
      const lighter = Math.max(lum1, lum2);
      const darker = Math.min(lum1, lum2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, label');

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const bgColor = styles.backgroundColor;

      const colorMatch = color.match(/\d+/g);
      const bgMatch = bgColor.match(/\d+/g);

      if (colorMatch && bgMatch) {
        const [r1, g1, b1] = colorMatch.map(Number);
        const [r2, g2, b2] = bgMatch.map(Number);

        const lum1 = getLuminance(r1, g1, b1);
        const lum2 = getLuminance(r2, g2, b2);
        const ratio = getContrastRatio(lum1, lum2);

        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;
        const isLarge = fontSize >= 18 || (fontSize >= 14 && parseInt(fontWeight) >= 700);
        const required = isLarge ? 3 : 4.5;

        if (ratio < required) {
          const elementDesc = element.tagName +
            (element.id ? `#${element.id}` : '') +
            (element.className ? `.${element.className.split(' ')[0]}` : '');

          issues.push({
            element: elementDesc,
            ratio: ratio.toFixed(2),
            fg: color,
            bg: bgColor,
            required
          });
        }
      }
    });

    return issues;
  });

  console.log(`Found ${contrastIssues.length} color contrast issues (showing first 10):\n`);
  contrastIssues.slice(0, 10).forEach((issue, idx) => {
    console.log(`${idx + 1}. ${issue.element}`);
    console.log(`   Ratio: ${issue.ratio}:1 (required: ${issue.required}:1)`);
    console.log(`   FG: ${issue.fg}`);
    console.log(`   BG: ${issue.bg}`);
    console.log('');
  });

  await browser.close();
}

identifyAccessibilityIssues().catch(console.error);
