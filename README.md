XSplit JS Framework

[![Build Status](https://travis-ci.org/xjsframework/xjs.svg?branch=master)](https://travis-ci.org/xjsframework/xjs)

The XSplit JS Framework allows developers to create plugins for XSplit Broadcaster.

Please visit [the official website](http://xjsframework.github.io/) for documentation and more information.

## Local XSplit CEF regression

Serve the examples and regression extension on port `3999`:

```sh
npm run examples
```

When the extension page is already attached in XSplit Broadcaster, run:

```sh
npm run test:xsplit:cdp
```

When CDP is reachable on `127.0.0.1:9222` but the extension page is not the active target, run:

```sh
npm run test:xsplit:cdp:attached
```

That wrapper navigates an existing XSplit CEF target to `http://localhost:3999/xsplit-extension/index.html`. Each run writes timestamped artifacts under `artifacts/xsplit-cdp/` and updates `artifacts/xsplit-cdp/latest-summary.json` with the latest result path, pass/fail state, browser metadata, and screenshot path.

If XSplit Broadcaster is running on the Windows client, keep `localhost:3999` working there with the reverse SSH tunnel:

```sh
ssh -N \
  -R '127.0.0.1:3999:127.0.0.1:3999' \
  ensu-win
```

If that tunnel is not available, pass a URL that the Windows CEF process can reach:

```sh
XJS_EXTENSION_NAVIGATE_URL=http://<reachable-host>:3999/xsplit-extension/index.html npm run test:xsplit:cdp:attached
```

## Release build notes

Generated modern package artifacts are intentionally ignored by git. Run `npm run build` before any local package validation or publish flow. The build regenerates `dist/xjs.mjs`, `dist/xjs.cjs`, `dist/xjs.js`, `dist/xjs.min.js`, and `dist/index.d.ts` from `src/`.

Use `npm run pack:check` before publishing. The package `prepare` lifecycle runs the build first, then `npm pack --dry-run` verifies the package tarball. The same `prepare` hook runs for `npm publish` and npm git dependencies, so the ignored modern `dist/` output is regenerated before the tarball is assembled. The package still includes `dist/` output because `package.json` lists `dist/` in `files`.

Only the deprecated compatibility bundles `dist/xjs-es2015.js` and `dist/xjs-es2015.min.js` remain tracked during the transition.

## Backlog

See [MIGRATION.md](MIGRATION.md) for the active modernization migration plan. [BACKLOG.md](BACKLOG.md) tracks deferred follow-up work, including the later static docs-site migration.

If you wish to contribute, check the [issue list](https://github.com/xjsframework/xjs/issues)! Drop a comment if you need more information before you start working on a pull request. Information on our deliverable roadmap is posted on [the wiki](https://github.com/xjsframework/xjs/wiki).
