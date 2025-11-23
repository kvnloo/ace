# Environment Variable Configuration Guide

This guide explains how to set up and validate environment variables for the LawnTech Dynamics project.

## Quick Start

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your configuration values

3. Start the application:
   ```bash
   npm run dev
   ```

The application will automatically validate all environment variables at startup and provide helpful error messages if something is misconfigured.

## Environment Variables Reference

### Required Variables

#### `VITE_GEMINI_API_KEY`
- **Type**: String
- **Required in**: Production only (warning in development)
- **Description**: Google Gemini AI API key for the chat assistant
- **Where to get**: https://ai.google.dev/
- **Steps to obtain**:
  1. Visit https://ai.google.dev/
  2. Click "Get API Key" or "Create API Key"
  3. Follow the authentication flow
  4. Copy your API key
  5. Paste into `.env.local`

Example:
```env
VITE_GEMINI_API_KEY=AIzaSyDxxx...
```

### Optional Variables

#### `VITE_BASE_PATH`
- **Type**: String
- **Default**: `/`
- **Description**: Base path for the application in routing and asset loading
- **Use cases**:
  - GitHub Pages subdirectory deployment: `/ace/`
  - Custom domain with subpath: `/sports/`
  - Local development: `/`

Example for GitHub Pages:
```env
VITE_BASE_PATH=/ace/
```

#### `VITE_DEBUG_MODE`
- **Type**: Boolean (`true` or `false`)
- **Default**: `false`
- **Description**: Enables additional console logging for development
- **Effects**:
  - More verbose environment validation output
  - Additional debugging information in console

Example:
```env
VITE_DEBUG_MODE=true
```

#### `VITE_ANALYTICS_ENABLED`
- **Type**: Boolean (`true` or `false`)
- **Default**: `false` in development, `true` in production
- **Description**: Controls whether analytics data collection is enabled
- **Note**: Currently analytics data is stored locally; no data is sent to external services

Example:
```env
VITE_ANALYTICS_ENABLED=true
```

### Automatically Set Variables

#### `NODE_ENV`
- **Type**: String
- **Automatically set by**: npm scripts
- **Values**: `development`, `production`, `test`
- **You should NOT set this manually** - it's controlled by npm

| Command | NODE_ENV |
|---------|----------|
| `npm run dev` | `development` |
| `npm run build` | `production` |
| `npm test` | `test` |

## File Organization

### `.env.local` (your actual configuration)
- **Location**: Root directory
- **Gitignore**: ✓ (never committed)
- **Who uses it**: Local development
- **Contains**: Your actual API keys and credentials
- **Create from**: `.env.example`

Example:
```env
VITE_GEMINI_API_KEY=AIzaSyDxxx...
VITE_BASE_PATH=/
VITE_DEBUG_MODE=false
VITE_ANALYTICS_ENABLED=false
```

### `.env.example` (template)
- **Location**: Root directory
- **Gitignore**: ✗ (committed to repo)
- **Who uses it**: Everyone cloning the repo
- **Contains**: Template with no actual values
- **Purpose**: Shows what variables exist and their defaults
- **Update when**: Adding new environment variables

### `.env` (deprecated/shared)
- **Not used** in this project
- **Gitignore**: ✓ (ignored)
- **Better approach**: Use `.env.example` and `.env.local`

## Validation & Error Handling

### How Validation Works

Environment validation runs automatically when the application starts (in `index.tsx`):

1. **Parse**: All environment variables are read from `process.env`
2. **Validate**: Each variable is checked against validation rules
3. **Report**: Errors and warnings are logged to console
4. **Fail Fast**: Application stops if critical errors exist

### Error Messages

#### Missing API Key in Production
```
Environment validation failed:
  ✗ GEMINI_API_KEY is required in production. Set VITE_GEMINI_API_KEY in your environment or .env.local file.

Please fix the above issues and restart the application.
```

**Solution**: Add `VITE_GEMINI_API_KEY=your_key_here` to `.env.local`

#### Missing API Key in Development (Warning)
```
[ENV] Validation Warnings
⚠ GEMINI_API_KEY is not set. AI chat features will not work. Set VITE_GEMINI_API_KEY in .env.local to enable.
```

**Solution**: Optional - AI chat will be disabled, but other features work

#### Invalid NODE_ENV
```
Environment validation failed:
  ✗ Invalid NODE_ENV: staging. Must be one of: development, production, test
```

**Solution**: Use only `development`, `production`, or `test`

## Development Workflows

### Local Development (No API Key)
Good for testing UI without API access:

```env
# .env.local
VITE_DEBUG_MODE=true
VITE_ANALYTICS_ENABLED=false
```

Run:
```bash
npm run dev
```

Expected console output:
```
✓ Environment variables validated successfully
```

### Local Development (With API Key)
Full feature testing:

```env
# .env.local
VITE_GEMINI_API_KEY=AIzaSyDxxx...
VITE_DEBUG_MODE=true
VITE_ANALYTICS_ENABLED=false
```

Run:
```bash
npm run dev
```

### Testing

```env
# .env.local (optional for tests)
NODE_ENV=test
VITE_GEMINI_API_KEY=test-key-123
```

Run:
```bash
npm test
```

### Production Build

```env
# .env.local
VITE_GEMINI_API_KEY=AIzaSyDxxx...
VITE_BASE_PATH=/ace/
VITE_ANALYTICS_ENABLED=true
```

