---
id: exp-2026-0001-pre-trip-cultural-briefing
title: Pre-trip cultural briefing generated from a calendar invite
domain: travel
stage: idea
owner: aking
opened: 2026-10-20
decision: pending
example: true

hypothesis: >
  We believe that a traveller who receives a short, specific cultural briefing two days
  before a trip will behave differently on arrival — asking better questions and making
  fewer avoidable missteps — and that the trigger can be a calendar invite alone, with no
  trip planning required of them.

human_problem: >
  A consultant flying to a client site in a country they have not worked in before has
  the information problem backwards: everything they can find is either tourist-grade or
  a 60-page country guide nobody reads on a Tuesday night. What is hard is not finding
  information, it is knowing which five things matter for the specific meeting they are
  walking into.

experiment: >
  Read a single calendar invite (destination, dates, attendee domains), generate a
  five-item briefing, and email it 48 hours ahead. No app, no account, no integration —
  forward an invite to an address and get the briefing back. Hand-generate the first
  batch if the model output is not good enough to send.

evidence:
  - signal: Recipients forward a second invite without being asked
    type: behavioural
    target: ">= 40% of recipients forward a second trip"
    actual:
  - signal: Recipients can name something they did differently on arrival
    type: qualitative
    target: ">= 6 of 15 in follow-up interviews"
    actual:
  - signal: Cost per briefing at acceptable quality
    type: economic
    target: "< $0.50 including model calls"
    actual:
---

# Pre-trip cultural briefing generated from a calendar invite

> **Illustrative seed record.** The specifics here are a worked example of the record
> format, not a committed project. Replace or delete it once real records exist.

## Why now

Two things changed. Models got good enough to compress a country guide into five specific
items without the output reading like a horoscope, and the cost per generation dropped far
enough that a briefing can be free to the recipient. Neither was true two years ago.

## What we are not doing

- No trip planning, booking, or itinerary features — those are ARC Travel's problem
- No account, no app, no calendar integration for this experiment (forwarding an invite
  is the entire interface)
- No attempt at a cultural model beyond the five items; depth is the next record, if this
  one survives

## Prior art

Culture Context is the adjacent ARC capability and would be the obvious home if this
works — see `portfolio/products.yaml`. The open question this record exists to answer is
whether the *trigger* (an invite, unprompted, 48 hours out) is what makes a briefing get
read, independent of how good the briefing is.

## Open questions

- Does the briefing need to know the attendees, or is destination plus meeting type enough?
- Is 48 hours the right lead time, or does it want to arrive in the airport lounge?
- Does this belong to the traveller or to whoever books their travel?
