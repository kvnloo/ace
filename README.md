# ACE — HomeBase public landing

<div align="center">

**Public pretotype landing for HomeBase — indoor pickleball digital twin and facility OS.**

[Live Pages (`main`)](https://kvnloo.github.io/ace/) • [Dev Preview](https://kvnloo.github.io/ace/dev/) • [Deployment](.github/DEPLOYMENT.md)

This Pages site is a **pretotype landing**, not the live GPU twin. HomeBase (private product) owns that loop. Stamps in the UI say which claims are **SHIPPED**, **LIVE** (elsewhere), **VISION**, **SPEC**, **PLANNED**, or **MOCK**. GitHub Pages deploys **`main`** and **`dev` only**.

</div>

---

## What this site is

ACE Pages is the public face of **HomeBase**: pickleball rules engine, 3D facility twin, and Facility OS (booking, cleaning robots, ROI). Those systems shipped in the private repo. This site does **not** start a second 60Hz loop, bundle the engine, or wire the booking API.

A nested **Pascal campus sketch** remains: Naperville racquet **SPEC** plus an APEX peak-performance wing (**VISION**). That sketch is not the live pickleball twin.

| Stamp | What |
|---|---|
| **SHIPPED** | USAPA 2025 engine + Facility OS MVP in the private HomeBase product (demo/sim data). Not this bundle. |
| **LIVE** | GPU twin (players, ball, cameras, scoreboards) — private HomeBase app only. |
| **VISION** | APEX labs, recovery / physio, gym, pool, clubhouse on the nested campus sketch. |
| **SPEC** | Naperville origin racquet counts on the nested sketch. Grass lab: 500 m² per section, section count unspecified. |
| **PLANNED / MOCK** | Blender-native GFX, web GFX quality lanes, waitlist form, Gemini chat. |
| **This repo runs** | Landing copy + Pascal Viewer + CSS fallback. HomeBase owns the live GPU loop. |

Do not copy facility floor plans or private twin source into this tree. Do not resurrect the Three.js lab theater as the renderer. Mine campus program through Pascal.

---

## 🏗️ Naperville origin layout (SPEC)

### **Ground Floor** - Tennis Complex
24 tennis courts featuring:
- Grass courts (replaceable modular turf)
- Hard courts
- Clay courts
- Wood courts
- Pro shop and locker rooms
- Surface split is **unspecified** (not 6/6/6/6 unless the spec says so)

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
- **HomeBase landing copy** (`landing/public.ts`) — pretotype; does not run the live twin
- **React 19.2** + TypeScript
- **Pascal Viewer** (`@pascal-app/core` / `viewer` / `nodes` 1.0.0) — nested campus sketch: Site → LawnTech levels 0–3 + APEX VISION wing
- Envelope **140×120 m** and **10 m** storeys are **inferred**, not origin measurements
- APEX rooms are **nine VISION zones** on inferred 30×30 m cells
- Grass lab is **one PLANNED zone** (origin: 500 m²/section; section count unspecified)
- CSS campus / court fallback when WebGL cannot paint
- **Framer Motion**, **Vite**
- **Gemini** chat is a **stub** on GitHub Pages (not a concierge product)
- Pascal **editor** is not shipped; `@pascal-app/editor` is a read-only shim so node definitions can load

### Proof

```bash
npm test          # facility/check-scene.ts + landing/check-copy.ts
npm run build
```

Mutation is **n/a** — Stryker is not adopted. Do not invent a score.

### Not in this tree
OpenTwins, Eclipse Ditto, Eclipse Hono, Jenkins, Unity-in-Docker, and a live BMS are **origin research language**, not wired dependencies. Do not treat README history as a running stack.

Agents: read [`AGENTS.md`](AGENTS.md) and [`ROADMAP.md`](ROADMAP.md). Workers never merge `main` or `dev`.

---

## 💻 Development

### Prerequisites
- Node.js (v20 or higher)
- npm
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

3. **Configure environment** (optional; chat is a stub without it)
   Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Build for Production

```bash
npm test
npm run build
npm run preview
```

---

## 🌐 Deployment

This project uses GitHub Actions for automated deployment to GitHub Pages:

- **Production**: Automatically deploys from `main` branch to `/`
- **Development**: Automatically deploys from `dev` branch to `/dev/`

Rolling git branches (`preview`, `nightly`) from the Verified OSS Loop are **not** Pages slots. Do not invent `/preview/<slug>/` without extending `.github/workflows/deploy.yml`.

See [Deployment Guide](.github/DEPLOYMENT.md) for detailed setup instructions.

### Deployment URLs
- Production: https://kvnloo.github.io/ace/
- Development: https://kvnloo.github.io/ace/dev/

---

## Spec lineage

- **Vision program**: `origin/enhance/3D` APEX campus (labs, physio, gym, pool, clubhouse, all sports)
- **Origin numbers**: private racket-sports spec (Naperville, four floors)
- Voyager/Eureka-style curriculum language is inspiration for a future ops loop, not a second scheduler in this tree

A pretty 3D scene is a **projection**, not proof of autonomy.

---

## 📝 Project Structure

```
ace/
├── AGENTS.md                 # Verified OSS Loop + ACE ownership
├── ROADMAP.md              # First untracked item is what autodevelop mints
├── facility/              # Pascal program + scene compiler
│   ├── program.ts
│   ├── vision.ts           # APEX VISION rooms
│   ├── generateScene.ts
│   └── check-scene.ts
├── components/
│   ├── PascalFacility.tsx
│   ├── facility/SketchMap.tsx
│   └── ThreeScene.tsx     # unused legacy — do not remount
├── .github/workflows/      # Pages deploy + validate + loop receipts
└── App.tsx
```

---

## 📄 License

This project is licensed under the terms specified in [LICENSE](LICENSE).

---

## Acknowledgments

- Origin facility spec (private digital-twin racket-sports project)
- APEX campus program from the `enhance/3D` branch
- Pascal Viewer for the public sketch
- Gemini is optional and stubbed on Pages
