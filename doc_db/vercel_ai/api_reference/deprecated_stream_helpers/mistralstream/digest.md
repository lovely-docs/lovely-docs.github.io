MistralStream is a deprecated helper function that transforms output from Mistral's language models into a ReadableStream. It has been removed in AI SDK 4.0 and is part of the legacy Mistral integration that is incompatible with AI SDK 3.1 functions. The recommended approach is to use the AI SDK Mistral Provider instead.

The function works with the official Mistral API and is supported in Node.js, Edge Runtime, and browser environments.

**Import:**
```
import { MistralStream } from "ai"
```

**Parameters:**
- `response` (Response): The response object returned by a call made by the Provider SDK
- `callbacks` (AIStreamCallbacksAndOptions, optional): An object containing callback functions:
  - `onStart()`: Called at the start of stream processing
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when the stream closes with the final completion message

**Returns:** A ReadableStream