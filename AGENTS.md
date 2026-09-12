# Notes for agents — ace

You are a contributor, not a maintainer. Workers open PRs. They never merge `main` or `dev`.

This project follows the [Verified OSS Loop](https://github.com/kvnloo/verified-oss-loop). Issues are not claims. AI work is untrusted until proven.

## First 60 seconds

1. Read this file, then `CONTRIBUTING.md`.
2. `git fetch origin`. `python3 .verified-oss-loop/rollout.py show`. Branch from `origin/$(python3 .verified-oss-loop/rollout.py get worker_base)` unless the issue names another base. Day-pass PRs target `feature_target`. Overnight unattended PRs target `overnight_target`. See `docs/rollout.md` in the kit (or `.verified-oss-loop/rollout.yml` here).
3. Search open issues and PRs. Do not duplicate in-flight work.
4. Orient (`skills/orient/SKILL.md`). If GitNexus MCP is already there: `query` → `context` → `impact`. Do not run `gitnexus analyze` unless a human asked. Else Serena symbols, else `rg` + read.

```bash
gh issue list --label claimable --state open
gh pr list --state open
```

## Pick and claim

Take **one** open issue labeled `claimable` and not `claimed`. Prefer `priority:P0`, then `P1`, then `good-first-issue`. Skip `needs-discussion` unless a human assigned it.

If nothing is `claimable`: do not code. **Triage** — if a `needs-discussion` issue exists: one-paragraph proposal on the newest; stop. If none: mint **exactly one** issue from the first untracked item in `ROADMAP.md`, else a failing unit command from `AGENTS.md`, else docs drift; label **`needs-discussion` only**; stop. Do not self-apply `claimable`. Do not rewrite `ROADMAP.md`. **Stop** if triage found nothing untracked, a live claim exists, a competing PR covers the scope, or secrets are required. Comment the blocker only if an issue thread exists. Do not open a consolation PR.

Claim comment (24h lease unless the project says otherwise):

```text
claiming for autodevelop
claimant: <github login or agent id>
base: <git rev-parse origin/$(python3 .verified-oss-loop/rollout.py get worker_base)>
expires: <now + 24h UTC>
scope: <one sentence>
```

Then add `claimed` and remove `claimable`. If a claim newer than 24h exists, pick a different issue.

## Proof

Commands were filled by `init-oss-repo.sh` / `oss-onboard` from the tree it saw, then ACE-ized. Do not invent a mutation score. Stryker is not adopted.

| Layer | Command |
|---|---|
| Unit | `npm test` |
| Mutation | `n/a` — Stryker not adopted; do not invent a score |
| Runtime | `npm run build` |

1. Name the intended vs current behavior.
2. Fail, then pass (see `skills/tdd/SKILL.md`).
3. Keep the smallest complete change (`skills/anti-slop/SKILL.md`).
4. Run unit tests on the touched surface.
5. If mutation is not `n/a`, run it on the contract you changed. A surviving mutant is a missing assertion.
6. Open a PR at `feature_target` (or `overnight_target` if unattended overnight). Fill `.github/PULL_REQUEST_TEMPLATE.md`. Never merge `main` or `dev`. Do not merge preview/nightly yourself; automerge may, when `rollout.yml` allows.
7. If the project runs an independent review bot (Greptile, CodeRabbit, Bugbot, Copilot, …), treat its comments as review, not merge. Fix real findings. Do not wait for a bot to approve itself.

**This branch:** honesty PR #7 still targets `main` because it predates rolling `preview`/`nightly`. After the maintainer runs `scripts/ensure-rollout-branches.sh --push`, new worker PRs target `preview`.

## ACE ownership

ACE is a **peak-performance pretotype** — a campus for human flourishing from all angles (scientists, athletes, labs, physiotherapy, all sports). That vision comes from `origin/enhance/3D` (APEX). Mine the **program**. Do not resurrect the Three.js lab theater, debug FPS HUD, OpenTwins-as-wired, 88% completion badges, or `4 × 500 = 2,000 m²` as origin fact.

The Naperville racquet building is the origin **SPEC** nested inside that vision:

- 24 tennis / 16 badminton / 4 squash / 16 table tennis / 8 pickleball / 1 real tennis
- Grass lab: 500 m² per section; **section count unspecified**
- Envelope 140×120 m and 10 m storeys are **inferred**

APEX rooms in Pascal (`building_apex`) are **VISION** named zones with inferred 30×30 m cells. Gym, pool, clubhouse, and physio are program identity, not origin measurements.

### This repo runs

- Pascal Viewer (`@pascal-app/core` / `viewer` / `nodes` 1.0.0) plus a CSS court/campus fallback
- `facility/generateScene.ts` compiles Site → LawnTech (SPEC) + APEX wing (VISION)
- `npm test` → `facility/check-scene.ts` (levels, one grass lab, nine VISION zones, no inferred farm sections)

### Do not (ACE-specific)

- Copy HomeForge / zerOS house, `NOW.yaml`, `:4210` bus, claim protocol, HYBRID, FBP, Keel, devices, or drones into this tree. Pascal embed + `plan2pascal` node mapping are the donor; ACE compiles four sport-hall floors by hand because plan2pascal v0 is single-level.
- Start ACE as a second live GPU loop. Homebase (`kvnloo/homebase-pickleball`) owns the live GPU path on host 0.
- Treat OpenTwins / Eclipse Ditto / Hono / Jenkins / Unity-in-Docker as wired dependencies. They are origin research language.
- Invent `/preview/<slug>/` Pages slots. Current deploy is `main` → `/ace/` and `dev` → `/ace/dev/` only. Rolling git branches are not Pages.
- Commit Sunshine credentials, API tokens, or `.env`.
- Mutate Linear until a human YES on the relevant issue.

## Do not

- Commit secrets, tokens, `.env`, or pairing files.
- Merge `main` or `dev`.
- Redefine the roadmap.
- Claim mutation coverage that the stack cannot run.
- Overwrite `LICENSE`.
- Duplicate `AGENTS.md` into `CLAUDE.md` / `GEMINI.md` / copilot-instructions.
- Run `gitnexus analyze` as a side effect of a claim.
- Dump the pstack plugin or Dr Eggbot marketplace pack into this tree. Pointers: `skills/pstack/SKILL.md`, `skills/dr-eggbot/SKILL.md`.
