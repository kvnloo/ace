#!/usr/bin/env bash
# Release expired Verified OSS Loop claim leases. Does not merge. Does not close issues.
# Usage: expire-claims.sh [--dry-run] [--max-age-hours 24]
set -euo pipefail

DRY=0
MAX_HOURS=24
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY=1; shift ;;
    --max-age-hours) MAX_HOURS="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,4p' "$0" | sed 's/^# //'
      exit 0
      ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  echo "gh is required" >&2
  exit 1
fi

export VOL_NOW_EPOCH
VOL_NOW_EPOCH="$(date -u +%s)"
export VOL_MAX_AGE_SECS=$((MAX_HOURS * 3600))

lease_state() {
  # JSON comments array on stdin → two lines: yes|no and reason
  python3 - <<'PY'
import datetime, json, os, re, sys
now = int(os.environ["VOL_NOW_EPOCH"])
max_age = int(os.environ["VOL_MAX_AGE_SECS"])
comments = json.load(sys.stdin)
iso = re.compile(
    r"(?:expires_at|expires)\s*:\s*([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:Z|[+-][0-9]{2}:[0-9]{2})?)",
    re.I,
)
claim_at = None
expiry = None
for c in comments:
    body = c.get("body") or ""
    created = c.get("createdAt") or c.get("created_at") or ""
    if re.search(r"(?i)claiming for|claimant:|claimed_at:", body):
        try:
            claim_at = int(datetime.datetime.fromisoformat(created.replace("Z", "+00:00")).timestamp())
        except Exception:
            pass
    for m in iso.finditer(body):
        raw = m.group(1)
        if raw.endswith("Z"):
            raw = raw[:-1] + "+00:00"
        try:
            expiry = int(datetime.datetime.fromisoformat(raw).timestamp())
        except Exception:
            pass
if expiry is not None:
    expired = expiry <= now
    reason = f"expires_at {expiry} <= now {now}"
elif claim_at is not None:
    expired = (now - claim_at) >= max_age
    reason = f"claim comment age {now - claim_at}s >= {max_age}s"
else:
    expired = False
    reason = "no claim timestamp"
print("yes" if expired else "no")
print(reason)
PY
}

issues="$(gh issue list --label claimed --state open --limit 100 --json number --jq '.[].number')"
if [[ -z "$issues" ]]; then
  echo "no claimed issues"
  exit 0
fi

released=0
while IFS= read -r num; do
  [[ -n "$num" ]] || continue
  comments="$(gh api "repos/{owner}/{repo}/issues/${num}/comments" --jq '[.[] | {body, createdAt: .created_at}]')"
  result="$(printf '%s' "$comments" | lease_state)"
  expired="$(printf '%s\n' "$result" | sed -n '1p')"
  reason="$(printf '%s\n' "$result" | sed -n '2p')"
  if [[ "$expired" != "yes" ]]; then
    echo "keep #$num ($reason)"
    continue
  fi
  echo "expire #$num ($reason)"
  if [[ "$DRY" -eq 1 ]]; then
    released=$((released + 1))
    continue
  fi
  gh issue edit "$num" --remove-label claimed --add-label claimable >/dev/null
  gh issue comment "$num" --body "Claim lease expired (\`${reason}\`). Returned to \`claimable\`. Workers do not merge. A new claimant may take this issue."
  released=$((released + 1))
done <<<"$issues"

echo "released $released lease(s)"
