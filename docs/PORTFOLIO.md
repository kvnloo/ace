# ACE portfolio (not a monorepo)

Date: 2026-09-14. Linear workspace: zer0 (`https://linear.app/0ism`). Team: personal.

ACE is a peak-performance campus digital twin. It is not GrowTwin, not Rally House pickle, not farm, not heliocortex house. Microservices stay in their own repos. This tree holds program + lookdev contract. Blender IaC lives in `wt/homebase-dream-photoreal`.

## Products (Linear projects)

| Product | Repo / home | Role |
|---|---|---|
| ACE | `ace-pretotype` + Blender `ace_campus.blend` | Campus twin frontend. Geometry, named cameras, Unreal map, facility OS *adapter*. |
| GrowTwin | GrowTwin / TwinForge | Shared engine: tick, soil/crop, kitchen later (Phase 5). Two frontends consume it. |
| heliocortex | `heliocortex` (no dash) | House frontend over the same engine. Not ACE stills. |
| Homebase | pickleball / Rally House | Lookdev *bar* for interiors. Never the ACE progress still. |
| OpenAvatar | existing Linear | Passport / public identity card. ACE binds member id; does not own biometrics. |
| sft-svlm | `/mnt/zer0models/sft-svlm` | Recall / conversation twin. Index on disk; do not commit corpus. |

## What stays in ACE

- Blender IaC (`build_ace_campus.py`, `COL_*` / `GEO-*` / `SOCK_*`)
- Named stills + Unreal export map
- Pretotype `facility/vision.ts` + `program.ts`
- Adapter only: bookings, soil 0–1, hour, passport id on the mesh

## What does not live here

- Crop/kitchen engine (GrowTwin)
- Biometrics / taste graph (engine + OpenAvatar)
- Collaboration matching (new OS service, later)
- Jarvis recall (sft-svlm)
- zerOS factory, farm scaffold, heliocortex house

## Contracts (versioned, small)

- passport id
- soil 0–1
- kitchen demand
- facility hour 0–23

Copy-paste from messy monorepos is how ACE becomes another one. Prefer libraries (Cycles, USD/Unreal, USAPA constants, AgX). L3 trays stay geometry until GrowTwin ticks them.

## Spec vs MOCK (do not resurrect)

- `/workspace/ace` treats 4×500 m² = 2,000 m² farm as fact. Pretotype: MOCK. Do not leak inferred farm sections.
- Nutrition kitchen = VISION occupancy (`facility/vision.ts` zone `nutrition`).
- LawnTech / `kvnloo/ace` (Jul 2026 Codex) is the origin demo, not the Blender product.

## Corpus (where the program actually is)

- Anthropic FTS: `/mnt/zer0models/sft-svlm/data/anthropic/anthropic.sqlite3`
- OpenAI Takeout zip: `data/raw/openai/*.zip` (ChatGPT titles: grass tennis, racquet floor plan, Blueprint, GrowTwin)
- Codex Jul 2026: LawnTech / ACE racket twin, Blueprint landing → GrowTwin synthesis
- Claude `~/.claude`: Factory Blueprint Protocol, not ACE
- Do not git corpus text. `fx` (Vercel, `/home/kvn/.local/bin/fx`) + `openai/gpt-5.6-luna` for fan-out once Gateway auth exists.

## Roadmap (Linear milestones on ACE)

1. Lookdev densify — one class per pass; Rally is bar not still
2. Unreal reassembly map — collections/sockets only
3. Facility OS adapter — tickFacility agrees with pretotype tests
4. Passport bind — OpenAvatar id on member; no health dumps in git
5. Kitchen bind — blocked on GrowTwin Phase 5; ACE APEX room only

## Collaboration / taste kitchen (intent, not this repo)

Passport = twin identity + ACE member. Taste kitchen = GrowTwin kitchen engine, ACE nutrition room as the room. Matching = separate OS. Low-ego open campus is product copy, not CMU.

Linear: MCP cannot create initiatives. Existing initiative: Smart Home Feedback Loop (heliocortex + GrowTwin). ACE is its own project, not that house loop.

Linear URLs (team personal / PER):
- ACE https://linear.app/0ism/project/ace-041d081409ee
- GrowTwin https://linear.app/0ism/project/growtwin-c7a14c05cbca
- heliocortex https://linear.app/0ism/project/heliocortex-537a9fade149
- sft-svlm https://linear.app/0ism/project/sft-svlm-67785ea46c9f
- Homebase (Rally bar) https://linear.app/0ism/project/homebase-0952753fa2cd
- Doc https://linear.app/0ism/document/portfolio-and-repo-map-d58a0e67ad57
- Issues PER-1669–PER-1678
