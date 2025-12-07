## AIStream

**Status**: Removed in AI SDK 4.0. Use `streamText.toDataStreamResponse()` instead.

Creates a readable stream for AI responses from fetch responses. Serves as the basis for OpenAIStream and AnthropicStream, enabling controlled handling of AI response streams compatible with useChat and useCompletion.

**Behavior**: Throws an error if response doesn't have a 2xx status code, ensuring streams are only created for successful responses.

## API

```javascript
import { AIStream } from "ai"

AIStream(response, customParser, callbacks)
```

**Parameters**:

- `response` (Response): The fetch response object used as the readable stream source.

- `customParser` ((data: string) => string | void): Function that parses stream events. Receives stringified chunks from the LLM and extracts message content. Returns nothing or a string.

- `callbacks` (AIStreamCallbacksAndOptions):
  - `onStart` (() => Promise<void>): Called at stream processing start.
  - `onToken` ((token: string) => Promise<void>): Called for each token in the stream.
  - `onCompletion` ((completion: string) => Promise<void>): Called for every completion with the completion string.
  - `onFinal` ((completion: string) => Promise<void>): Called once when stream closes with final completion message.