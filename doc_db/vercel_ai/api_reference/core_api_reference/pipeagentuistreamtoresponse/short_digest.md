## pipeAgentUIStreamToResponse

Streams Agent output as UI messages directly to a Node.js `ServerResponse` for real-time chat/tool-use endpoints in Express, Hono, or custom servers.

### Usage
```ts
await pipeAgentUIStreamToResponse({
  response: res,
  agent: MyCustomAgent,
  messages,
  abortSignal: abortController.signal, // optional
});
```

### Parameters
- **response** (ServerResponse, required): Node.js response object
- **agent** (Agent, required): Agent instance with `.stream()` method
- **messages** (unknown[], required): Input UI messages
- **abortSignal** (AbortSignal, optional): Cancel streaming on disconnect/timeout
- **...options** (optional): Response headers, status, streaming config

### Returns
`Promise<void>` - resolves when streaming completes.

### Key Points
- Writes streaming bytes directly to Node.js response (memory/latency efficient)
- Supports abort signals for cancellation on client disconnect
- Node.js only (not for Edge/serverless with web Response objects)
- Works with Express, Hono, and similar frameworks