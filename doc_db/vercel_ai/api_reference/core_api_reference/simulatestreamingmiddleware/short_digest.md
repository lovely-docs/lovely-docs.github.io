Middleware that simulates streaming for non-streaming language models by converting complete responses into chunk streams.

**Usage**:
```ts
const result = streamText({
  model: wrapLanguageModel({
    model: nonStreamingModel,
    middleware: simulateStreamingMiddleware(),
  }),
  prompt: 'Your prompt here',
});

for await (const chunk of result.fullStream) {
  // Process streaming chunks
}
```

Preserves all response properties: text, reasoning, tool calls, metadata, usage info, and warnings.