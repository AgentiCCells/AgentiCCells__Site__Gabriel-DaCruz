// Every pushed commit carries an Agent: trailer (role@AgentiCCells.person; person may be hyphenated, e.g. gabriel-dacruz).
import { execSync } from 'node:child_process';
const [before, after] = process.argv.slice(2);
const zero = /^0+$/;
const range = !before || zero.test(before) ? after : `${before}..${after}`;
let shas = [];
try { shas = execSync(`git rev-list ${range}`, { encoding: 'utf8' }).split('\n').filter(Boolean); } catch { shas = [after]; }
const bad = shas.filter(s => !/^Agent: [a-z.-]+@agenticcells\.[a-z]+(?:-[a-z]+)*$/im.test(execSync(`git log -1 --format=%B ${s}`, { encoding: 'utf8' })));
// The repository's first commit was made by GitHub when the repository was created. It is pinned here: no other
// root commit (an orphan merged in later) is exempt.
const root = ['fe53e6983e80eac1ade4c384e8063a4169dd0e4f'];
const failing = bad.filter(s => !root.includes(s));
if (failing.length) { console.error('Commits without an Agent: trailer:\n' + failing.join('\n')); process.exit(1); }
console.log(`OK (${shas.length} commits)`);
