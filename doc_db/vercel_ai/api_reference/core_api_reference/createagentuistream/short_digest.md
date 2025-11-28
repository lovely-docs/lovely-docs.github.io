## createAgentUIStream

Runs an Agent and returns a streaming UI message stream as an async iterable for incremental consumption.

### Usage
```ts
const stream = await createAgentUIStream({
  agent,
  messages: [{ role: 'user', content: 'What is the weather in SF today?' }],
  abortSignal: controller.signal,
});

for await (const chunk of stream) {
  console.log(chunk);
}
```

### Parameters
- `agent` (Agent, required): Agent instance with tools and `.stream({ prompt })` method
- `messages` (unknown[], required): Input UI messages for the agent
- `abortSignal` (AbortSignal, optional): Signal to cancel streaming
- `...options` (UIMessageStreamOptions, optional): Customization options

### Returns
`Promise<AsyncIterableStream<UIMessageChunk>>` - async iterable of UI message chunks

### Process
1. Validates and normalizes messages
2. Converts UI messages to model message format
3. Invokes agent's `.stream()` method with optional abort signal
4. Exposes result as streaming async iterable