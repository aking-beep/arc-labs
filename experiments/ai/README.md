# AI experiments

> **What can intelligent systems do for a person that they could not do before?**

The interesting question in this domain is rarely whether a model can do something. It is whether a person's capability actually changes when it does — and whether they stay in charge of the outcome ([Principle #3](../../docs/PRODUCT_PRINCIPLES.md)). An experiment whose evidence is model benchmark performance has not tested anything about a human.

## Belongs here

- Agentic workflows where the user remains the decision-maker
- Capability assessment and measurement (see `exp-2026-0003`)
- Interfaces that make model output inspectable and reversible
- Cost-curve experiments: what becomes viable at a new price per token
- Model-assisted work in service of a named human problem

## Does not belong here

- Model evaluation harnesses with no human in the loop — those are [`evals/ai/`](../../evals/ai/)
- Research reading with no build attached — that is [`research/ai-agents/`](../../research/ai-agents/)
- Autonomy with reliability obligations to real-world systems — that is ARC Control
- "We should use AI for X" with no hypothesis about what changes for whom

---

One directory per experiment, named for its record id. Start from
[`templates/experiment/WORK_README.md`](../../templates/experiment/WORK_README.md), and
open the record first: `python3 tools/labs.py new "Title" --domain ai`.
