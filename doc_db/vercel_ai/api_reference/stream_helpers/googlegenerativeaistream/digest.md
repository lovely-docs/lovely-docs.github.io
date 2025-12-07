**DEPRECATED**: GoogleGenerativeAIStream has been removed in AI SDK 4.0 and is part of the legacy Google Generative AI integration. Use the AI SDK Google Generative AI Provider instead.

The GoogleGenerativeAIStream function transforms output from Google's Generative AI SDK into a ReadableStream. It wraps AIStream under the hood with a parser for Google's response data structure. Works in Node.js, Edge Runtime, and browser environments.

**Import**:
```javascript
import { GoogleGenerativeAIStream } from "ai"
```

**Parameters**:
- `response`: `{ stream: AsyncIterable<GenerateContentResponse> }` - The response object from Google Generative AI API
- `callbacks` (optional): `AIStreamCallbacksAndOptions` - Callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns**: `ReadableStream`