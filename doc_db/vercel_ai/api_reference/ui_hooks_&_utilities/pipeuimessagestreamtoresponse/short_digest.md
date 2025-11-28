Pipes UI message streams to Node.js ServerResponse with status, headers, and optional independent SSE stream consumption.

```tsx
pipeUIMessageStreamToResponse({
  response: serverResponse,
  status: 200,
  statusText: 'OK',
  headers: { 'Custom-Header': 'value' },
  stream: myUIMessageStream,
  consumeSseStream: ({ stream }) => console.log('SSE:', stream),
});
```