## generateText

Generates complete text for non-interactive use cases:

```tsx
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

Result includes: `text`, `content`, `reasoning`, `files`, `sources`, `toolCalls`, `toolResults`, `finishReason`, `usage`, `totalUsage`, `warnings`, `steps`, `response` (with headers/body), `providerMetadata`, `output`.

`onFinish` callback receives text, usage, finishReason, messages, steps, totalUsage.

## streamText

Streams text for interactive use cases:

```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

Helper functions: `toUIMessageStreamResponse()`, `pipeUIMessageStreamToResponse()`, `toTextStreamResponse()`, `pipeTextStreamToResponse()`.

Callbacks: `onError({ error })`, `onChunk({ chunk })` with types (text, reasoning, source, tool-call, tool-input-start, tool-input-delta, tool-result, raw), `onFinish()`.

`fullStream` property provides all events: start, start-step, text-start, text-delta, text-end, reasoning-start, reasoning-delta, reasoning-end, source, file, tool-call, tool-input-start, tool-input-delta, tool-input-end, tool-result, tool-error, finish-step, finish, error, raw.

## Stream Transformation

Use `experimental_transform` to transform streams:

```tsx
const result = streamText({
  model, prompt,
  experimental_transform: smoothStream(),
});
```

Custom transformations with `stopStream()` to halt generation and simulate finish events.

Multiple transformations applied in order.

## Sources

Providers like Perplexity and Google Generative AI include sources (web pages). Each has: `id`, `url`, `title`, `providerMetadata`.

Access via `result.sources` with `generateText` or `fullStream` with `streamText`.