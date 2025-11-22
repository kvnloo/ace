# Contributing to LawnTech Dynamics

First off, thank you for considering contributing to LawnTech Dynamics! This project aims to revolutionize indoor sports facilities through open innovation, and your contributions help make that vision a reality.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What We're Looking For](#what-were-looking-for)
- [How to Contribute](#how-to-contribute)
- [Contribution Areas](#contribution-areas)
- [Development Workflow](#development-workflow)
- [Quality Standards](#quality-standards)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## What We're Looking For

We welcome contributions in several key areas:

### 🏗️ Facility Design & Architecture
- Spatial optimization algorithms
- Safety compliance improvements
- Accessibility enhancements
- Multi-sport facility layouts

### 🎨 3D Visualization & Models
- Three.js scene improvements
- Court surface rendering enhancements
- Lighting and material realism
- Performance optimizations
- Interactive hotspot features

### 🤖 Autonomous Systems & Algorithms
- Grass growth simulation models
- Robotic maintenance scheduling
- Energy optimization algorithms
- Predictive maintenance logic

### 📊 Analytics & AI
- Biomechanics tracking improvements
- Performance metrics visualization
- AI chat assistant enhancements
- Data analysis algorithms

### 📚 Documentation
- Technical documentation
- User guides
- API documentation
- Translation to other languages

### 🧪 Testing & Quality
- Unit tests
- Integration tests
- E2E tests
- Performance benchmarks

## How to Contribute

### 1. Find an Issue or Create One

**Browse existing issues:**
- Check [open issues](https://github.com/kvnloo/ace/issues) for tasks
- Look for `good first issue` labels for beginner-friendly tasks
- `help wanted` indicates we especially need assistance

**Create a new issue:**
- Use issue templates when available
- Provide clear description and context
- Include screenshots or mockups for visual changes
- Reference related issues if applicable

### 2. Fork and Clone

```bash
# Fork the repository via GitHub UI, then:
git clone https://github.com/YOUR_USERNAME/ace.git
cd ace
git remote add upstream https://github.com/kvnloo/ace.git
```

### 3. Set Up Your Development Environment

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (optional for most contributions)

# Start development server
npm run dev
```

**System Requirements:**
- Node.js v20 or higher
- npm or yarn
- Git
- Modern browser with WebGL support

### 4. Create a Branch

Use descriptive branch names:

```bash
# Feature branches
git checkout -b feature/grass-texture-enhancement

# Bug fixes
git checkout -b fix/court-lighting-issue

# Documentation
git checkout -b docs/api-reference

# Refactoring
git checkout -b refactor/three-scene-optimization
```

### 5. Make Your Changes

**Follow our coding standards:**
- Write TypeScript with proper types
- Follow existing code style (use ESLint)
- Add tests for new functionality
- Update documentation as needed

**Commit message format:**
```
type(scope): brief description

Detailed explanation of changes (optional)

Closes #issue_number
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or tooling changes

**Examples:**
```
feat(3d): add realistic grass blade rendering

Implements instanced mesh rendering for individual grass blades
using custom shaders for wind animation and realistic appearance.

Closes #42
```

```
fix(ai-chat): resolve streaming response timeout

Increases timeout threshold and adds retry logic for
Gemini API streaming responses.

Fixes #87
```

### 6. Test Your Changes

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all

# Check TypeScript types
npm run type-check

# Lint code
npm run lint
```

### 7. Submit a Pull Request

**Before submitting:**
- ✅ All tests pass
- ✅ Code follows style guidelines
- ✅ Documentation is updated
- ✅ Commits are clean and descriptive
- ✅ Branch is up to date with main

```bash
# Update your branch with latest changes
git fetch upstream
git rebase upstream/main

# Push to your fork
git push origin your-branch-name
```

**PR Guidelines:**
- Use the PR template
- Link related issues
- Provide clear description of changes
- Add screenshots/videos for UI changes
- Request review from maintainers

## Contribution Areas

### 🏗️ Facility Design Contributions

**What we're looking for:**
- Space optimization algorithms
- Safety compliance enhancements
- Accessibility improvements (ADA, AODA compliance)
- Multi-sport layout innovations

**How to contribute:**
- Review facility specifications in `docs/blueprint.md`
- Propose design improvements via issues
- Submit CAD files or spatial models
- Document design rationale

**Submission format:**
```
docs/designs/
  ├── your-design-name/
  │   ├── README.md           # Design rationale
  │   ├── specifications.md   # Technical specs
  │   ├── layout.svg          # Visual representation
  │   └── calculations.md     # Safety/space calculations
```

### 🎨 3D Model Improvements

**What we're looking for:**
- Realistic court textures and materials
- Lighting improvements
- Performance optimizations
- Interactive features

**Technologies used:**
- Three.js for 3D rendering
- React Three Fiber for React integration
- Custom shaders for effects
- Post-processing effects

**How to contribute:**
1. Modify components in `components/ThreeScene.tsx`
2. Add textures in `src/utils/courtTextures.ts`
3. Test performance (target: 60 FPS)
4. Document shader code and techniques

**Performance benchmarks:**
- Desktop: 60 FPS at 1080p
- Mobile: 30 FPS minimum
- Load time: < 3 seconds for scene initialization

### 🤖 Algorithm Enhancements

**Areas for contribution:**

**Grass Growth Simulation:**
- Hydroponics nutrient optimization
- Growth rate modeling
- Environmental factor simulation
- Patch replacement scheduling

**Robotic Maintenance:**
- Path planning algorithms
- Task prioritization logic
- Energy consumption optimization
- Collision avoidance systems

**Energy Optimization:**
- Solar panel efficiency modeling
- HVAC scheduling algorithms
- Demand response integration
- Carbon footprint tracking

**How to contribute:**
1. Create algorithms in `src/algorithms/` (new directory)
2. Include unit tests demonstrating correctness
3. Provide performance analysis
4. Document mathematical models

**Example structure:**
```typescript
/**
 * Grass Growth Simulation Algorithm
 *
 * Models grass growth rate based on environmental factors:
 * - Light intensity (PAR: 400-700nm)
 * - Temperature (optimal: 15-24°C)
 * - Humidity (optimal: 50-70%)
 * - Nutrient concentration (NPK ratio)
 *
 * @param params - Environmental parameters
 * @returns Growth rate in mm/day
 */
export function calculateGrassGrowthRate(params: GrowthParams): number {
  // Implementation with documented formula
}
```

### 📚 Documentation Improvements

**Documentation types:**
- Technical documentation (API, architecture)
- User guides (facility operations, booking)
- Contributing guides (this document!)
- Research papers (algorithms, design rationale)

**How to contribute:**
- Fix typos and clarity issues
- Add missing documentation
- Translate to other languages
- Create tutorials and guides

**Documentation locations:**
- `docs/` - General documentation
- `claudedocs/` - Technical implementation docs
- Component files - Inline JSDoc comments
- README files in subdirectories

## Development Workflow

### Local Development

```bash
# Start dev server with hot reload
npm run dev

# Access at http://localhost:3000
```

### Testing Strategy

**Unit Tests (Vitest):**
```bash
# Run unit tests
npm run test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

**E2E Tests (Playwright):**
```bash
# Run E2E tests
npm run test:e2e

# Run with UI for debugging
npm run test:e2e:ui

# Run specific test file
npm run test:e2e:loading
```

**Visual Regression Tests:**
```bash
# Run visual tests
npm run test:visual

# Update snapshots
npm run test:visual:update
```

### Code Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Maintainer Review**: Core team reviews code quality
3. **Community Feedback**: Other contributors may comment
4. **Approval**: Requires 1+ maintainer approval
5. **Merge**: Maintainer merges to main branch

**Review criteria:**
- Code quality and maintainability
- Test coverage and correctness
- Documentation completeness
- Performance impact
- Security considerations

## Quality Standards

### Code Quality

**TypeScript Standards:**
- Use explicit types (avoid `any`)
- Document public APIs with JSDoc
- Handle errors appropriately
- Follow existing naming conventions

**React Standards:**
- Use functional components with hooks
- Memoize expensive computations
- Follow React best practices
- Avoid prop drilling (use context when needed)

**Three.js Standards:**
- Dispose geometries and materials properly
- Use instanced meshes for repeated objects
- Optimize draw calls
- Profile performance regularly

### Testing Standards

**Test Coverage Goals:**
- Critical paths: 90%+ coverage
- UI components: 70%+ coverage
- Utilities: 80%+ coverage
- Overall: 75%+ coverage

**Test Quality:**
- Test behavior, not implementation
- Use descriptive test names
- Include edge cases
- Mock external dependencies

### Documentation Standards

**Code Documentation:**
- JSDoc for all public functions
- Inline comments for complex logic
- README for each major directory
- Architecture decision records (ADRs)

**User Documentation:**
- Clear, concise language
- Step-by-step instructions
- Screenshots and examples
- Troubleshooting sections

## Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Pull Requests**: Code review discussions

### Getting Help

**I'm stuck! Where do I ask for help?**

1. Check existing documentation
2. Search closed issues for similar problems
3. Open a new issue with:
   - Clear problem description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

**I have an idea but not sure how to implement it:**

1. Open an issue to discuss the idea
2. Tag it as `discussion`
3. Community will provide feedback and guidance

### Recognition

Contributors are recognized in several ways:

- **Contributors list**: All contributors listed in README
- **Release notes**: Contributions highlighted in releases
- **Special recognition**: Significant contributions featured in announcements

## License and Copyright

By contributing to LawnTech Dynamics, you agree that:

1. **Code contributions** are licensed under the project's open source license (see [LICENSE](../LICENSE))
2. **Facility design contributions** are licensed under Creative Commons CC-BY-SA 4.0
3. **Documentation contributions** are licensed under Creative Commons CC-BY-SA 4.0
4. You have the right to submit the contribution
5. You understand contributions may be used commercially

See [GOVERNANCE.md](GOVERNANCE.md) for intellectual property details.

## Questions?

Don't hesitate to reach out:

- **General questions**: Open a GitHub Discussion
- **Bug reports**: Open a GitHub Issue
- **Security issues**: See SECURITY.md for reporting process
- **Feature ideas**: Open an issue with `enhancement` label

---

**Thank you for contributing to the future of autonomous sports facilities! 🎾**

Every contribution, no matter how small, helps build something extraordinary. We're excited to work with you!
