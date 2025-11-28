## embed()

Generate an embedding for a single value using an embedding model.

### Purpose
Ideal for use cases where you need to embed a single value to retrieve similar items or use the embedding in downstream tasks.

### Basic Usage
```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

### Parameters
- **model** (EmbeddingModel, required): The embedding model to use. Example: `openai.embeddingModel('text-embedding-3-small')`
- **value** (VALUE, required): The value to embed. Type depends on the model.
- **maxRetries** (number, optional): Maximum number of retries. Set to 0 to disable retries. Default: 2.
- **abortSignal** (AbortSignal, optional): Cancel the call.
- **headers** (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers.
- **experimental_telemetry** (TelemetrySettings, optional): Telemetry configuration (experimental).
  - **isEnabled** (boolean, optional): Enable/disable telemetry. Disabled by default.
  - **recordInputs** (boolean, optional): Enable/disable input recording. Enabled by default.
  - **recordOutputs** (boolean, optional): Enable/disable output recording. Enabled by default.
  - **functionId** (string, optional): Identifier to group telemetry data by function.
  - **metadata** (Record<string, string | number | boolean | Array>, optional): Additional telemetry information.
  - **tracer** (Tracer, optional): Custom tracer for telemetry data.

### Returns
- **value** (VALUE): The value that was embedded.
- **embedding** (number[]): The embedding vector of the value.
- **usage** (EmbeddingModelUsage): Token usage for generating the embeddings.
  - **tokens** (number): Number of tokens used.
- **response** (Response, optional): Optional response data.
  - **headers** (Record<string, string>, optional): Response headers.
  - **body** (unknown, optional): Response body.
- **providerMetadata** (ProviderMetadata | undefined, optional): Provider-specific metadata. Outer key is provider name, inner values depend on provider.