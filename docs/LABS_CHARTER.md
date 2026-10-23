# ARC Labs Charter

## Mandate

> **ARC Labs explores the intersection of human potential, human curiosity, and emerging technology.**

Labs exists to find out what *should* exist. It is the part of ARC Transformation Group
that is allowed to be wrong in public, cheaply, and on a schedule.

Its sibling has an equally crisp mandate:

> **ARC Control makes autonomous technology trustworthy enough to operate in the real world.**

Together: **Labs explores what should exist. Control makes intelligent systems safe and
reliable enough to exist at scale.**

## What Labs is

An R&D operating system. A pipeline with a defined entry point, defined stages, defined
evidence, and — most importantly — a defined **exit**.

Labs holds four things:

| Holding | Meaning |
| --- | --- |
| **Records** | One file per idea, carrying the [five questions](./GRADUATION_CRITERIA.md#the-five-questions). Lives in `incubator/`. |
| **Work** | The smallest buildable thing that tests a record. Lives in `experiments/` and `prototypes/`. |
| **Knowledge** | What we learned, whether or not it shipped. Lives in `research/` and in killed records. |
| **Leverage** | Reusable infrastructure that makes the next experiment faster. Lives in `shared/`, `templates/`, `evals/`. |

## What Labs is not

Labs is **not** a monorepo for ARC's products. A product with its own users, deployment
cadence, roadmap, or revenue model does not belong here — it belongs in its own repository.
Labs is where that product was *decided on*, not where it lives.

Labs is also **not** ARC Control. Control is operational infrastructure with reliability
obligations to real-world systems. Nothing in Control is an experiment. If a question is
"can we make this autonomous system trustworthy," that is a Control question, not a
Labs question.

Specifically, Labs does not hold:

- Production application source for graduated products
- Customer data, credentials, or anything bound by a customer agreement
- Infrastructure that something else depends on at runtime
- Work with no owner and no review date

## The incubation model

```
Idea ──▶ Experiment ──▶ Prototype ──▶ Validation ──▶ Product ──▶ Independent repo
  │          │              │              │             │
  └──────────┴──────────────┴──────────────┴─────────────┘
                   any stage can decide: KILL
```

Every stage transition is a **decision**, not a drift. The decision is recorded in the
idea's record file, and the record physically moves between directories in `incubator/`.
`git mv` is the state transition, so every idea carries its own history.

See [GRADUATION_CRITERIA.md](./GRADUATION_CRITERIA.md) for the gates and
[EXPERIMENTATION.md](./EXPERIMENTATION.md) for how to run the work.

## Operating rules

1. **Every record has an owner. Every record in flight has a `review_by` date.** An idea
   nobody owns is not an idea, it is a wish. An in-flight experiment with no review date
   is not an experiment, it is a hobby.
2. **Timebox before you build.** The timebox is declared in the record before the first
   commit of work, not negotiated afterward.
3. **A record past its `review_by` date with `decision: pending` is a defect.** CI fails
   on it. This is the single mechanism that stops Labs becoming a graveyard.
4. **Killing is a success condition.** A killed experiment that produced a clear answer in
   five days is a better outcome than a six-month project with no verdict.
5. **Graduation is a removal.** When something graduates, its code leaves Labs. The record
   stays, pointing at the new repository.
6. **Evidence beats taste.** Taste decides what to try. Evidence decides what to keep.
7. **Reusable before repeated.** The second time Labs needs something, it goes in `shared/`.

## Cadence

| Rhythm | Activity |
| --- | --- |
| **Weekly** | Review every record in `incubator/validating/`. Run `labs status`. Any record at its `review_by` date gets a decision that day. |
| **Monthly** | Portfolio review. Does the mix of domains still match the mandate? Prune `incubator/ideas/`. |
| **Quarterly** | Graduation review. What is ready to leave? What has been "building" too long? |

## Domains

Labs organizes exploration into five domains. A record names exactly one.

| Domain | Question it asks |
| --- | --- |
| `ai` | What can intelligent systems do for a person that they could not do before? |
| `human-performance` | How do we measurably raise human capability? |
| `travel` | How does technology change how people move through and understand the world? |
| `gaming` | What do play, progression, and motivation teach us about engagement? |
| `emerging-tech` | What becomes possible that was not possible 18 months ago? |

A record that fits no domain is a signal: either the domain list is wrong, or the idea
belongs somewhere other than Labs. Both are worth saying out loud.

## Amending this charter

This charter changes by pull request, with the reasoning in the PR body. The mandate
sentence at the top changes rarely and deliberately — it is the thing everything else
is measured against.
