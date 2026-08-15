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

Likely repository: `kvnloo/pickleball-palace-builder`.

Best donor ref: `origin/claude/game-performance-optimization-YuK2B` at `9e325bca52c4010cfd4cb16681dfc4305c0f0e72`, six commits ahead of its `main`.

Strong concepts:

- typed pickleball shot, score, serve and rally state;
- configurable court/facility geometry;
- consolidated frame loop;
- low-allocation frame-time ring buffer;
- squared-distance LOD thresholds and hysteresis;
- frustum-culling helpers and distance-based shadow policy;
- focused performance test contracts.

Blockers before code transfer:

- no committed license was found in the donor repository;
- `package.json` and `package-lock.json` are out of sync, so `npm ci` fails on donor `main`;
- donor uses React 18 / R3F 8 / Three 0.170 while ACE uses React 19 / R3F 9 / Three 0.181;
- several optimization tests encode intent but do not prove browser behavior on ACE.

Until ownership/relicensing is explicit, copy no code. Reimplement proven concepts behind ACE-owned tests.

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
