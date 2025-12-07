## Streaming vs Blocking

Blocking UIs wait for full LLM response (5-40s latency) before displaying. Streaming UIs display response parts incrementally, improving UX.

## Implementation

Use `streamText` to stream text generation:

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

Streaming isn't always necessary—smaller, faster models may not benefit.