# Contributor Reference

These pages expose source-level modules for maintainers and contributors.
They mirror the old Dgeni habit of keeping implementation-facing docs visible in
the public repository, but they are not the stable package API.

Use the API Reference for supported package imports. Use this section when
working on migrations, host compatibility behavior, generated documentation, or
internal XSplit protocol flow.

## What Belongs Here

- Internal host bridges such as remote/proxy, event manager, and XML/JXON helpers.
- Source and item mixins that are useful when preserving legacy behavior.
- Utility modules that explain compatibility, migration, or contributor-facing implementation details.

Public runtime compatibility is still governed by the root package exports.
