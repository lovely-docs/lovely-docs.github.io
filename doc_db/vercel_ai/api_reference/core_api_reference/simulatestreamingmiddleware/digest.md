## simulateStreamingMiddleware

A middleware function that converts non-streaming language model responses into simulated streaming behavior, maintaining a consistent streaming interface regardless of the underlying model's capabilities.

### Purpose
Allows you to use a uniform streaming interface with models that only provide complete responses, eliminating the need to handle streaming and non-streaming models differently.

### API
- **Import**: `import { simulateStreamingMiddleware } from 'ai'`
- **Parameters**: None
- **Returns**: A middleware object that transforms complete responses into simulated streams

### How It Works
1. Awaits the complete response from the language model
2. Creates a `ReadableStream` that emits chunks in the correct sequence
3. Breaks down the response into appropriate chunk types
4. Preserves all response properties including text content, reasoning (string or array of objects), tool calls, metadata, usage information, and warnings

### Usage
```ts
import { streamText, wrapLanguageModel, simulateStreamingMiddleware } from 'ai';

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

After wrapping a non-streaming model with this middleware, you can iterate over `result.fullStream` using the standard streaming interface.