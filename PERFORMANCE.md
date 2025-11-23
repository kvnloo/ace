# Performance Monitoring Guide

This guide explains the performance monitoring system and how to track Web Vitals metrics in your application.

## Overview

The application uses **Core Web Vitals** to track and monitor performance. Web Vitals are user-centric metrics that capture the quality of the user experience on your website.

Performance monitoring is initialized automatically when the app loads (`initializeAnalytics()` in `index.tsx`).

## Tracked Metrics

### 1. **LCP - Largest Contentful Paint**

- **What it measures:** Time until the largest visible content element is painted on the screen
- **Target:** ≤ 2.5 seconds (good)
- **Threshold:** ≤ 4.0 seconds (needs improvement)
- **Why it matters:** Users perceive that the page is loading quickly when they see the main content
- **Example:** Hero image, large text block, video thumbnail

### 2. **FID - First Input Delay**

- **What it measures:** Time from when a user first interacts with a page to when the browser responds
- **Target:** ≤ 100 milliseconds (good)
- **Threshold:** ≤ 300 milliseconds (needs improvement)
- **Status:** Deprecated in favor of INP, but kept for backward compatibility
- **Why it matters:** Responsiveness makes the page feel snappy and interactive

### 3. **INP - Interaction to Next Paint**

- **What it measures:** Responsiveness of a page to user interactions (new replacement for FID)
- **Target:** ≤ 200 milliseconds (good)
- **Threshold:** ≤ 500 milliseconds (needs improvement)
- **Why it matters:** Captures the entire user interaction experience, from click to visual feedback
- **Note:** More comprehensive than FID; measures all interactions, not just the first one

### 4. **CLS - Cumulative Layout Shift**

- **What it measures:** Sum of layout shifts on the page (visual stability)
- **Target:** ≤ 0.1 (good)
- **Threshold:** ≤ 0.25 (needs improvement)
- **Range:** 0 to 1 (unitless score)
- **Why it matters:** Unexpected layout shifts are annoying and disrupt the user experience
- **Example:** Ads loading and pushing content, late-loading fonts changing text size

### 5. **TTFB - Time To First Byte**

- **What it measures:** Time from the browser sending a request to receiving the first byte of HTML response
- **Target:** ≤ 800 milliseconds (good)
- **Threshold:** ≤ 1.8 seconds (needs improvement)
- **Why it matters:** Indicates server health and network latency
- **Affected by:** Server response time, DNS lookup, network quality

## How to View Metrics

### In Development Mode

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open Browser DevTools** (F12 or Ctrl+Shift+I on Windows/Linux, Cmd+Option+I on Mac)

3. **Go to the Console tab** - You'll see colored performance logs like:
   ```
   ⚡ Web Vital: LCP
   Value: 1234ms
   Category: good
   ...
   ```

### Console Commands

#### Get Performance Summary

In the browser console, run:

```javascript
getPerformanceSummary();
```

This displays a formatted summary of all collected metrics:

```
📊 Performance Summary
LCP: 1234 [good]
FID: 45 [good]
CLS: 0.034 [good]
TTFB: 654 [good]
INP: 89 [good]
```

#### Access Raw Metrics

In the browser console, check:

```javascript
window.__WEB_VITALS__;
```

This returns an array of all collected metrics with timestamps and ratings.

#### Clear Metrics

If needed, reset the metrics array:

```javascript
clearCollectedMetrics();
```

### Using Browser DevTools Features

#### Lighthouse Audit

1. Open DevTools → Go to **Lighthouse** tab
2. Click **Analyze page load**
3. Detailed performance report including Web Vitals

#### Performance Tab

1. Open DevTools → Go to **Performance** tab
2. Click the record button
3. Interact with the page
4. View detailed metrics and flame charts

#### Network Tab

Monitor:

- **TTFB** - Check server response times
- **Load time** - Total page load time
- **Resource sizes** - Identify bottlenecks

## Metric Categories

All metrics are automatically categorized as:

- **Good** (✓) - User experience is excellent
- **Needs Improvement** (⚠) - Performance could be better
- **Poor** (✗) - User experience is degraded

Colors in console output:

- Green: Good performance
- Amber/Yellow: Needs improvement
- Red: Poor performance

## Architecture

### Key Files

