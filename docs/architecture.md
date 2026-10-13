# Implementation and decisions

## Brief

Provide an honest, no-cost, local-only knowledge and support demo for the Navrenlo portfolio. Users can ask questions of a fictional source library, inspect exact passages and preserve support drafts without sending them.

## Structure

- React and TypeScript render workspace navigation, conversation, library, draft editor and native dialogs.
- `src/model.ts` owns the typed fictional corpus, MiniSearch retrieval and validated session parsing.
- MiniSearch provides indexing, tokenization, prefix matching and relevance ranking. Its installed README/API was consulted rather than creating a custom engine.
- `sessionStorage` stores source IDs, query/category history and support drafts under a demo-specific key. Returned excerpts are read from the corpus. Invalid persisted shapes reset safely.
- Vite produces the standalone build. `scripts/serve.mjs` serves only the built directory on loopback with a path-boundary check.

## Visual direction

Quiet support workspace: white conversation surface, charcoal-green navigation, restrained leaf-green actions, neutral gray background and amber draft status. Existing Navrenlo PNG logo unchanged. Compact side navigation changes to a mobile tab row. A reset action remains available on mobile.

## Trade-offs

All meaningful terms must match the same passage. This protects against answering an unsupported compound question merely because one generic word matched. It also limits natural-language recall. Sources are fictional sample policies, not authoritative business/legal material. There is no inferred answer synthesis, vector database or live model.

Future live RAG integration requires explicit approval for provider/cost/data handling, server-side secret management, ingestion permissions, evaluation, access controls and prompt-injection protections. No API keys or placeholder live connection are included.
