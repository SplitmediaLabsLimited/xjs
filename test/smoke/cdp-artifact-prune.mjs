import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = new URL('../..', import.meta.url);
const script = new URL('scripts/prune-xsplit-cdp-artifacts.mjs', root);
const artifactRoot = await mkdtemp(join(tmpdir(), 'xjs-cdp-artifacts-'));
const runs = [
  '2026-05-14T13-00-00-000Z',
  '2026-05-14T13-10-00-000Z',
  '2026-05-14T13-20-00-000Z',
  '2026-05-14T13-30-00-000Z',
];

for (const run of runs) {
  await mkdir(join(artifactRoot, run), { recursive: true });
  await writeFile(join(artifactRoot, run, 'results.json'), JSON.stringify({ run }));
}

await writeFile(join(artifactRoot, 'latest-summary.json'), JSON.stringify({
  artifactDirectory: `artifacts/xsplit-cdp/${runs[1]}`,
}));

const env = {
  ...process.env,
  XJS_CDP_ARTIFACT_ROOT: artifactRoot,
  XJS_CDP_ARTIFACT_KEEP: '2',
};

const dryRun = await execFileAsync(process.execPath, [script.pathname], { env });
const dryRunResult = JSON.parse(dryRun.stdout);

assert.equal(dryRunResult.dryRun, true, 'prune should default to dry-run');
assert.deepEqual(dryRunResult.deleted, [], 'dry-run should not delete directories');
assert.deepEqual(
  dryRunResult.toDelete.map(item => item.name),
  [runs[0]],
  'dry-run should only plan to delete runs outside newest keep count and latest summary target'
);
assert.deepEqual((await readdir(artifactRoot)).filter(name => name.endsWith('Z')).sort(), runs);

const deleted = await execFileAsync(process.execPath, [script.pathname, '--yes'], { env });
const deletedResult = JSON.parse(deleted.stdout);
assert.equal(deletedResult.dryRun, false);
assert.deepEqual(deletedResult.deleted.map(item => item.name), [runs[0]]);

const remaining = (await readdir(artifactRoot)).filter(name => name.endsWith('Z')).sort();
assert.deepEqual(remaining, runs.slice(1));

const readme = await readFile(new URL('README.md', root), 'utf8');
assert.match(readme, /npm run artifacts:xsplit:prune/, 'README should document artifact pruning');
