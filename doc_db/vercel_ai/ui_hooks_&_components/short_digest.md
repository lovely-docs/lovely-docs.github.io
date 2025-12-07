**useChat**: Real-time streaming chat with message state (`submitted`/`streaming`/`ready`/`error`), methods (`sendMessage`, `stop`, `regenerate`, `setMessages`), callbacks (`onFinish`, `onError`, `onData`). Messages have `parts` array (text, tool calls, tool results, reasoning, sources, files). Configuration: hook-level (all requests), dynamic (refreshing tokens), request-level (per-message). Transport customization via `prepareSendMessagesRequest`. Message metadata via server-side `messageMetadata` callback. Advanced: reasoning tokens, sources, image generation, file attachments, tool type inference, UI throttling.

**Message Persistence**: Store/load chats with unique IDs. Validate messages with `validateUIMessages()` (supports tools/metadata). Server-side ID generation via `generateMessageId` or `createUIMessageStream`. Optimize data sent via `prepareSendMessagesRequest`. Handle disconnects with `consumeStream()`.

**Stream Resumption**: Resume streams after page reloads with `resume: true`, Redis, `resumable-stream` package. POST creates resumable stream with `consumeSseStream`, GET resumes via `resumeExistingStream`. Incompatible with abort.

**Tools**: Three types (server auto-execute, client auto-execute, user-interaction). Tool parts have states: `input-streaming`, `input-available`, `output-available`, `output-error`. Use `onToolCall` callback and `addToolOutput` for client tools. `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls` auto-submits. Dynamic tools use `dynamic-tool` type. Multi-step via `stopWhen: stepCountIs(n)`. Error handling via `output-error` state or `onError` callback.

**Generative UI**: Connect tool calls to React components. Define tools with schemas, create matching components, render by checking `message.parts` for `tool-${toolName}` parts and their states.

**useCompletion**: Streams text completions. State: `completion`, `input`, `isLoading`, `error`. Methods: `handleInputChange`, `handleSubmit`, `setInput`, `stop`. Callbacks: `onResponse`, `onFinish`, `onError`. Throttle with `experimental_throttle`.

**useObject**: Streams structured JSON with partial results. State: `object`, `isLoading`, `error`. Methods: `submit`, `stop`. Callbacks: `onFinish`, `onError`. Enum mode for classification.

**Custom Data Streaming**: Stream custom data alongside responses via `createUIMessageStream`. Persistent data parts (in history) with reconciliation by ID, transient data (via `onData` callback only). Supports loading states and progressive updates.

**Stream Protocols**: Text streams (plain text via `toTextStreamResponse()`) vs data streams (SSE with parts via `toUIMessageStreamResponse()`). Data streams support tool calls, usage, finish reasons.

**readUIMessageStream**: Transform UIMessageChunk stream to AsyncIterableStream<UIMessage> for iterative processing. Handle tool calls by switching on `part.type`. Resume from previous message.

**Error Handling**: Control warnings via `globalThis.AI_SDK_LOG_WARNINGS`. Display errors from hooks, disable inputs, implement retry/replace-message patterns. Pass `onError` callback to hooks.

**Transport**: Default POST to `/api/chat`. Configure via `DefaultChatTransport` with headers/body/credentials (static or dynamic functions). Transform requests via `prepareSendMessagesRequest`.