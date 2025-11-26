# Documentation Structure Specification

**Version:** 2.0
**Date:** 2025-11-26
**Status:** Active

---

## Overview

This specification defines the organizational structure for LLM-optimized documentation in the `claudedocs/` directory. The structure follows a numbered folder convention for logical progression through the development lifecycle.

---

## Folder Structure

```
claudedocs/
├── 00-index/           # Navigation, getting started, specifications
├── 01-architecture/    # System architecture, ADRs, design decisions
├── 02-research/        # Research findings, studies, explorations
├── 03-analysis/        # Code analysis, audits, reviews
├── 04-implementation/  # Implementation guides, technical specs
├── 05-features/        # Feature documentation organized by area
├── 06-testing/         # Testing guides, strategies, coverage
├── 07-operations/      # Monitoring, performance, maintenance
├── 08-workflows/       # Deployment, CI/CD, processes
├── 09-planning/        # Roadmaps, feature inventory, milestones
├── 10-stories/         # User stories, epics, requirements
├── 11-defects/         # Bug tracking, root cause analysis
├── 12-vision/          # Strategic vision, concepts, future direction
└── 99-archive/         # Historical documentation (date-organized)
```

---

## Folder Purposes

### 00-index/
**Purpose:** Entry point and navigation
**Contents:**
- README.md - Main documentation index
- STRUCTURE_SPECIFICATION.md - This file
- GETTING_STARTED.md - Onboarding guide
- NAVIGATION.md - Quick links to key documents

### 01-architecture/
**Purpose:** System design and architectural decisions
**Contents:**
- CORE_ARCHITECTURE.md - System overview
- ADRs/ - Architecture Decision Records
- diagrams/ - System diagrams
- patterns/ - Design patterns used

### 02-research/
**Purpose:** Research findings before implementation
**Contents:**
- Topic-specific research documents
- Comparative analyses
- Technology evaluations
- External references

### 03-analysis/
**Purpose:** Code and system analysis outputs
**Contents:**
- Code quality audits
- Performance analyses
- Security reviews
- Technical debt assessments

### 04-implementation/
**Purpose:** Technical implementation guides
**Contents:**
- Component specifications
- API documentation
- Integration guides
- Technical specifications (e.g., GRASS_AND_TERRAIN.md)

### 05-features/
**Purpose:** Feature documentation by domain
**Contents:**
- Subdirectories by feature area:
  - 3d-visualization/
  - booking-system/
  - cea-facility/
  - robotic-systems/
  - sports-facilities/

### 06-testing/
**Purpose:** Testing documentation
**Contents:**
- TESTING_GUIDE.md
- Test strategies
- Coverage reports
- E2E test documentation

### 07-operations/
**Purpose:** Operational documentation
**Contents:**
- PERFORMANCE_MONITORING.md
- Maintenance procedures
- Incident response
- Health checks

### 08-workflows/
**Purpose:** Process and deployment documentation
**Contents:**
- DEPLOYMENT_GUIDE.md
- CI/CD pipelines
- Development workflows
- Release processes

### 09-planning/
**Purpose:** Project planning and roadmaps
**Contents:**
- STRATEGIC_ROADMAP.md
- FEATURE_INVENTORY.md
- PLANNED_FEATURES.md
- Milestone tracking

### 10-stories/
**Purpose:** User stories and requirements
**Contents:**
- USER_STORIES.md - Main stories document
- epics/ - Large feature groupings
- narratives/ - User journey documentation
- templates/ - Story templates

### 11-defects/
**Purpose:** Bug tracking and analysis
**Contents:**
- Active defects
- Root cause analyses
- Resolution documentation
- Post-mortems

### 12-vision/
**Purpose:** Strategic and conceptual documentation
**Contents:**
- APEX_VISION.md - Platform vision
- Concept documents
- Future roadmap
- Innovation ideas

### 99-archive/
**Purpose:** Historical documentation
**Organization:** By date (YYYY-MM-DD/)
**Contents:**
- Superseded documents
- Completed milestone documentation
- Historical troubleshooting records
- Each archive folder has a README.md explaining contents

---

## Workflow Mapping

The folder structure maps to the development lifecycle:

```
Research (02) → Analysis (03) → Architecture (01) → Planning (09)
     ↓              ↓                ↓                  ↓
Stories (10) → Implementation (04) → Features (05) → Testing (06)
     ↓              ↓                ↓                  ↓
Defects (11) → Operations (07) → Workflows (08) → Archive (99)
```

**Lifecycle Stages:**
1. **Discovery**: 02-research, 12-vision
2. **Analysis**: 03-analysis
3. **Design**: 01-architecture
4. **Planning**: 09-planning, 10-stories
5. **Implementation**: 04-implementation, 05-features
6. **Validation**: 06-testing, 11-defects
7. **Deployment**: 07-operations, 08-workflows
8. **Archival**: 99-archive

---

## Entity Tracking

### Products
Tracked in: 12-vision/, 09-planning/
Format: Product briefs with feature lists

### Projects/Milestones
Tracked in: 09-planning/
Format: Milestone documents with deliverables

### Features
Tracked in: 05-features/, 09-planning/FEATURE_INVENTORY.md
Format: Feature documentation by domain

### Stories
Tracked in: 10-stories/
Format: User stories with acceptance criteria

### Tasks
Tracked in: GitHub Issues (external)
Link: Reference issue numbers in documentation

### Defects
Tracked in: 11-defects/
Format: Bug reports with root cause analysis

### Architecture Decisions
Tracked in: 01-architecture/ADRs/
Format: ADR template (Status, Context, Decision, Consequences)

---

## File Naming Conventions

- **UPPERCASE.md** - Major documents (README.md, CORE_ARCHITECTURE.md)
- **Title_Case.md** - Feature/topic documents
- **lowercase-hyphen.md** - Supporting documents
- **YYYY-MM-DD_topic.md** - Date-prefixed archive documents

---

## Migration from claudedocs-old

### Source Mapping
| claudedocs-old/ | claudedocs/ |
|-----------------|-------------|
| 01-architecture/ | 01-architecture/ |
| 02-implementation-guides/ | 04-implementation/ |
| 03-testing/ | 06-testing/ |
| 04-monitoring/ | 07-operations/ |
| 05-workflows/ | 08-workflows/ |
| 06-research/ | 02-research/ |
| 07-features/ | 05-features/ |
| 08-stories/ | 10-stories/ |
| 09-milestones/ | 09-planning/ |
| systems-detail/ | 05-features/ (by domain) |
| troubleshooting/ | 99-archive/ (resolved issues) |

### Preservation Rules
- ALL files from claudedocs-old preserved
- Root clutter consolidated into appropriate numbered folders
- Enhanced documents (e.g., GRASS_AND_TERRAIN.md) kept in new location
- Archive items organized by date with README explanations

---

## Related Documentation

- **docs/** - Human-developer documentation (separate from claudedocs)
- **GitHub Issues** - Task and bug tracking
- **GitHub Projects** - Sprint planning and boards

---

**Last Updated:** 2025-11-26
**Owner:** Documentation Team
