# Contributing to LawnTech Dynamics

Thank you for your interest in contributing to LawnTech Dynamics! This document provides comprehensive guidelines and instructions for setting up your development environment, maintaining code quality, and contributing effectively to the project.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Development Environment Setup](#development-environment-setup)
  - [Environment Configuration](#environment-configuration)
- [Code Style Guidelines](#code-style-guidelines)
  - [Code Formatting](#code-formatting)
  - [Linting](#linting)
  - [TypeScript Best Practices](#typescript-best-practices)
- [Testing Requirements](#testing-requirements)
  - [Unit Tests](#unit-tests)
  - [End-to-End Tests](#end-to-end-tests)
  - [Test Coverage](#test-coverage)
- [Development Workflow](#development-workflow)
  - [Branch Strategy](#branch-strategy)
  - [Making Changes](#making-changes)
  - [Pre-commit Checklist](#pre-commit-checklist)
- [Pull Request Process](#pull-request-process)
  - [Before Submitting](#before-submitting)
  - [PR Guidelines](#pr-guidelines)
  - [Review Process](#review-process)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
  - [Bug Reports](#bug-reports)
  - [Feature Requests](#feature-requests)
  - [Questions and Discussions](#questions-and-discussions)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Additional Resources](#additional-resources)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: v20 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Or use [nvm](https://github.com/nvm-sh/nvm) for version management
- **npm**: Comes bundled with Node.js (v9.0.0 or higher recommended)
- **Git**: For version control
  - Download from [git-scm.com](https://git-scm.com/)
- **A modern code editor**: We recommend:
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [WebStorm](https://www.jetbrains.com/webstorm/)
  - [Cursor](https://cursor.sh/)

### Development Environment Setup

1. **Fork the repository** (if you're an external contributor)

   Visit [https://github.com/kvnloo/ace](https://github.com/kvnloo/ace) and click "Fork"

2. **Clone the repository:**

   ```bash
   # If you forked the repo
   git clone https://github.com/YOUR-USERNAME/ace.git
   cd ace

   # Or clone the main repository directly
   git clone https://github.com/kvnloo/ace.git
   cd ace
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

   This will install all required packages listed in `package.json`.

4. **Verify installation:**

   ```bash
   npm run dev
   ```

   The development server should start at `http://localhost:3000`

### Environment Configuration

The application requires environment variables to function properly.

1. **Copy the example environment file:**

   ```bash
   cp .env.example .env.local
   ```

2. **Configure required variables:**

   Edit `.env.local` and set the following:

   ```env
   # Google Gemini AI API Key (required for AI chat feature)
   # Get your key from: https://ai.google.dev/
   VITE_GEMINI_API_KEY=your_gemini_api_key_here

   # Optional: Debug mode
   VITE_DEBUG_MODE=false

   # Optional: Analytics
   VITE_ANALYTICS_ENABLED=false
   ```

3. **For more details**, see [ENVIRONMENT.md](ENVIRONMENT.md)

---

## Code Style Guidelines

We maintain strict code quality standards to ensure consistency and maintainability across the project.

### Code Formatting

We use **Prettier** for automatic code formatting.

#### Prettier Configuration

Our configuration (`.prettierrc`) enforces:

- **2-space indentation**
- **Single quotes** for strings
- **Trailing commas** (ES5 compatible)
- **100 character line width**
- **Unix line endings (LF)**

#### Commands

```bash
# Format all files
npm run format

# Check formatting without making changes
npm run format:check
```

#### Editor Integration

Install the appropriate extension for your editor:

- **VS Code**: [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- **WebStorm**: Built-in support, enable in Settings > Languages & Frameworks > JavaScript > Prettier
- **Sublime Text**: [JsPrettier](https://packagecontrol.io/packages/JsPrettier)

**Recommended VS Code settings** (`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### Linting

We use **ESLint** to catch code quality issues and enforce best practices.

#### Running ESLint

```bash
# Check for linting issues
npm run lint

# Auto-fix issues where possible
npm run lint:fix

# Generate JSON report
npm run lint:report
```

#### ESLint Rules

Our configuration enforces:

- Modern ES2021+ syntax
- React best practices and hooks rules
- TypeScript strict typing
- Accessibility (a11y) standards
- Import/export conventions
- No unused variables or imports

### TypeScript Best Practices

- **Always define types** - Avoid using `any` type
- **Use interfaces for object shapes** - Prefer interfaces over type aliases for objects
- **Leverage type inference** - Don't over-specify types where TypeScript can infer
- **Use strict mode** - The project uses strict TypeScript settings

For more details, see [TYPESCRIPT.md](TYPESCRIPT.md)

---

## Testing Requirements

All contributions must include appropriate tests and maintain or improve code coverage.

### Unit Tests

We use **Vitest** for unit and component testing.

#### Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-runs tests on file changes)
npm run test:watch

# Run with UI interface
npm run test:ui

# Generate coverage report
npm run test:coverage
```

#### Writing Unit Tests

- Place test files next to the code they test with `.test.tsx` or `.test.ts` extension
- Test files are in the same directory as components:
  ```
  components/
    NavBar.tsx
    NavBar.test.tsx
  ```

**Example test structure:**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const { user } = render(<MyComponent />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### End-to-End Tests

We use **Playwright** for E2E testing.

#### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Debug mode
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

#### Writing E2E Tests

E2E tests are in the `/e2e` directory.

For more details, see [E2E_TESTING.md](E2E_TESTING.md)

### Test Coverage

**Minimum requirements:**

- **80% coverage** for new code
- **All critical paths** must be tested
- **No regressions** - existing tests must pass

Check coverage:

```bash
npm run test:coverage
```

Coverage reports are generated in the `/coverage` directory.

---

## Development Workflow

### Branch Strategy

We follow a simplified Git Flow:

- **`main`**: Production-ready code, deployed to https://kvnloo.github.io/ace/
- **`dev`**: Development branch, deployed to https://kvnloo.github.io/ace/dev/
- **Feature branches**: Created from `dev` for new features
- **Bugfix branches**: Created from `main` or `dev` for fixes

### Making Changes

1. **Create a feature branch:**

   ```bash
   # For new features
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name

   # For bug fixes
   git checkout -b fix/bug-description
   ```

2. **Make your changes**

   - Write clean, well-documented code
   - Follow the style guidelines
   - Add tests for new functionality

3. **Run quality checks:**

   ```bash
   # Format code
   npm run format

   # Check linting
   npm run lint

   # Run tests
   npm test

   # Build to verify
   npm run build
   ```

4. **Commit your changes**

   Follow our [commit message guidelines](#commit-message-guidelines)

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

### Pre-commit Checklist

Before committing, ensure:

- [ ] Code is formatted with Prettier (`npm run format`)
- [ ] No linting errors (`npm run lint`)
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors or warnings in development
- [ ] Documentation is updated (if applicable)
- [ ] Types are properly defined (no `any` types)

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest changes:

   ```bash
   git checkout dev
   git pull origin dev
   git checkout your-branch-name
   git merge dev
   ```

   Resolve any conflicts that arise.

2. **Run the complete test suite:**

   ```bash
   npm run format
   npm run lint
   npm test
   npm run test:e2e
   npm run build
   ```

3. **Update documentation** if you've:
   - Added new features
   - Changed APIs or interfaces
   - Modified configuration
   - Changed build or deployment processes

### PR Guidelines

#### Title Format

Use conventional commit format:

```
<type>(<scope>): <description>

Examples:
feat(chat): add message history feature
fix(navigation): resolve mobile menu overflow
docs(readme): update installation instructions
perf(3d): optimize Three.js scene rendering
```

#### Description Template

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues

Closes #123
Relates to #456

## Changes Made

- Bullet point list of changes
- Be specific and detailed
- Include any architectural decisions

## Testing

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] All tests passing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on mobile (if applicable)

## Screenshots (if applicable)

Add screenshots to demonstrate visual changes.

## Performance Impact

Describe any performance implications (bundle size, render time, etc.)

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
- [ ] Dependent changes merged
```

### Review Process

1. **Automated Checks**

   - GitHub Actions will run linting, tests, and build
   - All checks must pass before merging

2. **Code Review**

   - At least one approving review required
   - Address all review comments
   - Re-request review after making changes

3. **Merge**

   - Squash and merge is preferred
   - Delete branch after merging

---

## Issue Reporting Guidelines

### Bug Reports

When reporting bugs, please include:

**Title:** Clear, descriptive summary of the bug

**Description:**

```markdown
## Bug Description

Clear and concise description of what the bug is.

## Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Screenshots

If applicable, add screenshots to help explain the problem.

## Environment

- OS: [e.g. macOS 14.0, Windows 11, Ubuntu 22.04]
- Browser: [e.g. Chrome 120, Firefox 121, Safari 17]
- Node version: [e.g. v20.10.0]
- npm version: [e.g. 10.2.0]

## Additional Context

Any other context about the problem.

## Possible Solution (optional)

Suggestions for fixing the bug.
```

**Labels:** Add appropriate labels (bug, critical, ui, etc.)

### Feature Requests

For new features:

**Title:** Concise feature description

**Description:**

```markdown
## Feature Description

Clear description of the feature you'd like to see.

## Problem it Solves

What problem does this feature solve? Why is it needed?

## Proposed Solution

Detailed description of how you envision this feature working.

## Alternatives Considered

Other solutions you've considered and why this is better.

## Additional Context

Screenshots, mockups, or examples from other applications.

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

**Labels:** Add appropriate labels (enhancement, feature, etc.)

### Questions and Discussions

For questions or general discussions:

- Use [GitHub Discussions](https://github.com/kvnloo/ace/discussions) for:
  - General questions
  - Ideas and brainstorming
  - Show and tell
  - Community discussions
- Use issues only for actionable bugs and feature requests

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (no functional changes)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Build system or dependency changes
- **ci**: CI/CD configuration changes
- **chore**: Other changes that don't modify src or test files

### Scopes (optional but recommended)

- **chat**: AI chat component
- **3d**: Three.js 3D visualization
- **nav**: Navigation
- **api**: API integration
- **build**: Build configuration
- **deps**: Dependencies

### Examples

```bash
feat(chat): add message history with local storage

fix(3d): resolve camera rotation on mobile devices

docs(readme): update environment setup instructions

perf(3d): optimize Three.js scene rendering by reducing polygon count

test(nav): add unit tests for navigation component

refactor(chat): extract message formatting logic to utility

build(deps): upgrade React to v19.2.0

ci(github): add Playwright tests to CI pipeline
```

### Subject Line Rules

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Limit to 72 characters

### Body (optional)

- Explain **what** and **why**, not **how**
- Wrap at 72 characters
- Separate from subject with blank line

### Footer (optional)

- Reference issues: `Closes #123`, `Fixes #456`
- Note breaking changes: `BREAKING CHANGE: description`

---

## Additional Resources

### Documentation

- [README.md](README.md) - Project overview and quick start
- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed architecture documentation
- [ENVIRONMENT.md](ENVIRONMENT.md) - Environment configuration guide
- [TYPESCRIPT.md](TYPESCRIPT.md) - TypeScript guidelines
- [E2E_TESTING.md](E2E_TESTING.md) - End-to-end testing guide
- [PERFORMANCE.md](PERFORMANCE.md) - Performance optimization guide
- [LINTING.md](LINTING.md) - Linting configuration details
- [SEO.md](SEO.md) - SEO implementation guide
- [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md) - Deployment process

### External Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and community discussions
- **Code Review**: Request review from maintainers on your PR

---

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions
- Accept constructive criticism gracefully

---

## License

By contributing to LawnTech Dynamics, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to LawnTech Dynamics! Your efforts help make this project better for everyone.

For questions or assistance, please open an issue or start a discussion on GitHub.
