# Launch checklist — <product name>

**Labs record:** `<exp-id>` · **Target repo:** `<org>/<repo>` · **Owner:** <name>

An unchecked box is a blocker. If an item does not apply, strike it and say why.

## Evidence

- [ ] Real, non-employee, returning users — numbers recorded in the Labs record
- [ ] A retention or repeat-use signal, not just acquisition
- [ ] Every `evidence` signal in the record has an `actual`
- [ ] Someone outside ARC would be disappointed if this disappeared, and we can say who

## Ownership

- [ ] Named product owner (a person, not a Labs rotation)
- [ ] At least one quarter of product-work roadmap, written down
- [ ] On-call or support path defined — who hears about it when it breaks
- [ ] Product brief complete (`templates/product-brief/`)
- [ ] Architecture document complete (`templates/architecture/`)

## Evals

- [ ] `evals/accessibility` — passes (always required)
- [ ] `evals/security` — passes (always required)
- [ ] `evals/ai` — passes, if it ships model output
- [ ] `evals/product` — the product's own suite exists and runs in its CI

## Engineering

- [ ] Ships on its own cadence, independent of Labs
- [ ] CI runs tests on every push in the new repository
- [ ] Secrets out of source, rotated after the move
- [ ] Rollback path exists and has been exercised once
- [ ] Error reporting reaches a human
- [ ] Meets the latency floor in `docs/PRODUCT_PRINCIPLES.md` #8 on a real network

## Product principles

- [ ] All ten principles reviewed, with the retention mechanic (#2) stated plainly
- [ ] User can see what the system did and undo it (#3)
- [ ] Private-by-default defaults confirmed (#7)
- [ ] Experiment-era data deleted or migrated under consent

## Independence from Labs

- [ ] Every `shared/` dependency published, vendored, or deliberately forked
- [ ] Nothing in Labs is imported at runtime
- [ ] Nothing in Labs imports from this product

## The move

- [ ] Code pushed to `<org>/<repo>` with history
- [ ] Code **deleted** from `experiments/` and `prototypes/` — Labs keeps no copy
- [ ] Record moved to `incubator/graduated/`, `stage: graduated`, `decision: graduate`,
      `graduated_to: <org>/<repo>`
- [ ] Added to `portfolio/products.yaml`
- [ ] `python3 tools/labs.py portfolio` run and committed
- [ ] `python3 tools/labs.py validate` passes

## Afterwards

- [ ] One paragraph in the record under "What Labs learned" — the origin story stays here
- [ ] Anything reusable extracted into `shared/` before the code leaves
