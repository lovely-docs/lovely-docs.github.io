Creates a Response object streaming UI messages with custom data, text, sources, and LLM output.

**Parameters**: stream (required), status/statusText/headers (optional), consumeSseStream callback (optional)

**Example**:
```tsx
createUIMessageStreamResponse({
  status: 200,
  headers: { 'Custom-Header': 'value' },
  stream: createUIMessageStream({
    execute({ writer }) {
      writer.write({ type: 'data', value: { message: 'Hello' } });
      writer.write({ type: 'text', value: 'Hello, world!' });
      writer.write({ type: 'source-url', value: { type: 'source', id: 'source-1', url: 'https://example.com', title: 'Example Source' } });
      writer.merge(streamText({ model: 'anthropic/claude-sonnet-4.5', prompt: 'Say hello' }).toUIMessageStream());
    },
  }),
})
```