## Migration Process

1. Backup project and commit all changes
2. Upgrade to AI SDK 5.0 packages: `ai@5.0.0`, `@ai-sdk/provider@2.0.0`, `@ai-sdk/provider-utils@3.0.0`, `@ai-sdk/*@2.0.0`
3. Update peer dependency: `zod@^4.1.8` (required to avoid TypeScript performance issues)
4. Use automated migration: AI SDK 5 Migration MCP Server (for Cursor/MCP-compatible agents) or codemods (`npx @ai-sdk/codemod upgrade`)
5. Manually address breaking changes
6. Verify and commit

## Core API Changes

**generateText/streamText:**
- `maxTokens` → `maxOutputTokens`
- `providerMetadata` → `providerOptions` (input only; returned metadata still called `providerMetadata`)

**Message Types:**
- `CoreMessage` → `ModelMessage`
- `Message` → `UIMessage`
- `convertToCoreMessages` → `convertToModelMessages`
- `CreateMessage` → `CreateUIMessage`

**UIMessage Structure:**
- `.content` string → `.parts` array with typed objects: `{ type: 'text', text: '...' }`, `{ type: 'reasoning', text: '...' }`, `{ type: 'file', url: '...', mediaType: '...' }`
- `data` role removed; use `createUIMessageStream` with custom data parts instead
- `reasoning` property moved to parts array
- Reasoning part property: `reasoning` → `text`
- File parts: `.data` + `.mimeType` → `.url` + `.mediaType`

**Tools:**
- `parameters` → `inputSchema` in tool definitions
- `experimental_toToolResultContent` → `toModelOutput` (no longer experimental)
- Tool call/result properties: `args`/`result` → `input`/`output`
- `ToolExecutionError` removed; tool errors now appear as `tool-error` content parts in steps
- `toolCallStreaming` option removed; streaming always enabled by default
- UI tool parts: generic `tool-invocation` type → typed `tool-${toolName}` parts
- Tool states: `partial-call` → `input-streaming`, `call` → `input-available`, `result` → `output-available`, new `output-error` state
- New `dynamicTool` helper for runtime tools with unknown types; check `toolCall.dynamic` flag for type narrowing

**Streaming & Data:**
- `StreamData` class removed; use `createUIMessageStream` with custom data parts
- `writeMessageAnnotation`/`writeData` removed from `DataStreamWriter`; use custom data parts in UI message streams
- Stream protocol: single chunks → start/delta/end pattern with unique IDs
- `textDelta` → `text` in stream chunks
- `reasoning` chunk type → `reasoning-delta`
- New stream chunk types: `text-start`/`text-end`, `reasoning-start`/`reasoning-end`, `tool-input-start`/`tool-input-delta`/`tool-input-end`
- `step-finish` → `finish-step`
- `usage` → `totalUsage` in finish events
- Data stream protocol → Server-Sent Events (SSE)
- `createDataStreamResponse` → `createUIMessageStreamResponse`
- `toDataStreamResponse()` → `toUIMessageStreamResponse()`
- `getErrorMessage` option → `onError` callback (errors not sent to client by default for security)

**Step Control:**
- `maxSteps` → `stopWhen` with conditions: `stepCountIs(n)`, `hasToolCall('toolName')`, or custom function
- `stepType` property removed from steps
- `usage` (single step) vs `totalUsage` (all steps)

**Reasoning:**
- `step.reasoning` → `step.reasoningText`
- `result.reasoning` (string) → `result.reasoningText`
- `result.reasoningDetails` (array) → `result.reasoning`

**Other:**
- `experimental_continueSteps` removed
- Image generation: model settings moved to `providerOptions`
- `experimental_generateMessageId` moved from `streamText` to `toUIMessageStreamResponse`
- Temperature no longer defaults to 0; must be explicitly set
- `wrapLanguageModel` no longer experimental
- `activeTools` no longer experimental
- `prepareStep` no longer experimental (was `experimental_prepareStep`)

## UI Changes

**Package Structure:**
- `ai/rsc` → `@ai-sdk/rsc` (separate package)
- `ai/react` → `@ai-sdk/react` (separate package)
- `@ai-sdk/ui-utils` removed; exports moved to `ai` package
- `processDataStream` removed; use `readUIMessageStream` or Chat/useChat APIs

