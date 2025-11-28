## Text Stream Protocol

Plain text chunks appended together. Use `streamText()` with `toTextStreamResponse()` on backend; enable with `streamProtocol: 'text'` and `TextStreamChatTransport` on frontend. Supports only basic text.

## Data Stream Protocol (Default)

Server-Sent Events format with comprehensive part types. Use `toUIMessageStreamResponse()` on backend; no special config needed on frontend.

**Part types**: `start`, `finish`, `start-step`, `finish-step`, `text-start/delta/end`, `reasoning-start/delta/end`, `tool-input-start/delta/available`, `tool-output-available`, `source-url`, `source-document`, `file`, `data-*` (custom), `error`.

Stream ends with `data: [DONE]`. Custom backends must set `x-vercel-ai-ui-message-stream: v1` header. `useCompletion` only supports `text` and `data` parts.