## createAgentUIStream

Runs an Agent and returns a streaming UI message stream as an async iterable, enabling incremental consumption of agent reasoning and UI messages in servers, edge functions, or background jobs.

### Import
```ts
import { createAgentUIStream } from "ai"
```

### Usage
```ts
import { ToolLoopAgent, createAgentUIStream } from 'ai';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool, calculator: calculatorTool },
});

export async function* streamAgent(messages: unknown[], abortSignal?: AbortSignal) {
  const stream = await createAgentUIStream({
    agent,
    messages,
    abortSignal,
  });

  for await (const chunk of stream) {
    yield chunk; // UI message chunk object
  }
}
```

### Parameters
- `agent` (Agent, required): The agent instance to run. Must define its tools and implement `.stream({ prompt })`.
- `messages` (unknown[], required): Array of input UI messages sent to the agent (e.g., from user/assistant).
- `abortSignal` (AbortSignal, optional): Optional abort signal to cancel the agent streaming, e.g., in response to client disconnection.
- `...options` (UIMessageStreamOptions, optional): Additional options for customizing UI message streaming, such as source inclusion or error formatting.

### Returns
A `Promise<AsyncIterableStream<UIMessageChunk>>`, where each yielded value is a UI message chunk representing incremental agent UI output. This stream can be piped to HTTP responses, processed for dashboards, or logged.

### Example
```ts
import { createAgentUIStream } from 'ai';

const controller = new AbortController();

const stream = await createAgentUIStream({
  agent,
  messages: [{ role: 'user', content: 'What is the weather in SF today?' }],
  abortSignal: controller.signal,
  sendStart: true,
});

for await (const chunk of stream) {
  console.log(chunk);
}

// Call controller.abort() to stop streaming early if needed.
```

### How It Works
1. **Message Validation:** The incoming array of messages is validated and normalized according to the agent's tools and requirements. Invalid messages will cause an error.
2. **Model Message Conversion:** The validated UI messages are converted into the model message format the agent expects.
3. **Agent Streaming:** The agent's `.stream({ prompt, abortSignal })` method is invoked to produce a low-level result stream. If an abortSignal is provided and triggered, streaming will be canceled promptly.
4. **UI Message Stream:** That result stream is exposed as a streaming async iterable of UI message chunks.

### Notes
- The agent must define its tools and a `.stream({ prompt })` method.
- This utility returns an async iterator for full streaming flexibility. For HTTP responses, use createAgentUIStreamResponse or pipeAgentUIStreamToResponse.
- You can provide UI message stream options for fine-grained control over the output.
- To cancel a streaming agent operation, supply an AbortSignal via the abortSignal option.