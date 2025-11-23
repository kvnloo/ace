# API Documentation Guide

This guide explains how to write and maintain API documentation for the ACE Tennis Facility project using TSDoc and TypeDoc.

## Table of Contents

- [Overview](#overview)
- [TSDoc Writing Standards](#tsdoc-writing-standards)
- [TypeDoc Generation Workflow](#typedoc-generation-workflow)
- [Preview Documentation Locally](#preview-documentation-locally)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Overview

We use **TSDoc** for inline code documentation and **TypeDoc** to generate HTML API reference documentation. This ensures our codebase is well-documented and maintainable.

### Tools

- **TSDoc**: Comment syntax standard for TypeScript (similar to JSDoc)
- **TypeDoc**: Generates HTML documentation from TSDoc comments
- **http-server**: Local server for previewing documentation

## TSDoc Writing Standards

### Basic Structure

Every exported function, class, interface, and type should have TSDoc comments:

```typescript
/**
 * Brief description of what this does (one line).
 *
 * Detailed description with more context about the purpose,
 * behavior, and any important notes.
 *
 * @param paramName - Description of the parameter
 * @param optionalParam - Description (optional parameter)
 * @returns Description of what is returned
 *
 * @example
 * ```typescript
 * const result = myFunction('value');
 * console.log(result);
 * ```
 *
 * @see {@link RelatedInterface} for related types
 * @throws {ErrorType} When this error occurs
 */
export function myFunction(paramName: string, optionalParam?: number): ReturnType {
  // implementation
}
```

### Component Documentation

For React components:

```typescript
/**
 * WeatherSystem component displays real-time weather conditions.
 *
 * This component integrates with the weather API to show current conditions,
 * temperature, and weather effects in the 3D scene.
 *
 * @component
 * @category System Components
 *
 * @param props - Component properties
 * @param props.location - Geographic location for weather data
 * @param props.updateInterval - How often to fetch weather (milliseconds)
 *
 * @returns React component rendering weather visualization
 *
 * @example
 * ```tsx
 * <WeatherSystem
 *   location="New York"
 *   updateInterval={300000}
 * />
 * ```
 */
export function WeatherSystem({ location, updateInterval }: WeatherSystemProps) {
  // implementation
}
```

### Interface/Type Documentation

```typescript
/**
 * Configuration options for the lighting system.
 *
 * @interface
 * @category Types
 */
export interface LightingConfig {
  /**
   * Intensity of ambient lighting (0-1)
   * @defaultValue 0.5
   */
  ambientIntensity: number;

  /**
   * Enable dynamic shadows
   * @defaultValue true
   */
  enableShadows: boolean;

  /**
   * Shadow quality preset
   * @remarks Higher quality increases rendering cost
   */
  shadowQuality: 'low' | 'medium' | 'high' | 'ultra';
}
```

### Service Documentation

```typescript
/**
 * Service for interacting with the Gemini AI API.
 *
 * Handles authentication, request formatting, and response parsing
 * for all AI-related operations.
 *
 * @class
 * @category Services
 */
export class GeminiService {
  /**
   * Send a chat message and receive AI response.
   *
   * @param message - User's message text
   * @param context - Optional conversation context
   * @returns AI-generated response
   *
   * @throws {APIError} When API request fails
   * @throws {RateLimitError} When rate limit is exceeded
   *
   * @example
   * ```typescript
   * const service = new GeminiService();
   * const response = await service.sendMessage('Hello!');
   * console.log(response.text);
   * ```
   */
  async sendMessage(message: string, context?: ConversationContext): Promise<AIResponse> {
    // implementation
  }
}
```

### Required Tags

| Tag | Required For | Purpose |
|-----|--------------|---------|
| `@param` | All function parameters | Describe each parameter |
| `@returns` | Functions with return values | Describe return value |
| `@throws` | Functions that throw errors | Document error conditions |
| `@example` | Public APIs | Show usage examples |
| `@category` | Exports | Organize in documentation |
| `@deprecated` | Deprecated items | Mark as outdated |
| `@see` | Related items | Cross-reference |

### Optional but Recommended Tags

- `@remarks` - Additional notes and considerations
- `@defaultValue` - Default values for parameters
- `@internal` - Mark as internal-only (excluded from docs)
- `@beta` - Mark as experimental/unstable
- `@since` - Version when added
- `@version` - Current version

### Categories

Use `@category` to organize documentation:

- **Main Components** - Primary application components
- **System Components** - Background systems (weather, lighting)
- **Visualization Components** - 3D rendering components
- **UI Components** - User interface elements
- **Services** - Backend services and APIs
- **Utils** - Utility functions
- **Types** - TypeScript types and interfaces

## TypeDoc Generation Workflow

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Documentation

```bash
# Generate HTML documentation
npm run docs:generate

# Generate and watch for changes
npm run docs:watch
```

### 3. Output Location

Documentation is generated to `docs/api/` directory.

### 4. Clean and Rebuild

```bash
# Clean old documentation
npm run docs:clean

# Clean and regenerate
npm run docs:rebuild
```

## Preview Documentation Locally

### Using npm script (Recommended)

```bash
npm run docs:serve
```

This will:
1. Start http-server on port 8080
2. Automatically open your browser
3. Navigate to `http://localhost:8080`

### Manual Server

```bash
# Navigate to docs/api
cd docs/api

# Start any static server
python -m http.server 8080
# or
npx serve .
```

## CI/CD Integration

### GitHub Actions Workflow

We use GitHub Actions to automatically generate and deploy documentation on every push to `main`:

```yaml
# .github/workflows/docs.yml
name: Generate Documentation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate documentation
        run: npm run docs:generate

      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/api
```

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

Documentation will be available at: `https://yourusername.github.io/ace-tennis/`

### Pre-commit Hook (Optional)

Ensure documentation is up-to-date before commits:

```bash
# .husky/pre-commit
#!/bin/sh
npm run docs:generate
git add docs/api
```

## Best Practices

### Writing Documentation

1. **Be Concise** - First line should be a clear, brief summary
2. **Be Complete** - Include all parameters, return values, and exceptions
3. **Provide Examples** - Show real-world usage
4. **Use Markdown** - Format with headings, lists, code blocks
5. **Link Related Items** - Use `@see` tags for cross-references
6. **Update Regularly** - Keep docs in sync with code changes

### Code Organization

```typescript
// ✅ Good - Well documented
/**
 * Calculate court temperature based on ambient conditions.
 *
 * @param ambient - Current ambient temperature (°C)
 * @param sunlight - Sunlight intensity (0-1)
 * @returns Court surface temperature (°C)
 */
export function calculateCourtTemp(ambient: number, sunlight: number): number {
  return ambient + (sunlight * 10);
}

// ❌ Bad - Missing documentation
export function calculateCourtTemp(ambient: number, sunlight: number): number {
  return ambient + (sunlight * 10);
}
```

### Documentation Coverage

Aim for:
- **100%** coverage for public APIs
- **80%+** coverage for internal functions
- **All** interfaces and types documented

### Maintenance

- Review documentation during code reviews
- Update examples when APIs change
- Mark deprecated items before removal
- Version significant changes

## Troubleshooting

### TypeDoc Errors

**Error: Cannot find module**
```bash
# Ensure tsconfig.json is correct
npm run docs:generate -- --tsconfig ./tsconfig.json
```

**Warning: No documentation generated**
- Check that files are included in `entryPoints`
- Ensure TypeScript files compile without errors
- Verify TSDoc comments are properly formatted

### Documentation Not Updating

```bash
# Clear cache and rebuild
npm run docs:clean
npm run docs:generate
```

### Missing Categories

Add `@category` tags to your exports:

```typescript
/**
 * @category System Components
 */
export function MyComponent() {}
```

## Resources

- [TSDoc Specification](https://tsdoc.org/)
- [TypeDoc Documentation](https://typedoc.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JSDoc Reference](https://jsdoc.app/)

## Support

For questions or issues:
1. Check existing documentation examples in codebase
2. Review this guide
3. Create an issue in the repository
4. Contact the development team

---

**Last Updated**: November 2025
**Version**: 1.0.0
