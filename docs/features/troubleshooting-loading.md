# Adaptive Loading Troubleshooting Guide

Solutions for common loading system issues and performance problems.

## Common Issues

### Loading Takes Too Long

**Symptoms:**
- Loading screen persists for >30 seconds
- Progress bar stuck at certain percentage
- No FPS recommendation appears

**Causes & Solutions:**

#### 1. Slow Network Connection

**Diagnosis:**
- Open browser DevTools (F12)
- Check Network tab for slow asset downloads
- Look for timeouts or failed requests

**Solution:**
```
1. Close other bandwidth-heavy applications
2. Restart router if possible
3. Clear browser cache and reload
4. Use skip button to load minimal mode
```

#### 2. Browser Performance Issues

**Diagnosis:**
- Check CPU usage in Task Manager
- Look for other heavy browser tabs
- Check for browser extensions

**Solution:**
```
1. Close unnecessary browser tabs
2. Disable browser extensions temporarily
3. Restart browser
4. Try incognito/private mode
5. Update browser to latest version
```

#### 3. Asset Loading Errors

**Diagnosis:**
- Open DevTools Console (F12)
- Look for error messages
- Check Network tab for 404/500 errors

**Solution:**
```
1. Refresh page (Ctrl+R / Cmd+R)
2. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. Clear browser cache
4. Check internet connection
5. Try different browser
```

### Low FPS During Loading

**Symptoms:**
- FPS meter shows <30 FPS
- Loading feels choppy or stuttering
- Recommendation for Minimal mode appears

**Causes & Solutions:**

#### 1. Insufficient GPU

**Diagnosis:**
- FPS low even on Essential phase
- Quality mode doesn't improve FPS
- System has integrated graphics

**Solution:**
```
1. Accept Minimal mode recommendation
2. Close GPU-intensive applications
3. Update graphics drivers
4. Reduce browser zoom level
5. Lower display resolution temporarily
```

#### 2. Background Processes

**Diagnosis:**
- Task Manager shows high CPU usage
- Multiple applications running
- System feels slow overall

**Solution:**
```
1. Close unnecessary applications
2. Check for Windows updates installing
3. Check antivirus scanning
4. Disable startup programs
5. Restart computer
```

#### 3. Overheating

**Diagnosis:**
- Performance degrades over time
- Laptop fan running loud
- System hot to touch

**Solution:**
```
1. Ensure proper ventilation
2. Clean laptop vents
3. Use cooling pad
4. Reduce power-intensive tasks
5. Let system cool before retrying
```

### Quality Recommendation Not Appearing

**Symptoms:**
- Low FPS but no recommendation shown
- Skip button appears but no quality options
- System doesn't auto-adjust

**Causes & Solutions:**

#### 1. Browser Storage Disabled

**Diagnosis:**
- DevTools Console shows localStorage errors
- Incognito/private mode
- Browser privacy settings

**Solution:**
```
1. Exit private browsing mode
2. Enable cookies/local storage in browser settings:
   - Chrome: Settings > Privacy > Site Settings > Cookies
   - Firefox: Preferences > Privacy > Cookies and Site Data
   - Safari: Preferences > Privacy > Cookies
3. Clear site data and retry
4. Add site to allowed list
```

#### 2. JavaScript Disabled

**Diagnosis:**
- Page not interactive
- Console shows script errors
- Browser extension blocking

**Solution:**
```
1. Enable JavaScript in browser settings
2. Disable script-blocking extensions
3. Check browser security settings
4. Add site to trusted sites
```

### Quality Mode Not Persisting

**Symptoms:**
- Quality resets on reload
- Manual selection not saved
- Always starts in Balanced mode

**Causes & Solutions:**

#### 1. localStorage Cleared

**Diagnosis:**
- Browser set to clear on exit
- Privacy mode active
- Browser extension clearing data