**useChat Hook:**
- `maxSteps` removed; use server-side `stopWhen` instead
- `initialMessages` → `messages`
- Chat sharing: use explicit `Chat` instance instead of `id` parameter
- Transport architecture: `api`/`credentials`/`headers` → `transport: new DefaultChatTransport({ api, credentials, headers })`
- Removed managed input state; manually manage with `useState`
- `append()` → `sendMessage({ text: '...' })` or `sendMessage({ parts: [...] })`
- `reload()` → `regenerate()` with optional `messageId` parameter
- `onResponse` callback removed
- `sendExtraMessageFields` removed (now default)
- `keepLastMessageOnError` removed
- `data` and `allowEmptySubmit` removed from `ChatRequestOptions`
- `RequestOptions` → `CompletionRequestOptions`
- `addToolResult()` → `addToolOutput()` with `tool` name and `output` parameter
- Tool result submission: `onToolCall` no longer supports returning values; use `addToolOutput` explicitly with `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls` for automatic submission (don't await `addToolOutput` inside `onToolCall` to avoid deadlocks)
- `isLoading` removed; use `status` instead
- `experimental_resume` → `resumeStream`
- `body` option now static (captured at first render); use request-level config or `useRef` for dynamic values
- Usage info: moved from `onFinish` callback to message metadata via `messageMetadata` function in `toUIMessageStreamResponse`
- `experimental_prepareRequestBody` → `prepareSendMessagesRequest` in transport config

**Vue.js (@ai-sdk/vue):**
- `useChat` composable → `Chat` class constructor
- Message structure: `.content` string → `.parts` array

**Svelte (@ai-sdk/svelte):**
- Constructor: `Chat({...})` → `Chat(() => ({...}))`
- Properties now readonly; use setter methods like `setMessages()`
- Input management removed (manual state required)

**useCompletion:**
- `data` property removed

**useAssistant:**
- Hook removed entirely; use `useChat` instead

**Attachments:**
- `experimental_attachments` → file parts in `.parts` array

## Embedding Changes

- Model settings: moved to `providerOptions`
- `rawResponse` → `response`
- `embedMany` now makes parallel requests with configurable `maxParallelCalls` option

## Adapter Changes

- `LangChainAdapter.toDataStreamResponse()` → `toUIMessageStream()` from `@ai-sdk/langchain` + `createUIMessageStreamResponse()`
- `LlamaIndexAdapter.toDataStreamResponse()` → `toUIMessageStream()` from `@ai-sdk/llamaindex` + `createUIMessageStreamResponse()`

## Provider Interface Changes

- `LanguageModelV3` import: `ai` → `@ai-sdk/provider`
- `LanguageModelV1Middleware` → `LanguageModelV3Middleware` from `@ai-sdk/provider`
- Token properties: `promptTokens`/`completionTokens` → `inputTokens`/`outputTokens` (with required `totalTokens`)
- `rawResponse` → `response`
- Stream parts expanded with start/delta/end patterns and IDs
- Deprecated `CoreTool*` types removed; use `ToolCall`, `ToolResult`, `TypedToolResult`, `TypedToolCall`, `ToolChoice` from `@ai-sdk/provider-utils`

## Provider-Specific Changes

**OpenAI:**
- Default instance now uses Responses API (not Chat Completions); use `openai.chat()` for Chat Completions API
- `strictSchemas` → `strictJsonSchema` (defaults to false)
- `structuredOutputs` moved to `providerOptions`
- `compatibility` option removed (strict mode is default)
- `useLegacyFunctionCalls` removed
- `simulateStreaming` model option → middleware: `wrapLanguageModel({ model, middleware: simulateStreamingMiddleware() })`

**Google:**
- Search Grounding: `useSearchGrounding: true` → `tools: { google_search: google.tools.googleSearch({}) }`

**Amazon Bedrock:**
- Provider options: snake_case → camelCase (e.g., `reasoning_config` → `reasoningConfig`)

## Utility Changes

- `createIdGenerator()` now requires `size` argument at creation time (not at call time)
- `IDGenerator` type → `IdGenerator`

## Message Persistence

- v4: used `appendClientMessage`/`appendResponseMessages` helpers in `onFinish`
- v5: use `toUIMessageStreamResponse({ originalMessages, generateMessageId, onFinish })` which automatically formats messages in `UIMessage` format
- Always provide `originalMessages` and `generateMessageId` to prevent duplicate messages
- For complex scenarios with data parts, use `createUIMessageStream` with `originalMessages` and `generateId`

## Codemods

Run `npx @ai-sdk/codemod upgrade` to automatically apply transformations. Individual codemods available for specific changes (e.g., `v5/rename-format-stream-part`, `v5/move-maxsteps-to-stopwhen`). See codemod table for full list.