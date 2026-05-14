# Backlog

## Modernization Migration

Status: In progress

The active migration plan lives in [MIGRATION.md](MIGRATION.md). Use that document as the source of truth for build tooling, package outputs, TypeScript 6 hardening, XSplit CEF regression coverage, and release validation.

## Deferred Documentation Site Work

Status: Planned later

The legacy AngularJS docs app should eventually become a static documentation site. The current preference is Astro with Starlight, fed by future JSDoc or TSDoc annotations from `src/`, but the detailed docs-site plan should wait until the package and regression migration is close to complete.

Notes:

- AngularJS docs templates are documentation-generation views for public APIs, not runtime components for XSplit regression inventory.
- The current custom-element fixtures remain useful as regression baselines during the docs-shell replacement, but they are not the final implementation target.
