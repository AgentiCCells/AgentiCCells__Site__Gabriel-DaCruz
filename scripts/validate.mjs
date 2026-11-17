// Gate: fails the build on any problem. Never weaken a check to get a release out.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const problems = [];
const fail = m => problems.push(m);
const hype = /\b(revolutionary|cutting[- ]edge|seamless(?:ly)?|world[- ]class|game[- ]changing)\b/i;
const files = walk('_site');
for (const f of files) {
  if (!/\.(html|js|css|json|md)$/.test(f)) continue;
  const s = readFileSync(f, 'utf8');
  s.split('\n').forEach((line, i) => {
    if (line.includes('—')) fail(`${f}:${i + 1}: em dash`);
    const m = line.match(hype); if (m) fail(`${f}:${i + 1}: hype word "${m[0]}"`);
  });
  if (f.endsWith('.html')) {
    if (!/<title>[^<]+<\/title>/.test(s)) fail(`${f}: no <title>`);
    if (!/<html lang="/.test(s)) fail(`${f}: no lang on <html>`);
    // Link previews (WhatsApp, LinkedIn, Slack, iMessage): every page needs Open Graph tags with an
    // absolute https image, served by this site, at most 300 KB (WhatsApp drops larger images).
    const meta = n => (s.match(new RegExp(`<meta (?:property|name)="${n}" content="([^"]*)"`)) || [])[1];
    for (const n of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'twitter:card']) if (!meta(n)) fail(`${f}: no ${n} (link previews)`);
    const img = meta('og:image'), url = meta('og:url');
    if (img && !/^https:\/\//.test(img)) fail(`${f}: og:image must be an absolute https URL`);
    if (img && url && /^https:\/\//.test(img) && new URL(img).host === new URL(url).host) {
      const local = join('_site', decodeURIComponent(new URL(img).pathname));
      if (!existsSync(local)) fail(`${f}: og:image ${img} is not in the site`);
      else if (statSync(local).size > 300 * 1024) fail(`${f}: og:image is ${Math.round(statSync(local).size / 1024)} KB; keep it at most 300 KB`);
    }
    for (const m of s.matchAll(/<script[^>]+src="([^"]+)"/g)) if (/^(https?:)?\/\//.test(m[1])) fail(`${f}: third-party script ${m[1]}`);
    for (const m of s.matchAll(/(?:href|src)="([^"#?]+)/g)) {
      const u = m[1]; if (/^(https?:|mailto:|data:|\/\/)/.test(u)) continue;
      const target = u.startsWith('/') ? join('_site', u) : join(dirname(f), u);
      if (!existsSync(target) && !existsSync(join(target, 'index.html'))) fail(`${f}: broken link ${u}`);
    }
  }
}
if (!existsSync('_site/version.json')) fail('no version.json');
if (!existsSync('_site/index.html')) fail('no index.html');
try { JSON.parse(readFileSync('hub.json', 'utf8')); } catch (e) { fail('hub.json is missing or not JSON'); }
if (problems.length) { console.error(problems.join('\n')); console.error(`FAILED: ${problems.length} problem(s)`); process.exit(1); }
console.log('OK');
