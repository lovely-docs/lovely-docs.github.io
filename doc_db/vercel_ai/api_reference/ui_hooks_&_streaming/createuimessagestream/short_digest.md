Creates a readable stream for UI messages with message merging, error handling, and finish callbacks.

```tsx
const stream = createUIMessageStream({
  async execute({ writer }) {
    writer.write({ type: 'text-start', id: 'msg-1' });
    writer.write({ type: 'text-delta', id: 'msg-1', delta: 'Hello' });
    writer.write({ type: 'text-end', id: 'msg-1' });
    
    const result = streamText({ model: 'anthropic/claude-sonnet-4.5', prompt: 'Haiku' });
    writer.merge(result.toUIMessageStream());
  },
  onError: error => `Error: ${error.message}`,
  originalMessages: existingMessages,
  onFinish: ({ messages, isContinuation, responseMessage }) => {
    console.log('Finished:', messages);
  },
});
```

**Parameters**: execute (writer with write/merge methods), onError handler, originalMessages (for persistence), onFinish callback, optional generateId.

**Returns**: `ReadableStream<UIMessageChunk>` with automatic error handling and stream merging.