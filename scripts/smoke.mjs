// Smoke test: serve _site/ on localhost and open every page in Chromium at phone and desktop widths.
// Fails on: a page that does not answer 200, a console error or uncaught exception, or any request to
// another host (SMOKE_ALLOW_HOSTS, comma-separated, may name map tile hosts if a site ever uses them).
// If the page has the orange grower's order form, it also walks the order to the pretend confirmation.
// Run after build: node scripts/smoke.mjs. CI installs Playwright first (see .github/workflows/pages.yml).
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = '_site';
const allow = (process.env.SMOKE_ALLOW_HOSTS || '').split(',').map(s => s.trim()).filter(Boolean);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let f = join(root, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(root).filter(f => f.endsWith('.html') && !f.endsWith('404.html')).map(f => '/' + f.slice(root.length + 1).replace(/index\.html$/, '')).sort();

const problems = []; const fail = m => problems.push(m);
const browser = await chromium.launch();
for (const [w, h] of [[390, 844], [1280, 900]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  for (const path of pages) {
    const page = await ctx.newPage(); const where = `${path} @${w}px`;
    page.on('console', m => { if (m.type() === 'error') fail(`${where}: console error: ${m.text()}`); });
    page.on('pageerror', e => fail(`${where}: uncaught: ${e.message}`));
    page.on('request', r => {
      const u = new URL(r.url()); if (['data:', 'blob:', 'about:'].includes(u.protocol)) return;
      if (u.origin !== origin && !allow.includes(u.host)) fail(`${where}: request to another host: ${u.host}${u.pathname}`);
    });
    page.on('response', r => { if (r.url().startsWith(origin) && r.status() >= 400) fail(`${where}: ${r.status()} for ${r.url().slice(origin.length)}`); });
    try {
      const res = await page.goto(origin + path, { waitUntil: 'networkidle', timeout: 30000 });
      if (!res || res.status() !== 200) fail(`${where}: status ${res && res.status()}`);
      if (!(await page.title())) fail(`${where}: empty title`);
      if (await page.$('#form #to2')) await orderFlow(page, where);
    } catch (e) { fail(`${where}: ${e.message.split('\n')[0]}`); }
    await page.close();
  }
  await ctx.close();
}
await browser.close(); server.close();

// The orange grower's order: choose crates, a zone, see a total, confirm the pretend order.
async function orderFlow(page, where) {
  const qty = await page.$('#lines input[type=number]'); if (!qty) return fail(`${where}: order form has no quantity inputs`);
  await qty.fill('2'); await qty.dispatchEvent('input');
  if (await page.$eval('#to2', b => b.disabled)) return fail(`${where}: order: next stays disabled after choosing crates`);
  await page.click('#to2'); await page.click('#to3');
  const total = await page.$eval('#quote', q => (q.querySelector('.total') || q).textContent);
  if (!/\d/.test(total)) fail(`${where}: order: quote shows no total`);
  await page.check('#ok'); await page.click('#send');
  const done = await page.$eval('#done', d => d.textContent);
  if (!/(SIMULATION|SIMULAÇÃO)/.test(done)) fail(`${where}: order: no pretend confirmation`);
}

if (problems.length) { console.error(problems.join('\n')); console.error(`SMOKE FAILED: ${problems.length} problem(s) on ${pages.length} page(s)`); process.exit(1); }
console.log(`smoke OK (${pages.length} page(s) at 390 and 1280 px${allow.length ? '; allowed hosts ' + allow.join(',') : ''})`);
