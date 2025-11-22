# Documentation Structure Proposal
**Date:** 2025-11-22
**Purpose:** Detailed plan for organizing facility documentation in `docs/`

---

## Vision: Dual Documentation System

The ACE project contains two distinct documentation needs:

### 📚 `docs/` - Facility Documentation
**Purpose:** Human-readable documentation about the physical/conceptual facility
**Audience:** Investors, stakeholders, facility planners, architects, business analysts
**Focus:** What the facility IS and DOES

### 💻 `claudedocs/` - Developer Documentation
**Purpose:** Technical documentation for the 3D visualization web application
**Audience:** Software developers, QA engineers, DevOps, technical contributors
**Focus:** How the CODE works and is deployed

---

## Proposed `docs/` Directory Structure

```
docs/
├── README.md                                    # 🏠 Master navigation hub
│
├── concepts/                                     # 💡 Vision & Business Concepts
│   ├── README.md                                #    Overview of facility concepts
│   └── APEX-Facility-Summary.md                 #    Health optimization facility vision
│
├── architecture/                                 # 🏗️ Facility Design & Systems
│   ├── README.md                                #    Architecture overview
│   ├── facility-blueprint.md                    #    Consolidated facility design
│   ├── digital-twin-architecture.md             #    Unity digital twin (planning mode)
│   └── facility-architecture.md                 #    Multi-agent systems & components
│
├── specifications/                               # 📋 Technical Specifications
│   ├── README.md                                #    Specification index
│   ├── court-specifications.md                  #    (Future) Court dimensions & materials
│   ├── sensor-specifications.md                 #    (Future) IoT sensor requirements
│   └── infrastructure-specifications.md         #    (Future) Building & utilities
│
├── operations/                                   # ⚙️ Operational Guides
│   ├── README.md                                #    Operations overview
│   ├── facility-operations.md                   #    (Future) Day-to-day operations
│   ├── maintenance-procedures.md                #    (Future) Maintenance schedules
│   └── safety-protocols.md                      #    (Future) Safety & emergency
│
├── research/                                     # 🔬 Research & Analysis
│   ├── README.md                                #    Research index
│   ├── market-research.md                       #    (Future) Market analysis
│   ├── feasibility-studies.md                   #    (Future) Technical feasibility
│   └── competitive-analysis.md                  #    (Future) Competitor analysis
│
├── business/                                     # 💼 Business Planning
│   ├── README.md                                #    Business documentation index
│   ├── business-model.md                        #    (Future) Revenue & pricing
│   ├── financial-projections.md                 #    (Future) Financial models
│   └── partnership-opportunities.md             #    (Future) Strategic partnerships
│
└── archive/                                      # 📦 Historical Documentation
    ├── README.md                                #    Archive index
    └── DOCUMENTATION_ORGANIZATION_COMPLETE.md   #    Previous reorganization record
```

---

## File Movement Plan

### Phase 1: Immediate Moves (Facility Concept Documents)

#### From Project Root
| Source | Destination | Reason |
|--------|-------------|--------|
| `APEX-Facility-Summary.md` | `docs/concepts/APEX-Facility-Summary.md` | Health optimization facility concept |
| `docs/blueprint.md` | `docs/architecture/facility-blueprint.md` | Consolidated facility design spec |

#### From claudedocs/06-research/
| Source | Destination | Reason |
|--------|-------------|--------|
| `digital-twin-architecture.md` | `docs/architecture/digital-twin-architecture.md` | Unity facility planning tool |
| `facility-architecture.md` | `docs/architecture/facility-architecture.md` | Facility systems & components |

#### Archive Old Status Documents
| Source | Destination | Reason |
|--------|-------------|--------|
| `DOCUMENTATION_ORGANIZATION_COMPLETE.md` | `docs/archive/DOCUMENTATION_ORGANIZATION_COMPLETE.md` | Historical record |

### Phase 2: Stay in claudedocs/ (Code Documentation)

**Explicitly NOT moving:**
- `claudedocs/01-architecture/` - **3D scene code architecture**
- `claudedocs/02-implementation-guides/` - **React/Three.js coding guides**
- `claudedocs/03-testing-quality/` - **Web app testing**
- `claudedocs/04-monitoring-operations/` - **App monitoring & performance**
- `claudedocs/05-workflows/` - **CI/CD & deployment**
- `claudedocs/06-research/FACILITY-MASTER-OVERVIEW.md` - **Tennis court 3D viz research**
- `claudedocs/06-research/people_animation_research.md` - **3D character animation**
- `claudedocs/06-research/investigation/` - **Visual element rendering**

### Phase 3: Create New README Files

