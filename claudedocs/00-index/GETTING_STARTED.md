# Getting Started with ACE Documentation

**Version:** 1.0
**Date:** 2025-11-26
**Status:** Active

---

## Overview

This guide helps you navigate ACE documentation based on your role and goals.

---

## For Developers (docs/)

### Quick Path
1. Start with `docs/README.md` - Project overview and quick start
2. Review `docs/ARCHITECTURE.md` - System design and patterns
3. Check `docs/DEVELOPMENT.md` - Development workflows

### Key Resources
| Document | Purpose |
|----------|---------|
| `docs/README.md` | Project overview, quick start commands |
| `docs/ARCHITECTURE.md` | System architecture decisions |
| `docs/DEVELOPMENT.md` | Contributing guidelines |
| `docs/API.md` | Component and service API reference |

---

## For LLMs (claudedocs/)

### Quick Path
1. Start with `00-index/STRUCTURE_SPECIFICATION.md` - Documentation taxonomy
2. Load `04-planning/` for current project state
3. Reference `05-implementation/` for technical specs

### Folder Quick Reference

| Folder | Purpose | When to Use |
|--------|---------|-------------|
| `00-index/` | Navigation, specs | Finding your way |
| `01-architecture/` | System design, ADRs | Understanding architecture |
| `02-research/` | Research, synthesis | Technology exploration |
| `03-vision/` | Strategic vision | Understanding goals |
| `04-planning/` | All planning artifacts | Project status, features, stories |
| `05-implementation/` | Technical specs | Implementation details |
| `06-testing/` | Test strategies | Quality assurance |
| `07-operations/` | Monitoring, maintenance | Production concerns |
| `08-workflows/` | Deployment, CI/CD | Process documentation |
| `99-archive/` | Historical docs | Reference only |

---

## Quick Navigation

### I want to...

| Goal | Go To |
|------|-------|
| Understand the project | `docs/README.md` |
| See current status | `04-planning/FACILITY_STATUS.md` |
| Find feature docs | `04-planning/features/` |
| Check implementation specs | `05-implementation/` |
| See vision/concepts | `03-vision/APEX_VISION.md` |
| View research | `02-research/` |
| Find user stories | `04-planning/stories/` |
| Track defects | `04-planning/defects/` |
| Check test coverage | `06-testing/` |
| Deployment procedures | `08-workflows/DEPLOYMENT_GUIDE.md` |

---

## Documentation Types

### Human-Developer Docs (`docs/`)
- Concise, action-oriented
- API references and guides
- Quick start instructions
- External developer audience

### LLM-Optimized Docs (`claudedocs/`)
- Comprehensive context
- Cross-references and links
- Planning artifacts
- Research and synthesis
- Structured for AI consumption

---

## Key Documents

### Architecture
- `01-architecture/CORE_ARCHITECTURE.md` - Core system architecture
- `01-architecture/details/` - Detailed architecture docs

### Planning Hub
- `04-planning/STRATEGIC_ROADMAP.md` - Development roadmap
- `04-planning/FEATURE_INVENTORY.md` - Feature catalog
- `04-planning/FACILITY_STATUS.md` - Current status
- `04-planning/features/` - Feature documentation by domain
- `04-planning/stories/` - User stories and epics
- `04-planning/defects/` - Bug tracking
- `04-planning/sprints/` - Sprint planning
- `04-planning/milestones/` - Project milestones

### Vision
- `03-vision/APEX_VISION.md` - APEX health facility vision

### Research
- `02-research/synthesis/` - Synthesized research findings
- `02-research/sports-facilities/` - Sports facility research

---

## Tips for Effective Navigation

1. **Start with README files** - Each folder has a README explaining contents
2. **Use cross-references** - Documents link to related content
3. **Check dates** - Look for last_updated to assess currency
4. **Reference STRUCTURE_SPECIFICATION** - Canonical source for organization

---

**Last Updated:** 2025-11-26
**Version:** 1.0
**Owner:** Documentation Team
