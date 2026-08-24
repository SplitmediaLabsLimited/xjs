process.env.XJS_EXTENSION_FALLBACK_URL_PREFIXES =
  process.env.XJS_EXTENSION_FALLBACK_URL_PREFIXES ||
  [
    'http://127.0.0.1:3001/',
    'https://www.xspl.it.com/',
    'http://www.xspl.it.com/',
    'file:///www.xspl.it.com/',
  ].join(',');

process.env.XJS_EXTENSION_NAVIGATE_URL =
  process.env.XJS_EXTENSION_NAVIGATE_URL || 'http://localhost:3999/xsplit-extension/index.html';

await import('./xsplit-cdp-runner.mjs');
