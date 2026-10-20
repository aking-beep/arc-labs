# Auth

Throwaway identity for prototypes. Enough to tell two testers apart, and no more.

Experiments should not need this at all — an experiment that requires accounts is usually not the smallest thing. It exists for `prototype` and `validating` stages, where real people need to return to their own state.

## Scope

- Magic-link or code-based sign-in, no passwords
- A session that survives a reload, and nothing that survives the validation window
- A one-call wipe at window close, because experiment data gets deleted

## Out of scope

- Production auth for a graduated product. A graduated product owns its own identity —
  this is the single most important thing in `shared/` **not** to carry across
  ([Gate 5](../../docs/GRADUATION_CRITERIA.md#gate-5--incubate--graduate))
- Roles, permissions, org structures, SSO
- Anything storing a credential worth stealing

---

**Status:** empty. Populated on the [reusable-before-repeated](../README.md#the-rule-for-putting-something-here)
rule — the second time an experiment needs it. Adding something here creates a
[graduation cost](../README.md#the-graduation-problem), so the bar is "useful enough to
pay for twice".
