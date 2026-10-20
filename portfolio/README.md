# Portfolio

Two files, one hand-maintained and one generated. The distinction matters.

| File | Source of truth | Edited by |
| --- | --- | --- |
| [`products.yaml`](./products.yaml) | **Itself.** This is the registry. | Hand, by pull request |
| [`experiments.yaml`](./experiments.yaml) | `incubator/*/*.md` | **Nobody.** `labs portfolio` generates it. |

## `products.yaml`

Every product born in ARC Labs, wherever its code now lives — plus a `boundary:` section
recording what is deliberately *not* Labs, so the line stays legible when someone asks in
six months.

It is hand-maintained because it describes things outside this repository, which the
repository cannot observe. That makes it the one place where facts can quietly go stale,
so entries carry `repo_confirmed:`. **A `false` there is not a defect — it is an honest
flag on a working assumption.** Several entries start out false; confirm them rather than
letting a guess calcify into a record.

The one hard link to the pipeline: a record with `graduated_to: <repo>` must match a `repo`
in this file, or `labs validate` fails. A graduation is not complete until the product is
registered.

## `experiments.yaml`

A flat, generated index of every incubator record — id, title, domain, stage, owner,
dates, decision — for anything that wants the pipeline as data rather than as markdown.

```bash
python3 tools/labs.py portfolio     # regenerate
```

CI fails if it is out of sync with the records, which means it is always safe to read and
never worth editing. If you want to change what it contains, change `build_index()` in
`tools/labs.py`.

## Relationship types

| Relationship | Means |
| --- | --- |
| `labs-product` | Born in Labs, has its own users and roadmap, lives in its own repository |
| `labs-technology` | Born in Labs, ships as a component of something else rather than standalone |
| `labs-commercial-experiment` | Revenue hypothesis under test; not yet a product |
| `not-labs` | Outside the Labs mandate. Recorded in `boundary:` for clarity, not ownership |

The useful distinction is the second one. A `labs-technology` entry has no independent
users, so it does not get its own repository — but if it acquires users and a roadmap it
becomes a product, and that transition needs a record and a repository of its own.
