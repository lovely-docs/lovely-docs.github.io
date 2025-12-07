## Embeddings

Convert text to vectors using `embed()` for single values or `embedMany()` for batch processing. Calculate similarity with `cosineSimilarity()`.

**Basic usage:**
```ts
import { embed, embedMany, cosineSimilarity } from 'ai';

const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: ['text1', 'text2', 'text3'],
});

cosineSimilarity(embeddings[0], embeddings[1]);
```

**Configuration:** `maxParallelCalls`, `maxRetries`, `abortSignal`, `headers`, `providerOptions` for provider-specific settings.

**Returns:** `embedding`/`embeddings`, `usage` (token count), `response` (raw provider response).

**Middleware:** Use `wrapEmbeddingModel()` with `defaultEmbeddingSettingsMiddleware()` to set defaults.

**Supported providers:** OpenAI, Google Generative AI, Mistral, Cohere, Amazon Bedrock with various dimension options.