## createUIMessageStream

Creates a readable stream for UI messages with message merging, error handling, and finish callbacks.

**Writer API:**
- `write(chunk)` - Emit UI message chunk
- `merge(stream)` - Merge another UI message stream
- `onError(error)` - Handle errors in merged streams

**Message chunks** use consistent IDs across `text-start`, `text-delta`, `text-end` to group related content.

**Parameters:**
- `execute` - Function receiving writer to produce chunks
- `onError` - Error handler returning error message string
- `originalMessages` - Existing messages for persistence mode
- `onFinish` - Callback with `{ messages, isContinuation, responseMessage }`
- `generateId` - Custom ID generator

**Example:**
```tsx
const stream = createUIMessageStream({
  async execute({ writer }) {
    writer.write({ type: 'text-start', id: 'msg-1' });
    writer.write({ type: 'text-delta', id: 'msg-1', delta: 'Hello' });
    writer.write({ type: 'text-end', id: 'msg-1' });
    writer.merge(streamText({...}).toUIMessageStream());
  },
  onFinish: ({ messages }) => console.log(messages),
});
```