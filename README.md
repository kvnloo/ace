# LawnTech Dynamics - Autonomous Indoor Grass Court Facility

<div align="center">

**The world's first fully autonomous indoor grass court tennis facility**

[View Live Demo](https://kvnloo.github.io/ace/) • [Dev Preview](https://kvnloo.github.io/ace/dev/) • [Documentation](.github/DEPLOYMENT.md)

</div>

---

## 🎯 Project Overview

LawnTech Dynamics is an innovative multi-floor racquet sports facility concept combining autonomous operations, sustainable grass cultivation, and AI-powered performance analytics. Located in Naperville, Illinois, this facility aims to revolutionize indoor sports through cutting-edge technology and sustainable practices.

### Core Innovation
- **🌱 Autonomous Grass Management**: Vertical farming system that grows and swaps court surfaces robotically
- **🤖 AI-Powered Operations**: Self-managing facility with minimal human oversight
- **📊 Performance Analytics**: Real-time biomechanics tracking and injury prevention
- **♻️ Sustainable Design**: Solar-powered with advanced resource optimization

---

## 🏗️ Facility Layout

### **Ground Floor** - Tennis Complex
24 premium tennis courts featuring:
- Grass courts (replaceable modular turf)
- Hard courts
- Clay courts
- Wood courts
- Pro shop and premium locker rooms

### **First Floor** - Mezzanine Sports
- 16 badminton courts
- 4 squash courts
- 16 table tennis stations

### **Second Floor** - Specialty Courts
- 8 pickleball courts
- 1 historic real tennis court

### **Third Floor** - Vertical Grass Lab
2,000 m² autonomous farming facility with:
- Hydroponics and climate control
- Robotic patch transport system
- 60-minute court surface replacement capability

---

## 🚀 Technology Stack

### Frontend
- **React 19** with TypeScript
- **Framer Motion** for animations
- **Three.js** for 3D facility visualization
- **Tailwind CSS** for styling
- **Vite** for build tooling

### AI & Analytics
- **Google Gemini AI** for chat interface
- Computer vision for biomechanics analysis
- Predictive maintenance algorithms

### Autonomous Systems
- Building Management System (BMS)
- Robotic mowers and maintenance drones
- Biometric access control
- Smart HVAC optimization

---

## 💻 Development

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kvnloo/ace.git
   cd ace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🌐 Deployment

This project uses GitHub Actions for automated deployment to GitHub Pages:

- **Production**: Automatically deploys from `main` branch to `/`
- **Development**: Automatically deploys from `dev` branch to `/dev/`

See [Deployment Guide](.github/DEPLOYMENT.md) for detailed setup instructions.

### Deployment URLs
- Production: https://kvnloo.github.io/ace/
- Development: https://kvnloo.github.io/ace/dev/

---

## 🎨 Features

### Interactive 3D Facility Tour
Explore the entire facility complex with:
- Rotatable 3D visualization
- Interactive hotspots for each area
- Detailed feature information cards

### AI-Powered Chat Assistant
Get instant answers about:
- Facility features and amenities
- Membership options
- Technical specifications
- Court booking

### Real-Time Performance Analytics
- Biomechanics tracking at 60 FPS
- Serve speed analysis (225 km/h capability)
- Ground force measurement (1900 N torque)
- Pronation/supination tracking

### Autonomous Operations Dashboard
Monitor facility systems:
- Smart HVAC climate control
- Robotic maintenance status
- Court surface quality metrics
- Energy consumption analytics

---

## 🏛️ Project Architecture

### Digital Twin Framework
Built on **OpenTwins** technology:
- **Eclipse Ditto**: Digital twin definitions
- **Eclipse Hono**: IoT device integration
- Real-time monitoring and control
- Predictive maintenance algorithms

### Agent-Based Automation
Inspired by Voyager and Eureka methodologies:
- **Automatic Curriculum**: Dynamic task progression
- **Skill Library**: Reusable action patterns
- **Reward Optimization**: Evolutionary performance tuning
- **Self-Verification**: Continuous improvement loops

### Feedback-Driven Learning
- Environment feedback integration
- Execution error analysis
- Iterative skill refinement
- Performance metrics tracking

---

## 👥 Expert Roles

| Role | Responsibility |
|------|----------------|
| **Architect** | Facility layout and safety compliance |
| **Digital Twin Modeler** | Virtual replica and simulation systems |
| **Automation Engineer** | Robotics and autonomous systems integration |
| **Sports Surface Specialist** | Court maintenance and quality assurance |
| **Building Systems Engineer** | BMS and energy optimization |

---

## 🎯 Strategic Goals

1. **Autonomous Excellence**: Achieve 24/7 operation with minimal human intervention
2. **Sustainability**: Net-zero energy consumption through solar and smart systems
3. **User Experience**: Seamless booking, access, and service delivery
4. **Performance**: Industry-leading analytics and injury prevention
5. **Community**: Local partnerships and educational collaborations

---

## 🤝 Partnerships & Funding

### Strategic Partnerships
- Local sports organizations for cost sharing
- Educational institutions for research collaboration
- Government agencies for sustainability grants

### Investment Opportunities
Currently raising Series A funding for Austin, Texas pilot facility.
Contact via the [Invest page](https://kvnloo.github.io/ace/) for more information.

---

## 📊 Technical Specifications

### Data Collection
- Multi-sensor array for court conditions
- Environmental monitoring (temperature, humidity, air quality)
- Player movement tracking and analysis
- Real-time video analytics

### Simulation & Analysis
- Energy usage forecasting
- Maintenance schedule optimization
- Player traffic pattern analysis
- Resource allocation modeling

### System Integration
- Centralized control via BMS
- Real-time IoT device communication
- Cloud-based analytics platform
- Mobile app for member access

---

## 📝 Project Structure

```
ace/
├── .github/
│   ├── workflows/        # CI/CD pipelines
│   └── DEPLOYMENT.md     # Deployment documentation
├── components/           # React components
│   ├── NavBar.tsx
│   ├── ThreeScene.tsx
│   ├── AIChat.tsx
│   └── Specifications.tsx
├── services/            # Service layer
├── App.tsx              # Main application
├── index.tsx            # Entry point
├── types.ts             # TypeScript definitions
└── vite.config.ts       # Build configuration
```

---

## 🔧 Configuration

### Base Path Configuration
The project supports dynamic base paths for multi-environment deployment:

```typescript
// vite.config.ts
const base = process.env.VITE_BASE_PATH || '/';
```

Set via environment variable during build:
```bash
VITE_BASE_PATH=/dev/ npm run build
```

---

## 📖 Documentation

The ACE project maintains **two parallel documentation systems**:

### 📚 Facility Documentation
Learn about the autonomous racket sports and health optimization facility concept:
- **[Facility Documentation →](docs/README.md)** - Concepts, architecture, and operations
  - [Facility Concepts](docs/concepts/) - Vision and business models
  - [Facility Architecture](docs/architecture/) - Design specifications and systems
  - [Technical Specifications](docs/specifications/) - Component requirements
  - [Operations](docs/operations/) - Facility management procedures
  - [Research](docs/research/) - Market research and feasibility studies
  - [Business Planning](docs/business/) - Financial models and strategies

### 💻 Developer Documentation
Technical documentation for the 3D visualization web application:
- **[Developer Documentation →](claudedocs/README.md)** - Code, testing, and deployment
  - [Architecture & Design](claudedocs/01-architecture/) - System architecture and design specifications
  - [Implementation Guides](claudedocs/02-implementation-guides/) - Step-by-step feature implementation guides
  - [Testing & Quality](claudedocs/03-testing-quality/) - Testing strategies and quality assurance
  - [Monitoring & Operations](claudedocs/04-monitoring-operations/) - Production monitoring and operations
  - [Workflows & Procedures](claudedocs/05-workflows/) - Development workflows and deployment procedures
  - [Research & Investigation](claudedocs/06-research/) - Research findings and technical investigations

### Quick Links
- **[Facility Blueprint](docs/architecture/facility-blueprint.md)** - Complete facility design
- **[APEX Concept](docs/concepts/APEX-Facility-Summary.md)** - Health optimization facility vision
- **[Quick Reference](claudedocs/QUICK_REFERENCE.md)** - Fast lookup for common tasks and patterns
- **[Deployment Guide](claudedocs/05-workflows/DEPLOYMENT.md)** - GitHub Pages setup and troubleshooting

### External Links
- [AI Studio Link](https://ai.studio/apps/drive/1Fc7kvKrC_eN-FRp7CerebmQONPqJW6z2) - Original project workspace

---

## 📄 License

This project uses a **multi-license approach** to balance open innovation with appropriate protections:

| Asset Type | License | Use |
|------------|---------|-----|
| **Source Code** | [MIT](LICENSE) | Permissive for maximum adoption |
| **Facility Designs** | [CC-BY-SA 4.0](LICENSE-DESIGNS) | Share-alike for design innovations |
| **3D Models** | [CC-BY-SA 4.0](LICENSE-MODELS) | Share-alike for visual assets |
| **Documentation** | [CC-BY-SA 4.0](LICENSE-DOCS) | Share-alike for knowledge |

### Quick Summary

✅ **You can freely**:
- Use, modify, and distribute the code (MIT)
- Build commercial facilities using the designs (CC-BY-SA 4.0)
- Create derivative works and improvements
- Use in research and education

⚠️ **You must**:
- Include copyright and attribution notices
- Share design/model/documentation improvements under CC-BY-SA 4.0
- Indicate changes made to original works

❌ **You cannot**:
- Remove attribution from any component
- Create proprietary closed-source facility designs
- Claim official endorsement without permission

**For detailed licensing information, see [docs/LICENSE.md](docs/LICENSE.md)**

**For licensing rationale and analysis, see [docs/LICENSE_RECOMMENDATIONS.md](docs/LICENSE_RECOMMENDATIONS.md)**

---

## 🙏 Acknowledgments

- **OpenTwins** for digital twin infrastructure
- **Eclipse Foundation** for Ditto and Hono frameworks
- **Google** for Gemini AI integration
- **Community Contributors** for feedback and support

---

<div align="center">

**Built with ❤️ by the LawnTech Dynamics team**

[Report Bug](https://github.com/kvnloo/ace/issues) • [Request Feature](https://github.com/kvnloo/ace/issues) • [Contact Us](https://kvnloo.github.io/ace/)

</div>
