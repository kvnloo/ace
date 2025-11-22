# Sentry Testing Script

Quick reference for testing Sentry integration.

## Quick Console Tests

Open browser console after running `npm run dev` and paste these commands:

### 1. Test Basic Error Capture

```javascript
// Trigger a simple error
throw new Error('Test error from console');

// Expected: Error boundary UI should appear
// Check: Sentry dashboard (if DSN configured) or console logs
```

### 2. Test Loading Screen Tracking

```javascript
// Import tracker (if available in window)
import('./src/config/sentry').then(({ SentryTracker }) => {
  SentryTracker.trackLoadingScreen('shown', { totalAssets: 10 });
  console.log('✅ Loading screen tracking test sent');
});
```

### 3. Test Scene Lifecycle

```javascript
import('./src/config/sentry').then(({ SentryTracker }) => {
  SentryTracker.trackSceneLifecycle('mount', { floor: 0 });
  SentryTracker.trackSceneLifecycle('error', { error: 'Test error' });
  console.log('✅ Scene lifecycle tracking test sent');
});
```

### 4. Test Performance Tracking

```javascript
import('./src/config/sentry').then(({ SentryTracker }) => {
  // Normal performance
  SentryTracker.trackPerformance('scene_load_time', 2500, 'ms');

  // Poor performance (should trigger warning)
  SentryTracker.trackPerformance('fps', 25, 'fps');

  console.log('✅ Performance tracking test sent');
});
```

### 5. Test Asset Loading Error

```javascript
import('./src/config/sentry').then(({ SentryTracker }) => {
  const testError = new Error('Failed to load texture: 404 Not Found');
  SentryTracker.trackAssetLoadingError('texture', '/textures/test.jpg', testError);
  console.log('✅ Asset loading error test sent');
});
```

### 6. Test WebGL Error

```javascript
import('./src/config/sentry').then(({ SentryTracker }) => {
  SentryTracker.trackWebGLError('WebGL context lost', {
    reason: 'GPU reset',
    timestamp: Date.now(),
  });
  console.log('✅ WebGL error test sent');
});
```

### 7. Test User Action Tracking

```javascript
import('./src/config/sentry').then(({ SentryTracker }) => {
  SentryTracker.trackUserAction('test_action', {
    feature: 'tennis_court',
    floor: 1,
    timestamp: Date.now(),
  });
  console.log('✅ User action tracking test sent');
});
```

---

## Manual UI Tests

### Test Error Boundary

1. Navigate to FACILITY_DEMO view
2. Open browser console
3. Type: `throw new Error('Test error boundary')`
4. Expected: Error UI with "Application Error" message
5. Click "Try Again" → Should reset error state
6. Click "Return Home" → Should navigate to home page

### Test Loading Screen Tracking

1. Navigate to HOME view
2. Click "Explore 3D Demo"
3. Watch browser console for loading messages
4. Expected logs:
   ```
   🎬 Showing loading screen with X registered assets
   🔄 Loading screen active. Total assets: X
   ```

### Test 3D Scene Lifecycle

1. Navigate to FACILITY_DEMO
2. Open browser console
3. Look for scene lifecycle messages
4. Switch to another view
5. Expected: Mount and unmount tracking logs

---

## Verification Checklist

### Development Mode (No Sentry DSN)

```markdown
- [ ] Warning message: "Sentry DSN not configured"
- [ ] Errors logged to console
- [ ] No sentry.io network requests
- [ ] App functions normally
```

### With Sentry DSN Configured

```markdown
- [ ] Success message: "Sentry initialized successfully"
- [ ] Network tab shows sentry.io requests
- [ ] Errors appear in Sentry dashboard
- [ ] Breadcrumbs visible in error details
- [ ] Performance data captured
- [ ] Source maps working (TypeScript visible in stack traces)
```

### Error Boundary Tests

```markdown
- [ ] React errors caught
- [ ] Custom error UI displays
- [ ] "Try Again" button works
- [ ] "Return Home" button works
- [ ] Error sent to Sentry (if configured)
```

### Performance Tests

```markdown
- [ ] Page load time tracked
- [ ] Scene load time measured
- [ ] FPS warnings for low performance
- [ ] Memory usage monitored (if supported)
```

---

## Expected Console Output

### Development Mode (No DSN)

```
⚠️ Sentry DSN not configured. Error tracking running in mock mode.
Errors will be logged to console. Set VITE_SENTRY_DSN to enable Sentry.
See .env.example for configuration details.
```

### With Sentry DSN

```
🔍 Initializing Sentry for environment: development
✅ Sentry initialized successfully
```

### Loading Screen Active

```
🎬 Showing loading screen with 15 registered assets
🔄 Loading screen active. Total assets: 15
✅ Assets detected, loading screen will wait for completion
```

### Error Captured

```
Error caught by boundary: Error: Test error
  at <anonymous>:1:7

Sentry: Event sent successfully
```

---

## Network Tab Verification

### What to Look For

1. **Sentry Envelope Requests**
   - URL: `https://o<project>.ingest.sentry.io/api/<project>/envelope/`
   - Method: POST
   - Status: 200 OK
   - Size: Variable (depends on error data)

2. **Request Payload**
   - Contains error details
   - Includes breadcrumbs
   - Has environment context
   - Shows release version (if configured)

3. **Request Headers**
   - `Content-Type: text/plain;charset=UTF-8`
   - `X-Sentry-Auth: Sentry sentry_key=...`

---

## Troubleshooting

### No Console Logs Appearing

**Possible Causes**:
- Console filter active (clear filters)
- Log level too low (set to "Verbose" or "All")
- Browser extension blocking output

**Solution**: Open DevTools → Console → Clear filters → Refresh page

---

### Sentry Requests Blocked

**Possible Causes**:
- Ad blocker blocking sentry.io
- Corporate firewall/proxy
- Browser privacy settings

**Solution**: Whitelist sentry.io in ad blocker or use development mode

---

### Errors Not in Dashboard

**Possible Causes**:
- Wrong environment filter in Sentry
- DSN typo in .env.local
- Network request failed
- BeforeSend filter dropping event

**Solution**: Check Network tab for 200 OK responses to sentry.io

---

## Performance Baseline

### Expected Metrics (First Load)

```
Scene Load Time: 2000-4000ms (normal)
FPS: 55-60fps (normal)
Memory Usage: 100-300MB (normal)
```

### Warning Thresholds

```
Scene Load Time: >5000ms → Warning logged
FPS: <30fps → Warning logged
Memory Usage: >500MB → Warning logged
```

---

## Next Steps After Testing

### If Everything Works ✅

1. Remove test errors from code
2. (Optional) Add tracking to components
3. (Optional) Configure Sentry alerts
4. Deploy to production

### If Issues Found ❌

1. Check troubleshooting section above
2. Review documentation:
   - `claudedocs/monitoring/sentry_implementation.md`
   - `claudedocs/monitoring/IMPLEMENTATION_SUMMARY.md`
3. Verify environment configuration in `.env.local`
4. Check browser console for detailed error messages

---

## Quick Test Command

```bash
# Full test sequence
npm run dev

# Then in browser:
# 1. Open console
# 2. Navigate to FACILITY_DEMO
# 3. Throw test error: throw new Error('Test')
# 4. Check console and Sentry dashboard
```

---

**Test Duration**: 5-10 minutes
**Required Tools**: Browser DevTools (Console + Network tabs)
**Optional**: Sentry account for full verification

