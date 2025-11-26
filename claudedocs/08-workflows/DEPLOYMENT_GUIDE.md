# Deployment Guide

Complete guide for deploying and managing the ACE tennis facility visualization.

## Deployment Overview

### Environments
- **Development** - Local development with hot reload
- **Staging** - Pre-production testing environment
- **Production** - Live production deployment

### Deployment Platforms
- **GitHub Pages** - Static site hosting
- **Vercel** - Serverless deployment (alternative)
- **CDN** - Static asset distribution

## Build Process

### Production Build

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Preview build locally
npm run preview
```

### Build Optimization

**Vite configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react': ['react', 'react-dom'],
        },
      },
    },
  },
});
```

## GitHub Pages Deployment

### Automated Deployment

GitHub Actions workflow automatically deploys on push to main:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## CDN Configuration

### Asset Hosting

Static assets are served from CDN for better performance:

```typescript
// Configure CDN base URL
const CDN_BASE = 'https://cdn.example.com/assets';

// Load textures from CDN
const textureLoader = new THREE.TextureLoader();
textureLoader.setPath(CDN_BASE);
```

### Cache Strategy

```javascript
// Service worker cache configuration
const CACHE_NAME = 'ace-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/main.js',
  '/assets/main.css',
];

// Cache assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});
```

## Rollback Procedures

### Automated Rollback

If deployment validation fails, automatic rollback occurs:

```bash
#!/bin/bash
# scripts/rollback.sh

PREVIOUS_VERSION=$(git describe --tags --abbrev=0 HEAD^)

echo "Rolling back to $PREVIOUS_VERSION"

# Checkout previous version
git checkout $PREVIOUS_VERSION

# Rebuild and redeploy
npm run build
npm run deploy

# Tag rollback
git tag -a "rollback-$(date +%Y%m%d-%H%M%S)" -m "Rollback to $PREVIOUS_VERSION"
```

### Manual Rollback

```bash
# List recent deployments
git log --oneline -10

# Rollback to specific commit
git checkout <commit-hash>

# Rebuild and deploy
npm run build
npm run deploy
```

## Environment Configuration

### Environment Variables

```bash
# .env.production
VITE_API_URL=https://api.example.com
VITE_CDN_URL=https://cdn.example.com
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_ENABLE_DEBUG=false
```

### Configuration Management

```typescript
// config/environment.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  cdnUrl: import.meta.env.VITE_CDN_URL,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  isProduction: import.meta.env.PROD,
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
};
```

## Deployment Validation

### Smoke Tests

Automated tests run after deployment:

```typescript
// tests/smoke/deployment.test.ts
describe('Deployment Smoke Tests', () => {
  it('homepage loads successfully', async () => {
    const response = await fetch('https://example.com');
    expect(response.status).toBe(200);
  });

  it('3D scene renders', async () => {
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const canvas = await page.$('canvas');
    expect(canvas).toBeTruthy();
  });

  it('assets load from CDN', async () => {
    const page = await browser.newPage();
    page.on('response', (response) => {
      if (response.url().includes('cdn.example.com')) {
        expect(response.status()).toBe(200);
      }
    });
    await page.goto('https://example.com');
  });
});
```

### Performance Validation

```bash
# Run Lighthouse audit
npm run lighthouse -- https://example.com

# Check performance score
if [ $PERFORMANCE_SCORE -lt 90 ]; then
  echo "Performance score too low: $PERFORMANCE_SCORE"
  exit 1
fi
```

## Monitoring Deployment

### Health Checks

```typescript
// api/health.ts
export function healthCheck() {
  return {
    status: 'ok',
    version: packageJson.version,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
```

### Error Tracking

```typescript
// Sentry release tracking
Sentry.init({
  dsn: config.sentryDsn,
  release: `ace@${packageJson.version}`,
  environment: config.isProduction ? 'production' : 'staging',
});

// Track deployment
Sentry.configureScope((scope) => {
  scope.setTag('deployment', Date.now());
});
```

## Continuous Deployment

### CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run lint
      - run: npm run typecheck

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Troubleshooting

### Common Deployment Issues

**Build fails:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for errors

**Assets not loading:**
- Verify CDN configuration
- Check CORS settings
- Validate asset paths

**Performance degradation:**
- Check bundle size
- Verify asset compression
- Review code splitting

### Recovery Procedures

**Emergency rollback:**
```bash
# Quick rollback to previous deployment
npm run rollback:emergency
```

**Clear CDN cache:**
```bash
# Invalidate CDN cache after deployment
npm run cdn:invalidate
```

## Deployment Checklist

**Pre-deployment:**
- [ ] All tests passing
- [ ] Code review completed
- [ ] Version number updated
- [ ] Changelog updated
- [ ] Staging deployment tested

**Deployment:**
- [ ] Trigger deployment
- [ ] Monitor build process
- [ ] Verify deployment success
- [ ] Run smoke tests
- [ ] Check performance metrics

**Post-deployment:**
- [ ] Verify production site
- [ ] Monitor error rates
- [ ] Check analytics
- [ ] Document any issues
- [ ] Notify team

## Quick Reference

### Deployment Commands

```bash
# Build
npm run build

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Rollback
npm run rollback

# Validate deployment
npm run validate:deployment
```

### URLs

- **Production**: https://example.com
- **Staging**: https://staging.example.com
- **CDN**: https://cdn.example.com
