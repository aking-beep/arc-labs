# exp-2026-0002 — Question framing before a training session

**Record:** [`incubator/validating/exp-2026-0002-question-framing-before-a-session.md`](../../../incubator/validating/exp-2026-0002-question-framing-before-a-session.md)
**Owner:** aking · **Timebox:** 7 days · **Review:** 2026-10-27

> Illustrative seed. Shows the shape of an experiment work directory; contains no code.

> Experiment code. Hardcoded on purpose. Not a product, not a dependency. Only product
> principles 1–3 and 7 apply at this stage — see `docs/PRODUCT_PRINCIPLES.md`.

## Hypothesis

Replacing the pre-session instruction with a question raises completion, because the
barrier is motivational framing rather than the difficulty of the work.

## Run it

```bash
# the shortest path from clone to seeing the thing
```

## What is instrumented

One event: session completion, tagged with the variant shown. Nothing else.

## What is faked

Variant assignment is a hardcoded date parity check. No persistence, no accounts, no
analytics pipeline — completions are counted out of a flat log.

## Notes

Dated log in [`NOTES.md`](./NOTES.md).
