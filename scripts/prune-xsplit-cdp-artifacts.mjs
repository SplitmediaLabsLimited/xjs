import { mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

const artifactRoot = resolve(process.env.XJS_CDP_ARTIFACT_ROOT || 'artifacts/xsplit-cdp');
const keepCount = Number(process.env.XJS_CDP_ARTIFACT_KEEP || 5);
const dryRun = !process.argv.includes('--yes');
const runPattern = /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z$/;

function latestSummaryTarget(summary) {
  if (!summary?.artifactDirectory) {
    return null;
  }
  return basename(summary.artifactDirectory);
}

async function readLatestTarget() {
  try {
    const summary = JSON.parse(await readFile(resolve(artifactRoot, 'latest-summary.json'), 'utf8'));
    return latestSummaryTarget(summary);
  } catch {
    return null;
  }
}

async function listRunDirectories() {
  try {
    await mkdir(artifactRoot, { recursive: true });
    const entries = await readdir(artifactRoot);
    const runs = [];
    for (const name of entries) {
      if (!runPattern.test(name)) {
        continue;
      }
      const path = resolve(artifactRoot, name);
      const info = await stat(path);
      if (info.isDirectory()) {
        runs.push({ name, path });
      }
    }
    return runs.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

const latestTarget = await readLatestTarget();
const runs = await listRunDirectories();
const newestKept = new Set(runs.slice(Math.max(0, runs.length - keepCount)).map(run => run.name));
const kept = [];
const toDelete = [];

for (const run of runs) {
  const reasons = [];
  if (newestKept.has(run.name)) {
    reasons.push('newest');
  }
  if (run.name === latestTarget) {
    reasons.push('latest-summary');
  }

  if (reasons.length > 0) {
    kept.push({ name: run.name, reasons });
  } else {
    toDelete.push({ name: run.name, path: run.path });
  }
}

const deleted = [];
if (!dryRun) {
  for (const run of toDelete) {
    await rm(run.path, { recursive: true, force: true });
    deleted.push(run);
  }
}

console.log(JSON.stringify({
  artifactRoot,
  keepCount,
  dryRun,
  latestTarget,
  kept,
  toDelete,
  deleted,
}, null, 2));
