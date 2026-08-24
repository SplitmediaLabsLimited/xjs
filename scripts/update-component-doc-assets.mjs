import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const latestSummaryPath = join(root, 'artifacts/component-fixtures/latest-summary.json');
const publicOutputDir = join(root, 'docs/public/component-fixtures');
const manifestOutputPath = join(root, 'docs/src/assets/component-fixtures.json');

const summary = JSON.parse(await readFile(latestSummaryPath, 'utf8'));
const artifactDir = join(root, summary.artifactDirectory);

await mkdir(publicOutputDir, { recursive: true });

const fixtures = [];
for (const item of summary.screenshots || []) {
  const sourcePath = join(root, item.screenshot.path);
  const fileName = `${item.id}.png`;
  const outputPath = join(publicOutputDir, fileName);
  await copyFile(sourcePath, outputPath);
  fixtures.push({
    id: item.id,
    src: `/component-fixtures/${fileName}`,
    sha256: item.screenshot.sha256,
    bytes: item.screenshot.bytes,
    captureUrl: item.captureUrl,
    source: basename(sourcePath),
  });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  sourceRunAt: summary.runAt,
  sourceArtifactDirectory: summary.artifactDirectory,
  fixtureCount: fixtures.length,
  fixtures,
};

await writeFile(manifestOutputPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `Updated ${fixtures.length} component docs screenshots from ${artifactDir} into ${publicOutputDir}`
);
