# Backlog

## Docs Site Modernization

Status: Planned

Replace the legacy AngularJS documentation app under `docs/app/` with a static documentation site. The preferred direction is Astro with Starlight so the docs can stay mostly static, fast to host, and easy to regenerate from source annotations as the TypeScript migration continues.

Goals:

- Generate API reference pages from future JSDoc or TSDoc annotations in `src/`.
- Preserve public documentation navigation, search, and API-member presentation from the current docs experience.
- Keep the XSplit CEF regression extension and example fixtures separate from the docs runtime.
- Retire the AngularJS docs app once the generated static site reaches feature parity.
- Keep docs output deployable to the existing static hosting flow.

Validation:

- Add a docs build command that generates the static site without requiring the legacy docs app runtime.
- Add smoke checks for generated docs routes, navigation, search index output, and API reference content.
- Update component fixture screenshots when docs shell markup changes.
- Keep active docs output free of deprecated package-manager paths and HTML import usage.

Notes:

- AngularJS docs templates are documentation-generation views for public APIs, not runtime components for XSplit regression inventory.
- The current custom-element fixtures remain useful as regression baselines during the docs-shell replacement, but they are not the final implementation target.
