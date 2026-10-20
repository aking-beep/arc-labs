# Product evals

**A product's own suite must exist and run in its CI before graduation.** Unlike the other three, Labs does not define the content — the product does, because only the product knows what it claims.

What Labs requires is that the claims are written down and checked, rather than demonstrated.

## What it checks

- The one-sentence claim from the product brief, as an executable check
- The three to five things the product does, each covered end-to-end
- The primary user journey, completable by a first-time user without instruction
- The latency floor from [Principle #8](../../docs/PRODUCT_PRINCIPLES.md), measured on a
  real network rather than localhost
- The evidence signal from the Labs record, still instrumented after the move

## Entry point

```bash
# TODO: suite entry point
```

**Status:** not yet implemented. That last check is the one worth insisting on. A product that loses its evidence
instrumentation during graduation has lost the ability to tell whether the thing that
justified building it is still true.

---

The bar for adding a check here: [it must be able to fail a real thing](../README.md#adding-an-eval).
