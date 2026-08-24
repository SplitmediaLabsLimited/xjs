# AGENTS.md

Guidance for local LLM agents working in this repository.

## Instruction Priority

- Read this file before making changes.
- Read the documentation relevant to the change before editing. Start with
  `README.md`; also consult `MIGRATION.md`, `BACKLOG.md`,
  `MODERN_PARITY_AUDIT.md`, package scripts, and the relevant source or docs
  area.
- If instructions conflict, follow the user's latest explicit request first,
  then this file, then other repository documentation.
- Do not invent local override files or machine-specific setup. Ask when a
  required environment detail is not available from the repository.

## Agent Skills and Harness Compatibility

- Use these skills when they are available in the current agent harness:
  - `superpowers:using-superpowers` is required at session or task start so the
    agent discovers and follows applicable skills.
  - `superpowers:brainstorming` is required before new features, behavior
    changes, UI work, or design-heavy tasks.
  - `superpowers:test-driven-development` is required for feature and bug-fix
    implementation when an executable test is the appropriate durable guard.
  - `superpowers:systematic-debugging` is required for bugs, regressions,
    failing tests, and unexpected behavior.
  - `superpowers:writing-plans` is recommended for multi-step changes after the
    design and scope are clear.
  - `superpowers:verification-before-completion` is required before claiming
    work is complete, fixed, passing, or ready for handoff.
  - `superpowers:receiving-code-review` is recommended when addressing review
    feedback.
  - GitHub skills are recommended for issue, Project, PR, review, and CI work
    when the GitHub plugin is installed and authenticated.
- Skill names may be unprefixed or namespaced differently by the harness. Use
  the available equivalent rather than assuming one spelling.
- If a required skill or compatible tool is unavailable, say so plainly and
  ask whether to install it or proceed with the closest written fallback.
- Do not pretend that a missing skill, plugin, or tool is available. Harnesses
  without skills must follow the equivalent workflow in this file.

## Collaboration Workflow

- For multi-step work, give concise checkpoint updates with no more than three
  next steps. At handoff, state clearly what is complete and what remains.
- Before implementing a feature, expand the request into intended behavior,
  affected users, compatibility constraints, edge cases, and acceptance
  criteria. Ask for the governing GitHub issue when one exists.
- Do not pander or blindly agree. Explain concrete risks in brittle,
  unnecessarily complex, insecure, destructive, or incompatible approaches and
  offer a safer or simpler alternative.
- Check `git status --short` and the current branch before editing. Preserve
  unrelated user changes and do not clean, reset, or reformat them.
- Keep changes scoped. Avoid unrelated refactors, dependency upgrades,
  generated-output churn, releases, or production-affecting operations unless
  required and explicitly approved.
- Trace symbols to their definitions and usages before changing public
  behavior. Check the manifest and neighboring imports before adding a library
  or assuming an API exists.
- After pushing a commit that addresses review feedback, reply in each
  applicable inline thread with the exact pushed commit and verification,
  react to useful automated findings, and resolve the conversation only after
  the pushed head contains the fix. A later review or an outdated comment does
  not resolve the original thread. If a finding is rejected or remains
  unverified, explain the technical disposition instead of resolving it
  silently.

## GitHub Work Tracking

- Use GitHub issues and an organization Project associated with this repository
  as the durable record for planned and emergent work. Meaningful features,
  fixes, operational changes, documentation changes, and technical debt require
  tracking; tiny typo, formatting, or administrative changes may be exempt.
- GitHub CLI (`gh`) is required for this workflow. Before GitHub operations,
  run `gh --version` and `gh auth status`. If it is unavailable or unauthenticated,
  report the blocker rather than silently omitting tracking.
- Credentials for this private organization repository normally need `repo`,
  `read:org`, and `project` scopes. The write-capable Projects scope is
  `project`, not `project:write`. Ask before changing authentication scopes.
- Verify organization Project access with:

  ```sh
  gh project list --owner SplitmediaLabsLimited
  ```

- Do not guess which organization Project owns XJS work. Verify the repository's
  current Project association. If none is linked or designated, ask the user to
  identify it and report Project synchronization as a blocker until resolved.
- Perform modifications on a dedicated branch. Read-only investigation and
  issue grooming may occur on the default branch. Direct modifications on the
  default branch require explicit user instruction.
- Before creating or switching branches, preserve unrelated work, propose an
  issue-linked branch name, and ask unless the user already approved that
  operation. Never displace a dirty worktree; use a separate worktree when
  isolation is required.
- Search open and closed issues before creating one. Reuse a matching issue or,
  with approval, create one recording motivation, scope, acceptance criteria,
  and compatibility constraints.
- Add issue-worthy work to the designated Project and use its established
  fields and statuses. Update it at durable milestones: started, materially
  rescoped, blocked, draft PR opened, ready for review, completed, or cancelled.
