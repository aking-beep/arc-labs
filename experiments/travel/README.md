# Travel experiments

> **How does technology change how people move through and understand the world?**

Travel sits at the mandate's intersection almost by definition: it is curiosity with a departure date. The useful experiments here are about understanding and context rather than logistics — booking is a solved and crowded problem, and comprehension is not.

## Belongs here

- Cultural context and preparation (see Culture Context in [`portfolio/products.yaml`](../../portfolio/products.yaml))
- Language and communication in situ
- Local knowledge: what a resident knows that a visitor cannot find
- Trip-shaped interfaces — things that behave differently 48 hours out than six weeks out
- Movement, orientation, and navigation as understanding rather than routing

## Does not belong here

- Booking, pricing, and inventory — ARC Travel's product surface, not a Labs question
- Anything that depends on a supplier integration to be testable
- Destination content with no mechanism under test
- Production work on ARC Travel itself

---

One directory per experiment, named for its record id. Start from
[`templates/experiment/WORK_README.md`](../../templates/experiment/WORK_README.md), and
open the record first: `python3 tools/labs.py new "Title" --domain travel`.
