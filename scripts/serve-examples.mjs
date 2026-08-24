import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT || 3999);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
};

function resolveRequest(url) {
  const parsed = new URL(url, `http://localhost:${port}`);
  if (parsed.pathname === '/') {
    return { redirect: '/examples/' };
  }

  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/xsplit-extension' || pathname.startsWith('/xsplit-extension/')) {
    pathname = `/examples${pathname}`;
  }
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  const normalized = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const file = join(root, normalized);
  const allowedRoots = ['examples', 'dist', 'docs', 'docs-old'].map((dir) => join(root, dir));
  if (!allowedRoots.some((allowed) => file === allowed || file.startsWith(allowed + sep))) {
    return { status: 403, body: 'Forbidden' };
  }
  return { file };
}

createServer(async (req, res) => {
  const result = resolveRequest(req.url || '/');
  if (result.redirect) {
    res.writeHead(302, { Location: result.redirect });
    res.end();
    return;
  }
  if (result.body) {
    res.writeHead(result.status || 500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(result.body);
    return;
  }

  try {
    const info = await stat(result.file);
    if (!info.isFile()) {
      throw new Error('Not a file');
    }
    res.writeHead(200, {
      'Content-Type': contentTypes[extname(result.file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    });
    createReadStream(result.file).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, () => {
  console.log(`XJS examples server listening on http://localhost:${port}/examples/`);
  console.log(`XSplit extension URL: http://localhost:${port}/xsplit-extension/index.html`);
});
