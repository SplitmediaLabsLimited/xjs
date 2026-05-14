import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist/api');
const vendor = resolve(out, 'vendor');

await rm(out, { recursive: true, force: true });
await mkdir(vendor, { recursive: true });
await cp(resolve(root, 'docs-old/app'), out, { recursive: true });

const vendorFiles = [
  ['node_modules/angular/angular.js', 'angular/angular.js'],
  ['node_modules/angular-route/angular-route.js', 'angular-route/angular-route.js'],
  ['node_modules/angular-animate/angular-animate.js', 'angular-animate/angular-animate.js'],
  ['node_modules/angular-aria/angular-aria.js', 'angular-aria/angular-aria.js'],
  ['node_modules/angular-material/angular-material.css', 'angular-material/angular-material.css'],
];

for (const [from, to] of vendorFiles) {
  await mkdir(resolve(vendor, to, '..'), { recursive: true });
  await cp(resolve(root, from), resolve(vendor, to));
}