- Prefer `gh issue develop <number> --checkout` when it can safely establish the
  issue/branch relationship. Otherwise use a conventional issue-linked name
  such as `feat/123-description`, `fix/456-description`, or
  `docs/789-description`.
- Link a PR with `Closes #<number>`, `Fixes #<number>`, or
  `Resolves #<number>` when merging should close the issue. At handoff, report
  issue, Project status, branch, PR, verification, and any blockers.
- For emergency work, backfill the issue and Project item after stabilizing the
  immediate risk and before review or merge.

## Compatibility and Public API Invariants

- XSplit Broadcaster's embedded **CEF 103** runtime is the browser compatibility
  target and source of truth for XSplit-hosted behavior.
- Keep the browser build target at `chrome103`. In particular, preserve
  `build.target: 'chrome103'` in `vite.config.mjs` and the explicit
  `target: 'chrome103'` used for both browser bundles in `scripts/build.mjs`.
- Do not introduce syntax, browser APIs, dependency output, polyfill
  assumptions, or bundler transformations that require a browser newer than
  CEF 103. A modern standalone-browser result does not prove host compatibility.
- `dist/xjs.js`, `dist/xjs.min.js`, and the transitional compatibility copies
  must remain CEF 103 compatible. ESM and CommonJS package outputs may retain
  their separately configured modern target.
- Preserve the public XJS API during modernization. Do not remove or rename
  exports, classes, methods, properties, or events; change signatures or
  package-entry semantics; or intentionally alter existing runtime behavior
  without explicit approval and a migration plan.
- Preserve the XSplit browser-loader contract `require('xjs')`. It is a browser
  bundle shim and must not be confused with the npm package name.
- New maintained releases use `@splitmedialabs/xjs`. The historical
  `xjs-framework` package remains frozen at its final old-package release,
  `2.10.2`, unless an explicitly approved release plan says otherwise.
- Use Vite and the existing npm scripts. Do not reactivate Bower, Gulp,
  Browserify, Traceur, Broccoli, Dgeni, or the old Angular documentation stack.

## Documentation and Types

- Active product documentation lives under `docs/` and uses Astro/Starlight.
  `docs-old/` is migration reference material, not active infrastructure.
- Update public documentation in the same change when APIs, package entry
  points, examples, host behavior, or compatibility requirements would
  otherwise become inaccurate.
- Add concise TSDoc/JSDoc or comments where they explain public contracts,
  host-specific behavior, non-obvious side effects, compatibility workarounds,
  or why legacy-shaped behavior must remain.
- Avoid comments that only restate the code. Prefer explaining why a boundary
  exists, especially around CEF, raw CDP, host callbacks, and compatibility
  shims.
- Use explicit types at public boundaries and for host-response shapes when the
  value contract is known. Avoid broad `any` suppressions; document genuinely
  dynamic XSplit host boundaries locally.
- Type declaration output under `dist/` is generated by the build. Change
  source types and regenerate rather than hand-editing declarations.

## TDD and Verification

- Use proportionate TDD for feature and bug-fix code: establish a focused
  failing test or reproduction, observe the failure, implement the smallest
  change, and rerun the focused proof.
- Do not manufacture fake RED/GREEN ceremony for prose-only, config-only, or
  generated-output changes. Use readback, static assertions, lint, build, or a
  focused compatibility probe when those are the cheaper durable guard.
- Use the existing test infrastructure. Do not add a new runner without asking.
- Prefer targeted checks while iterating, then run the narrowest suite that
  covers the changed boundary:
  - `npm run build` for package output and declarations.
  - `npm test` for the default build and smoke suite.
  - `npm run test:full` for smoke plus the focused CEF compatibility contract.
  - `npm run test:components` for modern component tests.
  - `npm run docs:check` for active documentation source.
  - `npm run docs:build` for the generated documentation site.
  - `npm run pack:check` for package or release changes.
- Run `npm test` before handing off source, build, package, or smoke-test changes.
  Run `npm run test:full` when browser build targets or CEF compatibility
  boundaries change. Use the native docs and package commands above instead of
  adding source-spelling tests for their configuration.
- For documentation-only changes, read every changed file and run
  `git diff --check`. New untracked files also require an explicit
  `git diff --no-index --check /dev/null <file>` check because ordinary Git diff
  checks ignore them.
- A passing local browser test does not replace XSplit-host validation when the
  change affects browser output, DOM/custom elements, host callbacks, CDP, or
  CEF compatibility. If a Windows XSplit environment is unavailable, report
  the host check as not run rather than implying coverage.

## Repository Setup and Layout

- Package manager: npm. Expected Node version: `22.20.0`; package engine:
  `>=22.12.0`. Prefer the Volta pin in `package.json`.
- Initial setup from the repository root:

  ```sh
  volta install node@22.20.0
  npm ci
  npm run build
  ```

