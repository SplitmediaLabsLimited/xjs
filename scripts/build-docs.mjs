import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const astroBin = resolve(
  root,
  'node_modules/.bin',
  process.platform === 'win32' ? 'astro.cmd' : 'astro'
);

function run(command, args) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolveRun();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
      }
    });
  });
}

await run(process.execPath, [resolve(root, 'scripts/check-docs.mjs')]);
await rm(resolve(root, 'docs/.astro'), { recursive: true, force: true });
await rm(resolve(root, 'docs/src/content/docs/api'), { recursive: true, force: true });
await rm(resolve(root, 'docs/src/content/docs/internals'), { recursive: true, force: true });
await run(astroBin, ['build', '--root', 'docs']);
