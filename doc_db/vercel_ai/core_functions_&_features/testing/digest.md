## Testing Language Models

Testing language models is challenging due to their non-deterministic nature and the cost/slowness of calling real providers. The AI SDK Core provides mock providers and test helpers to enable unit testing.

### Available Test Utilities

Import from `ai/test`:
- **MockLanguageModelV3**: Mock language model following the v3 specification
- **MockEmbeddingModelV3**: Mock embedding model following the v3 specification
- **mockId**: Provides incrementing integer IDs
- **mockValues**: Iterates over an array of values, returning the last value when exhausted
- **simulateReadableStream**: Simulates readable streams with configurable delays

These allow you to control AI SDK output and test code deterministically without calling real providers.

### Usage Examples

**generateText**: Use MockLanguageModelV3 with a doGenerate function returning finishReason, usage stats, and text content:
```ts
const result = await generateText({
  model: new MockLanguageModelV3({
    doGenerate: async () => ({
      finishReason: 'stop',
      usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      content: [{ type: 'text', text: 'Hello, world!' }],
      warnings: [],
    }),
  }),
  prompt: 'Hello, test!',
});
```

**streamText**: Use MockLanguageModelV3 with a doStream function returning a simulated stream with text-start, text-delta, text-end, and finish chunks:
```ts
const result = streamText({
  model: new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'text-start', id: 'text-1' },
          { type: 'text-delta', id: 'text-1', delta: 'Hello' },
          { type: 'text-delta', id: 'text-1', delta: ', ' },
          { type: 'text-delta', id: 'text-1', delta: 'world!' },
          { type: 'text-end', id: 'text-1' },
          { type: 'finish', finishReason: 'stop', usage: { inputTokens: 3, outputTokens: 10, totalTokens: 13 } },
        ],
      }),
    }),
  }),
  prompt: 'Hello, test!',
});
```

**generateObject**: Use MockLanguageModelV3 with doGenerate returning JSON text matching your Zod schema:
```ts
const result = await generateObject({
  model: new MockLanguageModelV3({
    doGenerate: async () => ({
      finishReason: 'stop',
      usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      content: [{ type: 'text', text: '{"content":"Hello, world!"}' }],
      warnings: [],
    }),
  }),
  schema: z.object({ content: z.string() }),
  prompt: 'Hello, test!',
});
```

**streamObject**: Use MockLanguageModelV3 with doStream returning streamed JSON chunks:
```ts
const result = streamObject({
  model: new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'text-start', id: 'text-1' },
          { type: 'text-delta', id: 'text-1', delta: '{ ' },
          { type: 'text-delta', id: 'text-1', delta: '"content": ' },
          { type: 'text-delta', id: 'text-1', delta: '"Hello, world!"' },
          { type: 'text-delta', id: 'text-1', delta: ' }' },
          { type: 'text-end', id: 'text-1' },
          { type: 'finish', finishReason: 'stop', usage: { inputTokens: 3, outputTokens: 10, totalTokens: 13 } },
        ],
      }),
    }),
  }),
  schema: z.object({ content: z.string() }),
  prompt: 'Hello, test!',
});
```

**Simulate UI Message Stream Responses**: Use simulateReadableStream with initialDelayInMs and chunkDelayInMs to simulate server-sent event streams for testing or demonstration:
```ts
export async function POST(req: Request) {
  return new Response(
    simulateReadableStream({
      initialDelayInMs: 1000,
      chunkDelayInMs: 300,
      chunks: [
        `data: {"type":"start","messageId":"msg-123"}\n\n`,
        `data: {"type":"text-start","id":"text-1"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"This"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":" is an"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":" example."}\n\n`,
        `data: {"type":"text-end","id":"text-1"}\n\n`,
        `data: {"type":"finish"}\n\n`,
        `data: [DONE]\n\n`,
      ],
    }).pipeThrough(new TextEncoderStream()),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'x-vercel-ai-ui-message-stream': 'v1',
      },
    },
  );
}
```