**Solution:**
```
1. Check browser settings:
   - Chrome: Settings > Privacy > Clear browsing data > On exit
   - Firefox: Preferences > Privacy > History > Clear on close
2. Disable auto-clear for this site
3. Use normal browsing mode
4. Disable privacy extensions
```

#### 2. Multiple Tabs/Windows

**Diagnosis:**
- Multiple instances open
- Settings conflict between tabs
- Last tab closed wins

**Solution:**
```
1. Close all tabs/windows
2. Open single instance
3. Set quality mode
4. Close properly (don't force quit)
```

### Skip Button Not Working

**Symptoms:**
- Button click doesn't respond
- Loading continues after skip
- No transition to minimal mode

**Causes & Solutions:**

#### 1. Loading Already Complete

**Diagnosis:**
- All phases finished
- Progress at 100%
- Scene already loaded

**Solution:**
```
No action needed - loading finished naturally
```

#### 2. JavaScript Error

**Diagnosis:**
- DevTools Console shows errors
- Other buttons also not working
- Page partially broken

**Solution:**
```
1. Hard refresh page
2. Clear browser cache
3. Check browser console for errors
4. Report bug with console log
```

## Performance Issues

### Choppy Loading Animation

**Symptoms:**
- Progress bar stutters
- FPS meter unstable
- Visual glitches

**Solutions:**

```
1. Accept lower quality recommendation
2. Close other browser tabs
3. Disable browser hardware acceleration:
   - Chrome: Settings > System > Hardware acceleration
   - Firefox: Preferences > Performance > Hardware acceleration
4. Update graphics drivers
5. Try different browser
```

### Memory Warnings

**Symptoms:**
- Browser "Out of memory" warning
- Page becomes unresponsive
- Browser crashes

**Solutions:**

```
1. Close other tabs/applications
2. Restart browser
3. Use Minimal or Emergency mode
4. Increase system RAM if possible
5. Use 64-bit browser version
```

### Visual Artifacts

**Symptoms:**
- Black screen during loading
- Flickering elements
- Missing textures

**Solutions:**

```
1. Update graphics drivers
2. Disable browser hardware acceleration
3. Clear browser cache
4. Try different browser
5. Check WebGL support: https://get.webgl.org/
```

## Browser-Specific Issues

### Chrome

**Issue**: Loading stuck at Phase 1
**Solution**:
```
1. Disable extensions (Ctrl+Shift+N for incognito)
2. Reset flags: chrome://flags/#reset-all
3. Clear cache: Settings > Privacy > Clear browsing data
4. Update Chrome
```

**Issue**: High CPU usage
**Solution**:
```
1. Disable hardware acceleration
2. Enable GPU rasterization: chrome://flags/#enable-gpu-rasterization
3. Limit background tabs
```

### Firefox

**Issue**: FPS lower than Chrome
**Solution**:
```
1. Enable hardware acceleration
2. about:config > webgl.force-enabled = true
3. Update Firefox
4. Try Firefox Developer Edition
```

**Issue**: localStorage not saving
**Solution**:
```
1. Preferences > Privacy > History > Remember history
2. Clear site cookies and retry
3. Check about:preferences#privacy
```

### Safari

**Issue**: Loading very slow
**Solution**:
```
1. Safari > Preferences > Advanced > Show Develop menu
2. Develop > Empty Caches
3. Develop > Disable JavaScript Caches
4. Update Safari/macOS
```

**Issue**: WebGL not supported
**Solution**:
```
1. Safari > Preferences > Websites > WebGL
2. Enable for this site
3. Update macOS to latest version
```

## Device-Specific Issues

### Low-End Laptops

**Recommended Settings**:
```
Quality Mode: Minimal or Emergency
Browser: Chrome (best optimization)
Close: All other applications
Disable: Browser extensions, hardware acceleration
```

### High-End Desktops

**Recommended Settings**:
```
Quality Mode: Ultra
Browser: Chrome or Firefox
Enable: Hardware acceleration, GPU rasterization
Update: Graphics drivers regularly
```

### Tablets

