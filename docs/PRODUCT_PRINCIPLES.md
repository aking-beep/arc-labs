# Product Principles

What ARC Labs builds, and how it behaves when it builds it. These are the principles a
product is held to at [Gate 5](./GRADUATION_CRITERIA.md#gate-5--incubate--graduate),
and the tiebreakers when an experiment could go either way.

---

## 1. Raise the ceiling, not the floor

Labs builds things that make a capable person more capable. Plenty of software exists to
stop people failing; Labs is interested in the opposite end — what does someone do with a
tool that assumes competence and extends it?

**Tiebreaker:** if a feature only helps the least engaged user, it is maintenance.
If it changes what the most engaged user can do, it is Labs work.

## 2. Curiosity is the engagement model

Labs products earn attention by being interesting, not by being sticky. Streaks, guilt,
and loss-aversion mechanics are off the table — not because they do not work, but because
they work for reasons that have nothing to do with the user's benefit.

**Test:** would you be comfortable explaining the retention mechanic to the person it is
applied to? If not, it does not ship.

## 3. The human stays the agent

Emerging technology, AI included, operates in service of a person's intent. A Labs product
can advise, surface, generate, and automate — but the person remains the one deciding.
Anything irreversible is theirs to confirm.

**Test:** can the user see what the system did, and undo it?

## 4. Smallest honest surface

Each product does one thing a person can describe in a sentence. Breadth is how a Labs
product dies: it becomes unexplainable, then unmaintained.

**Test:** can a new user state what this is for after 30 seconds, and be right?

## 5. Evidence over enthusiasm

Taste chooses what to try. Evidence chooses what to keep. The same standard applies to
features inside a graduated product as to experiments inside Labs — a feature with no
behavioural signal gets removed, not defended.

## 6. Accessible by construction

Accessibility is a gate, not a backlog item. `evals/accessibility` runs against every
graduating product, and an inaccessible product does not graduate. A tool that raises
human capability but excludes people is a contradiction, not a tradeoff.

## 7. Private by default

Labs products handle attention, health, performance, and location data. Defaults are the
most private option; sharing is opt-in, legible, and revocable. Data collected for an
experiment is deleted when the experiment ends.

**Test:** if the data were published tomorrow, would a user say they had agreed to that?

## 8. Fast, because respect is measurable

Latency is how software communicates what it thinks of the user's time. Interaction
feedback under 100ms, meaningful first paint under 1s on real networks, no interface that
blocks on a model call without saying so.

## 9. Durable over clever

A Labs product that graduates will be maintained by someone who did not build it, on a
cadence Labs does not control. Prefer the boring architecture, the dependency with five
years of history, the pattern that reads obviously at 2am.

**Exception:** inside `experiments/`, cleverness is free. These principles start applying
at `building`.

## 10. Real-world or it did not happen

A demo is an argument, not evidence. Labs products are judged on behaviour in actual use,
by people with no relationship to ARC, on their own devices, on their own networks.

---

## Applying these

| Stage | How much this applies |
| --- | --- |
| `idea`, `experiment`, `prototype` | Principles 1–3 and 7 (mandate fit, user agency, privacy). The rest are suspended — that is what an experiment is for. |
| `validating` | Add 4, 5, 10. Real people are involved now. |
| `building` | All ten. Product work begins. |
| `graduated` | All ten, enforced by `evals/` and the launch checklist. |

Principles 7 (privacy) and 3 (human agency) are the two that apply from the very first
commit of experiment code. Everything else can wait for the thing to prove it deserves to exist.
