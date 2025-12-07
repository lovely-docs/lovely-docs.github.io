## Deprecated Feature

AWSBedrockAnthropicStream has been removed in AI SDK 4.0 and is part of the legacy AWS Bedrock integration. It is not compatible with AI SDK 3.1 functions.

## Purpose

AWSBedrockAnthropicStream is a utility function that transforms outputs from the AWS Bedrock API into a ReadableStream. It uses AIStream under the hood and handles parsing Bedrock's response.

## Import

```javascript
import { AWSBedrockAnthropicStream } from "ai"
```

## API

**Parameters:**

1. `response` (AWSBedrockResponse) - The response object returned from AWS Bedrock
   - `body` (AsyncIterable<{ chunk?: { bytes?: Uint8Array } }>, optional) - An async iterable of objects containing optional binary data chunks

2. `callbacks` (AIStreamCallbacksAndOptions, optional) - Callback functions for stream processing:
   - `onStart()` - Called at the start of stream processing
   - `onToken(token: string)` - Called for each token in the stream
   - `onCompletion(completion: string)` - Called for every completion
   - `onFinal(completion: string)` - Called once when the stream closes with the final completion message

**Returns:** ReadableStream