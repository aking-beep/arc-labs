# Graduation Criteria

This is the formal system that decides what happens to every idea in ARC Labs. It exists
for one reason: **to stop Labs becoming a graveyard of half-built projects.**

It is enforced by `tools/labs.py validate`, which runs in CI on every push. The rules
below are not aspirations — a repository that violates them fails its build.

---

## The five questions

Every record in `incubator/` must answer all five. A record that cannot answer them is
not ready to consume anyone's time.

| # | Question | Field | What a good answer looks like |
| --- | --- | --- | --- |
| 1 | **Hypothesis** — what do we believe? | `hypothesis` | A falsifiable statement. "We believe X, for Y, because Z." If no evidence could prove it wrong, rewrite it. |
| 2 | **Human problem** — whose capability or experience are we improving? | `human_problem` | A named person or role, and what is hard for them today. Not a market, not a segment, not "users". |
| 3 | **Experiment** — what is the smallest thing we can build? | `experiment` | Something buildable inside the timebox. If it needs auth, billing, and a mobile app, it is not the smallest thing. |
| 4 | **Evidence** — what tells us people actually want it? | `evidence` | Signals with a target set *before* the build, and an actual recorded after. At least one must be behavioural. |
| 5 | **Decision** — kill, iterate, incubate, or graduate? | `decision` | One of four words, with a date and a one-line rationale. `pending` is only legal before `review_by`. |

### Why evidence is a list, not a paragraph

A record's `evidence` is structured so the target is committed before the result is known:

```yaml
evidence:
  - signal: Returning users complete a second session within 7 days
    type: behavioural        # behavioural | qualitative | economic | technical
    target: ">= 40% of first-session completers"
    actual: "52% (n=61)"     # filled in at decision time
  - signal: Unprompted requests for the feature in support channel
    type: qualitative
    target: ">= 5 distinct people"
    actual: "9 people"
```

**At least one signal must be `type: behavioural` or `type: economic`.** People saying
they like a thing is not evidence that they want it. Interest is not demand.

---

## Stages

A record sits in exactly one stage, and the stage is encoded in **both** its `stage:`
field and the directory it lives in. The validator requires these to agree.

| Stage | Directory | Means | Typical timebox |
| --- | --- | --- | --- |
| `idea` | `incubator/ideas/` | Written down, not started. Has the five questions, no evidence yet. | — (no timebox) |
| `experiment` | `incubator/validating/` | Smallest buildable thing, in flight. | 1–7 days |
| `prototype` | `incubator/validating/` | Works end-to-end for one real person. | 1–3 weeks |
| `validating` | `incubator/validating/` | In front of real people, collecting the evidence named in the record. | 2–6 weeks |
| `building` | `incubator/building/` | Decision was `incubate`. Becoming a real product, still inside Labs. | 1–2 quarters |
| `graduated` | `incubator/graduated/` | Left Labs. Has its own repository. Record stays as the origin story. | — (terminal) |
| `killed` | `incubator/archive/` | Answered, and the answer was no. Record stays as the lesson. | — (terminal) |

Killed records live in `incubator/archive/`, **not** in `graduated/`. Mixing them would
destroy the only honest signal Labs has about its own hit rate.

---

## The four decisions

At every `review_by` date, exactly one of these is chosen. Choosing nothing is not an option.

### `kill`
The hypothesis was wrong, or right and not worth pursuing. Record moves to
`incubator/archive/`. **Required:** a `learned` field stating what is now known that was
not known before. A kill with no `learned` field fails validation — if an experiment
taught nothing, the experiment was designed wrong, and that itself is the lesson.

### `iterate`
The hypothesis is still live but the experiment did not test it cleanly. Record stays in
its stage, `review_by` is pushed out, and `iterations` is incremented. **Three iterations
is a cap** — a fourth means the hypothesis is not testable at this scale, and the
validator warns. Reaching the cap forces a `kill` or a rewritten hypothesis under a new ID.

### `incubate`
Evidence cleared the validation gate. Record moves to `incubator/building/`. Needs a
product brief (`templates/product-brief/`) and a named owner who is accountable for the
product, not just the experiment.

### `graduate`
The thing is a product. Record moves to `incubator/graduated/`, code leaves Labs for its
own repository, and `graduated_to` names that repository. See the gate below.

