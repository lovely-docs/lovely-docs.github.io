## Three Main Hooks

- **useChat**: Real-time streaming chat with message state, tools, persistence, and resumption
- **useCompletion**: Text completion streaming
- **useObject**: Structured JSON streaming (React/Svelte/Angular)

## Key Patterns

**Messages**: Use `parts` property (text, tool-call, tool-result, reasoning, source, file)

**Tools**: Server-side auto-execute via `execute()`, client-side via `onToolCall`, user-interaction via UI with state transitions

**Persistence**: Create chat with ID → load messages → validate → save in `onFinish`

**Resumption**: Enable `resume: true`, requires POST to create resumable stream + GET to reconnect via Redis

**Customization**: Hook-level config (headers, body, credentials) or request-level options

**Error Handling**: Use hook `error` object, `regenerate()` for retry, `onError` callback

**Transport**: `DefaultChatTransport` for HTTP, implement `ChatTransport` for custom protocols

**Streams**: Text (plain text) or Data (SSE, supports tools/reasoning/sources)