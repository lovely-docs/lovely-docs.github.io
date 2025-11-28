## Reranking Documents

Reranking improves search relevance by reordering documents based on their relevance to a query. Unlike embedding-based similarity search, reranking models are specifically trained to understand query-document relationships and produce more accurate relevance scores.

Use the `rerank` function with reranking models like `cohere.reranking('rerank-v3.5')` or `bedrock.reranking('cohere.rerank-v3-5:0')`:

```tsx
import { rerank } from 'ai';
import { cohere } from '@ai-sdk/cohere';

const documents = [
  'sunny day at the beach',
  'rainy afternoon in the city',
  'snowy night in the mountains',
];

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'talk about rain',
  topN: 2,
});

console.log(ranking);
// [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon in the city' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day at the beach' }
// ]
```

## Object Documents

Reranking supports structured documents (JSON objects) for searching databases, emails, or other structured content:

```tsx
const documents = [
  {
    from: 'Paul Doe',
    subject: 'Follow-up',
    text: 'We are happy to give you a discount of 20% on your next order.',
  },
  {
    from: 'John McGill',
    subject: 'Missing Info',
    text: 'Sorry, but here is the pricing information from Oracle: $5000/month',
  },
];

const { ranking, rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  topN: 1,
});

console.log(rerankedDocuments[0]);
// { from: 'John McGill', subject: 'Missing Info', text: '...' }
```

## Result Object

The `rerank` function returns:
- `ranking`: sorted array of `{ originalIndex, score, document }` objects
- `rerankedDocuments`: documents sorted by relevance (convenience property)
- `originalDocuments`: original documents array
- `response`: raw provider response with `{ id, timestamp, modelId, headers, body }`

Each ranking item contains:
- `originalIndex`: position in original documents array
- `score`: relevance score (typically 0-1, higher is more relevant)
- `document`: the original document

## Configuration Options

**topN**: Limit results to the N most relevant documents:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['doc1', 'doc2', 'doc3', 'doc4', 'doc5'],
  query: 'relevant information',
  topN: 3,
});
```

**providerOptions**: Provider-specific parameters:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  providerOptions: {
    cohere: {
      maxTokensPerDoc: 1000,
    },
  },
});
```

**maxRetries**: Set maximum retries (defaults to 2, meaning 3 total attempts):
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  maxRetries: 0,
});
```

**abortSignal**: Abort or timeout the reranking process:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  abortSignal: AbortSignal.timeout(5000),
});
```

**headers**: Add custom headers to the request:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

## Available Providers & Models

| Provider | Model |
| --- | --- |
| Cohere | `rerank-v3.5` |
| Cohere | `rerank-english-v3.0` |
| Cohere | `rerank-multilingual-v3.0` |
| Amazon Bedrock | `amazon.rerank-v1:0` |
| Amazon Bedrock | `cohere.rerank-v3-5:0` |
| Together.ai | `Salesforce/Llama-Rank-v1` |
| Together.ai | `mixedbread-ai/Mxbai-Rerank-Large-V2` |