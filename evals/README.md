# Evals

**The gates with teeth.** Two of these suites block graduation unconditionally.

An eval is not a test of whether code works — that is the product's own CI. An eval
answers whether a thing is *allowed to leave Labs*.

| Suite | Required for graduation | Asks |
| --- | --- | --- |
| [`accessibility/`](./accessibility/) | **Always** | Can everyone use it? |
| [`security/`](./security/) | **Always** | Can it be trusted with what it holds? |
| [`ai/`](./ai/) | If it ships model output | Is the output safe, honest, and reversible? |
| [`product/`](./product/) | Suite must exist and run | Does it do what it claims, for a real person? |

## Why accessibility and security are unconditional

Both are the kind of work that is cheap early and ruinous late, and both are the kind of
work that never wins a prioritisation argument against a feature. Making them gates
removes the argument.

The accessibility one is also a direct consequence of the mandate:
[Principle #6](../docs/PRODUCT_PRINCIPLES.md) — *a tool that raises human capability but
excludes people is a contradiction, not a tradeoff.*

## What evals do not apply to

**Experiments.** Nothing in `experiments/` is eval-gated. Experiment code is disposable,
and gating it would defeat the purpose of a timebox.

Evals start mattering at `validating` — the point where real people are involved — and
become blocking at [Gate 5](../docs/GRADUATION_CRITERIA.md#gate-5--incubate--graduate).

| Stage | Evals |
| --- | --- |
| `experiment`, `prototype` | None |
| `validating` | Accessibility smoke check; privacy and consent per [Principle #7](../docs/PRODUCT_PRINCIPLES.md) |
| `building` | All applicable suites run, failures tracked, not yet blocking |
| `graduation` | **Blocking.** An unchecked box in the launch checklist is a blocker. |

## Running them

Each suite documents its own entry point in its README. Suites are deliberately
independent — a product graduating to its own repository takes the suites it needs with it,
rather than depending on Labs to run them.

## Adding an eval

The bar: **an eval must be able to fail a real thing.** A check that has never blocked
anything is documentation wearing a test's clothes, and it trains people to ignore the
suite. If a check cannot fail, write it in the launch checklist instead.
