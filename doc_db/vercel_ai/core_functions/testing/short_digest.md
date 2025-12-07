## Testing with Mock Providers

Use `MockLanguageModelV3` and `MockEmbeddingModelV3` from `ai/test` to unit test code without calling real providers. Helper utilities include `mockId`, `mockValues`, and `simulateReadableStream`.

**Example with generateText:**
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

**Example with streamText:**
```ts
const result = streamText({
  model: new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'text-start', id: 'text-1' },
          { type: 'text-delta', id: 'text-1', delta: 'Hello, world!' },
          { type: 'text-end', id: 'text-1' },
          { type: 'finish', finishReason: 'stop', usage: { inputTokens: 3, outputTokens: 10, totalTokens: 13 } },
        ],
      }),
    }),
  }),
  prompt: 'Hello, test!',
});
```

Works with `generateObject`, `streamObject`, and UI message stream responses. `simulateReadableStream` supports `initialDelayInMs` and `chunkDelayInMs` for realistic timing.