# <experiment id> — <title>

**Record:** `incubator/<stage-dir>/<id>.md`
**Owner:** <owner> · **Timebox:** <n> days · **Review:** <YYYY-MM-DD>

> Experiment code. Hardcoded on purpose. Not a product, not a dependency, not an example
> of how ARC writes production software. See `docs/PRODUCT_PRINCIPLES.md` for which
> principles apply at this stage (1–3 and 7 only).

## Hypothesis

One line, copied from the record so a reader knows what this code is arguing.

## Run it

```bash
# the shortest path from clone to seeing the thing
```

## What is instrumented

The one signal this experiment exists to measure, and where it lands.

## What is faked

Auth, payments, persistence, the model, the data — whatever is a human behind a curtain.
Be explicit; the next reader will otherwise assume it works.

## Notes

Dated log in [`NOTES.md`](./NOTES.md). Write the surprises, not the status.
