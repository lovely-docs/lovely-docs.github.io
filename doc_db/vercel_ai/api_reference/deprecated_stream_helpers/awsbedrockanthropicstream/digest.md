**DEPRECATED**: AWSBedrockAnthropicStream has been removed in AI SDK 4.0 and is part of the legacy AWS Bedrock integration, incompatible with AI SDK 3.1 functions.

**Purpose**: Utility function that transforms AWS Bedrock API outputs into a ReadableStream, using AIStream under the hood to handle parsing Bedrock's response format.

**Import**:
```
import { AWSBedrockAnthropicStream } from "ai"
```

**Parameters**:
- `response` (AWSBedrockResponse, required): The response object from AWS Bedrock containing `body` - an optional async iterable of objects with optional binary data chunks (`AsyncIterable<{ chunk?: { bytes?: Uint8Array } }>`)
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with optional callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns**: ReadableStream