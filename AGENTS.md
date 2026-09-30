# Notes for agents — ace

You are a contributor, not a maintainer. Workers open PRs. They never merge `main` or `dev`.

This project follows the [Verified OSS Loop](https://github.com/kvnloo/verified-oss-loop). Issues are not claims. AI work is untrusted until proven.

## First 60 seconds

1. Read this file, then `CONTRIBUTING.md`.
2. `git fetch origin`. `python3 .verified-oss-loop/rollout.py show`. Branch from `origin/$(python3 .verified-oss-loop/rollout.py get worker_base)` unless the issue names another base. Day-pass PRs target `feature_target`. Overnight unattended PRs target `overnight_target`.
3. Search open issues and PRs. Do not duplicate in-flight work.
4. Orient (`skills/orient/SKILL.md`). If GitNexus MCP is already there: `query` → `context` → `impact`. Do not run `gitnexus analyze` unless a human asked. Else Serena symbols, else `rg` + read.

```bash
gh issue list --label claimable --state open
gh pr list --state open
```

## Pick and claim

Take one open issue labeled `claimable` and not `claimed`. Prefer `priority:P0`, then `P1`, then `good-first-issue`. Skip `needs-discussion` unless a human assigned it.

If nothing is `claimable`: do not code. If a `needs-discussion` issue exists, leave one concise proposal on the newest and stop. Otherwise mint exactly one issue from the first untracked item in `ROADMAP.md`, label it `needs-discussion`, and stop. Workers do not redefine `ROADMAP.md`.

Claim comment:

```text
claiming for autodevelop
claimant: <github login or agent id>
base: <git rev-parse origin/$(python3 .verified-oss-loop/rollout.py get worker_base)>
expires: <now + 24h UTC>
scope: <one sentence>
```

Then add `claimed` and remove `claimable`. If a claim newer than 24h exists, pick a different issue.

## Proof

| Layer | Command |
|---|---|
| Unit | `npm test` (`check:facility` + `check:landing`) |
| Mutation | `n/a` — do not invent a score |
| Runtime | `npm run build` |

1. Name intended vs current behavior.
2. Fail, then pass when changing behavior.
3. Keep the smallest complete change.
4. Run touched-surface tests.
5. Fill the evidence receipt with exact base/head SHAs.
6. Open a PR at the configured rollout target.
7. Independent review bots are reviewers/evidence, not merge authority.

Tests from another head are not evidence.

## ACE ownership

This repository is the **public ACE presentation/projection layer**.

ACE's top-level thesis is a consent-governed human-flourishing feedback loop:

```text
goal
 -> observe
 -> model
 -> hypothesize
 -> simulate
 -> connect the right humans/agents
 -> intervene
 -> measure
 -> verify
 -> learn
 -> repeat
```

The facility, sports, personal/facility twins, experts, agents, simulation, agriculture, robotics, gamification, and 3D scenes are infrastructure around that loop.

### Truth model

Public copy must preserve these distinctions:

- `LIVE`: running system exists elsewhere.
- `SHIPPED`: implemented capability exists, sometimes against demo/simulation data.
- `RESEARCH`: active engineering/experiment, not a product claim.
- `VISION`: intended architecture/program.
- `SPEC`: sourced facility/program fact.
- `MOCK`: illustrative behavior/UI.
- `PRETOTYPE`: this public Pages experience.

Never collapse observation, self-report, expert judgment, estimate, hypothesis, simulation, recommendation, intervention, and verified outcome into one kind of state.

Personalization means **measured response to interventions**, not fixed learning-style labels.

### Current system direction

The public landing should track the current ACE meta architecture without copying private data:

- private racquet digital twin: `LIVE` elsewhere;
- Facility OS foundations: `SHIPPED` against demo/sim data where verified;
- 2026 pickleball rules/profile + sport-blind transition protocol + differential tapes: `RESEARCH`;
- evidence/provenance spine: `RESEARCH`;
- backend-neutral WorldKernel / ball-physics bakeoff: `RESEARCH`;
- athlete intervention-response loop: `RESEARCH`;
- expert graph + agent authority contracts: `RESEARCH`;
- traceable 3D projection: `RESEARCH`;
- multidisciplinary human-performance campus: `VISION`.

Agents extend human attention and coordination. Coaches, PTs, physicians, nutritionists, biomechanists, scientists, farmers, engineers, peers, and mentors remain first-class humans with scoped authority.

### Campus truth boundary

The Naperville racquet building remains sourced `SPEC` nested inside a broader `VISION`:

- 24 tennis / 16 badminton / 4 squash / 16 table tennis / 8 pickleball / 1 real tennis;
- grass lab: 500 m² per section; section count unspecified;
- envelope/storey/APEX-cell dimensions are inferred when marked as such.

APEX rooms in Pascal are `VISION` zones. Program identity is not an origin measurement.

### This repo actually runs

- React/Vite public ACE landing;
- Pascal Viewer campus pretotype + CSS fallback;
- facility scene compiler/checks;
- deterministic local pretotype guide;
- `npm test` and `npm run build`.

It does **not** run:
- the private 60 Hz racquet twin;
- clinical systems;
- a medical decision engine;
- the experimental physics/simulation backends;
- a live BMS/robot fleet;
- a real waitlist submission.

### Pages channels

- `main` → `/ace/`
- `dev` → `/ace/dev/`
- `nightly` → `/ace/nightly/`

`nightly` is the direct fast-moving preview surface. Maintainers may push landing experiments there directly. Workers still follow the configured rollout/PR process.

### Do not

- start a second live GPU loop in this repo;
- copy private facility floor plans, credentials, internal paths, host details, or private-twin state;
- promote inferred geometry to sourced fact;
- claim medical, coaching, simulation, or personalization outcomes without evidence;
- treat the 3D scene as authoritative state;
- reintroduce stale USA Pickleball 2025 claims as current authority;
- treat OpenTwins / Ditto / Hono / Jenkins / Unity-in-Docker as wired dependencies unless the tree actually wires them;
- expose API keys in the public browser bundle.

## General do not

- Commit secrets, tokens, `.env`, or pairing files.
- Merge `main` or `dev` as a worker.
- Redefine the roadmap as a worker.
- Claim mutation coverage the stack cannot run.
- Overwrite `LICENSE`.
- Duplicate `AGENTS.md` into `CLAUDE.md` / `GEMINI.md` / copilot-instructions.
- Run `gitnexus analyze` as a side effect of a claim.
