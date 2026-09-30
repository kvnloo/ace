#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://127.0.0.1:4173";
const OUT = process.env.ARTIFACTS || "artifacts/visual-smoke";
const CHROME =
  process.env.CHROME ||
  ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].find((p) => fs.existsSync(p));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[i];
}

async function openPage(browser, { width, height, mobile = false, lite = false, reduced = false, label }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

  if (lite) {
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 2, configurable: true });
      Object.defineProperty(navigator, "deviceMemory", { get: () => 2, configurable: true });
    });
  }

  const pageErrors = [];
  const internalFailures = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));
  page.on("requestfailed", (req) => {
    if (req.url().startsWith(BASE)) internalFailures.push((req.failure()?.errorText || "failed") + " " + req.url());
  });

  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("main", { timeout: 20000 });
  await page.evaluate(async () => { try { await document.fonts.ready; } catch {} });
  await sleep(350);

  const shot = async (name) => {
    const dest = path.join(OUT, label + "-" + name + ".png");
    await page.screenshot({ path: dest, type: "png", fullPage: false });
    return dest;
  };

  return { page, pageErrors, internalFailures, shot };
}

async function main() {
  if (!CHROME) throw new Error("Chrome/Chromium not found");
  fs.mkdirSync(OUT, { recursive: true });

  const puppeteer = (await import("puppeteer-core")).default;
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "ace-visual-"));
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    userDataDir,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-features=Translate,BackForwardCache",
    ],
  });

  const failures = [];
  const report = { base: BASE, chrome: CHROME, desktop: {}, mobile: {}, reduced: {} };

  {
    const ctx = await openPage(browser, { width: 1440, height: 1000, label: "desktop" });
    const { page } = ctx;
    const facts = await page.evaluate(() => {
      const text = document.body.innerText || "";
      const resources = performance.getEntriesByType("resource").map((r) => r.name);
      return {
        title: document.title,
        hero: /A FEEDBACK LOOP/i.test(text),
        lenis: Boolean(window.__ACE_LENIS__),
        quality: document.documentElement.dataset.aceQuality,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        scrollHeight: document.documentElement.scrollHeight,
        resources,
        initialPascal: resources.some((u) => /PascalFacility/.test(u)),
        initialChat: resources.some((u) => /AIChat/.test(u)),
        tailwindCdn: resources.some((u) => /cdn\.tailwindcss\.com/.test(u)),
      };
    });
    report.desktop.home = facts;
    report.desktop.hero = await ctx.shot("hero");

    if (!facts.hero) failures.push("desktop hero copy missing");
    if (!facts.lenis) failures.push("Lenis did not initialize on desktop");
    if (facts.overflow > 2) failures.push("desktop horizontal overflow " + facts.overflow + "px");
    if (facts.initialPascal) failures.push("Pascal chunk loaded on home");
    if (facts.initialChat) failures.push("AIChat chunk loaded before interaction");
    if (facts.tailwindCdn) failures.push("Tailwind CDN runtime requested");

    const perf = await page.evaluate(async () => {
      const frames = [];
      let last = performance.now();
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const start = performance.now();
      await new Promise((resolve) => {
        const step = (now) => {
          frames.push(now - last);
          last = now;
          const t = Math.min(1, (now - start) / 1600);
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const lenis = window.__ACE_LENIS__;
          if (lenis) lenis.scrollTo(max * eased, { immediate: true });
          else window.scrollTo(0, max * eased);
          if (t < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
      return {
        frames: frames.slice(6),
        progress: getComputedStyle(document.documentElement).getPropertyValue("--ace-scroll").trim(),
        section: document.querySelector(".ace-live-section")?.textContent?.trim() || "",
      };
    });
    const clean = perf.frames.filter((dt) => dt > 0 && dt < 1000);
    report.desktop.scroll = {
      n: clean.length,
      mean: clean.length ? clean.reduce((a, b) => a + b, 0) / clean.length : 0,
      p95: percentile(clean, 95),
      max: clean.length ? Math.max(...clean) : 0,
      progress: perf.progress,
      section: perf.section,
    };
    report.desktop.mid = await ctx.shot("mid");
    if (Number(perf.progress) <= 0.5) failures.push("scroll progress did not publish (" + perf.progress + ")");
    if (!perf.section) failures.push("live section label did not update");

    await page.evaluate(() => {
      const button = [...document.querySelectorAll("button")].find((el) => el.textContent?.trim() === "System");
      button?.click();
    });
    await sleep(350);
    const system = await page.evaluate(() => ({
      heading: [...document.querySelectorAll("h2")].some((el) => /How the loop compounds/i.test(el.textContent || "")),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    }));
    report.desktop.system = system;
    report.desktop.systemShot = await ctx.shot("system");
    if (!system.heading) failures.push("System route did not render");
    if (system.overflow > 2) failures.push("System horizontal overflow " + system.overflow + "px");

    failures.push(...ctx.pageErrors.map((e) => "desktop pageerror: " + e));
    failures.push(...ctx.internalFailures.map((e) => "desktop request: " + e));
    await page.close();
  }

  {
    const ctx = await openPage(browser, { width: 390, height: 844, mobile: true, lite: true, label: "mobile" });
    const { page } = ctx;
    await page.click('button[aria-label="Open navigation menu"]');
    await page.evaluate(() => {
      const button = [...document.querySelectorAll("button")].find((el) => el.textContent?.trim() === "Campus");
      button?.click();
    });
    await page.waitForFunction(() => document.body.innerText.includes("Enable full 3D"), { timeout: 12000 });
    await sleep(250);
    const facts = await page.evaluate(() => {
      const resources = performance.getEntriesByType("resource").map((r) => r.name);
      return {
        quality: document.documentElement.dataset.aceQuality,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        hasCanvas: Boolean(document.querySelector("canvas")),
        enable3d: document.body.innerText.includes("Enable full 3D"),
        pascalLoaded: resources.some((u) => /PascalFacility/.test(u)),
      };
    });
    report.mobile = facts;
    report.mobile.shot = await ctx.shot("campus-lite");
    if (facts.quality !== "lite") failures.push("mobile quality expected lite, got " + facts.quality);
    if (facts.overflow > 2) failures.push("mobile horizontal overflow " + facts.overflow + "px");
    if (!facts.enable3d) failures.push("lite campus 3D opt-in missing");
    if (facts.hasCanvas) failures.push("lite campus mounted a canvas before opt-in");
    if (facts.pascalLoaded) failures.push("lite campus fetched Pascal before opt-in");
    failures.push(...ctx.pageErrors.map((e) => "mobile pageerror: " + e));
    failures.push(...ctx.internalFailures.map((e) => "mobile request: " + e));
    await page.close();
  }

  {
    const ctx = await openPage(browser, { width: 1280, height: 800, reduced: true, label: "reduced" });
    const facts = await ctx.page.evaluate(() => ({
      motion: document.documentElement.dataset.aceMotion,
      orbitAnimation: getComputedStyle(document.querySelector(".ace-core-orbit")).animationName,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    }));
    report.reduced = facts;
    report.reduced.shot = await ctx.shot("home");
    if (facts.motion !== "reduced") failures.push("reduced-motion dataset missing (" + facts.motion + ")");
    if (facts.overflow > 2) failures.push("reduced-motion horizontal overflow " + facts.overflow + "px");
    failures.push(...ctx.pageErrors.map((e) => "reduced pageerror: " + e));
    failures.push(...ctx.internalFailures.map((e) => "reduced request: " + e));
    await ctx.page.close();
  }

  report.failures = failures;
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(OUT, "report.md"), [
    "# ACE visual smoke",
    "",
    "- desktop scroll p95: " + report.desktop.scroll.p95.toFixed(1) + "ms · max " + report.desktop.scroll.max.toFixed(1) + "ms",
    "- desktop section after scroll: " + (report.desktop.scroll.section || "unknown"),
    "- mobile lite mode: " + report.mobile.quality + " · Pascal preloaded: " + report.mobile.pascalLoaded,
    "- reduced motion: " + report.reduced.motion,
    "- result: " + (failures.length ? "FAIL — " + failures.join("; ") : "PASS"),
    "",
  ].join("\n"));

  await browser.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
