## createUIMessageStream

Creates a readable stream for UI messages with support for message merging, error handling, and completion callbacks.

### Core Functionality

The function accepts an execute function that receives a writer instance to emit UI message chunks. It returns a `ReadableStream<UIMessageChunk>` that handles error propagation, stream merging, and cleanup automatically.

### Writer API

The writer instance provides:
- `write(part: UIMessageChunk)` - Emits a UI message chunk to the stream
- `merge(stream: ReadableStream<UIMessageChunk>)` - Merges another UI message stream into this one
- `onError(error: unknown)` - Error handler for merged streams

### Message Chunks

Messages are written as a sequence of chunks with consistent IDs:
- `text-start` - Begin a text message with an id
- `text-delta` - Append text content with the same id
- `text-end` - Complete the text message with the same id

### Configuration Parameters

- `execute` - Required function receiving the writer to produce message chunks
- `onError` - Optional error handler returning an error message string (defaults to error.message)
- `originalMessages` - Optional array of existing UIMessage objects; when provided, enables persistence mode and generates an ID for the response message
- `onFinish` - Optional callback invoked when streaming completes, receiving:
  - `messages` - Updated UIMessage array
  - `isContinuation` - Boolean indicating if response extends the last original message or creates a new one
  - `responseMessage` - The UIMessage sent to client
- `generateId` - Optional custom ID generator function (uses default if not provided)

### Example

```tsx
const stream = createUIMessageStream({
  async execute({ writer }) {
    writer.write({ type: 'text-start', id: 'msg-1' });
    writer.write({ type: 'text-delta', id: 'msg-1', delta: 'Hello' });
    writer.write({ type: 'text-end', id: 'msg-1' });
    
    const result = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      prompt: 'Write a haiku about AI',
    });
    writer.merge(result.toUIMessageStream());
  },
  onError: error => `Custom error: ${error.message}`,
  originalMessages: existingMessages,
  onFinish: ({ messages, isContinuation, responseMessage }) => {
    console.log('Stream finished:', messages);
  },
});
```