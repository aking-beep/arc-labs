# archive/ — `stage: killed`

Answered, and the answer was no. **These records are an asset, not a cleanup task.**

Every record here carries a `learned` field — what is now known that was not known before.
`labs validate` rejects a kill without one, on the reasoning that an experiment which
taught nothing was designed wrong, and *that* is the lesson worth recording.

**Read this directory before opening a new record.** The most expensive mistake in R&D is
retrying a dead idea in eighteen months because nobody who was in the room is still
nearby. Search it first:

```bash
grep -ril "<your idea's keyword>" incubator/archive/
```

**A healthy Labs has considerably more records here than in `graduated/`.** A kill rate
that looks low usually means ideas are not being killed, not that they were all good.

Deliberately kept separate from `graduated/`: mixing them would destroy the only honest
signal Labs has about its own hit rate.

**Terminal stage.** Reviving an idea means a new record with a new id, which should link
back to the one in here and say what changed.
