# Experiments

**The work.** One directory per experiment, named for its record id, organised by domain:

```
experiments/<domain>/<record-id>/
├── README.md     -> links back to the record, says what is faked
├── NOTES.md      -> dated log; write the surprises, not the status
└── <code>
```

The record in [`incubator/`](../incubator/) is the source of truth for *why* this exists
and when a decision is due. This directory is only the thing that was built.

## Rules for experiment code

- **Hardcode freely.** Auth, payments, multi-tenancy, and config systems are product work.
  An experiment that builds them has spent its timebox on the wrong thing.
- **Reach for [`shared/`](../shared/)** before writing infrastructure. Needed twice? It
  belongs there.
- **Instrument the one signal** named in the record. One event, not an analytics strategy.
- **Say what is faked** in the README. The next reader will otherwise assume it works.
- **Leave the mess visible.** Experiment code that looks like production code invites
  someone to treat it as production code.
- **Principles 1–3 and 7 apply** from the first commit (mandate fit, user agency, privacy).
  The other seven start at `building`. See [`PRODUCT_PRINCIPLES.md`](../docs/PRODUCT_PRINCIPLES.md).

## Lifecycle of a directory

| When | What happens here |
| --- | --- |
| Record reaches `experiment` | Directory created, linked from the record's `work:` field |
| Decision is `kill` | **Directory stays.** The code is part of the lesson. |
| Decision is `incubate` | Stays while the product is built; expect to replace rather than extend it |
| Decision is `graduate` | **Directory is deleted.** Code moves to the product's own repository. |

That last row is the one that keeps Labs from becoming a monorepo. `labs validate` checks
that a record's `work:` paths exist, so deleting a directory means updating the record in
the same commit.

## Domains

| Domain | The question it asks |
| --- | --- |
| [`ai/`](./ai/) | What can intelligent systems do for a person that they could not do before? |
| [`human-performance/`](./human-performance/) | How do we measurably raise human capability? |
| [`travel/`](./travel/) | How does technology change how people move through and understand the world? |
| [`gaming/`](./gaming/) | What do play, progression, and motivation teach us about engagement? |
| [`emerging-tech/`](./emerging-tech/) | What becomes possible that was not possible 18 months ago? |
