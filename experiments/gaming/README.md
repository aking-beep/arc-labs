# Gaming experiments

> **What do play, progression, and motivation teach us about engagement?**

Gaming is in Labs as a **source of mechanics**, not as a product line. Games solved progression, mastery, feedback, and difficulty calibration decades before software did, and most of that knowledge transfers. Some of it transfers in ways Labs will not ship — which is itself worth establishing by experiment rather than by assumption.

## Belongs here

- Progression and mastery systems, and what they imply for non-game products
- Difficulty calibration and flow — the strongest transferable mechanic in the domain
- Feedback loops: timing, specificity, and legibility
- Playfulness as a route to curiosity ([Principle #2](../../docs/PRODUCT_PRINCIPLES.md))
- Multiplayer and social structures where they serve capability

## Does not belong here

- Dark patterns, variable-ratio reward schedules, loss framing. Studying them to rule
  them out is legitimate; shipping them is not
- Games as products — Labs explores mechanics, not titles
- Monetisation mechanics borrowed from free-to-play

---

One directory per experiment, named for its record id. Start from
[`templates/experiment/WORK_README.md`](../../templates/experiment/WORK_README.md), and
open the record first: `python3 tools/labs.py new "Title" --domain gaming`.
