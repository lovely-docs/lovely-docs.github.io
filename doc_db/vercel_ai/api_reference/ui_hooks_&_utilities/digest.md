## UI Hooks & Utilities

### Hooks for Streaming UI

**useChat** - Conversational UI hook with streaming support, automatic state management, and tool calling. Accepts optional ChatTransport for custom endpoints, initial messages, and callbacks for tool calls, finish events, and errors. Returns current messages, status, and methods to send/regenerate/stop messages and handle tool outputs. Supports automatic resubmission via `sendAutomaticallyWhen`.

**useCompletion** - Text completion hook with streaming. Manages input and completion state, provides form handlers (`handleInputChange`, `handleSubmit`), and supports custom fetch, headers, and stream protocols. Returns completion text, input value, loading state, and control methods.

**useObject** (experimental) - Streams and parses JSON objects matching a Zod or JSON schema. Accepts schema and API endpoint, returns partial object updates as they stream, with error and loading states.

### Message Conversion & Transformation

**convertToModelMessages** - Transforms useChat UI messages to ModelMessage objects for backend functions like `streamText`. Supports multi-modal tool responses via `toModelOutput` and custom data part conversion with type-safe generics for attachments (URLs, code files).

**pruneMessages** - Filters ModelMessage arrays to reduce token count. Configurable strategies: remove all/some reasoning, remove tool calls except in recent messages, remove empty messages.

### Stream Creation & Response

**createUIMessageStream** - Creates a ReadableStream<UIMessageChunk> with writer API for emitting chunks. Supports merging streams, error handling, and onFinish callbacks. Messages use consistent IDs across text-start/delta/end lifecycle.

**createUIMessageStreamResponse** - Wraps UIMessageStream in an HTTP Response object with custom status, headers, and optional SSE consumption callback.

**pipeUIMessageStreamToResponse** - Pipes UIMessageStream to Node.js ServerResponse with HTTP metadata.

**readUIMessageStream** - Converts UIMessageChunk streams to AsyncIterableStream<UIMessage> for terminal UIs, custom clients, and React Server Components.

### Type Helpers

**InferUITools** - TypeScript type helper extracting input/output types from a ToolSet for type-safe tool handling in UIMessages.

**InferUITool** - Extracts input/output types from a single tool.