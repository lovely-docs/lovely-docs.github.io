AWSBedrockStream is a deprecated utility function that transforms AWS Bedrock API outputs into a ReadableStream. It has been removed in AI SDK 4.0 and is part of the legacy AWS Bedrock integration that is incompatible with AI SDK 3.1 functions.

**Import:**
```
import { AWSBedrockStream } from "ai"
```

**Parameters:**
- `response` (AWSBedrockResponse): The response object from AWS Bedrock containing an optional async iterable `body` property with binary data chunks (`AsyncIterable<{ chunk?: { bytes?: Uint8Array } }>`)
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with optional callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns:** ReadableStream

The function uses AIStream under the hood to handle parsing of Bedrock's response format.