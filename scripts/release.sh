#!/usr/bin/env bash
# Run every gate, then rebase on dev and push. Stops at the first failure. Never pipe a gate.
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/build.mjs
node scripts/validate.mjs
node scripts/smoke.mjs
git fetch -q origin dev
scripts/test-signatures.sh
# The security checks come from origin/dev (the trusted base), never from the tree being released; fail closed.
trusted="$(mktemp -d)"; trap 'rm -rf "$trusted"' EXIT
for f in check-signatures.mjs check-commits.mjs leak-scan.mjs; do git show "origin/dev:scripts/$f" > "$trusted/$f"; done
node "$trusted/check-commits.mjs" origin/dev HEAD
node "$trusted/check-signatures.mjs" origin/dev HEAD
node "$trusted/leak-scan.mjs"
for i in 1 2 3 4 5; do
  git fetch -q origin dev
  git rebase -q origin/dev
  node scripts/build.mjs >/dev/null && node scripts/validate.mjs >/dev/null && node "$trusted/leak-scan.mjs" >/dev/null
  if git -c push.negotiate=true push -q origin HEAD:dev; then echo "released $(git rev-parse --short HEAD) to dev"; exit 0; fi
  sleep $((i * 3))
done
echo "release failed after 5 attempts" >&2; exit 1
