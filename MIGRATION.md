# Modernization Migration Plan

This plan tracks the codebase-wide migration away from legacy package and build tooling while preserving compatibility for existing XSplit Broadcaster extensions. It is intentionally broader than the docs-site work; the documentation rewrite stays as a deferred note until the package, build, and regression surfaces are stable.

## Goals

- Complete Bower Removal and keep active source free of legacy package-manager paths and HTML imports.
- Move new npm releases from the historical `xjs-framework` package to `@splitmedialabs/xjs`.
- Keep the ESM Transition usable for modern consumers through `dist/xjs.mjs`, while preserving `dist/xjs.cjs` for CommonJS users.
- Build CEF 103 compatible browser artifacts for XSplit-hosted extension usage.
- Use Vite as the build foundation and avoid reintroducing Browserify or Gulp tasks.
- Keep TypeScript 6 compatibility as the baseline so the project is positioned for TS-go when it becomes practical.
- Grow regression coverage around package entry points, browser bundles, component fixtures, and XSplit CDP runs.
- Track modern coverage against legacy Karma and functional behavior in [MODERN_PARITY_AUDIT.md](MODERN_PARITY_AUDIT.md).

## API Stability Constraint

This modernization run must preserve the public XJS API. Do not remove exports, rename classes, rename methods, change method signatures, change package entry semantics, or intentionally alter existing runtime behavior as part of Bower removal, Vite migration, ESM transition, TypeScript hardening, or regression-test work.

When existing behavior is awkward or legacy-shaped, add modern regression coverage around the behavior first and defer any API redesign to a separately planned major-version effort. Compatibility fixes for packaging and CEF output are allowed, but public API changes require explicit approval and a migration plan.

## Compatibility Targets

- Modern bundlers: import from the package root through the conditional ESM export.
- CommonJS projects: require from the package root through the conditional CommonJS export.
- XSplit Broadcaster: load the browser bundle from `dist/xjs.js` or `dist/xjs.min.js`, both built for CEF 103.
- npm package consumers: install `@splitmedialabs/xjs`; keep `xjs-framework` for historical versions and approved transition releases only.
- Transitional legacy users: keep `dist/xjs-es2015.js` and `dist/xjs-es2015.min.js` tracked for one deprecated compatibility window.

## Current Checkpoints

- Bower package files, component directories, package metadata, and HTML imports are absent from active source and guarded by smoke tests.
- Active package and CI build workflows use Vite/npm scripts; legacy Gulp, Browserify, and Traceur build entry points are absent from package metadata and guarded by smoke tests.
- The inactive `tools/` tree has been removed after audit; Dgeni docs package source remains as reference material only and is no longer installed as an active dependency.
- Vite library builds generate ESM, CommonJS, browser, minified browser, and type outputs.
- Generated modern `dist/` outputs are ignored by git; release validation regenerates them before packing.
- The examples server exposes `/examples/` and `/xsplit-extension/index.html` on port `3999`.
- The XSplit regression extension renders all current runtime custom elements as component fixtures.
- The CDP runner targets `127.0.0.1:9222`, records console diagnostics, failed requests, page state, screenshots, and JSON artifacts.
- Smoke tests guard package exports, release workflow expectations, legacy-reference cleanup, harness structure, runner behavior, and custom-element fixture coverage.

## Migration Phases

### Phase 1: Build And Package Stabilization

Keep this phase focused on package behavior and generated artifacts.

- Preserve `main`, `module`, `types`, `browser`, and conditional `exports` in `package.json`.
- Keep Vite build scripts in `scripts/build.mjs` and `vite.config.mjs`.
- Keep CI pointed at `npm test` rather than legacy task runners.
- Keep CEF browser output targeted to `chrome103`.
- Run `npm test` before each checkpoint commit.
- Run `npm run pack:check` before release-oriented changes.

Exit criteria:

- ESM import smoke test passes.
- CommonJS require smoke test passes.
- Browser bundle smoke test passes.
- `npm pack --dry-run` includes the generated `dist/` files after a build.

### Phase 2: TypeScript 6 Hardening

Use TypeScript 6 as the migration baseline and avoid type work that only satisfies older compiler behavior.

- Continue tightening source contracts where TypeScript 6 exposes real ambiguity.
- Prefer explicit primitive types and narrow host-response shapes where the XSplit API has known value forms.
- Keep generated declaration output coming from the Vite build pipeline.
- Do not add broad `any` types to suppress migration issues unless the host API is genuinely dynamic and the boundary is documented.

Exit criteria:

- `npm test` passes after TypeScript-facing changes.
- New source contracts are reflected in generated declarations.
- Any remaining dynamic host API boundaries have local comments explaining why they cannot be narrowed yet.

### Phase 3: XSplit Regression Coverage

Treat XSplit CEF as the compatibility source of truth for browser-hosted behavior.

- Keep the examples server on port `3999`.
- Keep the extension page free of Vite HMR client code.
- Keep all runtime custom elements represented in the component fixtures manifest.
- Use raw CDP for XSplit runs; Playwright remains optional for non-XSplit browser smoke tests.
- Store useful CDP artifacts when manual runs succeed or reveal actionable environment failures.

Exit criteria:

- `npm run test:components` passes.
- `npm test` passes.
- Attached CDP runs write `artifacts/xsplit-cdp/latest-summary.json`.
- Successful XSplit runs capture a screenshot and JSON result set.
- Bootstrap failures capture page state, failed requests, and screenshot artifacts.

### Phase 4: Legacy Test And Example Rationalization

Keep old tests only where they still protect behavior that the modern suite does not cover. Use [MODERN_PARITY_AUDIT.md](MODERN_PARITY_AUDIT.md) to decide which legacy areas are covered well enough to retire later.

- Prefer smoke tests and focused component tests for migration guards.
- Keep Karma/Firefox available as `npm run test:legacy` while it still provides useful historical coverage.
- Move high-value legacy behavior into modern tests before dropping any old runner.
- Keep examples navigable through `/examples/` and visible inside the XSplit extension page where practical.

Exit criteria:

- Every removed legacy test has equivalent or better modern coverage.
- Example pages remain reachable from the examples server.
- XSplit extension fixtures still cover the public UI shapes used for regression screenshots.

### Phase 5: Documentation Site Follow-Up

Defer detailed planning until the package and regression migration is close to finished.

- Preferred direction: Astro with Starlight.
- Intended input: future JSDoc or TSDoc annotations from `src/`.
- Existing Dgeni package source under `docs/` can be mined for old API-doc generation behavior, but it is not part of the active docs build and is not kept installable through package dependencies.
- Migration goal: replace the legacy AngularJS docs app with a static site after generated API docs are reliable.
- Boundary: documentation templates are public API docs views, not runtime XSplit components.

Exit criteria:

- A separate docs-site implementation plan exists.
- API extraction format is chosen.
- Static docs build and deployment path are defined.

## Checkpoint Practice

- Commit after each coherent section of work.
- Keep commits scoped: build/package, TypeScript contracts, harness fixtures, CDP artifacts, and documentation should be separate when possible.
- Before claiming a checkpoint is complete, run the smallest verification that proves it, then run `npm test` for repo-level safety when package or smoke-test behavior changed.
