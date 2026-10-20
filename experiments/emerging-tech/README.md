# Emerging technology experiments

> **What becomes possible that was not possible 18 months ago?**

The scouting domain. Its job is to answer *is this real yet* cheaply and on the record, so the answer is a dated finding rather than a standing opinion. Expect the highest kill rate in Labs here, and treat that as the domain working.

Every record in this domain must answer one extra question in its body: **why now?** If nothing changed — no new capability, no new cost curve, no new access — it is not an emerging-technology experiment, it is a preference.

## Belongs here

- New capability or modality, probed with the smallest possible build
- Cost-curve crossings: what becomes viable at a tenth of last year's price
- New interface surfaces and input methods
- Infrastructure shifts that change what an application can assume
- Dated "not yet, and here is the specific blocker" findings — these are the domain's
  most common and most valuable output

## Does not belong here

- Technology with no candidate human problem attached
- Anything that cannot be probed inside a timebox
- Standing-opinion pieces with no build — that is [`research/emerging-technology/`](../../research/emerging-technology/)
- Things that were already answered here; check [`incubator/archive/`](../../incubator/archive/) first

---

One directory per experiment, named for its record id. Start from
[`templates/experiment/WORK_README.md`](../../templates/experiment/WORK_README.md), and
open the record first: `python3 tools/labs.py new "Title" --domain emerging-tech`.
