## Key Changes

**Packages:** `ai@5.0.0`, `@ai-sdk/provider@2.0.0`, `@ai-sdk/provider-utils@3.0.0`, `@ai-sdk/*@2.0.0`, `zod@^4.1.8`

**Core API:**
- `maxTokens` → `maxOutputTokens`
- `CoreMessage` → `ModelMessage`, `Message` → `UIMessage`
- `parameters` → `inputSchema` in tools
- `args`/`result` → `input`/`output` in tool calls
- `maxSteps` → `stopWhen` with conditions
- `StreamData` removed; use `createUIMessageStream` with data parts

**Message Structure:**
- `.content` string → `.parts` array: `[{ type: 'text', text: '...' }, { type: 'reasoning', text: '...' }]`
- File parts: `.data`/`.mimeType` → `.url`/`.mediaType`

**Streaming:**
- Single chunks → start/delta/end pattern with IDs
- `textDelta` → `text`, `reasoning` → `reasoning-delta`
- Data stream protocol → Server-Sent Events
- `toDataStreamResponse()` → `toUIMessageStreamResponse()`

**UI Hooks:**
- `useChat`: `initialMessages` → `messages`, `append()` → `sendMessage()`, `reload()` → `regenerate()`
- Transport: `api`/`credentials` → `transport: new DefaultChatTransport({...})`
- Removed managed input state; manual `useState` required
- `addToolResult()` → `addToolOutput()` with explicit tool name
- Tool submission: use `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls`

**Providers:**
- OpenAI: default now Responses API; use `openai.chat()` for Chat Completions
- Google: `useSearchGrounding` → `tools: { google_search: google.tools.googleSearch({}) }`

**Adapters:** LangChain/LlamaIndex moved to separate packages with UI message stream pattern