#!/usr/bin/env bash
# publish.sh — commit and push a new blog post to the Hugo site repo
# Usage: publish.sh <repo-path> <post-slug> [commit-message]
#
# Example:
#   publish.sh /path/to/Station2141 economic-value-after-ai "Add post: economic value after AI"

set -euo pipefail

REPO_PATH="${1:?Usage: publish.sh <repo-path> <post-slug> [commit-message]}"
POST_SLUG="${2:?Usage: publish.sh <repo-path> <post-slug> [commit-message]}"
COMMIT_MSG="${3:-Add post: ${POST_SLUG}}"

cd "$REPO_PATH"

# Stage the post directory
git add "content/posts/${POST_SLUG}/"

# Also stage any category/tag changes
git add -A content/ 2>/dev/null || true

git commit -m "$COMMIT_MSG"
git push origin main

echo "✓ Published: ${POST_SLUG}"
echo "  Waiting for GitHub Actions build..."
