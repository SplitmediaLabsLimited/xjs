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

To inspect which older timestamped CDP runs can be pruned:

```sh
npm run artifacts:xsplit:prune
```

The prune command defaults to dry-run mode, keeps the run referenced by `latest-summary.json`, and keeps the five newest timestamped runs. Set `XJS_CDP_ARTIFACT_KEEP=<count>` to change the retention count. Add `-- --yes` to delete the listed older run directories.

## Release build notes

Generated modern package artifacts are intentionally ignored by git. Run `npm run build` before any local package validation or publish flow. The build regenerates `dist/xjs.mjs`, `dist/xjs.cjs`, `dist/xjs.js`, `dist/xjs.min.js`, and `dist/index.d.ts` from `src/`.

Use `npm run pack:check` before publishing. It runs the build first, then verifies the package tarball with `npm pack --dry-run`. The package still includes `dist/` output because `package.json` lists `dist/` in `files`.

Only the deprecated compatibility bundles `dist/xjs-es2015.js` and `dist/xjs-es2015.min.js` remain tracked during the transition.

If you wish to contribute, check the [issue list](https://github.com/xjsframework/xjs/issues)! Drop a comment if you need more information before you start working on a pull request. Information on our deliverable roadmap is posted on [the wiki](https://github.com/xjsframework/xjs/wiki).
