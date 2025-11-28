## Streaming vs Blocking

Blocking UIs wait for complete LLM responses (5-40+ seconds), while streaming UIs display response parts immediately as they're generated, significantly improving user experience in conversational applications.

## Quick Implementation

Use the `streamText` function to stream text generation:

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

Streaming is most valuable for long outputs; consider non-streaming approaches if a faster model suffices.