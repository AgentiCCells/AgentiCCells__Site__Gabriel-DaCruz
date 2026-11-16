// Every pushed commit carries an Agent: trailer (role@AgentiCCells.person).
import { execSync } from 'node:child_process';
const [before, after] = process.argv.slice(2);
const zero = /^0+$/;
const range = !before || zero.test(before) ? after : `${before}..${after}`;
let shas = [];
try { shas = execSync(`git rev-list ${range}`, { encoding: 'utf8' }).split('\n').filter(Boolean); } catch { shas = [after]; }
const bad = shas.filter(s => !/^Agent: [a-z-]+@agenticcells\.[a-z]+$/im.test(execSync(`git log -1 --format=%B ${s}`, { encoding: 'utf8' })));
// The repository's first commit was made by GitHub when the repository was created.
const root = execSync('git rev-list --max-parents=0 HEAD', { encoding: 'utf8' }).split('\n').filter(Boolean);
const failing = bad.filter(s => !root.includes(s));
if (failing.length) { console.error('Commits without an Agent: trailer:\n' + failing.join('\n')); process.exit(1); }
console.log(`OK (${shas.length} commits)`);