---

## The gates

### Gate 1 — Idea → Experiment

- [ ] Five questions answered in the record
- [ ] Named owner
- [ ] Timebox declared (`timebox_days`) and `review_by` set
- [ ] At least one `behavioural` or `economic` evidence signal with a target
- [ ] Fits one of the five Labs domains
- [ ] Smallest-thing test: can one person build it inside the timebox?

### Gate 2 — Experiment → Prototype

- [ ] The experiment ran. Not "was started" — ran.
- [ ] Every evidence signal has an `actual`, even if the actual is "no data"
- [ ] Works end-to-end for at least one real person who is not the owner

### Gate 3 — Prototype → Validating

- [ ] In front of people who did not build it and are not employees
- [ ] Instrumented: the behavioural signal can actually be measured
- [ ] A kill condition is written down — the result that would end this

### Gate 4 — Validating → Incubate

**All of these:**

- [ ] Every evidence target met, or missed with a written reason to continue anyway
- [ ] Retention or repeat-use signal, not just acquisition
- [ ] A person outside ARC would be disappointed if it disappeared
- [ ] Someone will own it as a product
- [ ] It still sits inside the Labs mandate (human potential, curiosity, emerging tech)

### Gate 5 — Incubate → Graduate

This is the gate that moves code out of Labs. **All of these:**

- [ ] **Users.** Real, non-employee, returning. Numbers in the record.
- [ ] **Owner.** A named product owner, not a Labs rotation.
- [ ] **Roadmap.** At least one quarter of work that is product work, not experiment work.
- [ ] **Deployment.** Ships on its own cadence, independent of Labs.
- [ ] **Evals pass.** The relevant suites in `evals/` — always `evals/accessibility` and
      `evals/security`; `evals/ai` if it ships model output.
- [ ] **Economics.** A revenue model, or an explicit decision that it is strategic and
      unmonetized. "We'll figure it out later" is not an entry.
- [ ] **Independence.** It does not import from `shared/` without those dependencies being
      published, vendored, or deliberately accepted as a fork point.
- [ ] **Launch checklist** complete (`templates/launch-checklist/`).

On graduation:

1. Move the code to its own repository.
2. Delete it from `experiments/` or `prototypes/` — Labs keeps no copy.
3. Move the record to `incubator/graduated/` with `stage: graduated`, `decision: graduate`,
   `graduated_to: <org>/<repo>`.
4. Add the product to `portfolio/products.yaml`.
5. Run `labs portfolio` to regenerate `portfolio/experiments.yaml`.

---

## Staleness: the mechanism that actually works

Every record in an in-flight stage (`experiment`, `prototype`, `validating`, `building`) has a `review_by` date.

| Condition | Result |
| --- | --- |
| `review_by` in the future, `decision: pending` | Healthy. In flight. |
| `review_by` today or past, `decision: pending` | **CI failure.** Decide today. |
| `review_by` past, terminal decision recorded | Healthy. Closed. |
| `iterations >= 3` | **CI warning.** Hypothesis is not testable at this scale. |
| Terminal stage with no `decided_on` | **CI failure.** Undated decisions are not decisions. |

This is deliberately the harshest rule in the repository. It is cheap to extend a
`review_by` date with a reason in the commit message. It is not possible to ignore one.

---

## Worked example

```
exp-2026-004-session-streaks

idea        2026-02-02   written down, five questions answered
experiment  2026-02-05   3-day timebox, hardcoded streak counter, 12 testers
            2026-02-08   DECISION: iterate — counter worked, cohort too small
experiment  2026-02-08   review_by pushed to 2026-02-19, iterations: 1
prototype   2026-02-19   DECISION: iterate → prototype, works for 40 people
validating  2026-03-04   in front of 300 people, instrumented
            2026-04-01   DECISION: incubate — 52% 7-day repeat vs 40% target
building    2026-04-01   product brief written, owner assigned
graduated   2026-07-14   DECISION: graduate → aking-beep/steady-move
```

Elapsed: five months, four decisions, every one dated. That is the shape Labs is aiming for.

---

## Schema reference

The authoritative, machine-readable schema is `tools/record_schema.yaml`. To check your
work:

```bash
python3 tools/labs.py validate     # full repo check, what CI runs
python3 tools/labs.py status       # pipeline board
```
