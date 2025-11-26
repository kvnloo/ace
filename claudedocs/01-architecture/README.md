# Architecture & Design Documentation

High-level system architecture, design specifications, and layout documentation for the ACE 3D visualization project.

## Documents in This Section

### Court Layout & Configuration
- **[COURT_LAYOUT.md](COURT_LAYOUT.md)** - Complete facility layout with dimensions and court configurations
- **[court-labels-3d-fix.md](court-labels-3d-fix.md)** - 3D floating label system implementation
- **[court-labels-visual-summary.md](court-labels-visual-summary.md)** - Visual guide to court labeling system

## Overview

This section contains the architectural foundation of the ACE project:

1. **Facility Layout** - Physical layout of all courts and floors
2. **3D Scene Structure** - How the 3D visualization is organized
3. **Component Architecture** - Design patterns for visual components
4. **Labeling Systems** - Interactive label and annotation systems

## Key Concepts

### Multi-Floor Layout
The facility spans multiple floors:
- Ground Floor: Tennis courts (grass, hard, clay, wood)
- First Floor: Badminton, squash, table tennis
- Second Floor: Pickleball, real tennis
- Third Floor: Vertical grass lab

### 3D Visualization Architecture
- Three.js scene graph structure
- React Three Fiber component hierarchy
- Interactive elements and hotspots
- Camera controls and navigation

### Design Patterns
- Modular court components
- Reusable visual elements
- Consistent styling and theming
- Responsive layout systems

## Related Documentation

- **Implementation Guides:** [../05-implementation/](../05-implementation/)
- **Planning Hub:** [../04-planning/](../04-planning/)
- **Main Documentation:** [../README.md](../README.md)

---

[← Back to Documentation Home](../README.md)
