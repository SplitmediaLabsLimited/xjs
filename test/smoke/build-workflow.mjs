import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const travis = await readFile(new URL('.travis.yml', root), 'utf8');
const buildScript = await readFile(new URL('scripts/build.mjs', root), 'utf8');
const viteConfig = await readFile(new URL('vite.config.mjs', root), 'utf8');
const sourceHtmlMixin = await readFile(new URL('src/core/source/ihtml.ts', root), 'utf8');

const legacyBuildTools = /gulp|browserify|gulp-|traceur|dgeni(?:-packages)?/i;
const packageWorkflow = JSON.stringify({
  scripts: pkg.scripts,
  dependencies: pkg.dependencies || {},
  devDependencies: pkg.devDependencies || {},
});

assert.match(
  pkg.scripts.build,
  /^node scripts\/build\.mjs$/,
  'build script should use the Vite build wrapper'
);
assert.match(
  pkg.scripts['build:watch'],
  /^vite build --watch --config vite\.config\.mjs$/,
  'watch build should use Vite'
);
assert.doesNotMatch(
  packageWorkflow,
  legacyBuildTools,
  'package scripts and dependencies should not install or invoke legacy build/docs tools'
);

assert.match(travis, /node_js:\s*\n\s*-\s*"20"/, 'CI should target the modern Node runtime');
assert.match(travis, /npm test/, 'CI should run the npm smoke workflow');
assert.doesNotMatch(travis, legacyBuildTools, 'CI should not install or run legacy build tools');

assert.match(buildScript, /from 'vite'/, 'build wrapper should use Vite');
assert.match(buildScript, /chrome103/, 'build wrapper should preserve the CEF 103 browser target');
assert.doesNotMatch(
  buildScript,
  legacyBuildTools,
  'build wrapper should not call legacy build tools'
);
assert.match(viteConfig, /chrome103/, 'Vite config should preserve the CEF 103 browser target');
assert.doesNotMatch(
  sourceHtmlMixin,
  /\beval\s*\(/,
  'source HTML mixin should avoid direct eval so Vite/Rollup builds stay quiet'
);
assert.match(
  sourceHtmlMixin,
  /removeSourcePluginCustomCssElement/,
  'source HTML mixin should use DOM cleanup instead of local eval for source plugins'
);

for (const legacyEntryPoint of [
  'tools',
  'tools/broccoli',
  'tools/build/bundle.js',
  'tools/build/es5build.js',
  'tools/build/transpile.js',
  'tools/transpiler',
  'tools/transpiler/gulp-traceur.js',
  'tools/traceur-jasmine',
]) {
  await assert.rejects(
    stat(new URL(legacyEntryPoint, root)),
    { code: 'ENOENT' },
    `${legacyEntryPoint} should not remain as a legacy build entry point`
  );
}