- **`/utils/analytics.ts`** - Core analytics module
  - Initializes Web Vitals tracking
  - Formats and logs metrics
  - Manages metric collection
  - Prepares for analytics integration

- **`index.tsx`** - Application entry point
  - Calls `initializeAnalytics()` on app startup
  - Non-blocking implementation

### Privacy-First Design

The implementation is **completely privacy-conscious**:

- No data is sent to external services (yet)
- Metrics are collected locally only
- No personal information is tracked
- Ready for future analytics integration
- Browser consent required before sending data

To integrate with an analytics service in the future, modify the `sendMetricToAnalytics()` function in `/utils/analytics.ts`.

## Implementation Details

### Non-Blocking Performance

All metrics are collected using:

- **Async callbacks** - Don't block the main thread
- **setTimeout** - Deferred metric sending
- **Web Vitals library** - Native browser APIs

This ensures performance monitoring doesn't degrade the user experience.

### When Metrics Are Reported

- **LCP**: After the page becomes interactive
- **FID**: After the user first interacts with the page
- **INP**: Continuously as the user interacts
- **CLS**: Throughout the page lifetime
- **TTFB**: After the first byte arrives

## Tips for Optimization

### Improving LCP

- Optimize images and videos
- Preload critical resources
- Minimize CSS and JavaScript
- Use a CDN for static assets
- Enable compression (gzip/brotli)

### Improving INP/FID

- Reduce JavaScript execution time
- Break up long tasks
- Use Web Workers for heavy computation
- Defer non-critical JavaScript
- Optimize event handlers

### Improving CLS

- Set dimensions on images and videos
- Avoid inserting ads and embeds near top of viewport
- Use CSS transforms for animations (not layout changes)
- Avoid animations that shift content
- Use `content-visibility` CSS property

### Improving TTFB

- Optimize server response time
- Use a CDN for faster content delivery
- Cache resources aggressively
- Optimize database queries
- Consider server-side rendering

## Configuration

Performance budgets are defined in `package.json`:

```json
{
  "performanceBudgets": {
    "LCP": { "target": "2.5s", "threshold": "4.0s" },
    "FID": { "target": "100ms", "threshold": "300ms" },
    "INP": { "target": "200ms", "threshold": "500ms" },
    "CLS": { "target": "0.1", "threshold": "0.25" },
    "TTFB": { "target": "800ms", "threshold": "1.8s" }
  }
}
```

Adjust these values based on your application requirements and audience expectations.

## Future Enhancements

### Analytics Integration

To send metrics to an analytics service:

1. Uncomment the `fetch` call in `sendMetricToAnalytics()`
2. Point to your analytics endpoint
3. Ensure proper CORS and authentication

Example:

```typescript
async function sendMetricToAnalytics(metric: Metric): Promise<void> {
  const analyticsData = prepareMetricForAnalytics(metric);

  await fetch('https://your-analytics.com/api/metrics', {
    method: 'POST',
    body: JSON.stringify(analyticsData),
    keepalive: true,
  }).catch(() => {
    // Silently fail to not impact user experience
  });
}
```

### Real User Monitoring (RUM)

- Set up analytics service (Google Analytics 4, DataDog, etc.)
- Send metrics from production
- Monitor long-term performance trends
- Set up alerts for regressions

### Performance Budgeting CI/CD

- Add performance checks to CI/CD pipeline
- Fail builds if metrics exceed thresholds
- Track performance over time
- Prevent performance regressions

## Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [web-vitals Library](https://github.com/GoogleChromeLabs/web-vitals)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Core Web Vitals Guide](https://web.dev/vitals/)

## Troubleshooting

### Metrics not appearing?

- Ensure DevTools Console is open before page load
- Clear browser cache and reload
- Check that `initializeAnalytics()` is called in `index.tsx`
- Verify `NODE_ENV` is set to `development`

### Metrics showing "poor" values?

- Check browser DevTools Performance tab for bottlenecks
- Run Lighthouse audit for detailed report
- Check network conditions (throttle if on fast connection)
- Profile with DevTools Performance tab

### Need more detailed information?

- Use Chrome DevTools Performance tab
- Check web-vitals console messages
- Review Lighthouse report
- Use WebPageTest for waterfall charts

---

**Last Updated:** November 2024
**Performance Monitoring Version:** 1.0
