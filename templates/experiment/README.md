# Experiment template

`RECORD.md` is the canonical five-question record. Do not copy it by hand:

```bash
python3 tools/labs.py new "Your title here" --domain human-performance --owner aking
```

That generates `incubator/ideas/exp-<year>-<nnnn>-<slug>.md` with the id, date, domain,
and owner already filled in.

`WORK_README.md` is the stub for the work directory that the record points at
(`experiments/<domain>/<id>/README.md`). Copy that one by hand when you start building.

The record is validated against `tools/record_schema.yaml` by `labs validate`. If you add
a field to the template, add it to the schema too, or the validator will flag it as unknown.
