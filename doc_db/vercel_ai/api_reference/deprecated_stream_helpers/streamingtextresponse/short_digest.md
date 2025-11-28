**DEPRECATED in AI SDK 4.0** - use `streamText.toDataStreamResponse()` instead.

Utility wrapper around Response class for streaming text. Automatically sets status 200 and Content-Type header to 'text/plain; charset=utf-8'.

**Parameters**: `stream` (ReadableStream), optional `init` (ResponseInit with status, statusText, headers), optional `data` (StreamData)

**Returns**: Response with stream as body, status 200, and text/plain content type.