# Releasing a New Version

This document describes how to release XSplit JS Framework.

## Package Transition

Modern releases publish as `@splitmedialabs/xjs`. The historical
`xjs-framework` package remains frozen at `2.10.2`.

1. Publish `@splitmedialabs/xjs` from the reviewed release commit at the
   version declared in `package.json`.
2. After that scoped release is live, deprecate the historical package line:

   ```sh
   npm deprecate "xjs-framework@<=2.10.2" \
     "XJS has moved to @splitmedialabs/xjs. Install @splitmedialabs/xjs for maintained releases."
   ```

Do not publish a newer `xjs-framework` version without an explicitly approved
migration plan.

## 1. Verify the Release Candidate

Run the checks for each release boundary:

```sh
npm run test:full
npm run test:components
npm run docs:check
npm run docs:build
npm run pack:check
```

The legacy Karma/Jasmine files are historical reference and have no active test
command. Browser-output or host-boundary changes also require the raw-CDP
XSplit check described below.

## 2. Prepare the Release Branch

Create a dedicated release branch from the reviewed target branch. Use
`npm version major|minor|patch` to update package metadata, then run
`npm run build`.

The build creates ESM, CommonJS, CEF-compatible browser, minified browser, and
declaration output under `dist/`. Keep the browser target at `chrome103`.

Build tooling uses TypeScript 6 as the transition baseline before the Go-native
TypeScript line. Fix TS 6 deprecations rather than suppressing them because
deprecated options are expected to stop working in TypeScript 7.

To specify an exact version, run `npm version <version>` and then
`npm run build`.

## 3. Prepare the Documentation Site

Generate and validate the documentation with `npm run docs:build`. The GitHub
Pages workflow publishes `dist/docs` after the reviewed change reaches its
configured branch. Do not copy generated files into a separate repository.

## 4. Release

- Merge the approved release PR to `master` and create the version tag.
- Draft a GitHub release.
- Publish `@splitmedialabs/xjs` to npm.
- Deprecate `xjs-framework` only after the scoped package is live.
- Upload the reviewed generated browser files to the approved CDN destination.
- When XSplit Broadcaster is available, run `npm run examples`, attach
  `http://localhost:3999/xsplit-extension/index.html`, and collect
  `npm run test:xsplit:cdp` artifacts.

Publishing, deprecation, tagging, merging, CDN updates, and deployment require
explicit approval.

## 5. Update Release Communications

- Update the release notes in the wiki.
- Send a newsletter when the release plan calls for one.

## 6. Clean Up

Verify that release issues are closed and clean up outstanding release branches.

## 7. Done

Release complete. Party responsibly.
