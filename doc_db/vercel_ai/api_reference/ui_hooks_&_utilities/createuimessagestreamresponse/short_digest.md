## Purpose
Creates a Response object that streams UI messages to the client.

## Parameters
- `stream` (required): ReadableStream<UIMessageChunk>
- `status` (optional): number, defaults to 200
- `statusText` (optional): string
- `headers` (optional): Headers | Record<string, string>
- `consumeSseStream` (optional): callback for consuming SSE stream

## Returns
Response object streaming UI message chunks

## Example
```tsx
const response = createUIMessageStreamResponse({
  status: 200,
  headers: { 'Custom-Header': 'value' },
  stream: createUIMessageStream({
    execute({ writer }) {
      writer.write({ type: 'data', value: { message: 'Hello' } });
      writer.write({ type: 'text', value: 'Hello, world!' });
      writer.write({
        type: 'source-url',
        value: { type: 'source', id: 'source-1', url: 'https://example.com', title: 'Example Source' },
      });
      const result = streamText({ model: 'anthropic/claude-sonnet-4.5', prompt: 'Say hello' });
      writer.merge(result.toUIMessageStream());
    },
  }),
});
```