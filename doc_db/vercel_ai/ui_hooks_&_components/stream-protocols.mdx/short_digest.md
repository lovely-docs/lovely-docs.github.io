## Stream Protocols

Two protocols for streaming data to frontend: **Text Stream** (plain text chunks via `toTextStreamResponse()`) and **Data Stream** (SSE-based, default, supports text/reasoning/sources/files/custom data/tool calls/steps via `toUIMessageStreamResponse()`).

**Text Stream Example:**
```tsx
// Frontend
const { messages, sendMessage } = useChat({
  transport: new TextStreamChatTransport({ api: '/api/chat' }),
});

// Backend
return streamText({ model, messages }).toTextStreamResponse();
```

**Data Stream Example:**
```tsx
// Frontend (default)
const { messages, sendMessage } = useChat();

// Backend
return streamText({ model, messages }).toUIMessageStreamResponse();
```

Data stream parts: message-start, text (start/delta/end), reasoning (start/delta/end), source-url, source-document, file, data-*, error, tool-input (start/delta/available), tool-output-available, start-step, finish-step, finish, [DONE]. Custom backends need `x-vercel-ai-ui-message-stream: v1` header.