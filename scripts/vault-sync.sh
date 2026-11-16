#!/usr/bin/env bash
# Sync this commit's working tree into the site's sgit vault (the vault named in hub.json).
# Runs in CI only when the SGIT_VAULT_KEY secret exists; without it, it says so and exits 0.
# SGIT_TOKEN (an SG/Send access token) is passed too when that secret exists.
# The key is never printed: GitHub masks it, and every line of sgit output is filtered here as well.
# Flow (sgit.ai docs/vault/git-and-vaults.md, "the round trip"): attach with the key, pull the server's
# state, commit what changed in git, push. sgit honours .gitignore, so _site/ and node_modules/ stay out.
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -z "${SGIT_VAULT_KEY:-}" ]; then echo "vault sync skipped: no SGIT_VAULT_KEY secret"; exit 0; fi
[ -n "${GITHUB_ACTIONS:-}" ] && echo "::add-mask::${SGIT_VAULT_KEY}"
[ -n "${GITHUB_ACTIONS:-}" ] && [ -n "${SGIT_TOKEN:-}" ] && echo "::add-mask::${SGIT_TOKEN}"
mask() { python3 -c '
import os, sys
secrets = [s for s in (os.environ.get("SGIT_VAULT_KEY"), os.environ.get("SGIT_TOKEN")) if s]
secrets += [p for s in secrets for p in s.split(":") if len(p) >= 8]
for line in sys.stdin:
    for s in secrets: line = line.replace(s, "***")
    sys.stdout.write(line)'; }
run() { "$@" 2>&1 | mask; return "${PIPESTATUS[0]}"; }

read -r vault_id server < <(python3 -c 'import json; v = json.load(open("hub.json"))["vault"]; print(v["id"], v["server"])')
key_id="${SGIT_VAULT_KEY##*:}"
if [ "$key_id" != "$vault_id" ]; then echo "vault sync refused: the key is not for vault $vault_id (hub.json)"; exit 1; fi
command -v sgit >/dev/null || pip install -q sgit-ai==0.27.0
token=(); [ -n "${SGIT_TOKEN:-}" ] && token=(--token "$SGIT_TOKEN")
run sgit vault attach --vault-key "$SGIT_VAULT_KEY" --base-url "$server" "${token[@]}" .
run sgit pull
run sgit status
subject="$(git log -1 --format='%h %s')"
if run sgit commit --allow-deletions -m "git ${subject}"; then echo "committed to vault $vault_id"; else echo "nothing new to commit (or commit refused; see above)"; fi
run sgit push "${token[@]}"
echo "vault $vault_id synced to ${subject%% *}"
