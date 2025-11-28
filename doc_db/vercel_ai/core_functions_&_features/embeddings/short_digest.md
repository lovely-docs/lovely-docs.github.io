## Core Functions

- `embed()`: Embed single values
- `embedMany()`: Batch embed multiple values with configurable `maxParallelCalls`
- `cosineSimilarity()`: Calculate similarity between embeddings

## Configuration

```ts
// Provider options
await embed({
  model: 'openai/text-embedding-3-small',
  value: 'text',
  providerOptions: { openai: { dimensions: 512 } },
});

// Parallel requests, retries, timeouts, custom headers
await embedMany({
  maxParallelCalls: 2,
  maxRetries: 0,
  abortSignal: AbortSignal.timeout(1000),
  headers: { 'X-Custom-Header': 'value' },
  model: 'openai/text-embedding-3-small',
  values: ['text1', 'text2'],
});
```

## Token Usage & Response

Both functions return `usage` (token count) and `response` (raw provider response).

## Middleware

Use `wrapEmbeddingModel()` with `defaultEmbeddingSettingsMiddleware()` to set defaults.

## Supported Models

OpenAI (text-embedding-3-large/small, ada-002), Google (gemini-embedding-001, text-embedding-004), Mistral (mistral-embed), Cohere (embed-english/multilingual v2/v3), Amazon Bedrock (titan-embed-text-v1/v2)