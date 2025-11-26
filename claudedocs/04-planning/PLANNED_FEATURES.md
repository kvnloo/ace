# Planned Features Backlog

**Imported from:** claudedocs-old/07-features/PLANNED_FEATURES.md
**Status:** Active development planning
**Last Updated:** 2025-11-26

---

## Current Sprint Features

### Enhanced Ground Textures - Clay Court Effect
**Status:** 🔄 In Progress | **Priority:** P0

**Requirements:**
- Clay court color (terracotta/red-orange)
- Surface roughness and material properties
- Realistic texture mapping with LOD support
- 1024x1024 base texture with normal/specular maps

**Success Metrics:**
- Realistic appearance, maintain 60fps, mobile compatible

---

### Performance Optimization - Lazy Loading
**Status:** 🔄 In Progress | **Priority:** P0

**Requirements:**
- React Suspense for component lazy loading
- Progressive texture loading with progress tracking
- Vite code splitting, loading skeletons

**Success Metrics:**
- FCP <1.8s, TTI <2.8s, bundle size -20%

---

## Next Sprint Backlog

### Advanced Lighting and Shadows
**Priority:** P1 | **Effort:** 5-8 days

- Realistic shadow casting from net, posts, players
- Ambient occlusion for depth perception
- Time-of-day lighting variations
- Shadow render cost <5ms per frame

---

### Interactive Camera Controls
**Priority:** P1 | **Effort:** 5-7 days

- Orbit (drag rotate), zoom (scroll/pinch), pan
- Preset positions: player view, aerial, sideline
- Smooth transitions, mobile touch support

---

### Facility Amenities Catalog Enhancement
**Priority:** P1 | **Effort:** 3-5 days

- Modal popup with image gallery
- Availability status, booking hooks
- Filter and search functionality

---

## Future Backlog (Q1-Q2 2026)

### Photo-realistic Court Surface Materials
**Priority:** P0 | **Effort:** 10-15 days

- High-res PBR textures (base color, normal, roughness, displacement)
- Multiple court types with real-time switching
- Texture streaming/LOD system

---

### Virtual Facility Tours
**Priority:** P0 | **Effort:** 12-20 days

- Spline-based camera path system
- Information overlay hotspots
- Audio narration support
- 60-180 second tours, >70% completion target

---

### Court Booking Integration UI
**Priority:** P0 | **Effort:** 15-20 days

- Calendar-based availability view
- Time slot selection, court selection
- Booking form with backend API integration
- >80% completion rate target

---

### Environmental Effects - Weather & Time of Day
**Priority:** P1 | **Effort:** 10-15 days

- Sky system with sun positioning
- Weather effects (clouds, rain particles)
- Wet surface materials
- <10% frame time impact

---

### Mobile Gesture Controls
**Priority:** P0 | **Effort:** 7-10 days

- Swipe to rotate, pinch to zoom, two-finger pan
- Tap to select, visual feedback
- Cross-platform (iOS/Android)

---

### Accessibility Improvements - WCAG AA
**Priority:** P1 | **Effort:** 8-12 days

- Keyboard navigation, screen reader support
- ARIA labels, focus management
- Color contrast compliance
- Reduced motion support

---

### Multi-language Support
**Priority:** P1 | **Effort:** 6-10 days

Languages: English, Spanish, French, German, Mandarin
- i18next integration
- RTL layout support
- Language persistence

---

### VR/AR Support Exploration
**Priority:** P1 | **Effort:** 15-25 days + Research

- WebXR API integration
- VR headset support (Quest, PSVR)
- AR device support (ARCore, ARKit)
- 90fps VR performance target

---

## Feature Dependencies Graph

```
Current:
  Enhanced Ground Textures
  Performance Optimization

Next Sprint:
  Advanced Lighting ← Ground Textures
  Interactive Camera Controls
  Amenities Enhancement

Q1 2026:
  Photo-realistic Materials ← Ground Textures + Performance
  Environmental Effects ← Advanced Lighting
  Accessibility

Q2 2026:
  Virtual Tours ← Camera Controls + Lighting
  Court Booking UI
  Mobile Gestures ← Camera Controls
  Multi-language
  VR/AR ← Photo-realistic + Performance
```

---

## Prioritization Matrix

### P0 - Critical (Do First)
- Enhanced Ground Textures
- Performance Optimization
- Mobile Gesture Controls
- Photo-realistic Materials
- Virtual Tours
- Court Booking UI

### P1 - Important (Plan Carefully)
- Advanced Lighting
- Interactive Camera Controls
- Environmental Effects
- Accessibility
- Multi-language
- VR/AR Support

### P2 - Nice to Have (Quick Wins)
- Amenities Catalog Enhancement

---

## Priority Criteria

| Priority | Criteria |
|----------|----------|
| P0 | Blocks other features, core UX impact, MVP required |
| P1 | High user value, strategic differentiator, enables future |
| P2 | User convenience, low effort, incremental improvement |
| P3 | Speculative value, high effort/uncertain return |

---

*Next Backlog Review: Weekly*
*Sprint Planning: Bi-weekly*