**Recommended Settings**:
```
Quality Mode: Minimal
Browser: Safari (iOS) or Chrome (Android)
Close: Background apps
Reduce: Display brightness, zoom level
```

### Mobile Phones

**Not Recommended**:
```
The 3D facility is designed for desktop/laptop use.
Mobile devices lack sufficient GPU power.
Use desktop for best experience.
```

## Diagnostic Commands

### Check WebGL Support

Open DevTools Console and run:
```javascript
// Check WebGL availability
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
console.log('WebGL supported:', !!gl);
if (gl) {
  console.log('Vendor:', gl.getParameter(gl.VENDOR));
  console.log('Renderer:', gl.getParameter(gl.RENDERER));
}
```

### Check Current Quality Mode

```javascript
// Get current quality settings
console.log('Quality mode:', localStorage.getItem('qualityMode'));
```

### Force Quality Mode

```javascript
// Manually set quality mode
localStorage.setItem('qualityMode', 'minimal');
location.reload();
```

### Check FPS

```javascript
// Monitor FPS in console
let lastTime = performance.now();
let frames = 0;

function checkFPS() {
  frames++;
  const now = performance.now();
  if (now >= lastTime + 1000) {
    const fps = (frames * 1000) / (now - lastTime);
    console.log('FPS:', fps.toFixed(1));
    frames = 0;
    lastTime = now;
  }
  requestAnimationFrame(checkFPS);
}
checkFPS();
```

### Clear All Settings

```javascript
// Reset to defaults
localStorage.removeItem('qualityMode');
sessionStorage.clear();
location.reload();
```

## Error Messages

### "Loading timeout"
**Meaning**: Asset took too long to load
**Solution**: Check network connection, try skip button, refresh page

### "WebGL not supported"
**Meaning**: Browser doesn't support WebGL
**Solution**: Update browser, enable WebGL in settings, try different browser

### "Out of memory"
**Meaning**: Browser ran out of memory
**Solution**: Use Minimal mode, close other tabs, restart browser, increase RAM

### "FPS too low"
**Meaning**: Performance below acceptable threshold
**Solution**: Accept quality recommendation, close applications, update drivers

### "Asset load failed"
**Meaning**: Specific asset couldn't load
**Solution**: Check network, refresh page, clear cache, check console for details

## Getting Help

If issues persist:

1. **Capture Information**:
   - Browser version
   - Operating system
   - Graphics card
   - Console errors (F12 > Console)
   - Network errors (F12 > Network)
   - Quality mode when issue occurred

2. **Try Safe Mode**:
   ```javascript
   // Emergency safe mode
   localStorage.setItem('qualityMode', 'emergency');
   location.reload();
   ```

3. **Report Issue**:
   - GitHub Issues: [link]
   - Include system info
   - Attach console log
   - Describe steps to reproduce

## Prevention

### Before Loading

```
✓ Update browser to latest version
✓ Update graphics drivers
✓ Close unnecessary applications
✓ Check internet connection
✓ Disable heavy browser extensions
✓ Clear browser cache if experiencing issues
```

### During Loading

```
✓ Don't navigate away
✓ Don't refresh page
✓ Don't open DevTools (unless debugging)
✓ Accept quality recommendations
✓ Use skip button if needed
```

### After Loading

```
✓ Save quality preference
✓ Note FPS for future sessions
✓ Report any issues
✓ Provide feedback
```

## Performance Optimization

### For Developers

See [Performance Optimization Guide](../performance/optimization-guide.md) for:
- Asset optimization
- Lazy loading strategies
- Memory management
- Profiling tools

### For Users

See [User Guide](./adaptive-loading.md) for:
- Understanding quality modes
- When to skip loading
- Quality mode recommendations
- Best practices

## Related Documentation

- [User Guide](./adaptive-loading.md)
- [API Reference](./api-reference-loading.md)
- [Performance Guide](../performance/optimization-guide.md)
- [Testing Guide](../testing/loading-tests.md)
