# ACE Tennis Facility - API Reference Documentation

Welcome to the API reference documentation for the ACE Tennis Facility project. This documentation is automatically generated from TypeScript source code using TypeDoc and TSDoc comments.

## 📚 Overview

This API reference provides comprehensive documentation for all components, services, utilities, and types used in the ACE Tennis Facility application. The documentation includes:

- **Component APIs** - React components and their props
- **Service Interfaces** - Backend services and integrations
- **Utility Functions** - Helper functions and utilities
- **Type Definitions** - TypeScript interfaces and types

## 🚀 Quick Start

### Browse Documentation Online

Visit the [live documentation](https://yourusername.github.io/ace-tennis/) to explore the API reference.

### Local Development

To view documentation locally:

```bash
# Generate documentation
npm run docs:generate

# Serve documentation locally
npm run docs:serve
```

This will start a local server at `http://localhost:8080` with the API documentation.

## 📖 Documentation Structure

The API documentation is organized into the following categories:

### Main Components
Core application components that make up the primary user interface and functionality.

**Key Components:**
- `ThreeScene` - Main 3D rendering canvas
- `NavBar` - Navigation bar component
- `AIChat` - AI chat interface
- `RecoverySuite` - Recovery room facilities

### System Components
Background systems that manage various aspects of the facility.

**Key Components:**
- `WeatherSystem` - Weather simulation and effects
- `LightingSystem` - Dynamic lighting control
- `RoboticGrassSystem` - Automated grass maintenance
- `BMSControlRoom` - Building management system

### Visualization Components
3D visualization and overlay components.

**Key Components:**
- `HeatMapOverlay` - Court usage heat maps
- `QualityBadge` - Quality indicators
- `CharacterSystem` - Character animations

### Services
Backend services and API integrations.

**Key Services:**
- `GeminiService` - Google Gemini AI integration

### Utilities
Helper functions and common utilities.

**Key Utilities:**
- `courtTextures` - Court texture loading
- `webglCheck` - WebGL capability detection

### Types
TypeScript type definitions and interfaces.

**Key Types:**
- `WeatherData` - Weather information structure
- Component prop types
- Configuration interfaces

## 🔍 Finding Documentation

### By Name
Use the search bar in the top-right corner to search for specific components, functions, or types by name.

### By Category
Browse the sidebar to navigate through different categories of code:
- **Modules** - All source modules
- **Classes** - Class definitions
- **Interfaces** - TypeScript interfaces
- **Functions** - Exported functions
- **Variables** - Exported variables

### By Hierarchy
Click on "Hierarchy" to view the inheritance hierarchy of classes and components.

## 📝 Understanding the Documentation

### Component Documentation

Each component includes:

- **Description** - What the component does
- **Props** - Input properties with types and descriptions
- **Returns** - What the component renders
- **Examples** - Usage examples
- **Remarks** - Additional notes and considerations
- **See Also** - Related components and types

Example structure:
```typescript
/**
 * WeatherSystem displays real-time weather conditions.
 *
 * @param props - Component properties
 * @param props.location - Geographic location
 * @returns React component
 */
```

### Function Documentation

Functions include:

- **Parameters** - Input parameters with types
- **Returns** - Return value and type
- **Throws** - Possible exceptions
- **Examples** - Code examples

### Type Documentation

Types include:

- **Properties** - All properties with types
- **Default Values** - Default values for optional properties
- **Remarks** - Usage notes

## 🛠️ Development Guidelines

### Adding Documentation

All new code should include TSDoc comments:

```typescript
/**
 * Brief description of the component.
 *
 * Detailed explanation of what it does and why.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <MyComponent prop="value" />
 * ```
 */
export function MyComponent(props: MyComponentProps) {
  // implementation
}
```

See [API Documentation Guide](../contributing/api-documentation.md) for complete standards.

### Updating Documentation

Documentation is automatically regenerated:

1. **On PR** - Generated and validated for every pull request
2. **On Merge** - Deployed to GitHub Pages when merged to main
3. **Manually** - Run `npm run docs:generate` anytime

### Validation

Before submitting code:

```bash
# Ensure documentation generates without errors
npm run docs:generate

# Check for TypeScript errors
npm run typecheck
```

## 📊 Statistics

Current documentation coverage:

- **HTML Files**: 151
- **Total Size**: 1.2MB
- **Components**: 14+
- **Services**: Multiple
- **Utilities**: Multiple
- **Types**: Comprehensive

## 🔗 Related Resources

- [Contributing Guide](../contributing/api-documentation.md)
- [Project README](../../README.md)
- [Architecture Documentation](../architecture/)
- [Development Guide](../QUICK_START.md)

## 🤝 Contributing

To improve this documentation:

1. Add or update TSDoc comments in source code
2. Follow [documentation standards](../contributing/api-documentation.md)
3. Test documentation generation locally
4. Submit a pull request

## 📞 Support

For questions or issues:

- **Documentation Issues**: Create an issue in the repository
- **Code Questions**: Refer to source code comments
- **API Questions**: Check this reference documentation

## 🔄 Last Updated

This documentation is automatically updated on every merge to the main branch.

- **Version**: 0.0.0
- **Generated**: Automatically by TypeDoc
- **Coverage**: Comprehensive API reference

---

**Note**: This documentation is generated from source code comments. Always refer to the source code for the most detailed and up-to-date implementation details.
