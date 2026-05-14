# Legacy Documentation Source Boundary

This directory contains the old Angular/Dgeni-era documentation stack. It is
kept as migration reference material while the new Astro/Starlight site lives in
`docs/`.

## Legacy Build Surface

- `docs-old/app/` is the static legacy docs application copied by
  `npm run docs:legacy:build`.
- `scripts/build-legacy-docs.mjs` is the legacy docs build entry point.
- Docs runtime vendor files come from npm packages or checked-in files under
  `docs-old/app/`.

## Reference-Only Source

The package directories under `docs-old/` are retained as migration reference
material:

- `docs-old/docs-package/`
- `docs-old/angular.io-package/`
- `docs-old/public-docs-package/`
- `docs-old/typescript-package/`
- `docs-old/typescript-definition-package/`
- `docs-old/links-package/`

These directories are not part of the package build, examples server, or release
workflow. Keep them available as references for the Astro/Starlight
documentation migration, but do not add install-time dependencies or scripts just
to make the old generator stack runnable again.
