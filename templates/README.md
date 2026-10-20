# Templates

The paperwork of the pipeline. Each template attaches to a specific stage transition, so
filling one in is never busywork — it is the artifact a gate asks for.

| Template | Written at | Clears |
| --- | --- | --- |
| [`experiment/`](./experiment/) | Opening an idea | [Gate 1](../docs/GRADUATION_CRITERIA.md#gate-1--idea--experiment) |
| [`validation-plan/`](./validation-plan/) | Entering `validating` | [Gate 3](../docs/GRADUATION_CRITERIA.md#gate-3--prototype--validating) |
| [`product-brief/`](./product-brief/) | Entering `building` | [Gate 4](../docs/GRADUATION_CRITERIA.md#gate-4--validating--incubate) |
| [`architecture/`](./architecture/) | During `building` | [Gate 5](../docs/GRADUATION_CRITERIA.md#gate-5--incubate--graduate) |
| [`launch-checklist/`](./launch-checklist/) | Leaving Labs | [Gate 5](../docs/GRADUATION_CRITERIA.md#gate-5--incubate--graduate) |

Only the experiment record is machine-validated (`tools/record_schema.yaml`). The rest are
read by people, at reviews.

## Changing a template

Templates get worse by accretion. Before adding a field, ask what decision it changes. If
the answer is "it would be nice to know", leave it out — the cost of a template nobody
finishes is that nobody finishes any of them.

If you add a field to `experiment/RECORD.md`, add it to `tools/record_schema.yaml` in the
same commit or `labs validate` will flag it as unknown.
