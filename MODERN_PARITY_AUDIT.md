# Modern Test Parity Audit

This audit tracks how modern smoke and component tests cover behavior that is
still protected by the legacy Karma and functional suites. The goal is API
stability during modernization: legacy-shaped behavior remains covered until
there is explicit approval for a future major-version redesign.

## Active Modern Coverage

- Package entry points: `test/smoke/package-entries.mjs` and
  `test/smoke/browser-bundle-require.mjs` exercise ESM, CommonJS, browser
  exports, and the `require('xjs')` shim. `npm run pack:check` is the
  authoritative package-tarball check.
- Browser compatibility: `test/smoke/compatibility-targets.mjs` protects the
  silent CEF 103 build-target invariant. The Vite build itself is authoritative
  for build configuration; custom tests do not duplicate prose, retired-tool
  absence, or exact script spelling.
- XSplit host callback boundaries: the `exec`, app, DLL, IO, stream, and system
  smokes cover the highest-risk host shims.
- Extension and window APIs: the extension configuration, window event, and
  dialog smokes cover extension lifecycle, configuration, and dialog behavior.
- Runtime item, source, and scene APIs: the item, source, media, scene,
  transition, and type-resolution smokes cover the most-used public surfaces
  without changing their API shape.
- Remote/proxy transport: `test/smoke/remote-proxy-transport.mjs` covers
  exported `Remote` and `exec` behavior across message dispatch, callbacks,
  proxy calls, and local-mode rejection.
- System discovery and addable APIs: the system smokes cover camera,
  microphone, game, screen, URL, replay, group, and playlist factories.
- Component and host-harness coverage: `test/component/*.test.js` executes the
  custom elements in a browser, `scripts/check-docs.mjs` validates
  fixture-to-doc-to-screenshot relationships, and raw CDP provides
  authoritative XSplit/CEF host evidence. Static implementation-token tests
  were removed.
- Utility value objects: `test/smoke/util-value-objects.mjs` covers `Color`,
  `Rectangle`, thumbnail parsing, environment detection, and value conversions.

## Legacy Suites Still Kept

- `test/unit/specs/**` remains useful for historical API behavior until every
  public method has equivalent modern coverage.
- `test/functional/specs/**` remains a browser-oriented reference while the
  XSplit extension harness and CDP artifacts mature.
- `docs-old/**.spec.js` remains reference material only; the
  Dgeni/Broccoli/Angular docs pipeline is not part of the active build.

## Remaining Parity Gaps

- Scene lookup, active-scene switching, enumeration, search/filter helpers, item
  ordering, transitions, presets, and `liveScene()` have modern smoke coverage;
  add/delete event behavior still has only legacy coverage.
- Public visual methods, common playback controls, and source configuration are
  covered, but not every historical validation branch or malformed host reply.
- The XSplit harness covers fixtures and CDP plumbing, but manual CEF 103
  evidence remains necessary for authoritative host validation.

## Test Economy and Next Coverage

- Add a modern regression only for a reproduced bug, an intentionally changed
  public contract, or a parity gap being actively retired. The legacy inventory
  is not an instruction to reproduce every historical assertion.
- Prefer one focused host-boundary smoke over source-token assertions or
  multiple tests of the same getter/setter pattern.
- Use `npm test` for ordinary source changes, `npm run test:components` for
  custom-element behavior, native docs/package commands for those artifacts,
  and raw CDP for authoritative XSplit/CEF integration evidence.
- Retire legacy Karma specs only after the corresponding public behavior is
  protected; do not mechanically modernize inactive reference files.
