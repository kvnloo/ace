## Summary

<!-- What this PR does, in one paragraph. -->

## Checklist

- [ ] **Ownership respected**: changes stay inside `AGENTS.md` boundaries
- [ ] **Searched issues/PRs**: no duplicate in-flight work
- [ ] **Claimed issue**: work started after a bounded claim, not from the issue title alone
- [ ] **Fail-then-pass**: bug fixes include the red command and the green command
- [ ] **No secrets**: no tokens, API keys, `.env`, or pairing files
- [ ] **Mode** (select one):
  - [ ] **Unattended** — donated compute (cloud agent)
  - [ ] **Copilot** — human-supervised
- [ ] **Workers never merge `main`/`dev`**: this PR does not grant worker merge of production

## Evidence

```yaml
issue:
base_revision:
head_revision:
tests:
  red:
  green:
  sabotage:
mutation: n/a
runtime_evidence: []
limitations: []
ai_assistance:
```

Tests from another head are not evidence. If mutation is `n/a`, write `n/a` — do not invent a score. The receipt workflow fails the PR if these keys are empty or `head_revision` is not this PR's SHA.

## Related

<!-- Fixes #123 -->
