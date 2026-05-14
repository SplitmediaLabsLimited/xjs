import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const html = await readFile(new URL('docs/app/api.html', root), 'utf8');
const navbar = await readFile(new URL('docs/app/js/xsplit-navbar.js', root), 'utf8');

assert.doesNotMatch(html, /rel=["']import["']/, 'docs app should not use HTML imports');
assert.doesNotMatch(html, /polymer/i, 'docs app should not reference Polymer');
assert.match(html, /js\/xsplit-navbar\.js/, 'docs app should load native navbar module');
assert.match(html, /<xsplit-navbar><\/xsplit-navbar>/, 'docs app should keep the same custom element tag');

assert.match(navbar, /customElements\.define\(['"]xsplit-navbar['"]/, 'navbar module should define xsplit-navbar');
assert.match(navbar, /class\s+XSplitNavbar\s+extends\s+HTMLElement/, 'navbar should be a native custom element');
assert.doesNotMatch(navbar, /Polymer|LitElement|lit-html/, 'navbar should not migrate to Lit yet');
