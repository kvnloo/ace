# Autodevelop — ace

Paste **this entire file** as the first message to any coding agent (Cursor, Codex, Claude Code, Hermes, …). Do not summarize it. Work in **this** repository, not a different clone.

| | |
|---|---|
| **This repo** | https://github.com/kvnloo/ace |
| Clone | `git clone https://github.com/kvnloo/ace.git` |
| Protocol | [Verified OSS Loop](https://github.com/kvnloo/verified-oss-loop) (`SPEC.md` in that kit; this tree has `AGENTS.md`) |

You are a contributor, not a maintainer. Donate **one** coding pass. **Never merge `main` or `dev`.** Default rollout is Arch-style `rolling` unless `.verified-oss-loop/rollout.yml` says otherwise.

## Do

1. Clone or open https://github.com/kvnloo/ace. `cd` into that tree. `git fetch origin`. `python3 .verified-oss-loop/rollout.py show`. Branch from `origin/$(python3 .verified-oss-loop/rollout.py get worker_base)` unless the issue names another base. Day-pass PRs target `feature_target`. Overnight PRs target `overnight_target`.
2. Read `AGENTS.md` and `CONTRIBUTING.md` in this repo. Follow them if they conflict with this file.
3. Search open issues and PRs. Stop on overlap.

```bash
gh issue list --repo kvnloo/ace --label claimable --state open
gh pr list --repo kvnloo/ace --state open
```

4. Branch on the queue:

- **Work** — open `claimable` and not `claimed`: claim **one** leaf. Prefer `priority:P0`, then `P1`, then `good-first-issue`. Skip `needs-discussion` unless a human assigned it.
- **Triage** — nothing `claimable`: do not code. If a `needs-discussion` issue exists: one-paragraph proposal on the newest; stop. If none: mint **exactly one** issue from the first untracked item in `ROADMAP.md`, else a failing unit command from `AGENTS.md`, else docs drift; label **`needs-discussion` only**; stop. Do not self-apply `claimable`. Do not rewrite `ROADMAP.md`.
- **Stop** — triage found nothing untracked, a live claim exists, a competing PR covers the scope, or secrets are required.

Claim comment (24h lease unless the project says otherwise):

```text
claiming for autodevelop
claimant: <github login or agent id>
base: <git rev-parse origin/$(python3 .verified-oss-loop/rollout.py get worker_base)>
expires: <now + 24h UTC>
scope: <one sentence>
```

Then add `claimed` and remove `claimable`.

5. Orient before edit (`skills/orient/SKILL.md`). If GitNexus MCP is already there: `query` → `context` → `impact`. Do not run `gitnexus analyze` unless a human asked.
6. Fail, then pass (`skills/tdd/SKILL.md`). Unit command: `npm test`. Mutation: `npx stryker run` (write `n/a` if that is what the tree says; do not invent a score).
7. Smallest complete change (`skills/anti-slop/SKILL.md`). If pstack is already installed, `/poteto-mode` is allowed; still never merge.
8. Open a PR on https://github.com/kvnloo/ace at `feature_target` (day) or `overnight_target` (overnight) with `.github/PULL_REQUEST_TEMPLATE.md` filled. Bind evidence to `head_revision`. **Do not merge `main` or `dev`.**

## Stop

- Triage found nothing untracked, a live claim exists, or a competing PR covers the scope.
- You would need secrets, pairing tokens, or maintainer credentials.
- You were about to merge `main`/`dev`, force-push `main`, overwrite `LICENSE`, or dump GitNexus/pstack into the tree.

If you stop, comment the blocker only if an issue thread exists. Do not open a consolation PR.

## Skills in this repo

`skills/autodevelop/SKILL.md` is the same loop. `skills/verify/SKILL.md` is the receipt. Do not invent a parallel process.
