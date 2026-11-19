// Every commit after the baseline carries a git SSH signature made by a signing key listed in its FIRST PARENT's
// team/keys.json (status "active" or "superseded"), never the commit's own, so a commit cannot admit the key that
// signs it. No commit is exempt by author or committer name. Rule from Dinis Cruz, 2026-11-19 ~01:10 UTC: every commit is signed by the
// key of the agent that maintains the repository. Commits up to and including BASELINE were made before the rule.
// Run it from the trusted base's copy, never the pushed tree's (CI and release.sh take it with git show).
// Usage: node check-signatures.mjs <before> <after>. A missing or zero <before>, or one that is not an ancestor of
// <after> (a force push), stops the check. Skips are by ancestry only, never by date, file, path, message or name.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { createPublicKey } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Commits up to BASELINE are skipped only because they are its ancestors (git merge-base --is-ancestor), never by
// what a tree holds. SIG_BASELINE overrides it for scripts/test-signatures.sh only, and never under CI.
const PINNED = '11c6c7b16e8ec68a5b1221b3fd579dc17e3dfe49';
if (process.env.SIG_BASELINE && (process.env.CI || process.env.GITHUB_ACTIONS)) { console.error('SIG_BASELINE is not allowed under CI'); process.exit(1); }
const BASELINE = process.env.SIG_BASELINE || PINNED;
// A shallow checkout hides history (parents, keys), so the check refuses to run in one. CI uses fetch-depth 0.
if (execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim() !== 'false') {
  console.error('shallow checkout: the signature check needs full history (fetch-depth 0)'); process.exit(1);
}
const [before, after] = process.argv.slice(2);
if (!before || /^0+$/.test(before) || !after) { console.error('check-signatures: a non-zero <before> and an <after> are required'); process.exit(1); }
try { execFileSync('git', ['merge-base', '--is-ancestor', before, after]); }
catch { console.error(`check-signatures: ${before} is not an ancestor of ${after} (force push?)`); process.exit(1); }
const zero = /^0+$/;

// An ECDSA P-256 public key (PEM, SPKI) in OpenSSH form.
function sshKey(pem) {
  const jwk = createPublicKey(pem).export({ format: 'jwk' });
  if (jwk.kty !== 'EC' || jwk.crv !== 'P-256') throw new Error(`unsupported signing key ${jwk.kty} ${jwk.crv}`);
  const str = s => { const b = Buffer.from(s); const l = Buffer.alloc(4); l.writeUInt32BE(b.length); return Buffer.concat([l, b]); };
  const point = Buffer.concat([Buffer.from([4]), Buffer.from(jwk.x, 'base64url'), Buffer.from(jwk.y, 'base64url')]);
  const blob = Buffer.concat([str('ecdsa-sha2-nistp256'), str('nistp256'), str(point)]);
  return `ecdsa-sha2-nistp256 ${blob.toString('base64')}`;
}

const dir = mkdtempSync(join(tmpdir(), 'signers-'));
// The allowed signers file for a commit, built from its first parent's team/keys.json.
function signersFor(sha) {
  // An orphan commit (no parent) has no parent keys to trust, so it is refused.
  const parents = execFileSync('git', ['rev-list', '--parents', '-n', '1', sha], { encoding: 'utf8' }).trim().split(' ').slice(1);
  if (!parents.length) throw new Error('orphan commit: it has no parent, so no parent keys to trust');
  let keys;
  try { keys = JSON.parse(execFileSync('git', ['show', `${sha}^1:team/keys.json`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })); }
  catch { throw new Error('its parent has no readable team/keys.json'); }
  keys = keys.filter(k => ['active', 'superseded'].includes(k.status));
  if (!keys.length) throw new Error('its parent lists no active or superseded key');
  const f = join(dir, `${sha}.signers`);
  writeFileSync(f, keys.map(k => `${k.label} namespaces="git" ${sshKey(k.public_key.sign)}`).join('\n') + '\n');
  return f;
}

const isAncestor = (a, b) => { try { execFileSync('git', ['merge-base', '--is-ancestor', a, b]); return true; } catch { return false; } };
const range = [`${before}..${after}`, `^${BASELINE}`];
let shas = execFileSync('git', ['rev-list', ...range], { encoding: 'utf8' }).split('\n').filter(Boolean);
shas = shas.filter(s => s !== BASELINE && !isAncestor(s, BASELINE));

const bad = [];
for (const s of shas) {
  try {
    const signers = signersFor(s);
    execFileSync('git', ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${signers}`, 'verify-commit', s], { stdio: 'pipe' });
  } catch (e) { bad.push(`${s.slice(0, 7)}: ${String(e.stderr || e.message).trim().split('\n').pop() || 'not signed'}`); }
}
rmSync(dir, { recursive: true, force: true });
if (bad.length) { console.error('Commits not signed by a key in team/keys.json:\n' + bad.join('\n')); process.exit(1); }
console.log(`OK (${shas.length} signed commit(s), each by a key in its parent's team/keys.json)`);
