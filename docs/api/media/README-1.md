# ACE Project Documentation

Complete technical documentation for the LawnTech Dynamics autonomous indoor grass court facility visualization project.

## Quick Navigation

### For Quick Reference
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Fast lookup for common tasks and commands

### By Category

#### 1. Architecture & Design
**Location:** `/claudedocs/01-architecture/`

High-level system architecture, design specifications, and layout documentation.

- Court Layout and Configuration
- System Architecture Overview
- 3D Scene Structure
- Component Design Patterns

#### 2. Implementation Guides
**Location:** `/claudedocs/02-implementation-guides/`

Step-by-step guides for implementing features and components.

- Texture System Implementation
- Grass Court Implementation
- Clay Court Implementation
- Court Labeling System
- 3D Visual Elements

#### 3. Testing & Quality
**Location:** `/claudedocs/03-testing-quality/`

Testing strategies, test suites, and quality assurance documentation.

- Integration Testing
- Visual Regression Testing
- Performance Testing
- TDD Implementation
- Test-Driven Development Workflows

#### 4. Monitoring & Operations
**Location:** `/claudedocs/04-monitoring-operations/`

Production monitoring, performance tracking, and operational procedures.

- Continuous Error Monitoring
- Performance Testing & Benchmarks
- Monitoring Architecture
- Operations Dashboards

#### 5. Workflows & Procedures
**Location:** `/claudedocs/05-workflows/`

Development workflows, deployment procedures, and recovery systems.

- Deployment Guide
- Rollback & Recovery Procedures
- Emergency Response Playbooks
- Development Best Practices

#### 6. Research & Investigation
**Location:** `/claudedocs/06-research/`

Research findings, technical investigations, and exploratory work.

- People Animation Research
- Technical Feasibility Studies
- Performance Optimization Research

#### 7. User Stories
**Location:** `/claudedocs/08-stories/`

Detailed user stories with acceptance criteria for feature development.

- [Infrastructure Completion Stories](08-stories/INFRASTRUCTURE_COMPLETION.md) - 3D visualization, quality badges, performance
- [Autonomous Systems Stories](08-stories/AUTONOMOUS_SYSTEMS.md) - Monitoring, self-healing, automation

#### 8. Milestones
**Location:** `/claudedocs/09-milestones/`

Milestone definitions and completion criteria for major project phases.

- [Phase 1 Complete](09-milestones/PHASE_1_COMPLETE.md) - Foundation infrastructure and 3D visualization
- [MVP Completion](09-milestones/MVP_COMPLETION.md) - Full platform ready for member acquisition

## Documentation by Purpose

### Getting Started
1. Read the main [README.md](../README.md) in project root
2. Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common commands
3. Check [Deployment Guide](05-workflows/DEPLOYMENT.md) for deployment setup

### Implementing Features
1. Check relevant guide in [02-implementation-guides](02-implementation-guides/)
2. Follow the step-by-step instructions
3. Refer to [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for code patterns

### Testing & Quality Assurance
1. Review [Integration Testing](03-testing-quality/integration-tests/README.md)
2. Run performance benchmarks using [Performance Testing](04-monitoring-operations/PERFORMANCE_TESTING_IMPLEMENTATION.md)
3. Check visual regression with [Visual Testing Guide](03-testing-quality/integration-tests/README.md)

### Troubleshooting & Recovery
1. Use [Rollback Procedures](05-workflows/ROLLBACK_PROCEDURES.md) for emergency recovery
2. Check [Monitoring Dashboard](04-monitoring-operations/monitoring_architecture.md) for runtime issues
3. Review error logs and monitoring data

### Production Operations
1. Follow [Deployment Guide](05-workflows/DEPLOYMENT.md)
2. Monitor with [Continuous Monitoring](04-monitoring-operations/IMPLEMENTATION_SUMMARY.md)
3. Track performance with [Performance Benchmarks](04-monitoring-operations/performance_quick_reference.md)

## Project Status Documents

**Current System State:**
- ✅ Rollback System Complete - See [ROLLBACK_SYSTEM_COMPLETE.md](05-workflows/ROLLBACK_SYSTEM_COMPLETE.md)
- ✅ Monitoring Setup Complete - See [MONITORING_SETUP_COMPLETE.md](04-monitoring-operations/MONITORING_SETUP_COMPLETE.md)
- ✅ Performance Testing Complete - See [PERFORMANCE_TESTING_SUMMARY.md](04-monitoring-operations/PERFORMANCE_TESTING_SUMMARY.md)

## Documentation Standards

### File Naming Convention
- Use descriptive, lowercase filenames with hyphens
- Include category prefix for easy identification
- Examples: `texture-implementation.md`, `performance-testing-guide.md`

### Document Structure
All implementation guides should include:
1. **Overview** - What the document covers
2. **Prerequisites** - Required knowledge/setup
3. **Step-by-Step Instructions** - Detailed implementation steps
4. **Code Examples** - Working code snippets
5. **Troubleshooting** - Common issues and solutions
6. **References** - Related documentation links

### Maintenance
- Review and update documentation after each major feature
- Archive outdated documents to `/claudedocs/archive/`
- Keep QUICK_REFERENCE.md up-to-date with latest patterns
- Maintain cross-references between related documents

## Contributing to Documentation

When adding new documentation:
1. Place in appropriate category directory
2. Follow the documentation standards above
3. Update this README with links to new documents
4. Add entry to QUICK_REFERENCE.md if applicable
5. Cross-reference from related documents

## Archive

**Location:** `/claudedocs/archive/`

Outdated or superseded documentation is archived for historical reference. Do not rely on archived documents for current development.

## Additional Resources

### External Documentation
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Vite Documentation](https://vitejs.dev/)
- [Playwright Testing](https://playwright.dev/)

### Project Links
- [Live Demo](https://kvnloo.github.io/ace/)
- [Development Preview](https://kvnloo.github.io/ace/dev/)
- [GitHub Repository](https://github.com/kvnloo/ace)

---

**Last Updated:** 2025-11-22
**Maintained By:** ACE Development Team
