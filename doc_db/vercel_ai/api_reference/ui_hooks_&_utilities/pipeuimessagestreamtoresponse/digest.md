## Purpose
Pipes streaming UI message data to a Node.js ServerResponse object, enabling server-side streaming of AI responses.

## Parameters
- `response` (ServerResponse): The Node.js ServerResponse object to pipe data to
- `stream` (ReadableStream<UIMessageChunk>): The UI message stream to pipe
- `status` (number): HTTP status code for the response
- `statusText` (string): HTTP status text for the response
- `headers` (Headers | Record<string, string>): Additional response headers
- `consumeSseStream` (optional function): Callback to independently consume the SSE stream; receives a teed copy of the stream

## Usage
```tsx
pipeUIMessageStreamToResponse({
  response: serverResponse,
  status: 200,
  statusText: 'OK',
  headers: {
    'Custom-Header': 'value',
  },
  stream: myUIMessageStream,
  consumeSseStream: ({ stream }) => {
    console.log('Consuming SSE stream:', stream);
  },
});
```

The function handles the complete piping operation including status, headers, and optional independent stream consumption via the teed stream pattern.