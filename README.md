# ACE — human flourishing feedback-loop pretotype

ACE is a physical campus + digital twin ecosystem for setting goals, measuring reality, connecting the right experts, simulating options, acting, and learning from verified outcomes.

Production: https://kvnloo.github.io/ace/
Dev: https://kvnloo.github.io/ace/dev/
Nightly: https://kvnloo.github.io/ace/nightly/

This repository is the public ACE pretotype. It does not run the private 60 Hz racquet twin, clinical systems, or experimental simulation backends.

## Thesis

ACE is a consent-governed cyber-physical feedback system for human flourishing.

Goal -> observe -> model -> hypothesize -> simulate -> connect the right humans/agents -> intervene -> measure -> verify -> learn -> repeat.

The facility, sport engines, agents, personal twins, 3D scenes, agriculture, robotics, and software are infrastructure around that loop.

## Principles

- Human goals are the objective function. Do not reduce a person to one universal score.
- Evidence before optimization. Observation, estimate, hypothesis, simulation, intervention, and verified outcome stay distinct.
- Humans are first-class architecture. Coaches, PTs, physicians, nutritionists, researchers, farmers, engineers, peers, and mentors are not escalation paths from AI.
- Agents extend attention and coordination. Consequential actions remain purpose-scoped and approval-scoped.
- The digital twin is an evidence-backed model. A 3D scene is a projection of authoritative state, never the source of truth.
- Simulation must earn trust. Counterfactuals do not count unless predictions and intervention rankings transfer to real measured outcomes.
- Personalization means measured response to intervention, not fixed “learning-style” labels.

ACE is inspired by the ambition behind quantified-self and Blueprint-style continuous measurement, but is an independent concept with broader scope. No affiliation with Blueprint or Bryan Johnson is implied.

## What exists vs what is being tested

| Stamp | Meaning |
|---|---|
| LIVE | A running system exists elsewhere, outside this Pages bundle. |
| SHIPPED | An implemented capability exists, sometimes against demo/simulation data. |
| RESEARCH | Active engineering or experiment; not yet a product claim. |
| VISION | Intended architecture or campus direction. |
| SPEC | Sourced facility/program fact. |
| MOCK | Illustrative UI/behavior only. |
| PRETOTYPE | This public site: a truthful interface to the vision, not the full product. |

Current direction:

- LIVE — private racquet digital twin.
- SHIPPED — Facility OS foundations such as booking/operations/cleaning coverage/utilization against demo/sim data.
- RESEARCH — provenance-aware evidence spine, 2026 pickleball rule packages, sport-blind transition kernel, deterministic differential tapes, WorldKernel/physics bakeoff, intervention-response loop, expert/agent authority, traceable 3D replay, machine-checkable sport-law experiments.
- VISION — multidisciplinary human-performance campus connecting training, PT, medical/research, nutrition, recovery, community, engineering, and controlled-environment agriculture.

## First proving ground

Pickleball is the first end-to-end testbed because rules and outcomes are explicit enough to falsify the architecture.

The target vertical slice is:

1. play or ingest one real or intentionally synthetic session;
2. preserve an evidence chain for rally observations and rule-adjudicated state;
3. estimate one athlete capability with explicit uncertainty;
4. compare a small number of simulated alternatives;
5. let the user/coach choose an intervention;
6. repeat a comparable measurement;
7. keep or reject the hypothesis based on the observed outcome.

The goal is not to maximize feature count. The goal is to prove whether the loop creates useful capability gains beyond strong conventional coaching/software.

## Public campus sketch

The Pascal campus pretotype preserves the sourced Naperville racquet program and a broader APEX human-performance VISION.

Naperville origin SPEC:
- 24 tennis courts; surface mix includes hard, clay, grass, and wood, but the split is unspecified.
- 16 badminton courts.
- 4 squash courts.
- 16 table-tennis stations.
- 8 pickleball courts.
- 1 real-tennis court.
- Grass lab: 500 m² per section; section count unspecified.

The public scene must not convert inferred geometry into origin measurements.

APEX / ACE campus VISION includes:
- strength and conditioning;
- biomechanics / motion capture;
- physiotherapy / rehabilitation;
- medical / diagnostics partnerships;
- nutrition and food;
- recovery;
- research labs;
- social/community spaces;
- controlled-environment agriculture;
- maker / engineering spaces.

Some capabilities may ultimately be partnerships rather than co-located services. The sketch is a program exploration, not a construction claim.

## What this repository actually runs

- React 19 + TypeScript + Vite.
- Pascal Viewer for the campus sketch.
- CSS/fallback campus visualization when WebGL cannot paint.
- Public ACE narrative/status data in landing/public.ts.
- Deterministic local pretotype guide; the public bundle does not expose an AI API key.
- Landing/facility honesty checks.

Validation:
- npm test
- npm run build

Mutation testing is n/a; do not invent a mutation score.

The live/private racquet twin, private Facility OS runtime, clinical integrations, and simulation backends do not run in this tree.

Agents should read AGENTS.md. Workers never merge main or dev.

## Development

- git clone https://github.com/kvnloo/ace.git
- cd ace
- npm ci
- npm run dev

Build and validate:
- npm test
- npm run build
- npm run preview

No API key is required for the public pretotype.

## Deployment channels

The Pages artifact contains three independent builds:

- Production / main -> https://kvnloo.github.io/ace/
- Development / dev -> https://kvnloo.github.io/ace/dev/
- Nightly / nightly -> https://kvnloo.github.io/ace/nightly/

A push to any of those branches rebuilds the combined artifact from the current heads of all three channels.

nightly is intentionally the fast-moving preview surface. Work can be pushed there directly without changing dev or main.

## Relationship to the deeper ACE work

This public repo is the presentation/projection layer.

The deeper ACE digital-twin work owns the evolving evidence, rules, simulation, athlete-learning, expert/agent-authority, and 3D traceability experiments. The landing should summarize that direction without copying private data or converting research into shipped claims.

A pretty scene is not evidence. A model prediction is not an observation. A simulation is not an outcome.
