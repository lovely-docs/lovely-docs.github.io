**AnthropicStream** is a legacy utility function that transforms Anthropic SDK responses into a ReadableStream. It has been removed in AI SDK 4.0 and is not compatible with AI SDK 3.1 functions.

**Import:**
```
import { AnthropicStream } from "ai"
```

**Parameters:**
- `response` (Response): The response object from an Anthropic Provider SDK call
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object containing callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns:** ReadableStream

**Note:** This is part of the legacy Anthropic integration. The recommended approach is to use the AI SDK Anthropic Provider instead.