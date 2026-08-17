# Modernization Migration Plan

This plan tracks the codebase-wide migration away from legacy package and build
tooling while preserving compatibility for existing XSplit Broadcaster
extensions. It covers the package, build, regression, and documentation
surfaces now implemented on this branch.

## Goals

- Complete Bower Removal and keep active source free of legacy package-manager paths and HTML imports.
- Move new npm releases from the historical `xjs-framework` package to `@splitmedialabs/xjs`.
- Keep the ESM Transition usable through `dist/xjs.mjs` while preserving
  `dist/xjs.cjs` for CommonJS users.
- Build CEF 103 compatible browser artifacts for XSplit-hosted extension usage.
- Use Vite as the build foundation and avoid reintroducing Browserify or Gulp tasks.
- Keep TypeScript 6 compatibility as the baseline so the project is positioned for TS-go when it becomes practical.
- Grow regression coverage around package entry points, browser bundles, component fixtures, and XSplit CDP runs.
- Track modern coverage against legacy Karma and functional behavior in [MODERN_PARITY_AUDIT.md](MODERN_PARITY_AUDIT.md).

## API Stability Constraint

This modernization must preserve the public XJS API. Do not remove exports,
rename classes or methods, change signatures or package-entry semantics, or
intentionally alter runtime behavior as part of the tooling migration.

When behavior is awkward or legacy-shaped, protect it at the cheapest stable
boundary before changing it. Defer API redesign to a separately planned major
version. Packaging and CEF compatibility fixes are allowed, but public API
changes require explicit approval and a migration plan.

## Compatibility Targets

- Modern bundlers: import from the package root through the conditional ESM export.
- CommonJS projects: require from the package root through the conditional CommonJS export.
- XSplit Broadcaster: load `dist/xjs.js` or `dist/xjs.min.js`, both built for
  CEF 103.
- npm consumers: install `@splitmedialabs/xjs`; keep `xjs-framework` frozen at
  the final old-package release, `2.10.2`.
- Transitional legacy users: keep `dist/xjs-es2015.js` and
  `dist/xjs-es2015.min.js` tracked for one deprecated compatibility window.

## Current Checkpoints

- Bower package files, component directories, package metadata, and HTML imports
  are absent from active source.
- Active package builds use Vite/npm scripts; legacy Gulp, Browserify, and
  Traceur entry points are absent from package metadata.
- The inactive `tools/` tree has been removed. Dgeni docs source remains under
  `docs-old/` as reference and is not an active dependency.
- Vite library builds generate ESM, CommonJS, browser, minified browser, and type outputs.
- Generated modern `dist/` outputs are ignored by git; release validation regenerates them before packing.
- The examples server exposes `/examples/` and `/xsplit-extension/index.html` on port `3999`.
- The XSplit regression extension renders all current runtime custom elements as component fixtures.
- The CDP runner targets `127.0.0.1:9222` and records console diagnostics,
  failed requests, page state, screenshots, and JSON artifacts.
- Executable smokes protect package entries and public host behavior. Native
  docs/package commands and raw CDP protect their respective boundaries.

## Migration Phases

### Phase 1: Build And Package Stabilization

Keep this phase focused on package behavior and generated artifacts.

- Preserve `main`, `module`, `types`, `browser`, and conditional `exports` in `package.json`.
- Keep Vite build scripts in `scripts/build.mjs` and `vite.config.mjs`.
- Use `npm test` as the default build and smoke gate rather than a legacy task
  runner.
- Keep CEF browser output targeted to `chrome103`.
- Run `npm test` before each checkpoint commit.
- Run `npm run pack:check` before release-oriented changes.

Exit criteria:

- ESM import smoke test passes.
- CommonJS require smoke test passes.
- Browser bundle smoke test passes.
- `npm pack --dry-run` includes the generated `dist/` files after a build.

### Phase 2: TypeScript 6 Hardening

Use TypeScript 6 as the migration baseline. Avoid type work that only satisfies
older compiler behavior.

- Continue tightening source contracts where TypeScript 6 exposes real ambiguity.
- Prefer explicit primitive types and narrow host-response shapes where the XSplit API has known value forms.
- Keep generated declaration output coming from the Vite build pipeline.
- Do not add broad `any` types unless the host API is genuinely dynamic and the
  boundary is documented.

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

Keep old tests only where they document behavior that the modern suite does not
cover. Use [MODERN_PARITY_AUDIT.md](MODERN_PARITY_AUDIT.md) to decide which
legacy areas can be retired.

- Prefer executable behavior smokes and focused component tests over static
  source-spelling guards.
- Keep the Karma/Jasmine files as reference-only input until equivalent modern
  behavior is protected; do not advertise an inactive legacy runner.
- Move high-value legacy behavior into modern tests before dropping its
  reference coverage.
- Keep examples navigable through `/examples/` and visible inside the XSplit
  extension page where practical.

Exit criteria:

- Every removed legacy test has equivalent or better modern coverage.
- Example pages remain reachable from the examples server.
- XSplit extension fixtures still cover the public UI shapes used for
  regression screenshots.

### Phase 5: Documentation Site Migration

- Active product documentation uses Astro with Starlight under `docs/`.
- TypeDoc derives API and internal references from the TypeScript source.
- The old Dgeni/Angular documentation source lives under `docs-old/` as
  migration reference and is not active infrastructure.
- Documentation templates are public API views, not runtime XSplit components.

Exit criteria:

- `npm run docs:check` and `npm run docs:build` pass.
- API and internal references generate deterministically from TypeScript.
- The Pages workflow publishes the static `dist/docs` output.

## Checkpoint Practice

- Commit after each coherent section of work.
- Keep commits scoped: build/package, TypeScript contracts, harness fixtures,
  and documentation should be separate when possible.
- Before claiming a checkpoint complete, run the smallest authoritative check.
  Run `npm test` when package or smoke-test behavior changed.
