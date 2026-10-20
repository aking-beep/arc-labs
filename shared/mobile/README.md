# Mobile

Device capability shims and native scaffolding, for experiments that genuinely need a phone — sensors, camera, location, background activity, notifications.

Most experiments do not. A mobile experiment costs several times a web one, so the record should say specifically why the phone is required.

## Scope

- Capability shims: sensors, camera, location, haptics, notifications
- A minimal shell that gets an experiment onto a real device quickly
- Permission-request patterns that are honest about why ([Principle #7](../../docs/PRODUCT_PRINCIPLES.md))

## Out of scope

- A shared app shell every Labs product is expected to adopt
- Store submission, provisioning, and release tooling for a graduated product
- Cross-platform abstractions chosen before any experiment needed them

---

**Status:** empty. Populated on the [reusable-before-repeated](../README.md#the-rule-for-putting-something-here)
rule — the second time an experiment needs it. Adding something here creates a
[graduation cost](../README.md#the-graduation-problem), so the bar is "useful enough to
pay for twice".
