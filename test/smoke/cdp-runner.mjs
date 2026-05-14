import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../../scripts/xsplit-cdp-runner.mjs', import.meta.url), 'utf8');
const attachedSource = await readFile(new URL('../../scripts/xsplit-cdp-attached.mjs', import.meta.url), 'utf8');
const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
const readme = await readFile(new URL('../../README.md', import.meta.url), 'utf8');

assert.match(source, /node:crypto/, 'runner should use a stable hash for visual artifact metadata');
assert.match(source, /127\.0\.0\.1:9222/, 'runner should default to the local CDP port');
assert.match(source, /\/json\/version/, 'runner should inspect CDP version metadata');
assert.match(source, /\/json\/list/, 'runner should inspect page targets');
assert.match(source, /localhost:3999\/xsplit-extension\//, 'runner should select the XSplit extension target');
assert.match(source, /webSocketDebuggerUrl/, 'runner should connect directly to target websocket');
assert.match(source, /Runtime\.evaluate/, 'runner should execute the in-page regression suite');
assert.match(source, /Runtime\.consoleAPICalled/, 'runner should collect console output');
assert.match(source, /Network\.loadingFailed/, 'runner should collect failed requests');
assert.match(source, /Page\.captureScreenshot/, 'runner should capture screenshots when available');
assert.match(source, /screenshot\.png/, 'runner should store screenshots for successful visual regression runs');
assert.match(source, /sha256/, 'runner should record screenshot checksum metadata');
assert.match(source, /bytes/, 'runner should record screenshot byte size metadata');
assert.match(source, /latest-summary\.json/, 'runner should write a stable latest artifact summary');
assert.match(source, /artifactDirectory/, 'latest summary should point at the timestamped artifact directory');
assert.match(source, /passed/, 'latest summary should record pass/fail state');
assert.doesNotMatch(source, /if\s*\(\s*failures\.length[\s\S]{0,300}Page\.captureScreenshot/, 'screenshot capture should not be limited to failing runs');
assert.doesNotMatch(source, /connectOverCDP|playwright/i, 'XSplit runner should be raw CDP first');

assert.match(attachedSource, /XJS_EXTENSION_FALLBACK_URL_PREFIXES/, 'attached runner should configure fallback target prefixes');
assert.match(attachedSource, /XJS_EXTENSION_NAVIGATE_URL/, 'attached runner should configure extension navigation URL');
assert.match(attachedSource, /localhost:3999\/xsplit-extension\/index\.html/, 'attached runner should navigate to the local extension page');
assert.equal(pkg.scripts['test:xsplit:cdp:attached'], 'node scripts/xsplit-cdp-attached.mjs');
assert.match(readme, /test:xsplit:cdp:attached/, 'README should document attached XSplit CDP run');
assert.match(readme, /latest-summary\.json/, 'README should document the latest artifact summary');
