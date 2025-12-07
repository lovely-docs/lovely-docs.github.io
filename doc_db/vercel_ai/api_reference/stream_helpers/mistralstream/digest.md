**Deprecated**: MistralStream has been removed in AI SDK 4.0 and is part of the legacy Mistral integration. Use the AI SDK Mistral Provider instead.

**Purpose**: Transforms output from Mistral's language models into a ReadableStream. Works with the official Mistral API in Node.js, Edge Runtime, and browser environments.

**Import**:
```javascript
import { MistralStream } from "ai"
```

**API Signature**:
- `response` (Response): The response object from a Provider SDK call
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message
- Returns: `ReadableStream`