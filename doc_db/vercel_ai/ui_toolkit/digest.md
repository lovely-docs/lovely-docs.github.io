## Framework-Agnostic UI Hooks

Three main hooks for building interactive AI applications:

- **useChat**: Real-time streaming chat with message state management, input handling, error recovery, message manipulation, cancellation/regeneration, and tool integration
- **useCompletion**: Text completion streaming with input control and throttling
- **useObject**: Structured JSON object streaming with partial results (React/Svelte/Angular only)

## Core Features

**Message Management**
- Messages use `parts` property containing text, tool calls, tool results, reasoning, sources, and files
- Status tracking: `submitted`, `streaming`, `ready`, `error`
- Metadata attachment for timestamps, token usage, model info
- Message persistence with validation, server-side ID generation, and disconnect handling

**Tool Integration**
- Server-side auto-execution via `execute()` method
- Client-side handling via `onToolCall` callback
- User-interaction tools displayed in UI with state transitions (input-streaming → input-available → output-available/output-error)
- Tool call streaming enabled by default with partial results
- Type inference via `InferUITool` and `InferUITools`

**Request Customization**
- Hook-level: headers, body, credentials via `DefaultChatTransport`
- Request-level: per-message options override hook config
- Dynamic configuration via functions for auth tokens and session data
- Custom request transformation with `prepareSendMessagesRequest`

**Advanced Features**
- UI throttling to reduce render frequency during streaming
- Event callbacks: `onFinish`, `onError`, `onData`
- Reasoning tokens support (DeepSeek, Anthropic models)
- Sources forwarding for RAG applications
- Image generation support
- File attachments (FileList or file objects)
- Stream resumption after page reloads with Redis persistence
- Custom data streaming alongside responses with type-safe schemas
- Text stream protocol (plain text) or data stream protocol (SSE-based)

## Chat Persistence Pattern

```tsx
// Create chat with unique ID
const id = await createChat(); // generates ID, stores empty message array

// Load messages on page load
const messages = await loadChat(id);

// Validate messages against current tools/schemas
const validatedMessages = await validateUIMessages({
  messages: [...previousMessages, newMessage],
  tools, metadataSchema, dataPartsSchema,
});

// Save in onFinish callback
return result.toUIMessageStreamResponse({
  originalMessages: validatedMessages,
  onFinish: ({ messages }) => saveChat({ chatId: id, messages }),
});
```

## Stream Resumption

Enable with `resume: true` in `useChat`. Requires:
1. POST handler creates resumable stream via `consumeSseStream` callback, stores ID in persistence
2. GET handler resumes via `resumeExistingStream`, returns 204 if no active stream
3. Uses `resumable-stream` package with Redis backend

**Warning**: Incompatible with abort functionality.

## Generative UI

Tools can return React components dynamically. Define tools with Zod schemas, add to `streamText`, render based on tool part states:
- `input-available`: Loading state
- `output-available`: Render component with `part.output`
- `output-error`: Show error with `part.errorText`

## Error Handling

- Warnings prefixed "AI SDK Warning:" for unsupported features; control via `globalThis.AI_SDK_LOG_WARNINGS`
- Hook `error` object for UI display
- `regenerate()` or `setMessages()` for recovery
- `onError` callback for custom handling
- Server-side: throw errors in route handlers for testing

## Transport

`DefaultChatTransport` handles HTTP POST to `/api/chat` by default. Customize endpoint, headers, credentials, and request transformation. Implement `ChatTransport` interface for custom protocols (WebSockets, etc).

## Stream Protocols

**Text Stream**: Plain text chunks via `toTextStreamResponse()`, limited to text only
**Data Stream** (default): SSE-based via `toUIMessageStreamResponse()`, supports text/reasoning/tool/source/file/custom-data parts, ends with `[DONE]`