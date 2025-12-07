**DEPRECATED**: AWSBedrockStream has been removed in AI SDK 4.0 and is part of the legacy AWS Bedrock integration, incompatible with AI SDK 3.1 functions.

The AWSBedrockStream helper transforms AWS Bedrock API outputs into a ReadableStream, using AIStream under the hood to handle Bedrock response parsing.

**Import**:
```javascript
import { AWSBedrockStream } from "ai"
```

**API Signature**:

Parameters:
- `response` (AWSBedrockResponse): The response object from AWS Bedrock
  - `body` (AsyncIterable<{ chunk?: { bytes?: Uint8Array } }>, optional): Async iterable of objects containing optional binary data chunks
- `callbacks` (AIStreamCallbacksAndOptions, optional): Callback functions for stream lifecycle
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

Returns: `ReadableStream`