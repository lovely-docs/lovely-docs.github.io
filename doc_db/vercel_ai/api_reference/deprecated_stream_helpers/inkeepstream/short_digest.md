InkeepStream transforms Inkeep API responses into a ReadableStream using AIStream with Inkeep-specific parsing. Supports Node.js, Edge Runtime, and browsers. **Deprecated in AI SDK 4.0**.

Parameters: `response` (Response), optional `callbacks` with `onStart()`, `onToken(token)`, `onCompletion(completion)`, `onFinal(completion)`.

Returns: ReadableStream