#!/usr/bin/env bash
# Tests scripts/check-signatures.mjs in a throwaway repository, and asserts the reason for every failing case.
# The test repository pins gpg.ssh.program=ssh-keygen, so it never inherits a global signer.
set -euo pipefail
# The test sets SIG_BASELINE, which the checker refuses under CI, so CI markers are cleared for its own runs.
unset CI GITHUB_ACTIONS
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
reset; git checkout -q --orphan stray; git -c user.signingkey="$t/good" commit -q -S -m orphan; o="$(git rev-parse HEAD)"
git checkout -q dev; git -c user.signingkey="$t/good" merge -q -S --allow-unrelated-histories -m "merge orphan" "$o" 2>/dev/null
expect_err "an orphan commit is refused" "orphan commit"
git branch -q -D stray
reset; mkdir -p scripts; cp "$here/scripts/check-signatures.mjs" scripts/; git add -A; git -c user.signingkey="$t/good" commit -q -S -m "add checker"
trusted="$(git rev-parse HEAD)"; echo "process.exit(0)" > scripts/check-signatures.mjs; echo f > f; git add -A; git commit -q -m "weaken checker, unsigned"
if node scripts/check-signatures.mjs "$trusted" HEAD >/dev/null 2>&1; then echo "     (the pushed tree's own checker would pass this commit)"; fi
git show "$trusted:scripts/check-signatures.mjs" > "$t/trusted.mjs"
if out=$(node "$t/trusted.mjs" "$trusted" HEAD 2>&1); then echo "FAIL the trusted copy refuses a commit that weakens the checker: passed"; fail=$((fail+1));
elif grep -q "not signed" <<<"$out"; then echo "ok   a push that weakens the checker, with an unsigned commit, still fails (not signed)"; pass=$((pass+1));
else echo "FAIL the trusted copy refuses a commit that weakens the checker: wrong reason: $out"; fail=$((fail+1)); fi
git clone -q --depth 1 "file://$r" "$t/shallow"; git -C "$t/shallow" config gpg.ssh.program ssh-keygen
if out=$(cd "$t/shallow" && node "$here/scripts/check-signatures.mjs" "$SIG_BASELINE" HEAD 2>&1); then echo "FAIL a shallow checkout is refused: passed"; fail=$((fail+1));
elif grep -q "shallow checkout" <<<"$out"; then echo "ok   a shallow checkout is refused (shallow checkout)"; pass=$((pass+1));
else echo "FAIL a shallow checkout is refused: wrong reason: $out"; fail=$((fail+1)); fi
reset; mkdir -p scripts; cp "$here/scripts/check-signatures.mjs" scripts/; git add -A; git -c user.signingkey="$t/good" commit -q -S -m "add checker"
trusted="$(git rev-parse HEAD)"; git rm -q scripts/check-signatures.mjs; echo g > f; git add -A; git commit -q -m "remove checker, unsigned"
git show "$trusted:scripts/check-signatures.mjs" > "$t/trusted.mjs"
if out=$(node "$t/trusted.mjs" "$trusted" HEAD 2>&1); then echo "FAIL a push that removes the checker, with an unsigned change, fails: passed"; fail=$((fail+1));
elif grep -q "not signed" <<<"$out"; then echo "ok   a push that removes the checker, with an unsigned change, fails (not signed)"; pass=$((pass+1));
else echo "FAIL a push that removes the checker, with an unsigned change, fails: wrong reason: $out"; fail=$((fail+1)); fi
if out=$(CI=true node "$here/scripts/check-signatures.mjs" "$SIG_BASELINE" HEAD 2>&1); then echo "FAIL the base cannot be overridden under CI: passed"; fail=$((fail+1));
elif grep -q "not allowed under CI" <<<"$out"; then echo "ok   the base cannot be overridden under CI (not allowed under CI)"; pass=$((pass+1));
else echo "FAIL the base cannot be overridden under CI: wrong reason: $out"; fail=$((fail+1)); fi
# The CI step that picks the trusted base, taken from the workflow file and run here.
python3 - "$here/.github/workflows/pages.yml" > "$t/step.sh" <<'PY'
import re, sys
m = re.search(r'id: trusted.*?run: \|\n(.*?)\n      - name', open(sys.argv[1]).read(), re.S)
print('\n'.join(l[10:] for l in m.group(1).split('\n')))
PY
step() { ( export EVENT="$1" BEFORE="$2" REF="$3" GITHUB_SHA="$(git rev-parse HEAD)" RUNNER_TEMP="$t/rt" GITHUB_OUTPUT=/dev/null VERSION_BASE=0.1; rm -rf "$t/rt"; mkdir -p "$t/rt"; bash -e "$t/step.sh" 2>&1 ); }
expect_step_err() { if out=$(step "$2" "$3" "$4"); then echo "FAIL $1: passed"; fail=$((fail+1)); elif grep -q "$5" <<<"$out"; then echo "ok   $1 ($5)"; pass=$((pass+1)); else echo "FAIL $1: wrong reason: $out"; fail=$((fail+1)); fi; }
reset; git tag v0.1.0; mkdir -p scripts; for f in check-signatures.mjs check-commits.mjs leak-scan.mjs; do cp "$here/scripts/$f" scripts/; done
git add -A; git -c user.signingkey="$t/good" commit -q -S -m "add checks"; withchecks="$(git rev-parse HEAD)"
echo h > f; git add f; git -c user.signingkey="$t/good" commit -q -S -m next
if out=$(step push "$withchecks" refs/heads/dev) && grep -q "Trusted base: $withchecks" <<<"$out"; then echo "ok   a push takes its checks from BEFORE"; pass=$((pass+1)); else echo "FAIL a push takes its checks from BEFORE: $out"; fail=$((fail+1)); fi
expect_step_err "a push with BEFORE zero fails" push 0000000000000000000000000000000000000000 refs/heads/dev "no trusted base"
expect_step_err "a push whose BEFORE has no checker fails (no fallback)" push "$SIG_BASELINE" refs/heads/dev "has no scripts/"
expect_step_err "a manual run whose release tag has no checker copy fails" workflow_dispatch "" refs/heads/dev "has no scripts/"
expect_step_err "a manual run on another branch fails" workflow_dispatch "" refs/heads/other "no trusted base"
git checkout -q --orphan forced; git -c user.signingkey="$t/good" commit -q -S -m forced; forced="$(git rev-parse HEAD)"; git checkout -q dev
expect_step_err "a push whose BEFORE is not an ancestor fails (force push)" push "$forced" refs/heads/dev "is not an ancestor"
if out=$(node "$here/scripts/check-signatures.mjs" "$forced" HEAD 2>&1); then echo "FAIL the checker refuses a BEFORE that is not an ancestor: passed"; fail=$((fail+1)); elif grep -q "is not an ancestor" <<<"$out"; then echo "ok   the checker refuses a BEFORE that is not an ancestor (is not an ancestor)"; pass=$((pass+1)); else echo "FAIL the checker refuses a BEFORE that is not an ancestor: wrong reason: $out"; fail=$((fail+1)); fi
git branch -q -D forced; git tag -d v0.1.0 >/dev/null
reset; git checkout -q --orphan old; GIT_AUTHOR_DATE="2001-01-01T00:00:00Z" GIT_COMMITTER_DATE="2001-01-01T00:00:00Z" git -c user.signingkey="$t/good" commit -q -S -m "backdated orphan"; o="$(git rev-parse HEAD)"
git checkout -q dev; git -c user.signingkey="$t/good" merge -q -S --allow-unrelated-histories -m "merge backdated" "$o" 2>/dev/null
expect_err "a backdated orphan commit is refused" "orphan commit"
git branch -q -D old
echo "$pass passed, $fail failed"; [ "$fail" -eq 0 ]
