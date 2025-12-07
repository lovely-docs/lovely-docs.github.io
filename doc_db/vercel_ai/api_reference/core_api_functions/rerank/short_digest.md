## Overview
Rerank documents by relevance to a query using a reranking model.

## Basic Usage
```ts
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking, rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  topN: 2,
});
```

## Key Parameters
- `model`: Reranking model instance
- `documents`: Array of strings or objects to rerank
- `query`: Search query for ranking
- `topN`: Optional limit on returned documents
- `maxRetries`, `abortSignal`, `headers`, `providerOptions`, `experimental_telemetry`: Optional configuration

## Return Value
- `ranking`: Array of items with `originalIndex`, `score` (0-1), and `document`
- `rerankedDocuments`: Documents sorted by relevance (descending)
- `originalDocuments`: Original order
- `response`: Metadata including `id`, `timestamp`, `modelId`, `headers`, `body`
- `providerMetadata`: Optional provider-specific metadata

## Examples
Works with string documents, object documents, and provider-specific options like `cohere.maxTokensPerDoc`.