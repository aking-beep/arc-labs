# AI evals

**Required when a product ships model output to a user.**

Distinct from benchmark evaluation. The question is not whether a model performs well in general; it is whether *this* product's output is safe, honest, and reversible in the hands of the person relying on it.

## What it checks

- Honesty: the product does not assert what it cannot support, and says when it is unsure
- Reversibility: every model-driven action is visible and undoable
  ([Principle #3](../../docs/PRODUCT_PRINCIPLES.md))
- Refusal behaviour: appropriate, and legible rather than silent
- Harmful output: domain-specific red lines — health claims in human-performance, cultural
  claims in travel — tested with cases drawn from the product's actual use
- Prompt injection: untrusted content in context cannot redirect the product's behaviour
- Degradation: behaviour when the model is slow, unavailable, or returns nonsense
- Cost: per-interaction cost inside the bound stated in the product brief
- Attribution: where output is derived from a source, the user can see the source

## Entry point

```bash
# TODO: suite entry point
```

**Status:** not yet implemented. Build this alongside the first Labs product that ships model output to a user, using that
product's real failure cases rather than generic prompts.

---

The bar for adding a check here: [it must be able to fail a real thing](../README.md#adding-an-eval).
