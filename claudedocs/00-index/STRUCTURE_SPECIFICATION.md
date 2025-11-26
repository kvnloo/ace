# Documentation Structure Specification

**Version:** 3.0
**Date:** 2025-11-26
**Status:** Active

---

## Overview

This specification defines the organizational structure for LLM-optimized documentation in the `claudedocs/` directory. The structure follows a numbered folder convention for logical progression through the development lifecycle, with consolidated planning and streamlined navigation.

---

## Folder Structure

```
claudedocs/
├── 00-index/           # Navigation, getting started, specifications
├── 01-architecture/    # System architecture, ADRs, design decisions
├── 02-research/        # Research findings, studies, explorations
│   └── synthesis/      # Synthesized research findings
├── 03-vision/          # Strategic vision, concepts, future direction
├── 04-planning/        # Consolidated planning hub
│   ├── features/       # Feature documentation by domain
│   ├── stories/        # User stories, epics, requirements
│   ├── defects/        # Bug tracking, root cause analysis
│   ├── roadmaps/       # Strategic roadmaps and feature plans
│   ├── sprints/        # Sprint planning and tracking
│   ├── milestones/     # Project milestones
│   └── business/       # Business planning docs
├── 05-implementation/  # Implementation guides, technical specs
├── 06-testing/         # Testing guides, strategies, coverage
├── 07-operations/      # Monitoring, performance, maintenance
├── 08-workflows/       # Deployment, CI/CD, processes
└── 99-archive/         # Historical documentation (date-organized)
```

---

## Folder Purposes

### 00-index/
**Purpose:** Entry point and navigation hub
**Contents:**
- README.md - Main documentation index with quick links
- STRUCTURE_SPECIFICATION.md - This specification document
- GETTING_STARTED.md - Onboarding guide for new team members
- NAVIGATION.md - Quick reference to key documents
- Cross-references to major documentation areas

### 01-architecture/
**Purpose:** System design and architectural decisions
**Contents:**
- CORE_ARCHITECTURE.md - High-level system overview
- ADRs/ - Architecture Decision Records (numbered, dated)
- diagrams/ - System architecture diagrams
- patterns/ - Design patterns and architectural patterns
- integration/ - Third-party integration documentation
- Component interaction specifications

### 02-research/
**Purpose:** Research findings and technology evaluations
**Contents:**
- Topic-specific research documents
- Comparative analyses (technology, library, approach comparisons)
- Technology evaluations and proof-of-concepts
- External references and benchmark studies
- synthesis/ - Synthesized findings from multiple research efforts
- Research-to-decision pathways

### 03-vision/
**Purpose:** Strategic vision and future direction
**Contents:**
- APEX_VISION.md - Platform vision and goals
- Concept documents and innovation proposals
- Long-term strategic roadmap
- Future capability planning
- Product evolution documents
- Stakeholder value propositions

