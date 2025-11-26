# Mobile Testing Documentation

Comprehensive guide for mobile E2E testing in the ACE Facility project.

## Overview

This document describes our mobile testing strategy, covering responsive design validation, touch interactions, performance optimization, and cross-device compatibility.

## Test Coverage

### 1. Viewport Testing

We test against multiple mobile viewports to ensure responsive design:

| Device | Resolution | Description |
|--------|-----------|-------------|
| iPhone SE | 375x667 | Small mobile viewport |
| iPhone 12/13 | 390x844 | Standard iPhone |
| iPhone 14 Pro | 393x852 | Latest iPhone |
| Google Pixel 5 | 393x851 | Android flagship |
| Samsung Galaxy S20 | 360x800 | Popular Android |
| iPad Mini | 768x1024 | Small tablet |

### 2. Touch Gesture Support

**Swipe Gestures:**
- Horizontal swipes for 3D scene rotation
- Vertical swipes for scrolling
- Multi-finger swipes for advanced interactions

**Pinch Gestures:**
- Pinch-to-zoom for 3D scene navigation
- Reverse pinch for zoom out
- Smooth interpolation during gesture

**Tap Gestures:**
- Single tap for selection
- Double tap for zoom
- Long press for context menus

### 3. Mobile Navigation

**Hamburger Menu:**
- Visible on viewports <768px
- Animated open/close transitions
- Touch-friendly tap target (44x44px minimum)
- Accessible via keyboard and screen readers

**Navigation Items:**
- Stacked vertical layout on mobile
- Full-width tap targets
- Clear visual feedback on tap
- Smooth scroll to sections

### 4. Performance Requirements

**Load Time:**
- Initial page load: <5 seconds
- Time to Interactive: <3.8 seconds
- First Contentful Paint: <1.8 seconds

**Runtime Performance:**
- Maintain 30+ FPS during 3D interactions
- Memory usage <200MB on mobile devices
- Smooth scrolling (60 FPS)

**Network Optimization:**
- Lazy loading for images
- Responsive image srcset
- Compressed assets
- Service worker caching

### 5. Layout Responsiveness

**Breakpoints:**
```css
/* Mobile First Approach */
Base: 0px - 639px      /* Small mobile */
sm: 640px - 767px      /* Large mobile */
md: 768px - 1023px     /* Tablet */
lg: 1024px+            /* Desktop */
```

**Layout Validation:**
- No horizontal scroll
- Content fits viewport width
- Touch targets ≥44x44px
- Readable text (≥16px)
- Proper spacing for fingers

### 6. Orientation Support

**Portrait Mode:**
- Vertical stacking of content
- Full-width components
- Scrollable sections

**Landscape Mode:**
- Horizontal layout adjustments
- Optimized 3D scene view
- Preserved aspect ratios

## Testing Approach

### Manual Testing

1. **Device Lab Testing:**
   - Test on 5+ physical devices
   - Cover iOS and Android
   - Include different screen sizes

2. **Browser Testing:**
   - Safari Mobile (iOS)
   - Chrome Mobile (Android)
   - Firefox Mobile
   - Samsung Internet

3. **User Scenarios:**
   - New visitor flow
   - Navigation testing
   - Form interactions
   - 3D scene manipulation

### Automated Testing

**Playwright Device Emulation:**
```typescript
test('mobile test', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 12'],
    hasTouch: true
  });
  const page = await context.newPage();
  // Test mobile functionality
});
```

**Viewport Testing:**
```typescript
test('responsive layout', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // Validate mobile layout
});
```

**Touch Simulation:**
```typescript
// Swipe gesture
await page.touchscreen.swipe(
  { x: 100, y: 300 },
  { x: 300, y: 300 }
);

// Tap
await page.touchscreen.tap(150, 200);
```

## Common Issues & Solutions

### Issue: Content Overflows Viewport

**Solution:**
```css
* {
  max-width: 100%;
  overflow-wrap: break-word;
}

body {
  overflow-x: hidden;
}
```

