CohereStream is a deprecated utility function that transforms Cohere API responses into ReadableStream objects. It wraps AIStream with a Cohere-specific parser for response data structures.

**Status**: Removed in AI SDK 4.0. Part of legacy Cohere integration, incompatible with AI SDK 3.1 functions.

**Import**: `import { CohereStream } from "ai"`

**Parameters**:
- `response` (Response): The response object from Cohere Provider SDK
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns**: ReadableStream

**Environments**: Supported in Node.js, Edge Runtime, and browser environments.