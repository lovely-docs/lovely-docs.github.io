## UI Hooks & Utilities

**Hooks:** `useChat` (conversational UI with streaming, tool calling, auto-resubmission), `useCompletion` (text completion with form handlers), `useObject` (experimental, streams JSON matching schema)

**Message Conversion:** `convertToModelMessages` (UI → ModelMessage with multi-modal tool support), `pruneMessages` (reduce tokens by filtering reasoning/tool-calls)

**Streams:** `createUIMessageStream` (ReadableStream with writer API), `createUIMessageStreamResponse` (HTTP Response wrapper), `pipeUIMessageStreamToResponse` (Node.js piping), `readUIMessageStream` (AsyncIterableStream for custom clients)

**Types:** `InferUITools`, `InferUITool` (extract tool input/output types)