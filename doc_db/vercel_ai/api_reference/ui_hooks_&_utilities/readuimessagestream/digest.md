## readUIMessageStream

Transforms a stream of `UIMessageChunk`s into an `AsyncIterableStream` of `UIMessage`s.

**Import:**
```tsx
import { readUIMessageStream } from 'ai';
```

**Parameters:**
- `message` (UIMessage, optional): The last assistant message to use as a starting point when the conversation is resumed. Otherwise undefined.
- `stream` (ReadableStream<UIMessageChunk>): The stream of UIMessageChunk objects to read.
- `onError` ((error: unknown) => void, optional): A function that is called when an error occurs during stream processing.
- `terminateOnError` (boolean, optional): Whether to terminate the stream if an error occurs. Defaults to false.

**Returns:**
An `AsyncIterableStream` of `UIMessage`s. Each stream part represents a different state of the same message as it is being completed.

**Use cases:** Terminal UIs, custom stream consumption on the client, React Server Components (RSC), and scenarios outside of Chat.