## embed()

Generate an embedding for a single value using an embedding model.

```ts
import { embed } from 'ai';

const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

### Parameters
- **model** (EmbeddingModel): The embedding model to use
- **value** (VALUE): The value to embed
- **maxRetries** (number, optional): Max retries. Default: 2
- **abortSignal** (AbortSignal, optional): Cancel the call
- **headers** (Record<string, string>, optional): Additional HTTP headers
- **experimental_telemetry** (TelemetrySettings, optional): Telemetry config with isEnabled, recordInputs, recordOutputs, functionId, metadata, tracer

### Returns
- **embedding** (number[]): The embedding vector
- **value** (VALUE): The embedded value
- **usage** (EmbeddingModelUsage): Token usage with tokens count
- **response** (Response, optional): Response headers and body
- **providerMetadata** (ProviderMetadata, optional): Provider-specific metadata