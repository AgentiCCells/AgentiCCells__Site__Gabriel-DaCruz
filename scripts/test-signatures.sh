#!/usr/bin/env bash
# Tests scripts/check-signatures.mjs in a throwaway repository, and asserts the reason for every failing case.
# The test repository pins gpg.ssh.program=ssh-keygen, so it never inherits a global signer.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
t="$(mktemp -d)"; trap 'rm -rf "$t"' EXIT
ssh-keygen -q -t ecdsa -b 256 -N '' -C good -f "$t/good"
ssh-keygen -q -t ecdsa -b 256 -N '' -C bad -f "$t/bad"
pem() { ssh-keygen -e -m PKCS8 -f "$1.pub"; }
keys() { python3 -c 'import json,sys; print(json.dumps([{"label":l,"status":"active","public_key":{"sign":open(p).read()}} for l,p in zip(sys.argv[1::2],sys.argv[2::2])]))' "$@"; }
pem "$t/good" > "$t/good.pem"; pem "$t/bad" > "$t/bad.pem"
r="$t/repo"; mkdir -p "$r/team" && cd "$r"
git init -q -b dev .
git config user.name test; git config user.email test@example.invalid
git config gpg.format ssh; git config gpg.ssh.program ssh-keygen; git config commit.gpgsign false
keys good "$t/good.pem" > team/keys.json; git add -A; git commit -q -m base
export SIG_BASELINE="$(git rev-parse HEAD)"
check() { node "$here/scripts/check-signatures.mjs" "$SIG_BASELINE" HEAD 2>&1; }
pass=0; fail=0
expect_ok() { if out=$(check); then echo "ok   $1"; pass=$((pass+1)); else echo "FAIL $1: $out"; fail=$((fail+1)); fi; }
expect_err() { if out=$(check); then echo "FAIL $1: passed"; fail=$((fail+1)); elif grep -q "$2" <<<"$out"; then echo "ok   $1 ($2)"; pass=$((pass+1)); else echo "FAIL $1: wrong reason: $out"; fail=$((fail+1)); fi; }
reset() { git reset -q --hard "$SIG_BASELINE"; }

echo a > f; git add f; git -c user.signingkey="$t/good" commit -q -S -m signed
expect_ok "a commit signed by a listed key passes"
reset; echo b > f; git add f; git commit -q -m unsigned
expect_err "an unsigned commit fails" "not signed"
reset; echo c > f; git add f; git -c user.signingkey="$t/bad" commit -q -S -m stranger
expect_err "a commit signed by an unlisted key fails" "No principal matched"
reset; keys good "$t/good.pem" bad "$t/bad.pem" > team/keys.json; git add -A; git -c user.signingkey="$t/bad" commit -q -S -m self-admit
expect_err "a commit that lists its own key and signs with it fails" "No principal matched"
reset; echo d > f; git add f; git -c user.name=conductor -c user.signingkey="$t/bad" commit -q -S -m by-name
expect_err "no exemption by author or committer name" "No principal matched"
reset; python3 -c 'import json; d=json.load(open("team/keys.json")); d[0]["status"]="revoked"; json.dump(d,open("team/keys.json","w"))'; git add -A; git -c user.signingkey="$t/good" commit -q -S -m revoke
echo e > f; git add f; git -c user.signingkey="$t/good" commit -q -S -m after-revoke
expect_err "a commit after its key is revoked fails" "lists no active or superseded key"
echo "$pass passed, $fail failed"; [ "$fail" -eq 0 ]
