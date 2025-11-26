# ACE Tennis Facility Documentation

Welcome to the ACE (Advanced Tennis Facility) documentation. This documentation covers the 3D visualization system for a state-of-the-art tennis facility, with a vision toward APEX health optimization.

## Quick Start

**For developers new to the project:**
1. Start with [Architecture Overview](architecture/CORE_ARCHITECTURE.md)
2. Review [Implemented Features](features/IMPLEMENTED_FEATURES.md)
3. Follow [Implementation Guide](implementation/GRASS_AND_TERRAIN.md)

**For strategic vision:**
- [APEX Vision](concepts/APEX_VISION.md) - Health optimization facility concept
- [Strategic Roadmap](planning/STRATEGIC_ROADMAP.md) - 26-week development plan

**For testing and quality:**
- [Testing Guide](testing/TESTING_GUIDE.md)
- [Performance Monitoring](monitoring/PERFORMANCE_MONITORING.md)

**For deployment:**
- [Deployment Guide](workflows/DEPLOYMENT_GUIDE.md)

## Documentation Structure

### 📐 Architecture
Core system architecture and design decisions:
- `architecture/CORE_ARCHITECTURE.md` - System architecture, coordinate systems, rendering pipeline

### 💡 Concepts
Strategic vision and future direction:
- `concepts/APEX_VISION.md` - APEX health optimization facility vision (ACE → APEX transformation)

### 📋 Planning
Development roadmap and feature planning:
- `planning/STRATEGIC_ROADMAP.md` - 26-week, 5-phase development plan
- `planning/FEATURE_INVENTORY.md` - Complete component inventory (45+ components, 300+ 3D objects)
- `planning/PLANNED_FEATURES.md` - Feature backlog with prioritization

### ⚙️ Implementation
How-to guides for implementing features:
- `implementation/GRASS_AND_TERRAIN.md` - Grass rendering, clay courts, texture systems

### 🎨 Features
Feature documentation and roadmaps:
- `features/IMPLEMENTED_FEATURES.md` - Complete list of implemented features
- `features/cea-facility/` - CEA (Controlled Environment Agriculture) facility
  - `CEA_IMPROVEMENT_PLAN.md` - Level 3 vertical farming improvements
  - `HYDROPONICS_SYSTEM.md` - Technical specs for 16-tower hydroponics system
- `features/lighting-system/` - Dynamic lighting implementation
- `features/heatmap-system/` - Court usage visualization
- `features/weather-system/` - Environmental effects
- `features/character-system/` - Player animations

### 📖 Stories
User stories and acceptance criteria:
- `stories/USER_STORIES.md` - 20 user stories across 2 epics (Infrastructure, Autonomous Systems)

### 🧪 Testing
Testing strategies and test documentation:
- `testing/TESTING_GUIDE.md` - Unit, integration, and E2E testing guides

### 📊 Monitoring
Performance monitoring and optimization:
- `monitoring/PERFORMANCE_MONITORING.md` - Performance metrics, profiling, optimization

### 🚀 Workflows
Deployment and operational procedures:
- `workflows/DEPLOYMENT_GUIDE.md` - Build, deploy, and rollback procedures
- `workflows/MERGE_PLAN_*.md` - Branch merge documentation

### 🔬 Research
External research and specifications:
- `research/sports-facilities/` - HVAC, lighting, accessibility standards

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

**2025-11-26**: Documentation consolidation from claudedocs-old
- Added APEX Vision document (`concepts/APEX_VISION.md`)
- Added Strategic Roadmap (`planning/STRATEGIC_ROADMAP.md`)
- Added Feature Inventory (`planning/FEATURE_INVENTORY.md`)
- Added Planned Features backlog (`planning/PLANNED_FEATURES.md`)
- Added Hydroponics System specs (`features/cea-facility/HYDROPONICS_SYSTEM.md`)
- Added User Stories (`stories/USER_STORIES.md`) - 20 stories across 2 epics
- Updated README with new structure

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
