# Shared

**Leverage. The reason the tenth experiment is faster than the first.**

Infrastructure that more than one Labs experiment needs. Everything here exists to shorten
the distance between a hypothesis and a thing a person can use.

## The rule for putting something here

> **Reusable before repeated.** The *second* time Labs needs something, it goes here.

Not the first — premature shared code is worse than duplicated code, because it bakes in
assumptions from a single experiment that has not yet been decided. Not the third either;
by then two experiments have diverging copies and someone has to reconcile them.

| Directory | Holds | Do not put here |
| --- | --- | --- |
| [`design-system/`](./design-system/) | Tokens, primitives, patterns | Product-specific layouts |
| [`analytics/`](./analytics/) | Event capture, the one-signal helper | A measurement strategy |
| [`ai/`](./ai/) | Model clients, prompt scaffolding, cost tracking | Domain prompts |
| [`auth/`](./auth/) | Throwaway identity for prototypes | Production auth for a graduated product |
| [`mobile/`](./mobile/) | Device capability shims, native scaffolding | A shared app shell |

## The graduation problem

This is the sharp edge, and it is worth understanding before adding anything here.

A graduated product **must not depend on Labs at runtime**
([Gate 5](../docs/GRADUATION_CRITERIA.md#gate-5--incubate--graduate)). So every dependency
a product has on `shared/` must be resolved at graduation, one of three ways:

| Resolution | When it fits |
| --- | --- |
| **Publish** | The code is genuinely general. Versioned package, Labs maintains it. |
| **Vendor** | The product needs it and nobody else does. Copy it in, Labs stops owning it. |
| **Fork** | Both need it and their needs are diverging. Accept the divergence explicitly. |

The architecture template asks for this decision per dependency, and the launch checklist
blocks on it. Deferring it is how a Labs monorepo gets built by accident, one convenient
import at a time.

**Practical consequence:** keep what lives here small and boring. Every addition is a
future graduation cost, so the bar is not "is this useful" — it is "is this useful enough
to pay for twice".

## Quality bar

Shared code is the one place in Labs where production standards apply even though nothing
here is in production:

- Works for the experiment that needed it *and* the one that will
- Documented in its README with a usage example that runs
- No dependency on any specific experiment
- Breaking changes announced, because they break other people's timeboxes
