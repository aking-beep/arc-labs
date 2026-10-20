# AI

Model access, prompt scaffolding, and cost tracking. The most-reached-for directory in Labs, and therefore the one most at risk of becoming a framework.

Keep it at the level of "call a model, know what it cost, fall back when it is slow". Anything more opinionated belongs in the experiment.

## Scope

- Thin model clients with retry and timeout
- Streaming helpers and a structured-output helper
- **Cost tracking per experiment** — `evidence` targets are often economic, so cost per
  interaction needs to be observable without instrumentation work
- Fallback behaviour when a model is slow or unavailable ([Principle #8](../../docs/PRODUCT_PRINCIPLES.md))

## Out of scope

- Domain prompts — those belong to the experiment that wrote them
- Agent frameworks and orchestration layers
- Eval harnesses — see [`evals/ai/`](../../evals/ai/)
- Anything that makes a model call unobservable to the person who wrote it

---

**Status:** empty. Populated on the [reusable-before-repeated](../README.md#the-rule-for-putting-something-here)
rule — the second time an experiment needs it. Adding something here creates a
[graduation cost](../README.md#the-graduation-problem), so the bar is "useful enough to
pay for twice".
