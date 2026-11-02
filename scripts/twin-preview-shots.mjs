// Screens of the ACE site "Enter twin" flow at desktop + phone widths (drafts visible via ?drafts=1).
import { chromium } from 'playwright-core';
const base = process.argv[2] ?? 'http://127.0.0.1:5321/';
const out = process.argv[3] ?? '/tmp';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true, args: ['--use-angle=gl-egl', '--enable-gpu'] });
const errs = [];
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 412, height: 915 }]]) {
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: name === 'phone' ? 2 : 1 });
  page.on('pageerror', e => errs.push(`${name}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errs.push(`${name} console: ${m.text()}`); });
  await page.goto(base + '?drafts=1', { waitUntil: 'networkidle' });
  if (name === 'phone') { await page.click('.ace-menu-button'); await page.waitForTimeout(400); await page.locator('#ace-mobile-nav').getByText('Enter twin').click(); }
  else await page.click('.ace-nav-cta');
  await page.waitForSelector('.ace-twin', { timeout: 20000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${out}/site-twin-${name}.png` });
  // zoom in on the deep zoom stage
  const z = page.locator('.ace-twin-zoom');
  if (await z.count()) { const b = await z.boundingBox(); await page.mouse.move(b.x + b.width * 0.55, b.y + b.height * 0.4); for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, -400); await page.waitForTimeout(250); } await page.waitForTimeout(3000); await page.screenshot({ path: `${out}/site-twin-${name}-zoomed.png` }); }
  await page.evaluate(() => document.querySelector('.ace-twin-films')?.scrollIntoView());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/site-twin-${name}-films.png` });
  const noDrafts = await (async () => { const p2 = await browser.newPage({ viewport: vp }); await p2.goto(base, { waitUntil: 'networkidle' }); if (name !== 'phone') { await p2.click('.ace-nav-cta'); await p2.waitForSelector('.ace-twin'); await p2.waitForTimeout(1500); return p2.locator('.ace-twin').innerText(); } return 'skipped'; })();
  console.log(name, 'public (no drafts) text:', noDrafts.slice(0, 300).replace(/\n/g, ' | '));
  await page.close();
}
console.log('errors:', JSON.stringify(errs));
await browser.close();
