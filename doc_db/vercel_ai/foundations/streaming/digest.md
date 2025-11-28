## Why Streaming Matters

Large language models generate long outputs slowly, causing poor user experience with blocking UIs where users wait 5-40+ seconds for complete responses before anything displays. Streaming UIs mitigate this by displaying response parts as they become available, significantly improving perceived performance and user satisfaction in conversational applications.

## Blocking vs Streaming

**Blocking UI**: Waits for entire response generation before displaying anything. Results in long loading spinner waits.

**Streaming UI**: Transmits and displays response parts incrementally as they're generated. Users see content appearing immediately, reducing perceived latency.

## Implementation

The AI SDK simplifies streaming implementation. Stream text generation from OpenAI's gpt-4.1 (or other models like Anthropic Claude) in under 10 lines using the `streamText` function:

```ts
import { streamText } from 'ai';

const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a poem about embedding models.',
});

for await (const textPart of textStream) {
  console.log(textPart);
}
```

The `textStream` is an async iterable that yields text chunks as they're generated.

## When to Use Streaming

Streaming is beneficial for long-output LLM responses and conversational applications. However, if a smaller, faster model can achieve desired functionality without streaming, that simpler approach may be preferable for easier development. Regardless of model speed, the SDK makes streaming implementation straightforward.