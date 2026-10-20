# Security evals

**Required for every graduation, unconditionally.**

Labs products handle attention, health, performance, and location data. A product leaving Labs takes that responsibility with it, and the move itself is a risk event — credentials written for an experiment should not survive into a product.

## What it checks

- Secrets: none in source or history; rotated after the move out of Labs
- Dependencies: known-vulnerable packages flagged, with a decision recorded per finding
- Authentication: session handling, expiry, and revocation behave as documented
- Authorisation: a user cannot reach another user's data, tested rather than asserted
- Transport: TLS everywhere, no mixed content
- Input: untrusted input handled at every boundary, including model output
- Data: retention matches what users were told; deletion actually deletes
  ([Principle #7](../../docs/PRODUCT_PRINCIPLES.md))
- Logging: no credentials, tokens, or personal data in logs
- Experiment residue: test accounts, seeded data, and debug endpoints removed

## Entry point

```bash
# TODO: suite entry point
```

**Status:** not yet implemented. The last item is the one most often missed, and the reason this suite runs at the moment
of graduation rather than before it.

---

The bar for adding a check here: [it must be able to fail a real thing](../README.md#adding-an-eval).
