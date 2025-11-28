## Reranking Documents

Reranking reorders documents by relevance to a query using models trained to understand query-document relationships.

```tsx
import { rerank } from 'ai';
import { cohere } from '@ai-sdk/cohere';

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  topN: 2,
});
// [{ originalIndex: 1, score: 0.9, document: 'rainy afternoon in the city' }, ...]
```

Supports structured documents (JSON objects) and returns `ranking`, `rerankedDocuments`, `originalDocuments`, and `response`.

## Configuration

- `topN`: limit results to N most relevant documents
- `providerOptions`: provider-specific parameters (e.g., `maxTokensPerDoc`)
- `maxRetries`: set max retries (default 2)
- `abortSignal`: abort or timeout with `AbortSignal.timeout(ms)`
- `headers`: add custom headers

## Available Models

Cohere: `rerank-v3.5`, `rerank-english-v3.0`, `rerank-multilingual-v3.0`
Amazon Bedrock: `amazon.rerank-v1:0`, `cohere.rerank-v3-5:0`
Together.ai: `Salesforce/Llama-Rank-v1`, `mixedbread-ai/Mxbai-Rerank-Large-V2`