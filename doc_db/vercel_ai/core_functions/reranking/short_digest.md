## Reranking

Reorder documents by relevance to a query using trained reranking models.

```tsx
import { rerank } from 'ai';
import { cohere } from '@ai-sdk/cohere';

const { ranking, rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  topN: 2,
  maxRetries: 0,
  abortSignal: AbortSignal.timeout(5000),
  headers: { 'X-Custom-Header': 'value' },
  providerOptions: { cohere: { maxTokensPerDoc: 1000 } },
});

// ranking: [{ originalIndex, score, document }, ...]
// rerankedDocuments: sorted by relevance
```

Supports string and structured (JSON) documents. Returns ranking with originalIndex, relevance score (0-1), and document. Providers: Cohere (rerank-v3.5, rerank-english-v3.0, rerank-multilingual-v3.0), Amazon Bedrock (amazon.rerank-v1:0, cohere.rerank-v3-5:0), Together.ai (Salesforce/Llama-Rank-v1, mixedbread-ai/Mxbai-Rerank-Large-V2).