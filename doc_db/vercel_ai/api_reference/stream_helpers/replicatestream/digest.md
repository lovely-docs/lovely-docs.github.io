## ReplicateStream

**Status**: Removed in AI SDK 4.0. Legacy Replicate integration, incompatible with AI SDK 3.1 functions.

**Purpose**: Utility function that extracts streams from Replicate API output.

**Input**: A Prediction object returned by the Replicate JavaScript SDK.

**Output**: A Promise that resolves to a ReadableStream (makes a fetch call to Replicate's streaming API under the hood).

**Import**:
```javascript
import { ReplicateStream } from "ai"
```

**Parameters**:
- `pre` (Prediction): Object returned by Replicate JavaScript SDK
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message
- `options` (optional): `{ headers?: Record<string, string> }` for additional headers

**Returns**: ReadableStream wrapped in a Promise