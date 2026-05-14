# Documentation Source Boundary

The active documentation build is intentionally narrow during the modernization migration.

## Active Build Surface

- `docs/app/` is the static legacy docs application copied by `npm run docs:build`.
- `scripts/build-docs.mjs` is the only active docs build entry point.
- Docs runtime vendor files come from npm packages or checked-in files under `docs/app/`.

## Reference-Only Source

The package directories under `docs/` are retained as migration reference material:

- `docs/docs-package/`
- `docs/angular.io-package/`
- `docs/public-docs-package/`
- `docs/typescript-package/`
- `docs/typescript-definition-package/`
- `docs/links-package/`

These directories are not part of the active package build, docs build, examples server, or release workflow. Keep them available for the later Astro/Starlight documentation migration, but do not add install-time dependencies or scripts just to make the old generator stack runnable again.
