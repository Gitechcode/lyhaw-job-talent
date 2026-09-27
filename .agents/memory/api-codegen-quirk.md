---
name: API client codegen Headers typing
description: Orval-generated request helpers may use Headers.entries and require DOM iterable types.
---

When OpenAPI codegen adds request helpers that call `Headers.entries()`, the API client library must include `dom.iterable` in its TypeScript `lib` list.

**Why:** The generated helper is valid browser code, but TypeScript's `dom` library alone may not expose iterable methods on `Headers`, causing the shared library typecheck to fail after codegen.

**How to apply:** If generated API client code reports that `Headers.entries` does not exist, add `dom.iterable` to the client package compiler libs before retrying codegen.