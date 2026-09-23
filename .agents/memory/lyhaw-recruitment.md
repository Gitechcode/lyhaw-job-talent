---
name: LY Haw recruitment build
description: Durable implementation constraints for the LY Haw Job Talent app.
---

The public recruitment experience is Khmer-first and should keep Kantumruy Pro as the primary Khmer typeface, with a readable Latin fallback.

**Why:** The user explicitly requested the Khmer font and the first visual verification confirmed it is central to the product's readability and identity.

**How to apply:** Preserve the font tokens in the web artifact when extending public pages or staff-facing screens; do not replace them with a generic sans-serif without a deliberate reason.

The OpenAPI contract is the source of truth for generated client hooks; server-side calendar fields arrive as Date values and serialize to ISO strings for the browser.

**Why:** Code generation inferred date schemas as Date on the server, so string literals caused type errors while sorting and response validation.

**How to apply:** Use Date values for typed server fixtures and compare them with getTime(); keep browser display formatting at the UI boundary.