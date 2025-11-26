# ACE - Autonomous Court Environment

3D visualization web application for exploring advanced sports facility concepts.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## What is ACE?

ACE is a web-based 3D visualization platform showcasing:
- **Interactive 3D Courts**: Tennis, padel, and pickleball courts with realistic rendering
- **Facility Concepts**: Autonomous sports facilities with robotic systems
- **Advanced UI**: Loading screens, progress tracking, and debug panels
- **Performance**: Optimized for smooth 60 FPS rendering with thousands of objects

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Developer guide for contributing
- **[API.md](./API.md)** - Component and service API reference

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **3D Rendering**: Three.js + React Three Fiber
- **Styling**: Tailwind CSS
- **Testing**: Playwright (E2E) + Vitest (Unit)

## Key Features

### 3D Visualization
- Multiple court types (tennis, padel, pickleball)
- Realistic grass rendering with density monitoring
- Dynamic lighting and shadows
- Camera controls and navigation

### Performance
- Instanced rendering for thousands of objects
- Batch loading with progress tracking
- Lazy loading for off-screen components
- FPS monitoring and optimization

### User Experience
- Multi-phase loading screens
- Interactive debug panels
- Accessibility features (keyboard navigation, ARIA labels)
- Responsive design for mobile and desktop

## Project Status

**Active Development** - Core 3D rendering complete, ongoing UI refinements

## License

MIT

## Learn More

- Detailed documentation: `claudedocs/`
- Architecture details: `claudedocs/architecture-detail/`
- Test reports: `claudedocs/test-reports/`
