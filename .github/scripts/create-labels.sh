#!/usr/bin/env bash
# Create Verified OSS Loop labels on the current GitHub repo.
# Requires: gh auth. Does not overwrite existing label descriptions.
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "gh is required" >&2
  exit 1
fi

create() {
  local name="$1" color="$2" desc="$3"
  if gh label list --limit 200 --json name --jq '.[].name' | grep -Fxq "$name"; then
    echo "exists: $name"
    return 0
  fi
  gh label create "$name" --color "$color" --description "$desc"
}

create claimable "0E8A16" "Maintainers opened this for a bounded claim"
create claimed "FBCA04" "A live claim lease exists"
create "needs-discussion" "D876E3" "Maintainer or worker proposal; not a claim until promoted to claimable"
create needs-review "5319E7" "Evidence receipt attached; independent review next"
create blocked "D93F0B" "External or policy block"
create keep "1D76DB" "KEEP after merge"
create discard "6A737D" "DISCARD with a recorded lesson"
create "priority:P0" "D73A4A" "Critical"
create "priority:P1" "E99695" "High"
create "priority:P2" "F9D0C4" "Medium"
create "priority:P3" "FEF2C0" "Low"
create bug "D73A4A" "Something is broken"
create enhancement "A2EEEF" "Proposed change"
create security "B60205" "Security-sensitive; do not discuss exploits in public"
create "good-first-issue" "7057FF" "Good first claim after triage"
create "area:docs" "0075CA" "Documentation"
create "area:loop" "C5DEF5" "Claim/lease/receipt process"
create "area:verify" "BFDADC" "Tests, mutation, evidence"
create stale "FFFFFF" "Quiet; not a claim block"
