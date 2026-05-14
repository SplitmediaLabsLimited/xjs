import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../../scripts/xsplit-cdp-runner.mjs', import.meta.url), 'utf8');

assert.match(source, /127\.0\.0\.1:9222/, 'runner should default to the local CDP port');
assert.match(source, /\/json\/version/, 'runner should inspect CDP version metadata');
assert.match(source, /\/json\/list/, 'runner should inspect page targets');
assert.match(source, /localhost:3999\/xsplit-extension\//, 'runner should select the XSplit extension target');
assert.match(source, /webSocketDebuggerUrl/, 'runner should connect directly to target websocket');
assert.match(source, /Runtime\.evaluate/, 'runner should execute the in-page regression suite');
assert.match(source, /Runtime\.consoleAPICalled/, 'runner should collect console output');
assert.match(source, /Network\.loadingFailed/, 'runner should collect failed requests');
assert.match(source, /Page\.captureScreenshot/, 'runner should capture screenshots when available');
assert.doesNotMatch(source, /connectOverCDP|playwright/i, 'XSplit runner should be raw CDP first');
