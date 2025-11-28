Transforms a stream of `UIMessageChunk`s into an `AsyncIterableStream` of `UIMessage`s.

**Parameters:** `message` (UIMessage, optional), `stream` (ReadableStream<UIMessageChunk>), `onError` (optional callback), `terminateOnError` (boolean, optional, defaults to false).

**Returns:** `AsyncIterableStream` of `UIMessage`s where each part represents a different state of the message being completed.

**Use cases:** Terminal UIs, custom client-side stream consumption, React Server Components.