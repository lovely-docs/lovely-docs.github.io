GoogleGenerativeAIStream is a deprecated utility function that transforms Google Generative AI SDK responses into ReadableStream objects. It uses AIStream internally with a parser specific to Google's response structure.

**Status**: Removed in AI SDK 4.0. Part of legacy Google Generative AI integration, incompatible with AI SDK 3.1 functions. Use the AI SDK Google Generative AI Provider instead.

**Import**: `import { GoogleGenerativeAIStream } from "ai"`

**Parameters**:
- `response`: Object with `stream: AsyncIterable<GenerateContentResponse>` - the response object from Google Generative AI API
- `callbacks` (optional): AIStreamCallbacksAndOptions object with optional callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns**: ReadableStream

**Environments**: Supported in Node.js, Edge Runtime, and browser environments.