### 04-planning/
**Purpose:** Consolidated planning hub for all planning artifacts
**Structure:**
- **features/** - Feature documentation organized by domain
  - 3d-visualization/
  - booking-system/
  - cea-facility/
  - robotic-systems/
  - sports-facilities/
- **stories/** - User stories, epics, requirements
  - USER_STORIES.md - Main stories collection
  - epics/ - Large feature groupings
  - narratives/ - User journey documentation
  - templates/ - Story templates
- **defects/** - Bug tracking and root cause analysis
  - Active defect tracking
  - Root cause analyses
  - Resolution documentation
  - Post-mortems
- **roadmaps/** - Strategic roadmaps and feature plans
  - STRATEGIC_ROADMAP.md
  - FEATURE_INVENTORY.md
  - PLANNED_FEATURES.md
- **sprints/** - Sprint planning and tracking
  - Sprint goals and backlogs
  - Sprint retrospectives
  - Velocity tracking
- **milestones/** - Project milestone tracking
  - Milestone definitions
  - Deliverable tracking
  - Completion criteria
- **business/** - Business planning documentation
  - Business requirements
  - Stakeholder documentation
  - Business case documents

### 05-implementation/
**Purpose:** Technical implementation guides and specifications
**Contents:**
- Component implementation specifications
- API documentation and contracts
- Integration guides and procedures
- Technical specifications (e.g., GRASS_AND_TERRAIN.md)
- Code patterns and best practices
- Implementation checklists

### 06-testing/
**Purpose:** Testing strategies and documentation
**Contents:**
- TESTING_GUIDE.md - Comprehensive testing guide
- Test strategies by component/feature
- Coverage reports and requirements
- E2E test documentation
- Test data management
- Quality assurance processes

### 07-operations/
**Purpose:** Operational procedures and monitoring
**Contents:**
- PERFORMANCE_MONITORING.md - Performance tracking guide
- Maintenance procedures and schedules
- Incident response playbooks
- Health check definitions
- Monitoring dashboards
- Operational runbooks

### 08-workflows/
**Purpose:** Development processes and deployment
**Contents:**
- DEPLOYMENT_GUIDE.md - Deployment procedures
- CI/CD pipeline documentation
- Development workflows and standards
- Release processes and checklists
- Code review guidelines
- Contribution workflows

### 99-archive/
**Purpose:** Historical documentation and completed work
**Organization:** By date (YYYY-MM-DD/) with descriptive README files
**Contents:**
- Superseded documents with archival reasons
- Completed milestone documentation
- Historical troubleshooting records
- Deprecated feature documentation
- Each archive folder contains README.md explaining contents and archival date

---

## Workflow Mapping

The folder structure maps to the consolidated development lifecycle:

```
Vision (03) → Research (02) → Architecture (01)
     ↓             ↓                 ↓
Planning (04) ←─────────────────────┘
     ↓
     ├─→ Features (04/features/)
     ├─→ Stories (04/stories/)
     ├─→ Roadmaps (04/roadmaps/)
     └─→ Milestones (04/milestones/)
     ↓
Implementation (05) → Testing (06)
     ↓                      ↓
Operations (07) ← Defects (04/defects/)
     ↓
Workflows (08) → Archive (99)
```

**Lifecycle Stages:**
1. **Discovery**: 03-vision, 02-research
2. **Design**: 01-architecture
3. **Planning**: 04-planning (all planning artifacts consolidated)
4. **Implementation**: 05-implementation, 04-planning/features
5. **Validation**: 06-testing, 04-planning/defects
6. **Deployment**: 07-operations, 08-workflows
7. **Archival**: 99-archive

---

## Entity Tracking

### Products
**Tracked in:** 03-vision/, 04-planning/business/
**Format:** Product briefs with strategic goals and feature lists
**Cross-references:** Architecture decisions, feature inventory

### Projects/Milestones
**Tracked in:** 04-planning/milestones/
**Format:** Milestone documents with deliverables, timelines, and success criteria
**Cross-references:** Sprint plans, feature documentation

### Features
**Tracked in:** 04-planning/features/, 04-planning/roadmaps/FEATURE_INVENTORY.md
**Format:** Feature documentation organized by domain with specifications
**Cross-references:** User stories, architecture decisions, implementation guides

### Stories
**Tracked in:** 04-planning/stories/
**Format:** User stories with acceptance criteria, priority, and effort estimates
**Cross-references:** Features, epics, sprint backlogs

### Tasks
**Tracked in:** GitHub Issues (external)
**Link:** Reference issue numbers in documentation with context
**Integration:** Sprint planning links to GitHub Projects

### Defects
**Tracked in:** 04-planning/defects/
**Format:** Bug reports with severity, root cause analysis, and resolution paths
**Cross-references:** Test documentation, operations incidents

### Architecture Decisions
**Tracked in:** 01-architecture/ADRs/
**Format:** ADR template (Title, Status, Context, Decision, Consequences, Alternatives)
**Naming:** YYYYMMDD-NNN-title.md (date-sequence-title)

### Sprints
**Tracked in:** 04-planning/sprints/
**Format:** Sprint goals, backlog, capacity, retrospectives
**Cross-references:** Stories, milestones, velocity metrics

---

## File Naming Conventions

- **UPPERCASE.md** - Major documents (README.md, CORE_ARCHITECTURE.md, TESTING_GUIDE.md)
- **Title_Case.md** - Feature/topic documents (Grass_And_Terrain.md)
- **lowercase-hyphen.md** - Supporting documents (sprint-template.md, defect-analysis.md)
- **YYYY-MM-DD_topic.md** - Date-prefixed archive documents
- **YYYYMMDD-NNN-title.md** - Architecture Decision Records (ADRs)

**Directory Naming:**
- Lowercase with hyphens for multi-word directories (e.g., `3d-visualization/`)
- Short, descriptive names without version numbers
- Consistent with folder purpose

---

## Planning Hub Rationale

The consolidation of planning artifacts under `04-planning/` provides:

1. **Single Source of Truth**: All planning-related documentation in one location
2. **Logical Grouping**: Related planning artifacts (features, stories, defects, roadmaps) are co-located
3. **Simplified Navigation**: Clear hierarchy from high-level roadmaps down to individual stories
4. **Workflow Clarity**: Planning phase clearly separated from implementation and operations
5. **Reduced Cognitive Load**: Fewer top-level folders to navigate

**Migration Benefits:**
- Former 05-features → 04-planning/features (planning artifact)
- Former 09-planning → 04-planning/roadmaps (consolidated)
- Former 10-stories → 04-planning/stories (co-located with features)
- Former 11-defects → 04-planning/defects (planning/tracking artifact)
- Former 12-vision → 03-vision (strategic, pre-planning)

---

## Related Documentation

- **docs/** - Human-developer documentation (user guides, API docs for external developers)
- **GitHub Issues** - Active task tracking and bug reports
- **GitHub Projects** - Sprint boards and kanban views
- **claudedocs/** - LLM-optimized documentation (this structure)

**Integration Points:**
- GitHub Issues reference claudedocs for context
- Sprint plans in 04-planning/sprints/ link to GitHub Projects
- ADRs in 01-architecture/ inform implementation guides in 05-implementation/

---

## Document Lifecycle

```
Draft → Review → Active → Superseded → Archived
  ↓       ↓        ↓          ↓           ↓
(WIP)  (Review) (Current)  (Outdated)  (99-archive/)
```

**Status Indicators in Frontmatter:**
```yaml
---
status: draft | review | active | superseded | archived
version: X.Y
last_updated: YYYY-MM-DD
superseded_by: path/to/new/document.md (if applicable)
---
```

---

## Best Practices

1. **One Source of Truth**: Each topic has a single canonical document
2. **Cross-Reference Liberally**: Link related documents for context
3. **Date Everything**: Include creation and update dates
4. **Version Control**: Use semantic versioning for major documents
5. **Archive Don't Delete**: Move outdated docs to 99-archive/ with explanation
6. **Maintain README**: Each subdirectory should have a README explaining its contents
7. **Use Consistent Formatting**: Follow markdown standards and heading hierarchy
8. **Update Navigation**: Keep 00-index/README.md and NAVIGATION.md current

---

**Last Updated:** 2025-11-26
**Version:** 3.0
**Owner:** Documentation Team
**Change Summary:** Consolidated planning structure, eliminated legacy folders, streamlined navigation
