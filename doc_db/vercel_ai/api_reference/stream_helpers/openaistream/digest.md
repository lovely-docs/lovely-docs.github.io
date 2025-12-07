**DEPRECATED**: OpenAIStream has been removed in AI SDK 4.0 and is part of the legacy OpenAI integration. It is not compatible with AI SDK 3.1 functions. Use the AI SDK OpenAI Provider instead.

**Purpose**: Transforms responses from OpenAI's language models into a ReadableStream.

**Note on OpenAI SDK compatibility**: Prior to v4, the official OpenAI API SDK does not support the Edge Runtime and only works in serverless environments. The openai-edge package is based on fetch instead of axios (works in Edge Runtime), so openai v4+ or openai-edge is recommended.

**Import**:
```javascript
import { OpenAIStream } from "ai"
```

**API Signature**:

`OpenAIStream(response, callbacks?)`

**Parameters**:
- `response` (Response): The response object returned by a call made by the Provider SDK.
- `callbacks` (AIStreamCallbacksAndOptions, optional): An object containing callback functions:
  - `onStart()`: Called at the start of stream processing
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when the stream closes with the final completion message