### Issue: Touch Targets Too Small

**Solution:**
```css
button, a {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}
```

### Issue: Slow Performance

**Solution:**
- Reduce 3D scene complexity
- Implement level-of-detail (LOD)
- Use smaller textures
- Enable WebGL optimizations

### Issue: Font Size Unreadable

**Solution:**
```css
body {
  font-size: 16px; /* Minimum for mobile */
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
```

## Performance Optimization

### Image Optimization

**Responsive Images:**
```html
<img
  src="image-800w.jpg"
  srcset="image-400w.jpg 400w,
          image-800w.jpg 800w,
          image-1200w.jpg 1200w"
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  alt="Description"
  loading="lazy"
/>
```

**WebP Format:**
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

### 3D Scene Optimization

**Mobile-Specific Settings:**
```javascript
// Reduce quality on mobile
const isMobile = window.innerWidth < 768;
const renderer = new THREE.WebGLRenderer({
  antialias: !isMobile,
  powerPreference: isMobile ? 'low-power' : 'high-performance'
});

// Lower resolution
if (isMobile) {
  renderer.setPixelRatio(1);
} else {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
```

### Network Optimization

**Code Splitting:**
```javascript
// Lazy load 3D scene on mobile
const Scene3D = lazy(() => import('./Scene3D'));

{isMobile ? (
  <Suspense fallback={<Loading />}>
    <Scene3D />
  </Suspense>
) : (
  <Scene3D />
)}
```

## Accessibility on Mobile

### Touch Accessibility

- Minimum 44x44px touch targets
- Visual feedback on touch
- Haptic feedback for important actions
- No hover-dependent interactions

### Screen Reader Support

- Proper ARIA labels
- Semantic HTML structure
- Skip navigation links
- Announce dynamic content changes

### Keyboard Support (Bluetooth Keyboards)

- Full keyboard navigation
- Visible focus indicators
- Logical tab order
- Keyboard shortcuts documented

## Testing Checklist

### Pre-Launch Mobile Testing

- [ ] Test on 3+ physical iOS devices
- [ ] Test on 3+ physical Android devices
- [ ] Validate all viewports (375px - 1024px)
- [ ] Test both portrait and landscape
- [ ] Verify touch gestures work
- [ ] Check load time <5s on 3G
- [ ] No horizontal scroll
- [ ] Touch targets ≥44px
- [ ] Readable text ≥16px
- [ ] Forms work on mobile keyboards
- [ ] Images optimized and lazy loaded
- [ ] 3D scene performs well (30+ FPS)
- [ ] Accessibility audit passes
- [ ] Cross-browser testing complete

### Regression Testing

Run mobile tests after:
- UI component changes
- Layout modifications
- Performance optimizations
- 3D scene updates
- Navigation changes

## Tools & Resources

### Testing Tools

- **Playwright**: Automated mobile testing
- **Chrome DevTools**: Device emulation
- **BrowserStack**: Real device testing
- **Lighthouse**: Mobile performance audit

### Monitoring Tools

- **Google Analytics**: Mobile traffic analysis
- **Sentry**: Mobile error tracking
- **Web Vitals**: Performance monitoring

### Development Tools

- **React DevTools**: Component debugging
- **Three.js Inspector**: 3D scene debugging

## Best Practices

1. **Mobile-First Development**: Design for mobile, enhance for desktop
2. **Progressive Enhancement**: Core functionality works without JS
3. **Touch-First Interactions**: Optimize for touch, support mouse
4. **Performance Budget**: Set and enforce performance budgets
5. **Regular Testing**: Test on real devices frequently
6. **User Feedback**: Collect and act on mobile user feedback

## Continuous Improvement

- Monitor mobile analytics
- Track performance metrics
- Review crash reports
- A/B test mobile optimizations
- Stay updated on mobile best practices

---

**Last Updated:** November 2025
**Version:** 1.0
**Maintained by:** QA Team
