# Progressive Web App (PWA) Documentation

## Overview

LawnTech Dynamics is now a fully-featured Progressive Web App (PWA), providing users with a native app-like experience directly from their web browser. This document outlines the PWA features, installation process, and technical implementation details.

## Features

### 1. Installability
- **Add to Home Screen**: Users can install the app on their mobile devices and desktops
- **Standalone Mode**: Runs in a standalone window without browser UI
- **Custom App Icon**: Branded tennis ball icon with LawnTech monogram
- **Splash Screen**: Automatic splash screen generation from manifest

### 2. Offline Support
- **Service Worker**: Comprehensive caching strategy for offline functionality
- **Offline Fallback Page**: Custom offline page with status monitoring
- **Network-First Strategy**: Prioritizes fresh content when online
- **Cache-First for Static Assets**: Faster load times for CDN resources

### 3. Performance
- **Static Asset Caching**: Core files cached on first visit
- **Runtime Caching**: Dynamic content cached as users browse
- **Background Sync**: Queue form submissions when offline
- **Push Notifications**: Support for engagement notifications (optional)

### 4. App-like Experience
- **Custom Theme Colors**: Branded color scheme (#DFFF4F)
- **Status Bar Styling**: Customized for iOS and Android
- **App Shortcuts**: Quick access to key features (3D View, AI Chat)
- **Screenshots**: App store-style screenshots for installation prompts

## Installation

### Desktop (Chrome, Edge, Opera)
1. Visit the website in a supported browser
2. Look for the install icon in the address bar (or "Install App" button)
3. Click the install prompt
4. The app will be installed and can be launched from your desktop

### Mobile (iOS)
1. Open the website in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Confirm the installation
5. The app icon will appear on your home screen

### Mobile (Android)
1. Open the website in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home Screen"
4. Confirm the installation
5. The app will be installed and accessible from your app drawer

## Technical Implementation

### Manifest Configuration

**Location**: `/public/manifest.json`

Key configuration options:
```json
{
  "name": "LawnTech Dynamics - AI-Powered Indoor Tennis Facility",
  "short_name": "LawnTech",
  "display": "standalone",
  "theme_color": "#DFFF4F",
  "background_color": "#0f172a",
  "start_url": "/",
  "scope": "/"
}
```

### Service Worker

**Location**: `/public/service-worker.js`

#### Caching Strategies

1. **Network-First** (Default for same-origin requests)
   - Tries network first
   - Falls back to cache if offline
   - Updates cache with successful responses

2. **Cache-First** (For CDN resources)
   - Checks cache first
   - Falls back to network if not cached
   - Better performance for static assets

#### Cache Versioning
- Version: `v1`
- Cache name: `lawntech-v1`
- Automatic cleanup of old caches on activation

#### Offline Fallback
- Custom offline page at `/offline.html`
- Shows connection status
- Auto-reloads when connection is restored
- Lists available features

### Icon Assets

**Location**: `/public/icons/`

Generated icons:
- `icon-72x72.svg` through `icon-512x512.svg` (Standard icons)
- `icon-192x192-maskable.svg` and `icon-512x512-maskable.svg` (Adaptive icons)
- `shortcut-3d.svg` and `shortcut-chat.svg` (App shortcuts)

**Format**: SVG (Scalable Vector Graphics)
- Lightweight and crisp at any resolution
- Tennis ball design with LawnTech branding
- Green background (#2C5F2D) with yellow accent (#DFFF4F)

#### Converting to PNG

If PNG icons are required:
```bash
npm install --save-dev sharp
node scripts/generate-icons.js
```

Or use an online converter:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

### Service Worker Registration

**Location**: `/utils/serviceWorkerRegistration.ts`

The registration utility handles:
- Service worker lifecycle management
- Update detection and notification
- Error handling
- Development vs. production behavior

**Integration**: Registered in `/index.tsx`

```typescript
serviceWorkerRegistration.register({
  onSuccess: () => console.log('PWA: Cached for offline use'),
  onUpdate: (reg) => /* Show update notification */,
  onError: (error) => console.error('Registration failed', error)
});
```

## Testing PWA Features

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Application tab
3. Check:
   - **Manifest**: Verify manifest.json loads correctly
   - **Service Workers**: Check registration and status
   - **Cache Storage**: View cached resources
   - **Offline**: Test offline functionality

### Lighthouse PWA Audit
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App" category
4. Run audit
5. Address any issues identified

### Testing Offline Mode
1. Load the website
2. Open DevTools > Network tab
3. Select "Offline" from throttling dropdown
4. Reload the page
5. Verify offline page appears
6. Check cached resources load

### Testing Installation
1. Visit the site in a supported browser
2. Verify install prompt appears
3. Complete installation
4. Launch installed app
5. Verify standalone mode works
6. Test app shortcuts (if applicable)

## Troubleshooting

### Service Worker Not Registering

**Issue**: Service worker fails to register

**Solutions**:
- Check that site is served over HTTPS (or localhost)
- Verify service-worker.js is accessible at `/service-worker.js`
- Check browser console for errors
- Ensure no syntax errors in service worker file

### Manifest Not Loading

**Issue**: Manifest warnings in DevTools

**Solutions**:
- Verify manifest.json is valid JSON
- Check that manifest is linked in index.html
- Ensure manifest.json is served with correct MIME type (`application/manifest+json`)
- Validate icons exist at specified paths

### Cache Not Updating

**Issue**: Old content shown after updates

**Solutions**:
- Increment cache version in service-worker.js
- Clear service worker cache in DevTools
- Unregister and re-register service worker
- Use "Update on reload" in DevTools during development

### Install Prompt Not Showing

**Issue**: Installation option not available

**Solutions**:
- Verify all PWA criteria are met (manifest, service worker, HTTPS)
- Check that site passes PWA audit in Lighthouse
- Ensure user has not previously dismissed install prompt
- Try on different browser/device

## Best Practices

### 1. Cache Management
- Keep cache size reasonable (< 50MB recommended)
- Update cache version when deploying new content
- Remove old caches during service worker activation
- Cache only essential resources

### 2. Update Strategy
- Notify users when updates are available
- Provide clear update mechanism
- Don't force immediate updates
- Test updates thoroughly before deployment

### 3. Offline Experience
- Provide meaningful offline fallback
- Show clear connection status
- Queue user actions for later sync
- Maintain app functionality where possible

### 4. Performance
- Minimize service worker execution time
- Use efficient caching strategies
- Lazy load non-critical resources
- Monitor cache hit rates

### 5. User Experience
- Make installation discoverable
- Provide clear value proposition for installing
- Design for standalone mode
- Test on multiple devices and browsers

## Maintenance

### Regular Tasks

1. **Icon Updates**: When rebranding or changing design
   ```bash
   # Update icon SVG in scripts/generate-icons.js
   node scripts/generate-icons.js
   ```

2. **Service Worker Updates**: When adding new features
   - Update cache version
   - Add new routes/assets to cache list
   - Test offline functionality

3. **Manifest Updates**: When changing app info
   - Update name, description, or theme colors
   - Add new shortcuts or screenshots
   - Verify changes with Lighthouse

### Monitoring

Track these metrics:
- Installation rate
- Service worker errors
- Cache hit rate
- Offline page views
- Update adoption rate

## Browser Support

### Desktop
- ✅ Chrome 67+
- ✅ Edge 79+
- ✅ Opera 54+
- ⚠️ Firefox 62+ (limited support)
- ⚠️ Safari 11.1+ (limited support)

### Mobile
- ✅ Chrome for Android 67+
- ✅ Samsung Internet 8+
- ⚠️ Safari iOS 11.3+ (limited support, no install prompt)

### Feature Support
- **Service Workers**: All modern browsers
- **Add to Home Screen**: Chrome, Edge, Opera, Safari iOS
- **App Shortcuts**: Chrome 96+, Edge 96+
- **Push Notifications**: Chrome, Firefox, Edge (not Safari iOS)

## Resources

### Official Documentation
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [W3C - Web App Manifest](https://www.w3.org/TR/appmanifest/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA auditing
- [PWA Builder](https://www.pwabuilder.com/) - PWA testing and packaging
- [Workbox](https://developers.google.com/web/tools/workbox) - Service worker library

### Testing
- [WebPageTest](https://www.webpagetest.org/) - Performance testing
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) - Development and debugging

## Security Considerations

### HTTPS Requirement
- Service workers require HTTPS (except localhost)
- Ensure SSL certificate is valid and up-to-date
- Use HSTS headers for additional security

### Content Security Policy
- Configure CSP headers appropriately
- Allow service worker script execution
- Restrict script sources

### Data Privacy
- Cache only non-sensitive data
- Implement cache expiration for user data
- Provide clear privacy policy
- Handle permissions respectfully

## Future Enhancements

### Planned Features
1. **Background Sync**: Reliable form submission when offline
2. **Push Notifications**: Engagement and update notifications
3. **Periodic Background Sync**: Fresh content updates
4. **Advanced Shortcuts**: More quick actions
5. **Share Target**: Receive shared content from other apps

### Experimental Features
- **File System Access**: Save files locally
- **Web Bluetooth**: Connect to tennis equipment
- **Wake Lock**: Prevent screen from sleeping during use

---

**Last Updated**: November 2025
**Maintained By**: LawnTech Dynamics Development Team
**Version**: 1.0.0
