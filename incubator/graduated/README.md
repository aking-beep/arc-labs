# graduated/ — `stage: graduated`

Left Labs. Has its own repository, its own deployment cadence, its own owner.

**The code is not here.** Graduation deletes it from `experiments/` and `prototypes/` —
that is the whole point. What stays is the record: the hypothesis someone had, the
evidence that justified building it, and the dated decisions in between. The origin story.

Every record here must name its destination in `graduated_to: <org>/<repo>`, and that
repository must appear in [`portfolio/products.yaml`](../../portfolio/products.yaml).
`labs validate` enforces both — a graduation is not complete until the product is
registered.

**Terminal stage.** No `review_by`, no further transitions. If a graduated product comes
back to Labs, that is a new record with a new id and a new hypothesis, not a reopening of
this one.

Read these when starting something adjacent. The useful part is usually not the hypothesis
that worked — it is the two iterations before it.
