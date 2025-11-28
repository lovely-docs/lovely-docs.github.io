AIStream creates a readable stream for AI responses from fetch responses. It serves as the basis for OpenAIStream and AnthropicStream, enabling controlled handling of AI response streams compatible with useChat and useCompletion.

**Deprecation**: AIStream has been removed in AI SDK 4.0. Use `streamText.toDataStreamResponse()` instead.

**Error Handling**: AIStream throws an error if the response doesn't have a 2xx status code, ensuring streams are only created for successful responses.

**API Parameters**:
- `response` (Response): The fetch response object used as the source of the readable stream
- `customParser` ((data: string) => string | void): Function that parses stream events by extracting message content from stringified chunks from the LLM
- `callbacks` (AIStreamCallbacksAndOptions): Optional callback functions:
  - `onStart` (() => Promise<void>): Called at the start of stream processing
  - `onToken` ((token: string) => Promise<void>): Called for each token in the stream
  - `onCompletion` ((completion: string) => Promise<void>): Called for every completion with the completion string
  - `onFinal` ((completion: string) => Promise<void>): Called once when the stream closes with the final completion message

**Import**: `import { AIStream } from "ai"`