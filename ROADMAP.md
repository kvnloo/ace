# ACE roadmap

Workers mint **exactly one** `needs-discussion` issue from the first untracked item. Do not rewrite this file to claim work. Do not self-apply `claimable`.

## Honesty split

| Stamp | Meaning |
|---|---|
| **VISION** | Peak-performance campus for human flourishing from all angles: scientists, athletes, labs, physiotherapy, all sports. Program mined from `origin/enhance/3D` (APEX). Not origin measurements. |
| **SPEC** | Naperville origin racquet counts: 24 tennis / 16 badminton / 4 squash / 16 table tennis / 8 pickleball / 1 real tennis. Grass lab: 500 m² per section, section count unspecified. |
| **PLANNED / MOCK** | Live BMS, drones, 60 FPS biomechanics, Gemini concierge product, 6/6/6/6 split, four farm racks, 60-minute turf-swap receipt. |
| **This repo runs** | Pascal pretotype + CSS fallback. Not a live facility. Homebase owns the live GPU loop. |

## Untracked (oldest first)

1. Delete or isolate unused `components/ThreeScene.tsx` so inferred 6/6/6/6 and four farm racks cannot remount if that canvas is imported again.
2. GitHub Pages still deploys only `main` (`/ace/`) and `dev` (`/ace/dev/`). Rolling `preview` / `nightly` branches have no Pages slot — do not invent `/preview/<slug>/` without extending `.github/workflows/deploy.yml` and documenting it.
3. APEX Pascal rooms are named VISION zones with inferred 30×30 m cells. Do not promote those dimensions (or 147 biomarkers, +28% VO₂, 1,388 seats) to origin until a spec says so.
4. Do not start ACE as a second live GPU loop. Homebase (`kvnloo/homebase-pickleball`) owns the live GPU path.

## Maintainer (not worker)

- `.github/scripts/create-labels.sh` (gh write; workers cannot).
- `bash scripts/ensure-rollout-branches.sh --root . --push` so `preview` and `nightly` exist. After that, new worker PRs target `preview`. Existing honesty PR #7 still targets `main` because it predates rolling branches.
