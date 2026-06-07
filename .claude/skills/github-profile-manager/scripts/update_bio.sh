#!/usr/bin/env bash
# update_bio.sh — update GitHub profile bio and fields via gh API
# Requires: gh CLI authenticated with a token that has `user` scope.
# Usage: ./update_bio.sh "New bio text here"
#
# For other fields, edit the PATCH calls below or run them manually:
#   gh api -X PATCH user -f company="..." -f location="..." -f blog="..."

set -euo pipefail

# 1. Confirm auth + identity
echo "→ Checking auth..."
gh auth status >/dev/null 2>&1 || { echo "✗ Not authenticated. Run: gh auth login"; exit 1; }

LOGIN=$(gh api user --jq .login)
if [ "$LOGIN" != "Samuel-Tabares" ]; then
  echo "✗ Authenticated as '$LOGIN', expected 'Samuel-Tabares'. Aborting."
  exit 1
fi
echo "✓ Authenticated as $LOGIN"

# 2. Bio
BIO="${1:-}"
if [ -z "$BIO" ]; then
  echo "Usage: ./update_bio.sh \"New bio text\""
  echo "Current bio:"
  gh api user --jq .bio
  exit 0
fi

# Warn if over GitHub's ~160 char soft limit
LEN=${#BIO}
if [ "$LEN" -gt 160 ]; then
  echo "⚠ Bio is $LEN chars (>160). GitHub may truncate. Continue? [y/N]"
  read -r ans
  [ "$ans" = "y" ] || { echo "Aborted."; exit 1; }
fi

echo "→ Setting bio to:"
echo "   $BIO"
gh api -X PATCH user -f bio="$BIO" --jq '{bio}'
echo "✓ Bio updated."

# 3. Show resulting profile snapshot
echo "→ Current profile:"
gh api user --jq '{name, bio, company, location, blog}'
