Generate embedding for a single value using an embedding model.

**Example:**
```ts
import { embed } from 'ai';
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

**Parameters:** `model` (required), `value` (required), `maxRetries`, `abortSignal`, `headers`, `experimental_telemetry`

**Returns:** `value`, `embedding` (number[]), `usage` (with `tokens`), `response`, `providerMetadata`