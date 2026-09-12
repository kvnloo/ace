#!/usr/bin/env bash
# Create preview, nightly, and dev from the default branch if missing.
# Does not force-push. Does not touch main.
# Usage: ensure-rollout-branches.sh --root DIR [--push]
set -euo pipefail

ROOT="."
PUSH=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --root) ROOT="$2"; shift 2 ;;
    --push) PUSH=1; shift ;;
    -h|--help)
      echo "Usage: $0 [--root DIR] [--push]"
      exit 0
      ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

ROOT="$(cd "$ROOT" && pwd)"
git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null

DEFAULT=main
if git -C "$ROOT" rev-parse --verify -q origin/main >/dev/null; then
  DEFAULT=main
elif git -C "$ROOT" symbolic-ref -q refs/remotes/origin/HEAD >/dev/null; then
  DEFAULT="$(git -C "$ROOT" symbolic-ref --short refs/remotes/origin/HEAD | sed 's#^origin/##')"
fi

scheme="rolling"
if [[ -f "$ROOT/.verified-oss-loop/rollout.yml" ]]; then
  scheme="$(python3 "$(dirname "$0")/rollout.py" --root "$ROOT" get scheme)"
fi
if [[ "$scheme" == "stable" ]]; then
  echo "scheme=stable: no extra channels"
  exit 0
fi

for b in preview nightly dev; do
  if git -C "$ROOT" rev-parse --verify -q "origin/$b" >/dev/null; then
    echo "keep origin/$b"
    continue
  fi
  if git -C "$ROOT" rev-parse --verify -q "$b" >/dev/null; then
    echo "keep local $b"
  else
    git -C "$ROOT" branch "$b" "origin/$DEFAULT"
    echo "created $b from origin/$DEFAULT"
  fi
  if [[ "$PUSH" -eq 1 ]]; then
    git -C "$ROOT" push -u origin "$b"
  fi
done
