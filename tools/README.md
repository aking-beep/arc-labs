# Tools

| File | What it is |
| --- | --- |
| [`labs.py`](./labs.py) | The pipeline tool. Validation, the board, and every state transition. |
| [`record_schema.yaml`](./record_schema.yaml) | The authoritative record schema. Declarative, so it is documentation and enforcement at once. |
| [`check_links.py`](./check_links.py) | Relative markdown links resolve. External URLs deliberately unchecked. |

Only dependency is PyYAML.

```bash
python3 -m pip install pyyaml
```

## labs.py

```bash
python3 tools/labs.py status                                    # the board
python3 tools/labs.py validate                                  # what CI runs
python3 tools/labs.py new "Title" --domain ai --owner you        # open a record
python3 tools/labs.py move <id> --to prototype                   # stage transition (git mv)
python3 tools/labs.py decide <id> --decision kill \
    --rationale "..." --learned "..."                            # record a decision
python3 tools/labs.py portfolio                                  # regenerate experiments.yaml
```

Record ids can be abbreviated to any unique prefix or substring — `exp-2026-0002` is
enough, and an ambiguous fragment lists the candidates rather than guessing.

### What `validate` checks

Per record: the five questions are answered and long enough to be real answers; `stage`
matches the directory the record lives in; the id matches the filename; at least one
evidence signal is behavioural or economic; decided records have an `actual` on every
signal; kills carry `learned`; graduations carry `graduated_to`; dates are ordered
sensibly.

Across the repository: ids are unique; `work:` paths exist; every `graduated_to` is
registered in `portfolio/products.yaml`; `portfolio/experiments.yaml` is in sync.

**And the rule that matters most:** a record in an in-flight stage, past its `review_by`
date, with `decision: pending` is an **error**. That single check is what keeps
`incubator/` a pipeline rather than a graveyard.

Warnings, which do not fail the build: three or more iterations, an owner over the
in-flight cap, an idea past its shelf life, an unknown front-matter field.

### Why mutations are surgical

`move` and `decide` rewrite only the front-matter lines they change. Records are
hand-edited markdown — re-serialising the whole block would collapse the `>` block
scalars, quote the dates, and delete the template's comments, and a tool that mangles
your file on every transition is a tool people stop using. A `move` should produce a
one-line diff, and it does.

## Changing the schema

`record_schema.yaml` is read at runtime, so adding a field is a schema edit plus a line in
`templates/experiment/RECORD.md`. The conditional `required` rules (`always`, `in_flight`,
`decided`, `killed`, `graduated`, …) are resolved in `required_now()` in `labs.py` — a new
rule name needs a case there.

Before adding a field, ask what decision it changes. If the answer is "it would be nice to
know", leave it out.

## Testing a change to the validator

The validator's only job is to fail things, so test it by breaking something on purpose:

```bash
cp -r . /tmp/labs-test && cd /tmp/labs-test
sed -i 's/^stage: experiment$/stage: building/' incubator/validating/*.md
python3 tools/labs.py validate      # must report the stage/directory mismatch
```

A check that cannot fail a real record is documentation wearing a test's clothes.
