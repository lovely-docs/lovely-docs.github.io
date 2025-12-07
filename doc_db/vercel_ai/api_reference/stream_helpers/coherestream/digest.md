**Deprecated**: CohereStream has been removed in AI SDK 4.0 and is part of the legacy Cohere integration, incompatible with AI SDK 3.1 functions.

**Purpose**: Transforms Cohere API output into a ReadableStream using AIStream under the hood with a Cohere-specific parser. Supported in Node.js, Edge Runtime, and browser environments.

**Import**:
```javascript
import { CohereStream } from "ai"
```

**API Signature**:
- `response` (Response): The response object from Cohere Provider SDK
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns**: ReadableStream