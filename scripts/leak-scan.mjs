// Leak scan over tracked files and the built site. Ciphertext under .sg_vault/bare is skipped (it is
// protected by the vault key, which must never be in the tree; checked separately below).
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const shapes = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key block'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key id'],
  [/\bgh[pousr]_[A-Za-z0-9]{30,}\b/, 'GitHub token'],
  [/\bsk-or-v1-[a-f0-9]{20,}/, 'OpenRouter key'],
  [/\bsk-ant-[A-Za-z0-9_-]{20,}/, 'Anthropic key'],
  [/\bsgit_private_(vault|read)_[A-Za-z0-9]/, 'sgit private key'],
  [/\bya29\.[A-Za-z0-9_-]{20,}/, 'Google OAuth token'],
];
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const tracked = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);
const files = [...tracked, ...(existsSync('_site') ? walk('_site') : [])].filter(f => !f.startsWith('.sg_vault/bare/') && existsSync(f));
const bad = [];
for (const f of files) {
  if (f.startsWith('.sg_vault/local/')) { bad.push(`${f}: a file from .sg_vault/local is tracked`); continue; }
  const s = readFileSync(f, 'latin1');
  for (const [re, what] of shapes) if (re.test(s)) bad.push(`${f}: ${what}`);
}
// The vault's own secrets, when this checkout holds them, must appear nowhere in tracked files or the site.
const secrets = [];
for (const p of ['.sg_vault/local/vault_key', '.sg_vault/local/token']) if (existsSync(p)) { const v = readFileSync(p, 'utf8').trim(); secrets.push(v, v.split(':')[0]); }
for (const k of ['SG_SEND_ACCESS_KEY', 'OPENROUTER_API_KEY']) if (process.env[k]) secrets.push(process.env[k]);
for (const f of files) { const s = readFileSync(f, 'latin1'); for (const x of secrets) if (x && x.length >= 8 && s.includes(x)) bad.push(`${f}: holds a vault or access secret`); }
if (bad.length) { console.error(bad.join('\n')); console.error(`LEAK SCAN FAILED: ${bad.length}`); process.exit(1); }
console.log(`OK (${files.length} files)`);
