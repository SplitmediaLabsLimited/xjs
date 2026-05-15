# Releasing a New Version

This document describes how to release a new version of XSplit JS Framework

Modern releases are published to the scoped npm package `@splitmedialabs/xjs`.
The historical `xjs-framework` package remains available for old releases such
as `2.10.2` and any explicitly approved transition release. After the scoped
package is available, deprecate the old package on npm with a message directing
users to `@splitmedialabs/xjs`.

1. **Make sure that tests are green**

  Before the release, make sure that all required checks pass. Execute
`npm test` first to run package, docs, harness, and packaging smoke checks.
Run `npm run test:legacy` when validating the original browser-based unit suite.

2. **Prepare the release branch**

  Merge all branches to develop and then create the release branch. Use
`npm version major|minor|patch` to update package metadata, then execute
`npm run build` to transpile and bundle the project.

  This creates the ESM, CommonJS, CEF-compatible browser, and minified browser
bundles under `dist/`.

  Build tooling is pinned to TypeScript 6 as the transition baseline before the
Go-native TypeScript line. Keep TS 6 deprecations visible and fix them rather
than suppressing them, since deprecated compiler options are expected to stop
working in TypeScript 7.

  *NOTE:* In case you want to specify the version number, execute
  `npm version 1.5.0`, then run `npm run build`.

3. **Prepare the website for release**

  Generate the API Docs by executing `npm run docs:build` and then copy the necessary files
to `xjsframework.github.io`'s repository and update the tutorials if needed.

4. **Release**

  - Merge release branch to master and add the version tag.
  - Draft a new release in Github
  - Publish `@splitmedialabs/xjs` to NPM
  - Deprecate `xjs-framework` on NPM after the scoped package is live
  - Upload the latest generated xjs files to CDN
  - If XSplit Broadcaster is available, run `npm run examples`, attach
    `http://localhost:3999/xsplit-extension/index.html`, and collect
    `npm run test:xsplit:cdp` artifacts.

5. **Update the Release Notes and/or send the Newsletter**

  - Update the Release Notes in the wiki page
  - Send the newsletter if necessary

6. **Cleanup**

  Verify all issues are closed, and clean outstanding branches.

7. **Done!**

  Release is complete! You may now party.
