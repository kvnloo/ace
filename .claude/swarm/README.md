# ACE Facility Audit Swarm

## Mission
Comprehensive facility inventory, implementation mapping, and industrial architect-style construction planning for the LawnTech Dynamics autonomous indoor grass court facility.

## Swarm Configuration
- **Topology**: Adaptive (mesh → hierarchical → star)
- **Agent Count**: 12 specialized agents
- **Coordination**: Hybrid with shared memory
- **Execution**: Parallel where possible, sequential validation gates

## Agent Teams

### Documentation Analysis Swarm (4 agents)
- `facility-doc-analyst` - Parse `/docs` for facility sections
- `dev-doc-analyst` - Parse `/claudedocs` for technical specs
- `story-analyst` - Extract user stories and requirements
- `spec-reconciler` - Cross-reference all documentation sources

### Code Analysis Swarm (4 agents)
- `component-inventory` - Catalog all 30+ React components
- `feature-mapper` - Map components to facility sections
- `dependency-analyzer` - Trace component relationships
- `completion-validator` - Assess implementation status

### Planning & Synthesis Swarm (4 agents)
- `architect-coordinator` - Industrial architecture methodology
- `priority-strategist` - Construction sequencing logic
- `gap-analyzer` - Identify missing implementations
- `workflow-designer` - Create tracking system

## Deliverables Structure

```
.claude/
├── inventory/          # What exists (docs + code)
├── planning/           # How to build (priorities + phases)
├── workflows/          # How to track (ongoing system)
├── reports/            # Executive summaries
└── diagrams/           # Visual representations
```

## Coordination Protocol

All agents follow the standard hooks protocol:
1. **Pre-task**: Initialize with session restore
2. **During**: Post-edit notifications and memory updates
3. **Post-task**: Task completion and metrics export

## Status Tracking

Check `status/swarm-progress.json` for real-time progress across all 12 agents.
