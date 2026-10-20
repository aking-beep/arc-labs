# Analytics

Event capture for experiment evidence. One job: make the single behavioural signal in a record measurable in under an hour.

Nothing here is a measurement strategy. An experiment that needs a funnel has stopped being an experiment.

## Scope

- Capture for one named event, with a session identifier and nothing more
- Local counting, so an experiment can read its own numbers without a pipeline
- Retention defaults and a deletion helper — [Principle #7](../../docs/PRODUCT_PRINCIPLES.md)
  requires experiment data to be deleted when the experiment ends, so make that one call

## Out of scope

- Dashboards, funnels, cohort tooling
- Anything that identifies a person beyond what they consented to
- Production analytics for a graduated product — that is the product's own choice

---

**Status:** empty. Populated on the [reusable-before-repeated](../README.md#the-rule-for-putting-something-here)
rule — the second time an experiment needs it. Adding something here creates a
[graduation cost](../README.md#the-graduation-problem), so the bar is "useful enough to
pay for twice".
