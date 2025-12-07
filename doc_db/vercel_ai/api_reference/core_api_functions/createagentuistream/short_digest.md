Runs an Agent and returns an async iterable stream of UI message chunks for incremental consumption.

```ts
import { createAgentUIStream } from 'ai';

const stream = await createAgentUIStream({
  agent,
  messages: [{ role: 'user', content: 'What is the weather in SF today?' }],
  abortSignal: controller.signal,
});

for await (const chunk of stream) {
  console.log(chunk);
}
```

Parameters: `agent` (Agent), `messages` (unknown[]), `abortSignal` (AbortSignal, optional), `...options` (UIMessageStreamOptions, optional)

Returns: `Promise<AsyncIterableStream<UIMessageChunk>>`

Validates messages, converts to model format, invokes agent's `.stream()` method, and exposes result as async iterable.