All new directories need comprehensive README files with:
1. **Purpose** - What this section contains
2. **Audience** - Who should read these docs
3. **Quick Links** - Navigation to key documents
4. **Related Documentation** - Cross-references to code docs where appropriate

---

## README Content Templates

### `docs/README.md` (Master Index)

```markdown
# ACE Facility Documentation

Welcome to the facility documentation for the ACE project. This documentation focuses on the **facility concept, architecture, and operations** of the autonomous racket sports and health optimization facility.

> **Looking for code documentation?** See [claudedocs/](../claudedocs/README.md) for developer documentation about the 3D visualization web application.

## Quick Navigation

### Understand the Vision
- [APEX Facility Concept](concepts/APEX-Facility-Summary.md) - Health optimization facility vision
- [Facility Blueprint](architecture/facility-blueprint.md) - Consolidated design

### Explore the Architecture
- [Digital Twin Architecture](architecture/digital-twin-architecture.md) - Unity planning system
- [Facility Architecture](architecture/facility-architecture.md) - Multi-agent systems

### Documentation by Role

#### For Investors & Stakeholders
- [Business Concepts](concepts/) - Vision and value proposition
- [Business Planning](business/) - Revenue models and projections

#### For Architects & Planners
- [Facility Architecture](architecture/) - Design specifications
- [Technical Specifications](specifications/) - Detailed requirements

#### For Facility Operators
- [Operational Guides](operations/) - Day-to-day procedures
- [Maintenance](operations/) - Upkeep and safety

#### For Researchers
- [Research & Analysis](research/) - Market research and feasibility

## Relationship to Code Documentation

The ACE project has **two parallel documentation systems**:

### 📚 `docs/` (This Directory)
- **Focus:** The facility itself (concept, architecture, operations)
- **Audience:** Non-technical stakeholders, facility planners
- **Content:** What the facility IS and HOW IT OPERATES

### 💻 `claudedocs/`
- **Focus:** The 3D visualization web application
- **Audience:** Software developers, technical contributors
- **Content:** How the CODE works and is deployed

**Example:**
- `docs/architecture/facility-blueprint.md` describes the **physical facility layout**
- `claudedocs/01-architecture/COURT_LAYOUT.md` describes the **code structure for rendering courts**

---

**Last Updated:** 2025-11-22
```

### `docs/concepts/README.md`

```markdown
# Facility Concepts

High-level vision and business concepts for the autonomous facility.

## Documents in This Section

### APEX Facility
- [APEX-Facility-Summary.md](APEX-Facility-Summary.md) - Complete health optimization facility concept
  - Performance metrics and outcomes
  - Business model and revenue streams
  - Technology stack and implementation roadmap

## Purpose

This section contains **conceptual and vision documents** that describe:
- What the facility aims to achieve
- Who it serves and how
- Business value and market opportunity
- High-level technical approach

## Audience

- Investors and stakeholders
- Strategic partners
- Business development teams
- Executive leadership

## Related Documentation

- **Architecture:** [../architecture/](../architecture/) - Detailed facility design
- **Business Planning:** [../business/](../business/) - Financial models
- **Code Implementation:** [../../claudedocs/](../../claudedocs/) - 3D visualization app
```

### `docs/architecture/README.md`

```markdown
# Facility Architecture

Detailed architectural designs and technical systems for the autonomous facility.

## Documents in This Section

### Core Architecture
- [facility-blueprint.md](facility-blueprint.md) - Consolidated design specification
  - Racket sports facility layout
  - Health optimization facility
  - Vertical farming integration
  - Multi-agent orchestration

### Digital Twin System
- [digital-twin-architecture.md](digital-twin-architecture.md) - Unity digital twin planning
  - Pre-construction visualization
  - Operational simulation
  - Cost estimation integration
  - AI training environment

### System Architecture
- [facility-architecture.md](facility-architecture.md) - Technical systems and components
  - Hierarchical agent system
  - Facility components (courts, sensors, farming)
  - Data integration layer
  - Control systems

## Purpose

This section contains **architectural blueprints** that describe:
- Physical facility layout and design
- Technical systems and infrastructure
- Digital twin and simulation systems
- Agent-based control architecture

## Audience

- Solution architects
- Facility designers
- Systems engineers
- Technical planners

## Related Documentation

- **Specifications:** [../specifications/](../specifications/) - Detailed technical specs
- **3D Visualization Code:** [../../claudedocs/01-architecture/](../../claudedocs/01-architecture/) - Code architecture
```

### `docs/archive/README.md`

