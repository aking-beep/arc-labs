# Example

**Input:** a PR that adds an `/api/refund` route and no tests.

**Output (abridged):**

```
Recommendation: request-changes

Risks:
- [high] app/api/refund/route.ts:41 — refunds execute with no identity check in the diff
- [medium] app/api/refund/route.ts:58 — errors are swallowed; client always sees 200

Test gaps:
- No test hunk for unauthorized refund
- No test for failed payment-provider response

Checklist:
- [ ] Human review of billing path
- [ ] Add 401/403 cases
```
