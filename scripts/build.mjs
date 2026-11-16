// Build: copy src/ to _site/, stamp the version, write version.json.
// SITE_VERSION is set by CI only (v0.1.N); a local build says "dev".
// Shared fragments (figures, source lists) live in src/_inc/ and are pulled into pages with
// <!--#inc name.ext -->, so every design shows the same figure; _inc/ itself is not published.
import { cpSync, rmSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const version = process.env.SITE_VERSION || 'dev';
rmSync('_site', { recursive: true, force: true });
cpSync('src', '_site', { recursive: true });
const inc = (s, depth = 0) => s.replace(/<!--#inc ([\w./-]+) -->/g, (_, n) => {
  if (depth > 4 || n.includes('..')) throw new Error(`bad include ${n}`);
  return inc(readFileSync(join('src/_inc', n), 'utf8').trim(), depth + 1);
});
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
for (const f of walk('_site')) {
  if (!/\.(html|js|css|json|md|txt)$/.test(f)) continue;
  const raw = readFileSync(f, 'utf8');
  const s = f.endsWith('.html') ? inc(raw) : raw;
  if (s !== raw || s.includes('__VERSION__')) writeFileSync(f, s.replaceAll('__VERSION__', version));
}
rmSync('_site/_inc', { recursive: true, force: true });
writeFileSync('_site/version.json', JSON.stringify({ version, commit: process.env.GITHUB_SHA || 'local', built: new Date().toISOString() }, null, 2) + '\n');
writeFileSync('_site/.nojekyll', '');
console.log(`built _site/ (${version})`);
