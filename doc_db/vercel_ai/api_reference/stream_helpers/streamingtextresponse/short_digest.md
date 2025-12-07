**DEPRECATED in AI SDK 4.0** — use `streamText.toDataStreamResponse()` instead.

Utility class wrapping Response to stream text with automatic status 200 and 'text/plain; charset=utf-8' Content-Type.

**Parameters:** `stream` (ReadableStream), `init` (ResponseInit with status/statusText/headers), `data` (StreamData, optional)