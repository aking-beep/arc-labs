# How to run a Labs experiment

The mechanics. [GRADUATION_CRITERIA.md](./GRADUATION_CRITERIA.md) is the law;
this is the practice.

## 1. Open a record before you build anything

```bash
python3 tools/labs.py new "Curiosity prompt before a workout" --domain human-performance
# -> incubator/ideas/exp-2026-0012-curiosity-prompt-before-a-workout.md
```

Fill in the five questions. This takes 20 minutes and it is the highest-leverage 20
minutes in the whole pipeline. Most ideas die here, cheaply and correctly.

A record that is hard to write is usually an idea that is not yet an idea. Sit with the
discomfort rather than resolving it by starting to code.

## 2. Pick the smallest thing

The smallest thing is almost always smaller than your first instinct. Ladder, cheapest first:

| Technique | Tests | Cost |
| --- | --- | --- |
| **Conversation** | Does the problem exist? | Hours |
| **Fake door** | Would anyone click it? | A day |
| **Wizard of Oz** | Is the output valuable? (human behind the curtain) | 1–2 days |
| **Single-path prototype** | Does the real mechanism work for one person? | 3–7 days |
| **Instrumented prototype** | Do people come back? | 2–3 weeks |

Pick the cheapest technique that can actually falsify the hypothesis. If a conversation
can kill it, do not build a prototype.

## 3. Declare the timebox and the kill condition

In the record, before the first commit of work:

```yaml
timebox_days: 5
review_by: 2026-10-25
kill_condition: >
  Fewer than 3 of 12 testers start a second session without being asked.
```

The kill condition is the single most-skipped field and the single most useful one. Writing
down the result that would end the experiment, *before* you are attached to the experiment,
is what makes the decision survivable later.

## 4. Build it in `experiments/<domain>/<id>/`

```
experiments/human-performance/exp-2026-0012-curiosity-prompt/
├── README.md          -> links back to the record
├── NOTES.md           -> running log, dated entries, what surprised you
└── <code>
```

Rules for experiment code:

- **Hardcode freely.** Auth, payments, multi-tenancy, and config systems are product work.
- **Reach for `shared/`** before writing infrastructure. If `shared/` does not have it and
  you need it twice, that is a signal to put it there.
- **Instrument the one signal you care about.** Not an analytics strategy — one event.
- **Leave the mess visible.** Experiment code that looks like production code invites
  someone to treat it as production code.

## 5. Keep a dated log

`NOTES.md`, append-only, one entry per working session:

```markdown
## 2026-10-21
Shipped the prompt to 12 testers. 4 completed. Two said the prompt felt like homework —
the framing, not the mechanic. Trying a question instead of an instruction tomorrow.

## 2026-10-22
Question framing: 9 of 12 completed. The mechanic was never the problem.
```

This log is what makes the decision writable at review time, and what makes a killed
experiment worth more than nothing. Write the surprises, not the status.

## 6. Decide on the review date

Run the review on the date in the record. Not when it feels ready — ready is a feeling
and feelings do not have dates.

```bash
python3 tools/labs.py decide exp-2026-0012-curiosity-prompt --decision iterate \
  --rationale "Mechanic works, framing was wrong. One more cycle on framing."
```

Four decisions, one chosen: `kill`, `iterate`, `incubate`, `graduate`. Fill in every
`actual` in `evidence` first — including "no data", which is itself a finding about the
experiment's design.

## 7. Move the record

```bash
python3 tools/labs.py move exp-2026-0012-curiosity-prompt --to prototype
```

This rewrites the `stage` field and `git mv`s the record into the right stage directory,
so the pipeline on disk always matches reality. Commit the move on its own, with the
rationale in the message.

---

## Anti-patterns

| Anti-pattern | Why it is fatal | What to do instead |
| --- | --- | --- |
| **Hypothesis written after the build** | Nothing can falsify it; you will find support for whatever you built | Record first, always |
| **"Let's see what happens"** | No target means no result, so the experiment cannot end | Set the target before building |
| **Evidence is all qualitative** | People are kind in interviews and honest in behaviour | At least one behavioural or economic signal |
| **Extending the timebox silently** | This is how a 5-day experiment becomes an 8-month project | Extend by commit, with a reason |
| **Building the product during the experiment** | Sunk cost arrives before evidence does | Hardcode; product work starts at `building` |
| **Killing quietly** | The lesson evaporates, and someone retries it in a year | `learned` field is mandatory on kills |
| **Graduating without moving code out** | Labs becomes the monorepo it exists not to be | Graduation deletes code from Labs |
| **One owner for nine open experiments** | All nine stall | Cap concurrent owned experiments at three |

## Weekly review script

Fifteen minutes, every week:

1. `python3 tools/labs.py status` — look at the board.
2. Any record at or past `review_by`: decide now, in the room.
3. Any record with `iterations >= 2`: ask out loud whether the hypothesis is testable.
4. Any owner with more than three in-flight: rebalance.
5. `incubator/ideas/` older than a quarter: kill or promote. Ideas do not improve by waiting.
