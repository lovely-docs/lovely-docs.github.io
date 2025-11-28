InkeepStream is a utility function that transforms responses from Inkeep's API into a ReadableStream. It wraps AIStream under the hood with a parser specific to Inkeep's response data structure. The function is supported in Node.js, Edge Runtime, and browser environments.

**Status**: InkeepStream has been removed in AI SDK 4.0 and is part of the legacy Inkeep integration, incompatible with AI SDK 3.1 functions.

**Import**: `import { InkeepStream } from "ai"`

**Parameters**:
- `response` (Response): The response object returned by a call made by the Provider SDK
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object containing callback functions:
  - `onStart()`: Called at the start of stream processing
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when the stream closes with the final completion message

**Returns**: A ReadableStream