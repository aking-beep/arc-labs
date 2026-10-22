---
title: RAG Over Your Docs
category: Retrieval
difficulty: intermediate
tags: [rag, embeddings, retrieval, qa]
updated: 2026-08-11
hitl: false
stack: [embeddings, vector DB, LLM]
---

# RAG Over Your Docs

A retrieval-augmented Q&A pipeline: chunk, embed, retrieve, and answer with citations over your own documents.

## What it does
Answers questions grounded in a document set instead of the model's memory. Chunks source docs, embeds them, retrieves the top-k relevant chunks per query, and asks the model to answer only from retrieved context, with inline citations back to the source.

## Pipeline
1. **Ingest** — split docs into ~500-token chunks with ~50-token overlap.
2. **Embed** — store vectors + source metadata in a vector DB.
3. **Retrieve** — embed the query, pull top-k (start with k=5) by cosine similarity.
4. **Answer** — prompt the model with the chunks and require citations.
5. **Fallback** — if no chunk clears a similarity threshold, say 'not found in the docs' rather than guessing.

## Prompt skeleton
```
Answer the question using ONLY the context below.
Cite each claim as [source: <file>#<chunk>].
If the context doesn't contain the answer, say so.

Context:
{retrieved_chunks}

Question: {user_question}
```

## Guardrails
Require citations and reject answers without them. Set a minimum similarity threshold so off-topic questions return 'not found' instead of a hallucination. Log the retrieved chunk IDs with every answer so you can audit wrong results.

## Tools
- **chunker** (validator) — Split docs into ~500-token chunks with overlap.
- **embedder** (api) — Store vectors plus source metadata.
- **retriever** (retriever) — Top-k by cosine similarity with a minimum threshold.
- **answer-model** (llm) — Answer only from retrieved context, with citations.

## Example input
```json
{
  "corpus_id": "hr-handbook",
  "question": "What is the parental leave duration?"
}
```

## Example output
```json
{
  "answer": "Parental leave is 16 weeks. [source: handbook.pdf#c12]",
  "citations": [
    "handbook.pdf#c12"
  ],
  "retrieved": 5,
  "below_threshold": false
}
```
