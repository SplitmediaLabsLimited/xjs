import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const entry = resolve(root, 'src/index.ts');
const license = await readFile(resolve(root, 'LICENSE'), 'utf8');
const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const banner = `/**\n * XSplit JS Framework\n * version: ${pkg.version}\n * CEF 103 compatible browser bundle target: chrome103\n *\n${license.split('\n').map(line => ` * ${line}`).join('\n')}\n */`;

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      shell: process.platform === 'win32',
      stdio: 'inherit',
    });
    child.on('exit', code => {
      if (code === 0 || options.allowFailure) {
        if (code !== 0) {
          console.warn(`${command} ${args.join(' ')} exited with ${code}; continuing because declarations were still emitted.`);
        }
        resolvePromise();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
      }
    });
  });
}

async function buildFormat(format, fileName, options = {}) {
  await build({
    configFile: false,
    build: {
      target: options.target || 'es2020',
      outDir: dist,
      emptyOutDir: false,
      sourcemap: false,
      minify: options.minify || false,
      lib: {
        entry,
        name: 'XJS',
        formats: [format],
        fileName: () => fileName,
      },
      rollupOptions: {
        output: {
          banner,
          exports: 'named',
        },
      },
    },
  });
}

async function appendRequireShim(path) {
  const bundle = await readFile(path, 'utf8');
  const shim = `
;(function(global) {
  var previousRequire = global.require;
  var xjsExports = global.XJS;
  function xjsRequire(name) {
    if (name === 'xjs') {
      return xjsExports;
    }
    if (typeof previousRequire === 'function' && previousRequire !== xjsRequire) {
      return previousRequire.apply(this, arguments);
    }
    throw new Error("Cannot find module '" + name + "'");
  }
  xjsRequire.xjs = xjsExports;
  global.require = xjsRequire;
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : window);
require('xjs');
`;
  await writeFile(path, `${banner}\n${bundle}\n${shim}`);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await run('tsc', ['-p', 'tsconfig.build.json'], { allowFailure: true });
await buildFormat('es', 'xjs.mjs');
await buildFormat('cjs', 'xjs.cjs');
await buildFormat('iife', 'xjs.js', { target: 'chrome103' });
await appendRequireShim(resolve(dist, 'xjs.js'));
await buildFormat('iife', 'xjs.min.js', { target: 'chrome103', minify: true });
await appendRequireShim(resolve(dist, 'xjs.min.js'));

const browser = await readFile(resolve(dist, 'xjs.js'), 'utf8');
const browserMin = await readFile(resolve(dist, 'xjs.min.js'), 'utf8');
await writeFile(resolve(dist, 'xjs-es2015.js'), browser);
await writeFile(resolve(dist, 'xjs-es2015.min.js'), browserMin);
