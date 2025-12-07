Transforms a stream of `UIMessageChunk`s into an `AsyncIterableStream` of `UIMessage`s for non-Chat use cases.

**Parameters:**
- `message` (UIMessage, optional): Starting point for resumed conversations
- `stream` (ReadableStream<UIMessageChunk>): Stream to read
- `onError` (optional): Error handler
- `terminateOnError` (boolean, optional): Stop on error (default: false)

**Returns:** `AsyncIterableStream<UIMessage>` where each part represents message state during completion.