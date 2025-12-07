## InkeepStream

**Status**: Removed in AI SDK 4.0. Legacy integration, incompatible with AI SDK 3.1 functions.

**Purpose**: Transforms output from Inkeep's API into a ReadableStream using AIStream under the hood with a parser for Inkeep's response structure.

**Environments**: Node.js, Edge Runtime, browser.

**Import**:
```javascript
import { InkeepStream } from "ai"
```

**API Signature**:

`InkeepStream(response, callbacks?)` → `ReadableStream`

**Parameters**:
- `response` (Response): Response object from Inkeep Provider SDK call
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

All callbacks are async functions returning `Promise<void>`. If callbacks not provided, default behavior is used.