```markdown
# Documentation Archive

Historical documentation for reference purposes.

> **⚠️ Note:** Archived documents may be outdated. For current documentation, see the parent directories.

## Archived Documents

- [DOCUMENTATION_ORGANIZATION_COMPLETE.md](DOCUMENTATION_ORGANIZATION_COMPLETE.md) - Previous reorganization (2025-11-22)

## Purpose

This archive preserves historical documentation that:
- Has been superseded by newer documents
- Provides historical context for decisions
- May contain useful reference information
- Should not be used for current development

## When to Archive

Documents should be moved here when:
1. They describe outdated processes or systems
2. They have been replaced by newer, comprehensive docs
3. They are no longer relevant to current operations
4. They are valuable for historical context only
```

---

## Cross-Reference Strategy

### Linking Facility Docs ↔ Code Docs

**In facility docs (`docs/`):**
```markdown
> **Implementation Status:** See [claudedocs/06-research/FACILITY-MASTER-OVERVIEW.md](../claudedocs/06-research/FACILITY-MASTER-OVERVIEW.md) for current 3D visualization implementation.
```

**In code docs (`claudedocs/`):**
```markdown
> **Facility Context:** For the conceptual facility design, see [docs/architecture/facility-blueprint.md](../docs/architecture/facility-blueprint.md)
```

### Main Project README Updates

Add clear signposting in the main `README.md`:

```markdown
## Documentation

### 📚 Facility Documentation
Learn about the autonomous racket sports and health optimization facility concept:
- **[Facility Documentation →](docs/README.md)** - Concepts, architecture, and operations

### 💻 Developer Documentation
Technical documentation for the 3D visualization web application:
- **[Developer Documentation →](claudedocs/README.md)** - Code, testing, and deployment
```

---

## Implementation Steps

### Step 1: Create Directory Structure
```bash
mkdir -p docs/concepts
mkdir -p docs/architecture
mkdir -p docs/specifications
mkdir -p docs/operations
mkdir -p docs/research
mkdir -p docs/business
mkdir -p docs/archive
```

### Step 2: Create All README Files
- `docs/README.md` (master index)
- `docs/concepts/README.md`
- `docs/architecture/README.md`
- `docs/specifications/README.md`
- `docs/operations/README.md`
- `docs/research/README.md`
- `docs/business/README.md`
- `docs/archive/README.md`

### Step 3: Move Files
```bash
# From root
mv APEX-Facility-Summary.md docs/concepts/

# Rename and move blueprint
mv docs/blueprint.md docs/architecture/facility-blueprint.md

# From claudedocs research
mv claudedocs/06-research/digital-twin-architecture.md docs/architecture/
mv claudedocs/06-research/facility-architecture.md docs/architecture/

# Archive old status docs
mv DOCUMENTATION_ORGANIZATION_COMPLETE.md docs/archive/
```

### Step 4: Update Cross-References
- Update any links in moved files to point to new locations
- Add cross-references between facility docs and code docs
- Update main README.md with documentation section

### Step 5: Clean Up Root Directory
- Remove duplicate status documents if they exist in both root and claudedocs
- Verify no orphaned documentation

### Step 6: Verification
- [ ] All facility docs in `docs/`
- [ ] All code docs in `claudedocs/`
- [ ] No broken links
- [ ] Clear navigation from main README
- [ ] Cross-references work both ways

---

## Maintenance Guidelines

### Adding New Facility Documentation

1. **Determine category:**
   - Concepts: High-level vision and business
   - Architecture: Technical design and systems
   - Specifications: Detailed technical requirements
   - Operations: Procedures and guides
   - Research: Analysis and studies
   - Business: Financial and strategic planning

2. **Create document** with:
   - Clear filename (lowercase-with-hyphens.md)
   - Header with document type, audience, last updated
   - Cross-references to related docs (both facility and code)

3. **Update category README** with new document link

4. **Update master `docs/README.md`** if significant

### Keeping Docs in Sync

**Monthly maintenance:**
- Review cross-references between `docs/` and `claudedocs/`
- Update "Last Updated" dates
- Archive outdated documents
- Check for broken links

---

## Benefits of This Structure

### Clear Separation of Concerns
- **Facility docs** focus on WHAT and WHY
- **Code docs** focus on HOW and IMPLEMENTATION

### Better Navigation
- Role-based navigation (investor, architect, developer)
- Clear master indexes
- Comprehensive cross-referencing

### Scalability
- Easy to add new facility documentation
- Room for future sections (legal, compliance, etc.)
- Archive system for historical docs

### Professional Presentation
- Stakeholder-friendly facility documentation
- Developer-focused technical documentation
- Clear relationship between the two

---

**Prepared by:** Documentation Organization Agent
**Status:** Ready for implementation
**Estimated Time:** 30-45 minutes
