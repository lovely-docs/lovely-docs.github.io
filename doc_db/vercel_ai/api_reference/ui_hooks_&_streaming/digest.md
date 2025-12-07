## Core Hooks

**useChat** - Conversational UI hook with streaming, message state management, tool calling, and transport customization. Creates chat interface with automatic state management.

Parameters: `chat` (existing instance), `transport` (ChatTransport with api endpoint, credentials, headers, body, request customization via `prepareSendMessagesRequest`/`prepareReconnectToStreamRequest`), `id` (unique identifier), `messages` (initial UIMessage[]), `onToolCall` (callback requiring `addToolOutput`), `sendAutomaticallyWhen` (resubmit condition), `onFinish` (receives message, messages, isAbort, isDisconnect, isError, finishReason), `onError`, `onData`, `experimental_throttle`, `resume`.

Returns: `id`, `messages` (UIMessage[] with id, role, parts, metadata), `status` ('submitted'|'streaming'|'ready'|'error'), `error`, `sendMessage(message|string, options?)`, `regenerate(options?)`, `stop()`, `clearError()`, `resumeStream()`, `addToolOutput(tool, toolCallId, output|errorText)`, `setMessages(messages|function)`.

**useCompletion** - Text completion hook with streaming, state management, and UI updates.

Parameters: `api` (default '/api/completion'), `id` (shared state), `initialInput`, `initialCompletion`, `onFinish((prompt, completion))`, `onError`, `headers`, `body`, `credentials`, `fetch`, `streamProtocol` ('text'|'data'), `experimental_throttle`.

Returns: `completion`, `input`, `error`, `isLoading`, `setCompletion`, `setInput`, `complete(prompt, options?)`, `stop()`, `handleInputChange`, `handleSubmit`.

**useObject** (experimental) - Streams and parses JSON objects into typed objects using schemas.

Parameters: `api`, `schema` (Zod or JSON Schema), `id`, `initialValue`, `fetch`, `headers`, `credentials`, `onError`, `onFinish({object, error})`.

Returns: `submit(input)`, `object` (DeepPartial<RESULT>), `error`, `isLoading`, `stop()`, `clear()`.

## Message Conversion & Utilities

**convertToModelMessages** - Transforms useChat messages to ModelMessage objects for AI core functions. Supports multi-modal tool responses via `toModelOutput` method and custom data part conversion with `convertDataPart` callback for URLs, code files, JSON configs.

**pruneMessages** - Filters ModelMessage arrays to reduce context size. Parameters: `messages`, `reasoning` ('all'|'before-last-message'|'none'), `toolCalls` ('all'|'before-last-message'|'before-last-${number}-messages'|'none'|PruneToolCallsOption[]), `emptyMessages` ('keep'|'remove'). Removes intermediate reasoning, tool calls, and empty messages.

**createUIMessageStream** - Creates readable stream for UI messages with message merging and error handling.

Parameters: `execute({writer})` with `writer.write(UIMessageChunk)` and `writer.merge(stream)`, `onError`, `originalMessages`, `onFinish({messages, isContinuation, responseMessage})`, `generateId`.

Returns: ReadableStream<UIMessageChunk>.

**createUIMessageStreamResponse** - Creates HTTP Response streaming UI message chunks (data, text, sources, LLM output).

Parameters: `stream` (ReadableStream<UIMessageChunk>), `status`, `statusText`, `headers`, `consumeSseStream`.

Returns: Response object.

**pipeUIMessageStreamToResponse** - Pipes ReadableStream<UIMessageChunk> to Node.js ServerResponse.

Parameters: `response`, `stream`, `status`, `statusText`, `headers`, `consumeSseStream`.

**readUIMessageStream** - Transforms UIMessageChunk stream to AsyncIterableStream<UIMessage> for terminal UIs, custom clients, or RSCs.

Parameters: `message` (optional starting message), `stream`, `onError`, `terminateOnError`.

Returns: AsyncIterableStream<UIMessage>.

## Type Helpers

**InferUITools** - Maps ToolSet to inferred input/output types for each tool: `{ [NAME]: { input: InferToolInput; output: InferToolOutput } }`.

**InferUITool** - Infers input/output types from single tool definition: `{ input: InferToolInput; output: InferToolOutput }`.

## Framework Support

React: Full support (useChat, useCompletion, useObject). Svelte: Full support (Chat, Completion, StructuredObject). Vue.js: useChat and useCompletion only.