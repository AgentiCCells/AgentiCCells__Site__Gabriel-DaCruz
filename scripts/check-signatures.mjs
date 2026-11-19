// Every commit after the baseline carries a git SSH signature made by a signing key listed in its FIRST PARENT's
// team/keys.json (status "active" or "superseded"), never the commit's own, so a commit cannot admit the key that
// signs it. No commit is exempt by author or committer name. Rule from Dinis Cruz, 2026-11-19 ~01:10 UTC: every commit is signed by the
// key of the agent that maintains the repository. Commits up to and including BASELINE were made before the rule.
// Usage: node scripts/check-signatures.mjs [before] [after]   (no arguments: every commit after the baseline on HEAD)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { createPublicKey } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASELINE = '11c6c7b16e8ec68a5b1221b3fd579dc17e3dfe49';
const [before, after = 'HEAD'] = process.argv.slice(2);
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
const range = !before || zero.test(before) ? [after, `^${BASELINE}`] : [`${before}..${after}`, `^${BASELINE}`];
let shas = execFileSync('git', ['rev-list', ...range], { encoding: 'utf8' }).split('\n').filter(Boolean);
shas = shas.filter(s => s !== BASELINE && !isAncestor(s, BASELINE));

const bad = [];
for (const s of shas) {
  try {
    const signers = signersFor(s);
    execFileSync('git', ['-c', 'gpg.format=ssh', '-c', `gpg.ssh.allowedSignersFile=${signers}`, 'verify-commit', s], { stdio: 'pipe' });
  } catch (e) { bad.push(`${s.slice(0, 7)}: ${String(e.stderr || e.message).trim().split('\n').pop() || 'not signed'}`); }
}
rmSync(dir, { recursive: true, force: true });
if (bad.length) { console.error('Commits not signed by a key in team/keys.json:\n' + bad.join('\n')); process.exit(1); }
console.log(`OK (${shas.length} signed commit(s), each by a key in its parent's team/keys.json)`);
