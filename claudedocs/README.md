# ACE Tennis Facility Documentation

Welcome to the ACE (Advanced Tennis Facility) documentation. This documentation covers the 3D visualization system for a state-of-the-art tennis facility.

## Quick Start

**For developers new to the project:**
1. Start with [Architecture Overview](architecture/CORE_ARCHITECTURE.md)
2. Review [Implemented Features](features/IMPLEMENTED_FEATURES.md)
3. Follow [Implementation Guide](implementation/GRASS_AND_TERRAIN.md)

**For testing and quality:**
- [Testing Guide](testing/TESTING_GUIDE.md)
- [Performance Monitoring](monitoring/PERFORMANCE_MONITORING.md)

**For deployment:**
- [Deployment Guide](workflows/DEPLOYMENT_GUIDE.md)

## Documentation Structure

### 📐 Architecture
Core system architecture and design decisions:
- `architecture/CORE_ARCHITECTURE.md` - System architecture, coordinate systems, rendering pipeline

### ⚙️ Implementation
How-to guides for implementing features:
- `implementation/GRASS_AND_TERRAIN.md` - Grass rendering, clay courts, texture systems

### 🎨 Features
Feature documentation and roadmaps:
- `features/IMPLEMENTED_FEATURES.md` - Complete list of implemented features
- Feature-specific documentation in subdirectories

### 🧪 Testing
Testing strategies and test documentation:
- `testing/TESTING_GUIDE.md` - Unit, integration, and E2E testing guides

### 📊 Monitoring
Performance monitoring and optimization:
- `monitoring/PERFORMANCE_MONITORING.md` - Performance metrics, profiling, optimization

### 🚀 Workflows
Deployment and operational procedures:
- `workflows/DEPLOYMENT_GUIDE.md` - Build, deploy, and rollback procedures

### 📦 Archive
Historical documentation and deprecated features (preserved for reference)

## Project Overview

ACE is a 3D visualization system for a tennis facility featuring:
- **Multiple court types**: Grass, clay, and hard courts
- **Real-time 3D rendering**: Using Three.js and React
- **Interactive features**: Heat maps, character animations, weather effects
- **Performance optimized**: 60 FPS on target hardware
- **Responsive design**: Desktop and mobile support

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **3D Rendering**: Three.js
- **Testing**: Jest, React Testing Library, Playwright
- **Monitoring**: Sentry, Custom performance tracking
- **Deployment**: GitHub Pages, CDN

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Key Features

### Implemented ✅
- Multiple tennis court types with realistic rendering
- Adaptive grass system with wind animation
- Dynamic lighting (day/night cycle)
- Heat map overlay for court usage
- Character system with animations
- Performance monitoring dashboard
- Automated deployment pipeline

### In Progress 🔄
- Robotic maintenance systems
- Advanced analytics dashboard

### Planned 📋
- Transport pod system
- AI-powered court management
- Virtual reality support

## Performance Standards

**Rendering:**
- Target: 60 FPS on desktop, 30 FPS on mobile
- Initial load: < 3 seconds
- Asset streaming: < 5 seconds

**Memory:**
- Initial: < 200MB
- Peak: < 500MB
- Stable operation with minimal GC

**Testing:**
- Code coverage: > 80%
- Test pass rate: > 95%
- E2E coverage: Critical paths

## Contributing

When contributing to this documentation:

1. **Keep it current**: Update docs when making changes
2. **Be concise**: Clear, actionable content over verbose descriptions
3. **Use examples**: Code examples and diagrams where helpful
4. **Organize properly**: Place docs in appropriate directories

## Documentation Standards

### File Naming
- Use UPPERCASE for major documents: `CORE_ARCHITECTURE.md`
- Use descriptive names: `GRASS_AND_TERRAIN.md` not `grass.md`
- Group related docs in subdirectories

### Content Structure
- Start with overview/summary
- Use clear headings and sections
- Include code examples where relevant
- Add "Quick Reference" sections for common tasks
- Link to related documentation

### Maintenance
- Archive outdated docs (don't delete)
- Update links when moving files
- Keep changelog for major updates
- Review quarterly for accuracy

## Support

For questions or issues:
- Check relevant documentation section
- Review troubleshooting guides
- Check GitHub issues
- Contact development team

## Recent Updates

**2025-11-26**: Major documentation reorganization
- Consolidated 107 files into streamlined structure
- Created comprehensive guides for each domain
- Improved navigation and discoverability
- Archived historical documents for reference

## License

[Add license information]

---

**Navigation Tips:**
- Use the directory structure above to find specific topics
- Check the Quick Start section for your role
- Review the Archive only if you need historical context
