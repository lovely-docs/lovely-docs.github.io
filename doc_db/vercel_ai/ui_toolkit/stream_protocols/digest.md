## Stream Protocols Overview

AI SDK UI functions (`useChat`, `useCompletion`, `useObject`) support two stream protocols for sending data to the frontend: text streams and data streams.

## Text Stream Protocol

Text streams contain plain text chunks that are appended together to form a complete response. Supported by `useChat`, `useCompletion`, and `useObject`.

**Backend**: Use `streamText()` and call `toTextStreamResponse()` on the result to return a streaming HTTP response.

**Frontend**: Enable with `streamProtocol: 'text'` option. Use `TextStreamChatTransport` with the API endpoint.

**Limitation**: Text streams only support basic text data. For tool calls and other data types, use data streams.

**Example**:
```tsx
// Frontend
const { messages, sendMessage } = useChat({
  transport: new TextStreamChatTransport({ api: '/api/chat' }),
});

// Backend
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toTextStreamResponse();
}
```

## Data Stream Protocol

Uses Server-Sent Events (SSE) format for standardization, keep-alive through ping, reconnect capabilities, and better cache handling. Default protocol for `useChat` and `useCompletion`.

**Backend**: Use `toUIMessageStreamResponse()` from `streamText` result object.

**Custom backends**: Must set `x-vercel-ai-ui-message-stream: v1` header.

**Stream ends with**: `data: [DONE]`

### Supported Stream Parts

**Message Control**:
- `start`: Beginning of new message with metadata (`{"type":"start","messageId":"..."}`)
- `finish`: Completion of message (`{"type":"finish"}`)
- `start-step`: Start of a step (one LLM API call)
- `finish-step`: Completion of a step (necessary for multiple stitched assistant calls and tool execution)

**Text Content** (start/delta/end pattern):
- `text-start`: Beginning of text block with unique ID
- `text-delta`: Incremental text content (`{"type":"text-delta","id":"...","delta":"Hello"}`)
- `text-end`: Completion of text block

**Reasoning Content** (start/delta/end pattern):
- `reasoning-start`: Beginning of reasoning block
- `reasoning-delta`: Incremental reasoning content
- `reasoning-end`: Completion of reasoning block

**Tool Execution**:
- `tool-input-start`: Beginning of tool input streaming (`{"type":"tool-input-start","toolCallId":"...","toolName":"..."}`)
- `tool-input-delta`: Incremental tool input chunks (`{"type":"tool-input-delta","toolCallId":"...","inputTextDelta":"..."}`)
- `tool-input-available`: Tool input complete and ready for execution (`{"type":"tool-input-available","toolCallId":"...","toolName":"...","input":{...}}`)
- `tool-output-available`: Result of tool execution (`{"type":"tool-output-available","toolCallId":"...","output":{...}}`)

**External References**:
- `source-url`: External URL references (`{"type":"source-url","sourceId":"...","url":"..."}`)
- `source-document`: Document/file references (`{"type":"source-document","sourceId":"...","mediaType":"file","title":"..."}`)

**Files**:
- `file`: File references with media type (`{"type":"file","url":"...","mediaType":"image/png"}`)

**Custom Data**:
- `data-*`: Custom data types with type-specific handling (`{"type":"data-weather","data":{"location":"SF","temperature":100}}`)

**Errors**:
- `error`: Error messages appended to message (`{"type":"error","errorText":"..."}`)

**Example**:
```tsx
// Frontend (default, no special config needed)
const { messages, sendMessage } = useChat();

// Backend
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

**Compatibility**: `useCompletion` only supports `text` and `data` stream parts (not tool or reasoning parts).