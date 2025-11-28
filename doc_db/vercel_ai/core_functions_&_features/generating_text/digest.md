## Overview

The AI SDK Core provides two functions for text generation from LLMs:
- `generateText`: Generates complete text for non-interactive use cases (drafting, summarizing, agents with tools)
- `streamText`: Streams text for interactive use cases (chatbots, real-time applications)

## generateText

Generates text and returns a result object with the complete response:

```tsx
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

With system prompts and complex instructions:

```tsx
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You are a professional writer. You write simple, clear, and concise content.',
  prompt: `Summarize the following article in 3-5 sentences: ${article}`,
});
```

Result object properties:
- `text`: The generated text
- `content`: Content generated in the last step
- `reasoning`: Full reasoning from the model
- `reasoningText`: Reasoning text (some models only)
- `files`: Generated files
- `sources`: Reference sources used (some models only)
- `toolCalls`: Tool calls made
- `toolResults`: Results of tool calls
- `finishReason`: Why generation stopped
- `usage`: Token usage for final step
- `totalUsage`: Total usage across all steps
- `warnings`: Provider warnings
- `request`: Additional request info
- `response`: Full response with headers and body
- `providerMetadata`: Provider-specific metadata
- `steps`: Details for all intermediate steps
- `output`: Generated structured output

Access raw response headers and body via `result.response.headers` and `result.response.body`.

`onFinish` callback is triggered after generation completes with text, usage, finishReason, messages, steps, and totalUsage:

```tsx
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onFinish({ text, finishReason, usage, response, steps, totalUsage }) {
    // save chat history, record usage, etc.
    const messages = response.messages;
  },
});
```

## streamText

Streams text from LLMs for interactive use cases where immediate responses are needed:

```ts
import { streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

`result.textStream` is both a `ReadableStream` and `AsyncIterable`. Streaming starts immediately and suppresses errors to prevent crashes; use `onError` callback for error logging.

Helper functions for integration with AI SDK UI:
- `toUIMessageStreamResponse()`: Creates UI Message stream HTTP response
- `pipeUIMessageStreamToResponse()`: Writes UI Message stream to Node.js response
- `toTextStreamResponse()`: Creates simple text stream HTTP response
- `pipeTextStreamToResponse()`: Writes text delta to Node.js response

Uses backpressure - only generates tokens as requested. Must consume stream for it to finish.

Result promises (resolve when stream finishes):
- `text`, `content`, `reasoning`, `reasoningText`, `files`, `sources`, `toolCalls`, `toolResults`, `finishReason`, `usage`, `totalUsage`, `warnings`, `steps`, `request`, `response`, `providerMetadata`

`onError` callback for error handling:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onError({ error }) {
    console.error(error);
  },
});
```

`onChunk` callback triggered for each stream chunk (text, reasoning, source, tool-call, tool-input-start, tool-input-delta, tool-result, raw):

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onChunk({ chunk }) {
    if (chunk.type === 'text') {
      console.log(chunk.text);
    }
  },
});
```

`onFinish` callback when stream completes with text, usage, finishReason, messages, steps, totalUsage.

`fullStream` property provides all events for custom UI or stream handling:

```tsx
for await (const part of result.fullStream) {
  switch (part.type) {
    case 'start': // stream start
    case 'start-step': // step start
    case 'text-start': // text generation start
    case 'text-delta': // text chunk
    case 'text-end': // text generation end
    case 'reasoning-start': // reasoning start
    case 'reasoning-delta': // reasoning chunk
    case 'reasoning-end': // reasoning end
    case 'source': // source reference
    case 'file': // generated file
    case 'tool-call': // tool invocation
    case 'tool-input-start': // tool input start
    case 'tool-input-delta': // tool input chunk
    case 'tool-input-end': // tool input end
    case 'tool-result': // tool result
    case 'tool-error': // tool error
    case 'finish-step': // step completion
    case 'finish': // stream completion
    case 'error': // error event
    case 'raw': // raw value
  }
}
```

## Stream Transformation

Use `experimental_transform` option to transform streams (filtering, changing, smoothing). Transformations apply before callbacks and promise resolution.

`smoothStream` function smooths text streaming:

```tsx
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```

Custom transformations receive tools and return a TransformStream:

```ts
const upperCaseTransform = <TOOLS extends ToolSet>() =>
  (options: { tools: TOOLS; stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        controller.enqueue(
          chunk.type === 'text'
            ? { ...chunk, text: chunk.text.toUpperCase() }
            : chunk,
        );
      },
    });
```

Call `stopStream()` to stop generation (useful for guardrails). Must simulate `finish-step` and `finish` events to ensure well-formed stream and callback invocation:

```ts
const stopWordTransform = <TOOLS extends ToolSet>() =>
  ({ stopStream }: { stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        if (chunk.type !== 'text') {
          controller.enqueue(chunk);
          return;
        }
        if (chunk.text.includes('STOP')) {
          stopStream();
          controller.enqueue({ type: 'finish-step', finishReason: 'stop', ... });
          controller.enqueue({ type: 'finish', finishReason: 'stop', ... });
          return;
        }
        controller.enqueue(chunk);
      },
    });
```

Multiple transformations can be provided in array - applied in order.

## Sources

Some providers (Perplexity, Google Generative AI) include sources in responses. Sources are limited to web pages grounding the response.

Each URL source has: `id`, `url`, `title` (optional), `providerMetadata`.

With `generateText`:

```ts
const result = await generateText({
  model: 'google/gemini-2.5-flash',
  tools: { google_search: google.tools.googleSearch({}) },
  prompt: 'List the top 5 San Francisco news from the past week.',
});

for (const source of result.sources) {
  if (source.sourceType === 'url') {
    console.log('ID:', source.id);
    console.log('Title:', source.title);
    console.log('URL:', source.url);
    console.log('Provider metadata:', source.providerMetadata);
  }
}
```

With `streamText`, access via `fullStream` property:

```tsx
for await (const part of result.fullStream) {
  if (part.type === 'source' && part.sourceType === 'url') {
    console.log('ID:', part.id);
    console.log('Title:', part.title);
    console.log('URL:', part.url);
    console.log('Provider metadata:', part.providerMetadata);
  }
}
```

Sources also available in `result.sources` promise.