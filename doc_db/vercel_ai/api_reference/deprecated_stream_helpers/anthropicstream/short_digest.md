**Deprecated legacy function** that converts Anthropic SDK responses to ReadableStream. Removed in AI SDK 4.0.

**Import:** `import { AnthropicStream } from "ai"`

**Parameters:**
- `response`: Anthropic Provider SDK response
- `callbacks` (optional): `onStart()`, `onToken(token)`, `onCompletion(completion)`, `onFinal(completion)`

**Returns:** ReadableStream

Use the AI SDK Anthropic Provider instead.