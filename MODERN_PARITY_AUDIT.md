# Modern Test Parity Audit

This audit tracks how the modern smoke and component tests cover behavior that is still protected by the legacy Karma and functional suites. The goal is API stability during modernization: legacy-shaped behavior remains covered until there is explicit approval for a future major-version redesign.

## Active Modern Coverage

- Package entry points: `test/smoke/package-entries.mjs`, `test/smoke/browser-bundle-require.mjs`, and `test/smoke/release-workflow.mjs` cover ESM, CommonJS, browser bundle, and pack behavior.
- Build and migration guardrails: `test/smoke/build-workflow.mjs`, `test/smoke/migration-plan.mjs`, `test/smoke/docs-boundary.mjs`, and `test/smoke/no-legacy-dependency-references.mjs` cover Vite, Bower removal, generated bundle policy, and documentation boundaries.
- XSplit host callback boundaries: `test/smoke/exec-callbacks.mjs`, `test/smoke/app-host-apis.mjs`, `test/smoke/dll-language-apis.mjs`, `test/smoke/io-apis.mjs`, `test/smoke/stream-output-apis.mjs`, and `test/smoke/system-url-apis.mjs` cover the highest-risk host shims.
- Extension and window APIs: `test/smoke/extension-config-apis.mjs`, `test/smoke/extension-window-events.mjs`, and `test/smoke/dialog-window-controls.mjs` cover extension lifecycle, configuration, and dialog behavior.
- Runtime item and source APIs: `test/smoke/item-base-apis.mjs`, `test/smoke/item-visual-effects-apis.mjs`, `test/smoke/source-feature-apis.mjs`, `test/smoke/media-playback-apis.mjs`, `test/smoke/scene-type-resolution.mjs`, and `test/smoke/transition-channel-apis.mjs` cover the most-used public item/source surfaces without changing their API shape.
- System discovery and addable APIs: `test/smoke/system-device-discovery.mjs` and `test/smoke/system-addable-apis.mjs` cover camera, microphone, game, screen, URL, replay, group, and video playlist factory behavior.
- Component and harness coverage: `test/component/*.test.js`, `test/smoke/navbar-source.mjs`, `test/smoke/xsplit-harness.mjs`, `test/smoke/custom-element-fixture-coverage.mjs`, and `test/smoke/cdp-runner.mjs` cover the custom-element fixtures, examples shell, and CDP runner contract.
- Utility value objects: `test/smoke/util-value-objects.mjs` covers `Color`, `Rectangle`, thumbnail parsing, environment detection, and related value conversions.

## Legacy Suites Still Kept

- `test/unit/specs/**` remains useful for historical API behavior until every public method has equivalent modern coverage.
- `test/functional/specs/**` remains useful as a browser-oriented reference while the XSplit extension harness and CDP artifacts mature.
- `docs/**.spec.js` remains reference material for the deferred documentation migration only; the Dgeni/Broccoli/Angular docs pipeline is not part of the active build.

## Remaining Parity Gaps

- Full scene mutation and lookup flows: active/current scene lookup, scene creation/removal, and scene item enumeration still need focused modern smokes before legacy scene specs can be retired.
- Complete source configuration flows: `saveConfig`, `requestSaveConfig`, `applyConfig`, source-specific current/global lookup behavior, and Flash/Game/SceneSource special cases need more host-shim coverage.
- Deep item effect and media edge cases: the modern suite covers public visual methods and common playback controls, but not every historical validation branch or malformed host response.
- Remote/proxy transport behavior: internal remote execution paths are exported and should receive modern coverage before any transport refactor.
- Browser functional behavior: the XSplit harness covers fixtures and CDP plumbing, but manual CEF 103 result artifacts should be kept until automated confidence matches the old functional expectations.

## Next Coverage Loop

1. Add scene API smokes for active/current scene lookup, scene item enumeration, and mutation calls.
2. Add source configuration smokes for `saveConfig`, `requestSaveConfig`, `applyConfig`, Flash/Game/SceneSource specifics, and current-source lookup.
3. Add internal remote/proxy transport smokes before touching transport internals or retiring related legacy tests.
