## Purpose
Rerank documents by relevance to a query using semantic understanding.

## Basic Usage
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
});
```

## Key Parameters
- `model` (required): Reranking model instance
- `documents` (required): Array of strings or objects to rerank
- `query` (required): Search query
- `topN` (optional): Limit results count
- `maxRetries` (optional): Retry attempts, default 2
- `providerOptions` (optional): Provider-specific settings

## Return Value
- `ranking`: Array of items with `originalIndex`, `score` (0-1), and `document`
- `rerankedDocuments`: Documents sorted by relevance (descending)
- `response`: Metadata including `timestamp`, `modelId`, `headers`
- `providerMetadata`: Optional provider-specific data

## Examples
```ts
// String documents
const { rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day', 'rainy afternoon', 'snowy night'],
  query: 'talk about rain',
  topN: 2,
});
// Result: ['rainy afternoon', 'sunny day']

// Object documents
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: [
    { from: 'Paul', subject: 'Follow-up', text: 'discount 20%' },
    { from: 'John', subject: 'Missing Info', text: 'Oracle pricing: $5000/month' },
  ],
  query: 'Which pricing from Oracle?',
  topN: 1,
});

// With provider options
await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day', 'rainy afternoon'],
  query: 'talk about rain',
  providerOptions: { cohere: { maxTokensPerDoc: 1000 } },
});
```