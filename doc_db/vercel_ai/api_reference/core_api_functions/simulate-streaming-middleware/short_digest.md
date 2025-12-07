Middleware that simulates streaming for non-streaming models by converting complete responses into chunk streams.

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