// Every pushed commit carries an Agent: trailer (role@AgentiCCells.person; person may be hyphenated, e.g. gabriel-dacruz).
// Usage: node check-commits.mjs <before> <after>. The range is before..after: commits are skipped only by ancestry
// (ancestors of before), never by date, file, path, message or name. A missing or zero before stops the check.
import { execFileSync } from 'node:child_process';
const [before, after] = process.argv.slice(2);
if (!before || /^0+$/.test(before) || !after) { console.error('check-commits: a non-zero <before> and an <after> are required'); process.exit(1); }
try { execFileSync('git', ['merge-base', '--is-ancestor', before, after]); }
catch { console.error(`check-commits: ${before} is not an ancestor of ${after}`); process.exit(1); }
const shas = execFileSync('git', ['rev-list', `${before}..${after}`], { encoding: 'utf8' }).split('\n').filter(Boolean);
const bad = shas.filter(s => !/^Agent: [a-z.-]+@agenticcells\.[a-z]+(?:-[a-z]+)*$/im.test(execFileSync('git', ['log', '-1', '--format=%B', s], { encoding: 'utf8' })));
if (bad.length) { console.error('Commits without an Agent: trailer:\n' + bad.join('\n')); process.exit(1); }
console.log(`OK (${shas.length} commits)`);
