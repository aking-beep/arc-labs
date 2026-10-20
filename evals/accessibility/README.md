# Accessibility evals

**Required for every graduation, unconditionally.** No exceptions, no "we will do it in the first quarter after launch".

This follows directly from the mandate. Labs exists to raise human capability; a product that raises capability for some people by excluding others has not done the thing Labs claims to do ([Principle #6](../../docs/PRODUCT_PRINCIPLES.md)).

## What it checks

- Keyboard: every interactive path completable without a pointer
- Screen reader: every meaningful element labelled and announced in a sensible order
- Contrast: text and interactive states meet WCAG AA at minimum
- Focus: visible, logical, never trapped
- Motion: respects `prefers-reduced-motion`
- Targets: hit areas usable on a phone, one-handed
- Zoom: usable at 200% without horizontal scrolling or clipping
- Forms: errors identified in text, associated with their field, not colour-only

## Entry point

```bash
# TODO: suite entry point
```

**Status:** not yet implemented. Highest-priority suite to build, because it blocks every graduation and because
retrofitting it is the most expensive form of this work.

---

The bar for adding a check here: [it must be able to fail a real thing](../README.md#adding-an-eval).
