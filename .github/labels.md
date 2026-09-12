# Labels for the Verified OSS Loop

Create these in GitHub Settings → Labels, or copy and run `.github/scripts/create-labels.sh` (`--labels` on init).

## Loop

| Name | Color | Meaning |
|---|---|---|
| claimable | 0E8A16 | Maintainers opened this for a bounded claim |
| claimed | FBCA04 | A live lease exists |
| needs-discussion | D876E3 | Maintainer or worker proposal; not a claim until promoted to claimable |
| needs-review | 5319E7 | Evidence receipt is attached; independent review next |
| blocked | D93F0B | External or policy block |
| keep | 1D76DB | KEEP after merge |
| discard | 6A737D | DISCARD with a lesson, not silence |

## Priority

| Name | Color |
|---|---|
| priority:P0 | D73A4A |
| priority:P1 | E99695 |
| priority:P2 | F9D0C4 |
| priority:P3 | FEF2C0 |

## Kind

| Name | Color |
|---|---|
| bug | D73A4A |
| enhancement | A2EEEF |
| security | B60205 |
| good-first-issue | 7057FF |
| area:docs | 0075CA |
| area:loop | C5DEF5 |
| area:verify | BFDADC |
| stale | FFFFFF |