- This is a single-package TypeScript repository, not a monorepo:
  - `src/` contains the stable runtime API source.
  - `scripts/` contains build, docs, CDP, and maintenance automation.
  - `test/smoke/` contains active behavior smokes and focused compatibility
    contracts.
  - `test/unit/` contains legacy Karma/Jasmine-era tests retained as reference
    or migration input unless an active command proves otherwise.
  - `examples/` contains examples and the XSplit regression extension served on
    port `3999`.
  - `docs/` contains the active Astro/Starlight site.
  - `docs-old/` contains inactive legacy docs code.
  - `artifacts/` contains ignored local CDP and screenshot evidence.
- Modern code is ESM-first. Follow neighboring TypeScript/JavaScript style,
  including existing single-quoted imports and semicolons. Keep CommonJS output
  as a build artifact for consumers; do not convert active source back to
  CommonJS.

## XSplit and CEF Regression

- XSplit Broadcaster on Windows is required for authoritative host-integration
  testing. The expected CEF remote-debugging endpoint is
  `http://127.0.0.1:9222`.
- Launch XSplit Broadcaster for local XJS regression with these XSplit startup
  arguments (they are XSplit arguments, not Chromium `--` switches):

  ```text
  remotedebugxsplit remotedebug:9222 forcedacceptlocalexres:.
  ```

  `remotedebug:9222` exposes CEF's CDP endpoint. `remotedebugxsplit` enables
  XSplit's remote-debug handling for its embedded resources.
  `forcedacceptlocalexres:.` treats `.` as a regular expression and accepts
  matching local external-resource files without the normal remote/hash
  selection, so use this broad override only for a bounded developer/regression
  session. Developer mode is a lower-security mode: keep CDP bound to Windows
  loopback, forward it over SSH when testing remotely, and relaunch normally
  when finished.
- Before claiming host evidence, verify `/json/version` identifies both
  Chrome/CEF 103 and XSplit Broadcaster; a listening port or generic Chrome
  target is not authoritative XSplit evidence.
- Use raw CDP for XSplit-hosted regression because Playwright compatibility is
  not authoritative for CEF 103:
  - `npm run test:xsplit:cdp` attaches to an already open extension target.
  - `npm run test:xsplit:cdp:attached` may navigate an eligible active CEF
    target to the regression extension.
- Do not replace the raw-CDP path with a Playwright-only workflow. Playwright is
  acceptable for ordinary browser checks that do not claim XSplit host proof.
- Run `npm run examples` to serve `/examples/` and
  `/xsplit-extension/index.html` on port `3999`.
- For remote Windows testing, use the documented SSH forwarding and environment
  variables in `README.md`; do not bake developer-specific hostnames or paths
  into tracked files.
- Preserve useful timestamped evidence in ignored `artifacts/` during local
  runs. Do not commit machine-specific diagnostics unless the task explicitly
  calls for a reviewed regression fixture or receipt.

## Generated and Legacy Files

- Do not hand-edit generated modern outputs:
  - `dist/xjs.mjs`
  - `dist/xjs.cjs`
  - `dist/xjs.js`
  - `dist/xjs.min.js`
  - `dist/index.d.ts` and declaration files under `dist/`
  - generated API and internal docs content ignored by `.gitignore`
- Regenerate package output with `npm run build` and documentation output with
  the existing docs scripts.
- `dist/xjs-es2015.js` and `dist/xjs-es2015.min.js` are tracked transitional
  compatibility bundles even though the build regenerates them. Review their
  diff deliberately when a build-related task updates them; do not treat them
  as arbitrary hand-maintained source.
- Component fixture screenshots and
  `docs/src/assets/component-fixtures.json` are generated, committed docs
  assets. Update them through `npm run docs:components:update`, not by manually
  copying individual screenshots or editing manifest metadata.
- Avoid committing `node_modules/`, `.astro/`, `artifacts/`, ignored generated
  docs, or unrelated `dist/` output.
- Do not restore inactive legacy tooling merely because historical files or
  tests refer to it. Migrate valuable behavior to active tests before deleting
  historical coverage.

## Release and External Operations

- Do not publish packages, alter npm deprecations, push, merge, deploy docs,
  change secrets, or perform customer/production operations without explicit
  user approval.
- Release-oriented changes must preserve package exports and regenerate ignored
  artifacts before `npm run pack:check`.
- The package `prepare` lifecycle runs the build for pack, publish, and npm git
  installs. Account for that behavior when diagnosing release output.
- Treat release claims as requiring package tarball evidence, not merely a
  successful source build.

## Commit and Handoff

- Do not commit, push, merge, or rewrite history unless the user asks.
- When asked to commit, keep commits coherent and scoped. Separate unrelated
  build/package, TypeScript, CDP, generated-asset, and documentation changes.
- Before final handoff, report changed files, issue and Project state, current
  branch, commands run and their results, checks skipped, and any verification
  that still requires a Windows XSplit/CEF 103 environment.
