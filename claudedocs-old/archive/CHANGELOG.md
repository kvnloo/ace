# Changelog

All notable changes to the ACE (Advanced Court Explorer) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Sprint 1 - Documentation Cleanup (2025-11-22)

#### Fixed
- **Component Count**: Corrected component count from "30+ components" to accurate "44 components" across all documentation
  - Updated `.claude/planning/VALIDATION_CHECKLIST.md`
  - Updated `.claude/reports/architect-coordinator-summary.md` (4 instances)
  - Updated `.claude/planning/construction-phases.md` (3 instances)
  - Updated `.claude/reports/detailed-inventory.md`

- **Test Coverage Reporting**: Clarified test coverage metrics
  - Documented current state: 15% unit test coverage
  - Set target: 70% unit coverage, 40% E2E by Sprint 6
  - Removed misleading "40% test coverage" claims
  - Updated conflict resolution in detailed-inventory.md

- **Terminology Standardization**: Standardized on "BMS" (Building Management System)
  - Replaced all instances of "BAS" (Building Automation System) with "BMS" in `docs/specifications/building-sections-cd-specs.md`
  - Updated 8 references including section headers and integration points
  - Maintains consistency with industry standard terminology

- **Version References**: Added archive warnings for outdated version information
  - Current versions: React 19.2.0, Three.js 0.181.2, TypeScript 5.8.2
  - Archived documents flagged with version warnings where applicable

#### Documentation
- Created `docs/CHANGELOG.md` to track all project changes
- Established changelog format following Keep a Changelog standards

### Migration Notes

**For Developers**:
- Component count is now accurately documented as 44 components
- Test coverage expectations: We're at 15% unit coverage, targeting 70% by Sprint 6
- Use "BMS" terminology for all building management system references
- Check package.json for current dependency versions (don't rely on archived docs)

**Breaking Changes**: None

**Deprecations**: None

---

## Version History Format

Each version entry should include:
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

---

*This changelog was created as part of Sprint 1 documentation cleanup initiative.*
