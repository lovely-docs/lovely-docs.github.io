**DEPRECATED**: AnthropicStream has been removed in AI SDK 4.0 and is part of the legacy Anthropic integration. Use the AI SDK Anthropic Provider instead.

AnthropicStream is a utility function that transforms Anthropic SDK responses into a ReadableStream. It wraps AIStream with a parser specific to Anthropic's response data structure.

**Import**:
```javascript
import { AnthropicStream } from "ai"
```

**Parameters**:
- `response` (Response): The response object from an Anthropic Provider SDK call
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns**: ReadableStream