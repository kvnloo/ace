# Documentation Navigation Guide

## Quick Links

### For Developers
- **[README.md](./README.md)** - Start here! Project overview and quick start
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development workflows and guidelines
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design
- **[API.md](./API.md)** - Component and hook API reference

### For LLMs (Software Architecture)
- **[claudedocs/](../claudedocs/)** - Detailed technical documentation
- **[claudedocs/01-architecture/](../claudedocs/01-architecture/)** - Detailed architecture
- **[claudedocs/06-testing/](../claudedocs/06-testing/)** - Test guides and reports
- **[claudedocs/99-archive/](../claudedocs/99-archive/)** - Historical reports

### For Facility Design (Physical Architecture)
- **[FACILITY_STATUS.md](../claudedocs/09-planning/FACILITY_STATUS.md)** - Overall facility completion (47%)
- **[APEX_VISION.md](../claudedocs/12-vision/APEX_VISION.md)** - Strategic vision concept
- **[cea-facility/](../claudedocs/05-features/cea-facility/)** - Vertical farming (L3 Floor)
- **[sports-facilities/](../claudedocs/02-research/sports-facilities/)** - HVAC, lighting, accessibility research

## Documentation Philosophy

### docs/ (This Directory)
**Purpose:** Essential information for human developers
**Audience:** Developers joining the project
**Content:** Clear, concise, actionable guides

**Rules:**
- Maximum 5-6 files
- Each file serves a specific purpose
- No test reports or debug logs
- No screenshots or HTML artifacts
- Updated when architecture or APIs change

### claudedocs/
**Purpose:** Detailed technical context for LLMs and deep dives
**Audience:** AI assistants, debugging sessions, historical reference
**Content:** Test reports, debug sessions, detailed specs

**Rules:**
- Organized by category
- Preserve historical information
- Include test artifacts and screenshots
- Detailed implementation notes
- Technical specifications

## Finding Information

### "How do I get started?"
→ [README.md](./README.md)

### "How does the system work?"
→ [ARCHITECTURE.md](./ARCHITECTURE.md)

### "How do I develop a feature?"
→ [DEVELOPMENT.md](./DEVELOPMENT.md)

### "What are the component APIs?"
→ [API.md](./API.md)

### "I need detailed implementation notes"
→ [claudedocs/](../claudedocs/)

### "I need test reports or debug history"
→ [claudedocs/99-archive/](../claudedocs/99-archive/)

## Contributing to Documentation

### Adding to docs/
Only add if it's:
- Essential for understanding the project
- Needed by every developer
- General enough to stay relevant

**Don't add:**
- Test reports → claudedocs/06-testing/
- Debug logs → claudedocs/99-archive/
- One-off analyses → claudedocs/99-archive/
- Screenshots → claudedocs/99-archive/

### Adding to claudedocs/
Organize by category:
- `01-architecture/` - Detailed system design
- `02-research/` - Research and investigation
- `05-features/` - Feature documentation
- `06-testing/` - Test guides and setup
- `09-planning/` - Planning and status tracking
- `12-vision/` - Strategic vision documents
- `99-archive/` - Historical reports and analyses

## Documentation Standards

### Markdown Style
- Use clear headings (H1, H2, H3)
- Code blocks with language specification
- Links to related docs
- Examples where helpful

### Code Examples
```typescript
// ✅ Good: Shows complete, working code
import { Component } from './Component';

function App() {
  return <Component prop="value" />;
}

// ❌ Bad: Incomplete or unclear
// ... some code ...
```

### Keep It Updated
- Review docs when APIs change
- Archive outdated content to claudedocs/
- Update README when project scope changes
- Verify examples still work

## File Structure

```
docs/
├── README.md          # Project overview ⭐
├── ARCHITECTURE.md    # System design ⭐
├── DEVELOPMENT.md     # Dev workflows ⭐
├── API.md             # API reference ⭐
└── NAVIGATION.md      # This file

claudedocs/
├── 01-architecture/   # Detailed architecture
├── 02-research/       # Research and investigation
├── 05-features/       # Feature documentation
├── 06-testing/        # Test documentation
├── 09-planning/       # Planning and status
├── 12-vision/         # Strategic vision
├── 99-archive/        # Historical reports
└── [other categories]
```

---

**Last Updated:** 2025-11-26
**Cleanup:** Reduced from 375 files to 5 essential docs
