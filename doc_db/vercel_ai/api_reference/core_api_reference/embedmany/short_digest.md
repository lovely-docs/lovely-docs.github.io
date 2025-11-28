## embedMany()

Embed multiple values using an embedding model with automatic chunking for large requests.

```ts
const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});
```

**Parameters**: model, values, maxRetries (default 2), abortSignal, headers, experimental_telemetry (isEnabled, recordInputs, recordOutputs, functionId, metadata, tracer)

**Returns**: values, embeddings (number[][]), usage (tokens, body), providerMetadata