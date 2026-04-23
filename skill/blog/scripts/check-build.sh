#!/usr/bin/env bash
# check-build.sh — poll GitHub Actions for the latest build status
# Usage: check-build.sh <owner/repo> [github-token]
#
# Example:
#   check-build.sh Nesbitt-bot/Station2141

set -euo pipefail

REPO="${1:?Usage: check-build.sh <owner/repo> [github-token]}"
TOKEN="${2:-${GITHUB_TOKEN:-}}"

AUTH_HEADER=""
if [ -n "$TOKEN" ]; then
  AUTH_HEADER="Authorization: Bearer $TOKEN"
fi

MAX_ATTEMPTS=12
INTERVAL=15

for i in $(seq 1 $MAX_ATTEMPTS); do
  RESPONSE=$(curl -s \
    ${AUTH_HEADER:+-H "$AUTH_HEADER"} \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/actions/runs?per_page=1")

  STATUS=$(echo "$RESPONSE" | python3 -c "import sys,json; r=json.load(sys.stdin)['workflow_runs'][0]; print(r['status'], r.get('conclusion','pending'))" 2>/dev/null || echo "error")

  echo "Attempt ${i}/${MAX_ATTEMPTS}: ${STATUS}"

  case "$STATUS" in
    *success*)
      echo "✓ Build succeeded"
      exit 0
      ;;
    *failure*)
      echo "✗ Build failed"
      exit 1
      ;;
    *error*)
      echo "? Could not check status"
      ;;
  esac

  if [ "$i" -lt "$MAX_ATTEMPTS" ]; then
    sleep "$INTERVAL"
  fi
done

echo "⏱ Timed out waiting for build"
exit 2
