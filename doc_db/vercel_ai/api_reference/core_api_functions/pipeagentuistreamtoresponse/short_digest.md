Streams Agent UI messages directly to Node.js ServerResponse for real-time chat/tool-use endpoints.

**Parameters**: response (ServerResponse), agent (Agent), messages (array), optional abortSignal and streaming options.

**Returns**: Promise<void>

**Example**:
```ts
await pipeAgentUIStreamToResponse({
  response: res,
  agent: openaiWebSearchAgent,
  messages,
  abortSignal: abortController.signal,
});
```

**Key points**: Node.js only (not Edge/serverless), supports cancellation via AbortSignal, writes directly to response for efficiency.