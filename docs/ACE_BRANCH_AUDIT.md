# ACE branch and donor audit

Date: 2026-08-15

## Verified baseline

- Production branch: `main` at `d74e487db708f85ca32f4566d9a78de11d4003de`
- Production URL: https://kvnloo.github.io/ace/
- Current `main` production build passes.
- Current bundle: approximately 1.48 MB minified / 440 KB gzip in one application chunk.
- Dependency audit at time of review: 10 findings, including 9 high severity.
- The deployed product is a concept/demo. No live BMS, athlete telemetry, autonomous facility, active funding round, or physical campus was verified.

## Branch disposition

### Promote selectively from `origin/dev`

`origin/dev` is 31 commits ahead of `main` and contains the strongest integrated facility architecture. It should be harvested by subsystem, not merged wholesale.

High-value areas:

- procedural court-surface work;
- facility/lab/transport components;
- improved load and court-view behavior;
- deployment, quality and test infrastructure;
- documentation cleanup and architecture material.

Gate each subsystem with a fresh build, visual comparison, bundle measurement and claim review.

### Extract only from `origin/enhance/3D`

This branch is 44 commits ahead but includes substantial debug, generated artifact and dependency debt. Useful donor concepts include:

- asset registry and performance instrumentation;
- weather and lighting separation;
- adaptive loading and performance gating;
- visual-regression and E2E specifications.

Do not merge the branch. Reimplement or cherry-pick narrowly after verifying individual commits.

### Immediate low-risk donor

`e696b980b47eb311638d4aaa33027854c2811363` replaces an inappropriate hero image with a tennis-court image. The concept is correct, but the final redesign should use a locally owned, rights-safe media asset rather than a remote runtime dependency.

### Research only

`38f289749669a30ad9fba56ceb59a5ff7a114617` contains multi-sport facility research. Curate it as requirements evidence. Do not publish its unverified technical claims as operating capability.

### Production-hardening reference

`049d926a88888008173bfea8ab3e99067c6f17fc` contains a broad production-hardening attempt. Review its accessibility, error-boundary, CI and code-splitting ideas individually. Do not merge wholesale because its build/audit surface is materially larger and riskier than `main`.

### Retire as active lines

- `stg` is one commit behind `main`.
- the map-debug branch is already ancestral donor history, not a release branch.
- old generated debug reports and screenshots should not become production architecture.

## Homebase / pickleball donor

Verified local repository: `/workspace/zer0/products/homebase/pickleball`.

Product identity: Rally House Pickleball Digital Twin. This local working repository—not `kvnloo/pickleball-palace-builder`—is the Homebase implementation referenced by the owner.

Current inspected branch: `feat/optimize` at `7139d7d`, two commits ahead of local/main `90ff6c5`. The checkout already contained unrelated owner changes in `README.md`, `scripts/generate-robot-model.mjs`, and untracked `scripts/with-python.sh`; those must be preserved.

Strong donor systems:

- pure TypeScript USAPA 2025 rules engine with rendering-independent boundaries;
- XState-backed player and rally state;
- fixed-timestep 60 Hz animation loop;
- per-court ball physics, scoring, serve and non-volley-zone behavior;
- configurable 11-court facility layouts;
- Three.js digital-twin scene builders, court selection and operational overlays;
- facility analytics, gamification and service layers;
- robot, scheduling, camera and facility-management dashboards;
- floor-plan image ingestion into facility configuration;
- substantial Vitest, Playwright, Testing Library and mutation-testing infrastructure;
- recent frame-loop, renderer, draw-call and UI optimization work.

Promotion boundary:

- Homebase should contribute domain truth, simulation, facility configuration and operations patterns.
- ACE should own the architectural shell, premium campus presentation, multi-sport composition and Athlete OS experience.
- Extract contracts behind adapters rather than coupling ACE directly to Homebase scene or dashboard internals.
- Preserve the dirty Homebase working tree and audit licensing/ownership before publishing transferred code as OSS.

## Promotion sequence

1. Establish ACE Performance Campus as the truthful umbrella brand.
2. Remove or qualify unsupported operational and funding claims.
3. Repair dependency findings and introduce CI gates.
4. Split the 3D scene and AI client from the initial route.
5. Promote the strongest facility modules from `dev` one subsystem at a time.
6. Reimplement Homebase's pickleball simulation and frame-loop patterns after license clearance.
7. Build the Athlete OS measurement layer as a real data contract before marketing it as live.
8. Replace remote/placeholder media with local, rights-safe assets.

## Brand direction

ACE Performance Campus is the umbrella. LawnTech becomes the modular grass and court-surface R&D program.

Core promise:

> Train the athlete. Measure the system.

Experience pillars:

- Athlete OS: longitudinal baselines and retesting;
- Neuro & Reaction Lab: supervised perceptual and stroboscopic training;
- Sport Labs: sport-specific courts, simulation and coaching workflows;
- Recovery: workload, readiness and return-to-play boundaries;
- Facility Twin: transparent concept planning and eventual sensor integration.

Public pages must not simulate strobing effects. Health and performance claims require evidence grading, contraindications, supervision, privacy treatment and explicit concept/operational status.
