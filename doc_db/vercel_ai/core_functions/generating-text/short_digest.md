## Text Generation

**`generateText`**: Generates complete text for non-interactive use cases.
```ts
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You are a professional writer.',
  prompt: 'Summarize this article...',
  onFinish({ text, finishReason, usage, response, steps, totalUsage }) {
    // save history, record usage
  },
});
```
Result properties: `text`, `content`, `reasoning`, `files`, `sources`, `toolCalls`, `toolResults`, `finishReason`, `usage`, `totalUsage`, `warnings`, `response`, `steps`, `output`. Access headers/body via `result.response.headers/body`.

**`streamText`**: Streams text for interactive use cases. Starts immediately, suppresses errors.
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday...',
  onError({ error }) { console.error(error); },
  onChunk({ chunk }) { if (chunk.type === 'text') console.log(chunk.text); },
  onFinish({ text, finishReason, usage, response, steps, totalUsage }) { },
});

for await (const textPart of result.textStream) console.log(textPart);
```
Helper functions: `toUIMessageStreamResponse()`, `pipeUIMessageStreamToResponse()`, `toTextStreamResponse()`, `pipeTextStreamToResponse()`. Uses backpressure—only generates tokens as requested.

**`fullStream`**: Access all stream events (types: `start`, `text-delta`, `tool-call`, `tool-result`, `finish`, `error`, etc.).

**Stream Transformation**: Use `experimental_transform` to filter/smooth streams. Built-in `smoothStream()` available. Custom transformations return `TransformStream`. Can stop stream with `stopStream()` (must simulate `finish-step` and `finish` events). Multiple transformations applied in order.

**Sources**: Some providers include web page sources. Access via `result.sources` (generateText) or `fullStream` with `part.type === 'source'` (streamText). Source properties: `id`, `url`, `title`, `providerMetadata`.