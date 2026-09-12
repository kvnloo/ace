# LawnTech Dynamics — indoor grass-court pretotype

<div align="center">

**A public digital-twin pretotype of an indoor racquet facility with a third-floor grass lab**

[View Live Demo](https://kvnloo.github.io/ace/) • [Dev Preview](https://kvnloo.github.io/ace/dev/) • [Documentation](.github/DEPLOYMENT.md)

This Pages site is a **pretotype**, not a running BMS. LIVE / MOCK / PLANNED stamps in the UI say which claims are spec vs. theater.

</div>

---

## Project Overview

LawnTech Dynamics is a four-floor racquet-sports facility concept: indoor courts plus an on-site grass lab so the playing surface can be grown and swapped instead of painted green. The origin spec is **Naperville, Illinois**. The Invest page may mention other cities as a **pitch** — that is MOCK, not the spec.

### Core idea
- **Grass as a crop**: third-floor lab grows modular turf for the courts below
- **Indoor facility that prepares itself**: climate, surface, and access as one loop (pretotype)
- **Court is the hero**: the 3D demo is a spatial sketch, not a photoreal twin. If WebGL cannot paint, the map falls back to a CSS court still.
- **Measure, don't guess**: turf quality and energy are the honest metrics — not "AI-powered" as a product

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
Origin spec: **500 m² per section**. Section count is not in the origin (an earlier public page inferred 4 × 500 = 2,000 m²).
- Hydroponics and climate control (**PLANNED**)
- Patch transport (**PLANNED** — not a live robot fleet)
- Fast turf swap is a pretotype goal, not a measured receipt

---

## What this repo actually runs

### Pages demo (this tree)
- **React 19** + TypeScript
- **React Three Fiber** + **three** for the facility sketch
- **Framer Motion**, **Vite**
- **Gemini** chat is a **stub** on GitHub Pages (no live coaching product)

### Not in this tree
OpenTwins, Eclipse Ditto, Eclipse Hono, Jenkins, Unity-in-Docker, and a live BMS are **origin research language**, not wired dependencies. Do not treat README history as a running stack.

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

## Features

### Interactive 3D facility sketch
A Three.js sketch of the four floors. Court is the hero. HUD cards are MOCK overlays — they are not a live sensor bind.

### Chat (stub)
The Gemini box answers from prompt text when a key is present. On Pages it is a stub. Not a coaching product.

### Specs vs theater
Origin court counts (24 tennis + mezzanine + pickleball + real tennis) are in the spec. **60 FPS / 225 km/h / 1900 N** are README theater from an earlier draft — not measured on this demo. Vertical farm and robot swap are **PLANNED**.

---

## Spec lineage

The facility numbers come from the private racket-sports origin spec (Naperville, four floors). This public repo is a later, thinner pretotype. Voyager/Eureka-style curriculum language is inspiration for a future ops loop, not a second scheduler in this tree.

A pretty 3D scene is a **projection**, not proof of autonomy.

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

### Investment
The Invest form does not submit (MOCK). Origin location is Naperville. Other cities on that page are a pitch, not a second spec.

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

- [Deployment Guide](.github/DEPLOYMENT.md) - GitHub Pages setup and troubleshooting
- [AI Studio Link](https://ai.studio/apps/drive/1Fc7kvKrC_eN-FRp7CerebmQONPqJW6z2) - Original project workspace

---

## 📄 License

This project is licensed under the terms specified in [LICENSE](LICENSE).

---

## Acknowledgments

- Origin facility spec (private digital-twin racket-sports project)
- React Three Fiber / three.js for the public sketch
- Gemini is optional and stubbed on Pages

---

<div align="center">

**Built with ❤️ by the LawnTech Dynamics team**

[Report Bug](https://github.com/kvnloo/ace/issues) • [Request Feature](https://github.com/kvnloo/ace/issues) • [Contact Us](https://kvnloo.github.io/ace/)

</div>