Build:
```bash
npm run build
```

## Accessing Environment Variables in Code

### Type-Safe Access

Use the environment validator module:

```typescript
import { env } from './utils/env';

// Access individual variables with type checking
const apiKey = env.GEMINI_API_KEY;
const debugMode = env.DEBUG_MODE; // Returns boolean
const basePath = env.VITE_BASE_PATH; // Returns string

// Check if in development
if (env.isDevelopment()) {
  console.log('Development mode enabled');
}

// Check if in production
if (env.isProduction()) {
  console.log('Production mode enabled');
}

// Check if a variable is set
if (env.has('GEMINI_API_KEY')) {
  // Use the API key
}
```

### In Components

```typescript
import React from 'react';
import { env } from './utils/env';

const AIChat: React.FC = () => {
  // Show warning if API key not configured
  if (!env.GEMINI_API_KEY) {
    return <div>AI chat is not configured. Please set VITE_GEMINI_API_KEY.</div>;
  }

  // Use the API key
  return <ChatInterface apiKey={env.GEMINI_API_KEY} />;
};
```

### In Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
});
```

## Troubleshooting

### Application won't start - "Could not find root element"

This error happens if the `#root` element is missing from HTML. Not related to environment variables. Check `index.html`.

### "Environment not initialized" error

This means `initializeEnvironment()` wasn't called before using `env`. Make sure `index.tsx` has:
```typescript
import { initializeEnvironment } from './utils/env';
initializeEnvironment();
```

### API key not working in development

1. Verify the key in `.env.local`:
   ```bash
   grep VITE_GEMINI_API_KEY .env.local
   ```

2. Restart the dev server:
   ```bash
   npm run dev
   ```

3. Check browser console for validation messages

4. Ensure the key is valid at https://ai.google.dev/

### Build succeeds but app fails at runtime

This usually means environment variables are missing in production. Make sure to set all required environment variables in your deployment platform.

For GitHub Pages, set environment variables during build:
```bash
VITE_GEMINI_API_KEY=your_key VITE_BASE_PATH=/ace/ npm run build
```

### Different behavior between local and production

Common causes:
1. Missing environment variables in production
2. Different `VITE_BASE_PATH` value
3. Different `NODE_ENV` value

Check that all variables in `.env.local` are also set in production.

## Security Best Practices

### Do's

- ✓ Use `.env.local` for development with real keys
- ✓ Commit `.env.example` to show what variables exist
- ✓ Use different keys for different environments
- ✓ Rotate API keys periodically
- ✓ Use environment variable management in your deployment platform

### Don'ts

- ✗ Commit `.env.local` (it's in `.gitignore` for a reason)
- ✗ Commit `.env` files with real credentials
- ✗ Use the same API key across all environments
- ✗ Log or expose API keys in console output
- ✗ Hardcode API keys in source code

### For Team Development

1. Each team member creates their own `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add their own API keys to `.env.local`

3. Never share `.env.local` - it's in `.gitignore`

4. Update `.env.example` if you add new variables:
   ```bash
   git add .env.example
   git commit -m "Add new environment variable template"
   ```

## CI/CD Integration

### GitHub Actions

Set environment variables as repository secrets:

1. Go to: Settings > Secrets and variables > Actions > New repository secret
2. Add secrets for:
   - `VITE_GEMINI_API_KEY`
   - `VITE_BASE_PATH` (if different from default)

3. Use in workflow:
   ```yaml
   - name: Build
     env:
       VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
       VITE_BASE_PATH: /ace/
     run: npm run build
   ```

### Docker/Container Deployment

Pass environment variables at runtime:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD ["npm", "run", "preview"]
```

Run with environment:

```bash
docker run \
  -e VITE_GEMINI_API_KEY=your_key \
  -e VITE_BASE_PATH=/ \
  -p 3000:3000 \
  lawntech-dynamics
```

## Adding New Environment Variables

When adding new environment variables:

1. **Update `.env.ts`**: Add type definition to `EnvironmentVariables` interface
2. **Add validation**: Add validation logic in `validate()` method
3. **Update `.env.example`**: Add template with documentation
4. **Update this guide**: Document the new variable here
5. **Commit**: Update `.env.example` in git

Example:

```typescript
// 1. Add to EnvironmentVariables interface in utils/env.ts
interface EnvironmentVariables {
  // ... existing variables
  VITE_NEW_FEATURE_ENABLED?: string;
}

// 2. Add validation
private validate(): void {
  // ... existing validation
  if (this.variables.VITE_NEW_FEATURE_ENABLED === undefined) {
    this.warnings.push('VITE_NEW_FEATURE_ENABLED is not set...');
  }
}

// 3. Add getter for convenience
get NEW_FEATURE_ENABLED(): boolean {
  return this.variables.VITE_NEW_FEATURE_ENABLED === 'true';
}
```

```env
# Update .env.example
VITE_NEW_FEATURE_ENABLED=false
```

## References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
- [Google Gemini API](https://ai.google.dev/)
- [Security Best Practices](https://owasp.org/www-project-web-security-testing-guide/)

## Support

If you encounter issues with environment variables:

1. Check this guide first
2. Review the error message carefully
3. Verify your `.env.local` file matches `.env.example` structure
4. Restart the development server
5. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
