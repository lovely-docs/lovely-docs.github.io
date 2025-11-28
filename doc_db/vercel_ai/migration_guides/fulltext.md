

## Pages

### versioning
MAJOR.MINOR.PATCH versioning with stable (production-ready), experimental (prefix, pin versions), and deprecated (migrate via guides/codemods) API tiers.

## Version Format
Version numbers follow `MAJOR.MINOR.PATCH`:
- **Major**: Breaking API updates requiring code changes
- **Minor**: New features and improvements in public releases
- **Patch**: New features and bug fixes

## API Stability Levels

**Stable APIs**: All APIs without special prefixes are production-ready with backward compatibility maintained. Breaking changes only occur in major releases.

**Experimental APIs**: Prefixed with `experimental_` or `Experimental_` (e.g., `experimental_generateImage()`). These can change in any release. Usage guidelines:
- Test only in development, not production
- Review release notes before upgrading
- Prepare for potential code updates
- Pin exact version numbers (avoid `^` or `~` ranges) to prevent unexpected breaking changes

**Deprecated APIs**: Marked as `deprecated` and removed in future major releases. Migration path:
- Switch to recommended alternative API
- Follow migration guides released with major versions
- Automated codemods provided where possible to assist migration

### migrate_data_to_ai_sdk_5.0
Two-phase data migration from AI SDK 4.x to 5.0: Phase 1 adds runtime conversion layer (v4 database ↔ v5 app) without schema changes; Phase 2 migrates to v5 schema via dual-write, background batch conversion, and read switch to eliminate conversion overhead. Message structure changes: v4 top-level `content`/`reasoning`/`toolInvocations` → v5 `parts` array with text/reasoning/tool-${name} parts; tool state mapping: `partial-call`→`input-streaming`, `call`→`input-available`, `result`→`output-available`.

## Data Migration Strategy for AI SDK 5.0

AI SDK 5.0 changes the message structure from v4, requiring data migration. The guide provides a two-phase approach to migrate persisted messages and chat data.

### Key Message Structure Changes

**AI SDK 4.0 format:**
- `content` field for text
- `reasoning` as top-level property
- `toolInvocations` as top-level property
- `parts` optional ordered array

**AI SDK 5.0 format:**
- `parts` array is the single source of truth
- `content` removed (access via `text` part)
- `reasoning` removed (replaced with `reasoning` part)
- `toolInvocations` removed (replaced with `tool-${toolName}` parts with `input`/`output` instead of `args`/`result`)
- `data` role removed (use data parts instead)

### Phase 1: Runtime Conversion (Hours to Days)

Get your app working immediately without database changes by adding a conversion layer.

**Setup:**
1. Install v4 types alongside v5 using npm aliases in package.json:
```json
{
  "dependencies": {
    "ai": "^5.0.0",
    "ai-legacy": "npm:ai@^4.3.2"
  }
}
```

2. Import types:
```tsx
import type { Message as V4Message } from 'ai-legacy';
import type { UIMessage } from 'ai';
```

**Conversion functions:** Create type guards (`isV4Message`, `isV4ToolInvocationPart`, etc.) and bidirectional converters:
- `convertV4MessageToV5()`: Transform v4 messages to v5 format
- `convertV5MessageToV4()`: Transform v5 messages to v4 format
- `convertV4ToolInvocationToV5ToolUIPart()`: Handle tool invocation state mapping (`partial-call` → `input-streaming`, `call` → `input-available`, `result` → `output-available`)
- Part converters for reasoning, source, and file parts

**Apply conversion on read:**
```tsx
export async function loadChat(chatId: string): Promise<MyUIMessage[]> {
  const rawMessages = await db.select().from(messages).where(eq(messages.chatId, chatId));
  return rawMessages.map((msg, index) => convertV4MessageToV5(msg, index));
}
```

**Apply conversion on write:**
```tsx
export async function POST(req: Request) {
  const { message, chatId } = await req.json();
  await upsertMessage({
    chatId,
    id: message.id,
    message: convertV5MessageToV4(message), // convert to v4 before saving
  });
  const previousMessages = await loadChat(chatId);
  const messages = [...previousMessages, message];
  // ... rest of streamText logic
}
```

Result: Bidirectional conversion layer (v4 database ↔ v5 application) with unchanged database schema.

### Phase 2: Side-by-Side Schema Migration (Do Soon After Phase 1)

Migrate data to v5 schema to eliminate runtime conversion overhead.

**Migration strategy:**
1. Create `messages_v5` table alongside existing `messages` table with same structure but storing v5 message parts
2. Implement dual-write for new messages to both schemas (with conversion)
3. Run background migration script to convert existing messages in batches
4. Verify data integrity (count messages in both schemas, check migration progress)
5. Update read functions to use `messages_v5` schema (no conversion needed since data is already v5)
6. Stop dual-writing, write only to `messages_v5`
7. Drop old `messages` table

**Dual-write implementation:**
```typescript
export const upsertMessage = async ({ chatId, message, id }) => {
  return await db.transaction(async tx => {
    // Write to v4 schema
    const [result] = await tx.insert(messages).values({
      chatId, parts: message.parts ?? [], role: message.role, id
    }).onConflictDoUpdate({ target: messages.id, set: { parts: message.parts ?? [], chatId } }).returning();
    
    // Convert and write to v5 schema
    const v5Message = convertV4MessageToV5({ ...message, content: '' }, 0);
    await tx.insert(messages_v5).values({
      chatId, parts: v5Message.parts ?? [], role: v5Message.role, id
    }).onConflictDoUpdate({ target: messages_v5.id, set: { parts: v5Message.parts ?? [], chatId } });
    
    return result;
  });
};
```

**Background migration script:**
```typescript
async function migrateExistingMessages() {
  const migratedIds = await db.select({ id: messages_v5.id }).from(messages_v5);
  const migratedIdSet = new Set(migratedIds.map(m => m.id));
  const allMessages = await db.select().from(messages);
  const unmigrated = allMessages.filter(msg => !migratedIdSet.has(msg.id));
  
  const batchSize = 100;
  for (let i = 0; i < unmigrated.length; i += batchSize) {
    const batch = unmigrated.slice(i, i + batchSize);
    await db.transaction(async tx => {
      for (const msg of batch) {
        const v5Message = convertV4MessageToV5({ id: msg.id, content: '', role: msg.role, parts: msg.parts, createdAt: msg.createdAt }, 0);
        await tx.insert(messages_v5).values({ id: v5Message.id, chatId: msg.chatId, role: v5Message.role, parts: v5Message.parts, createdAt: msg.createdAt });
      }
    });
  }
}
```

**Verification script:**
```typescript
async function verifyMigration() {
  const v4Count = await db.select({ count: count() }).from(messages);
  const v5Count = await db.select({ count: count() }).from(messages_v5);
  console.log(`V4: ${v4Count[0].count}, V5: ${v5Count[0].count}, Progress: ${((v5Count[0].count / v4Count[0].count) * 100).toFixed(2)}%`);
}
```

**After migration, update read functions:**
```typescript
export const loadChat = async (chatId: string): Promise<MyUIMessage[]> => {
  return await db.select().from(messages_v5).where(eq(messages_v5.chatId, chatId)).orderBy(messages_v5.createdAt);
};
```

**Update route handler to write v5 directly:**
```tsx
export async function POST(req: Request) {
  const { message, chatId } = await req.json();
  await upsertMessage({ chatId, id: message.id, message }); // no conversion
  const previousMessages = await loadChat(chatId);
  const messages = [...previousMessages, message];
  // ... streamText logic
}
```

**Cleanup:**
- Remove conversion functions and `ai-legacy` dependency
- Test thoroughly
- After safe period (1-2 weeks), drop old table: `DROP TABLE messages;`
- Optionally rename: `ALTER TABLE messages_v5 RENAME TO messages;`

### Implementation Notes

- Adapt all examples to your specific database (Postgres, MySQL, SQLite), ORM (Drizzle, Prisma, raw SQL), and schema design
- Phase 1 can be completed in hours/days; Phase 2 should follow soon after
- The conversion layer handles all v4 message types including tool invocations with state mapping, reasoning parts, source parts, and file parts
- Batch migration script can be run multiple times safely and supports resuming
- Dual-write ensures no data loss during migration period

### migrate_ai_sdk_4.0_to_5.0
Complete breaking changes for AI SDK 5.0: message types (CoreMessage→ModelMessage, Message→UIMessage), message structure (.content→.parts array), tools (parameters→inputSchema, args/result→input/output), streaming (single chunks→start/delta/end pattern, data stream→SSE), UI hooks (useChat transport architecture, removed managed input, append→sendMessage), step control (maxSteps→stopWhen), and provider-specific updates (OpenAI Responses API default, Google search grounding as tool).

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

### migrate_ai_sdk_4.1_to_4.2
AI SDK 4.2: stabilize APIs (remove experimental_ prefix), require zod ^3.23.8, redesign useChat to combine assistant messages into single message with ordered parts array (text, reasoning, tool-invocation, source, file) instead of separate properties.

## Stable APIs

The following APIs are now stable and no longer prefixed with `experimental_`:
- `customProvider`
- `providerOptions` (renamed from `providerMetadata` for provider-specific inputs)
- `providerMetadata` (for provider-specific outputs)
- `toolCallStreaming` option for `streamText`

## Dependency Versions

AI SDK 4.2 requires `zod` dependency with version `^3.23.8` (non-optional).

## UI Message Parts - Major Change

The `useChat` hook now combines assistant messages with tool calling into a single message with multiple parts instead of creating separate messages for each step.

### Previous Format
```javascript
message.content = "Final answer: 42";
message.reasoning = "First I'll calculate X, then Y...";
message.toolInvocations = [{toolName: "calculator", args: {...}}];
```

### New Format
```javascript
message.parts = [
  { type: "text", text: "Final answer: 42" },
  { type: "reasoning", reasoning: "First I'll calculate X, then Y..." },
  { type: "tool-invocation", toolInvocation: { toolName: "calculator", args: {...} } },
];
```

### Migration Example
Update UI components to iterate over `message.parts` array and handle each part type:

```javascript
function Chat() {
  const { messages } = useChat();
  return (
    <div>
      {messages.map(message =>
        message.parts.map((part, i) => {
          switch (part.type) {
            case 'text':
              return <p key={i}>{part.text}</p>;
            case 'source':
              return <p key={i}>{part.source.url}</p>;
            case 'reasoning':
              return <div key={i}>{part.reasoning}</div>;
            case 'tool-invocation':
              return <div key={i}>{part.toolInvocation.toolName}</div>;
            case 'file':
              return (
                <img
                  key={i}
                  src={`data:${part.mediaType};base64,${part.data}`}
                />
              );
          }
        }),
      )}
    </div>
  );
}
```

The old format fields remain available for backward compatibility but migration to the new format is recommended for better multi-modal and multi-step interaction support.

### migrate_ai_sdk_5.0_to_6.0_beta
Upgrade AI SDK 5.0 to 6.0 Beta: update packages (ai@6.0.0-beta, @ai-sdk/provider@3.0.0-beta, @ai-sdk/provider-utils@4.0.0-beta, @ai-sdk/*@3.0.0-beta), follow breaking changes, use provided codemods for automatic transformations; beta includes agents and tool approval features.

## Migration Process

1. Backup your project and ensure all changes are committed to version control
2. Upgrade to AI SDK 6.0 Beta
3. Follow the breaking changes guide
4. Verify the project works as expected
5. Commit your changes

## Package Versions to Update

Update these packages in `package.json` to beta versions:
- `ai`: `6.0.0-beta` (or `@beta` dist-tag)
- `@ai-sdk/provider`: `3.0.0-beta` (or `@beta` dist-tag)
- `@ai-sdk/provider-utils`: `4.0.0-beta` (or `@beta` dist-tag)
- `@ai-sdk/*`: `3.0.0-beta` (or `@beta` dist-tag for other packages)

Example upgrade command:
```
pnpm install ai@beta @ai-sdk/react@beta @ai-sdk/openai@beta
```

## Codemods

AI SDK 6.0 Beta will provide Codemod transformations to automatically upgrade your codebase when features are deprecated, removed, or changed. Codemods run automatically on your codebase to apply many changes without manual file-by-file updates. However, codemods may not cover all necessary changes - you may need to make additional manual updates.

Note: The codemod table in the documentation is currently incomplete (marked as TBD).

## Important Notes

- AI SDK 6 is in beta and introduces new capabilities like agents and tool approval
- Consider waiting for the stable release before upgrading production projects
- Refer to the AI SDK 6 Beta announcement for details on new features

### migrate_4.0_to_4.1
4.0 to 4.1 upgrade has no breaking changes.

This migration guide covers upgrading from AI SDK version 4.0 to 4.1. The release contains no breaking changes, meaning existing code will continue to work without modifications. For detailed information about new features and improvements in this release, refer to the AI SDK 4.1 release blog post.

### migrate_ai_sdk_3.4_to_4.0
Breaking changes for AI SDK 4.0: baseUrl→baseURL, remove await from streamText/streamObject, maxToolRoundtrips→maxSteps, experimental exports removed, facade constructors removed, type renames (ExperimentalMessage→ModelMessage), method renames (toAIStream→toDataStream), property renames (rawResponse→response, roundtrips→steps), warnings becomes Promise, UI hooks streamMode→streamProtocol, framework imports split to separate packages, error methods isXXXError→isInstance.

## Migration Process

1. Backup project and commit all changes
2. Migrate to AI SDK 3.4 first
3. Upgrade to AI SDK 4.0
4. Run codemods: `npx @ai-sdk/codemod upgrade` or `npx @ai-sdk/codemod v4`
5. Manually fix remaining breaking changes
6. Verify and commit

## Package Versions

Update to: `ai@4.0.*`, `ai-sdk@provider-utils@2.0.*`, `@ai-sdk/*@1.0.*`

## Provider Changes

- **baseUrl → baseURL**: All providers now use `baseURL` instead of `baseUrl`
- **Anthropic**: Remove `new Anthropic()` facade, use `createAnthropic()` or `anthropic` object. Move model-specific `topK` to standard `topK` parameter
- **Google Generative AI**: Remove `new Google()` facade, use `createGoogleGenerativeAI()` or `google` object. Move model-specific `topK` to standard `topK`
- **Google Vertex**: Move model-specific `topK` to standard `topK`
- **Mistral**: Remove `new Mistral()` facade, use `createMistral()` or `mistral` object
- **OpenAI**: Remove `new OpenAI()` facade, use `createOpenAI()` or `openai` object
- **LangChain**: Replace `LangChainAdapter.toAIStream()` with `LangChainAdapter.toDataStream()`

## AI SDK Core Changes

- **streamText/streamObject**: No longer return Promises - remove `await`
- **Roundtrips → maxSteps**: Replace `maxToolRoundtrips`/`maxAutomaticRoundtrips` with `maxSteps` (value = roundtrips + 1). Replace `roundtrips` property with `steps`
- **nanoid → generateId**: Import `generateId` instead of `nanoid`
- **generateId size**: Now generates 16-character IDs (was 7)
- **Message types**: `ExperimentalMessage` → `ModelMessage`, `ExperimentalUserMessage` → `CoreUserMessage`, `ExperimentalAssistantMessage` → `CoreAssistantMessage`, `ExperimentalToolMessage` → `CoreToolMessage`
- **Tool type**: `ExperimentalTool` → `CoreTool`
- **Experimental exports**: Remove `experimental_generateText`, `experimental_streamText`, `experimental_generateObject`, `experimental_streamObject` - use non-experimental versions
- **streamText methods**: Replace `toAIStream()` with `toDataStream()`, `pipeAIStreamToResponse()` with `pipeDataStreamToResponse()`, `toAIStreamResponse()` with `toDataStreamResponse()`
- **Stream functions**: `formatStreamPart()` → `formatDataStreamPart()`, `parseStreamPart()` → `parseDataStreamPart()`
- **Token usage types**: `TokenUsage`/`CompletionTokenUsage` → `LanguageModelUsage`, `EmbeddingTokenUsage` → `EmbeddingModelUsage`
- **Telemetry**: Removed `ai.finishReason`, `ai.result.object`, `ai.result.text`, `ai.result.toolCalls`, `ai.stream.msToFirstChunk` (now under `ai.response.*`)
- **Provider registry**: Remove `experimental_Provider`, `experimental_ProviderRegistry`, `experimental_ModelRegistry` - use `Provider` instead. Remove `experimental_createModelRegistry()` - use `experimental_createProviderRegistry()`
- **rawResponse → response**: Replace `rawResponse` property with `response`
- **pipeDataStreamToResponse/toDataStreamResponse**: Remove `init` option, set values directly in options object
- **responseMessages**: Replace with `response.messages`
- **experimental_continuationSteps → experimental_continueSteps**
- **LanguageModelResponseMetadataWithHeaders**: Use `LanguageModelResponseMetadata` instead
- **streamText/streamObject warnings**: Now returns Promise - must `await result.warnings`
- **simulateReadableStream**: Rename `values` parameter to `chunks`

## AI SDK RSC Changes

- **render function**: Removed - use `streamUI` instead or migrate to AI SDK UI

## AI SDK UI Changes

- **Framework exports**: Svelte/Vue/SolidJS no longer exported from `ai` - install `@ai-sdk/svelte`, `@ai-sdk/vue`, `@ai-sdk/solid` separately
- **experimental_StreamData → StreamData**
- **useChat hook**:
  - `streamMode` → `streamProtocol`
  - Remove `experimental_maxAutomaticRoundtrips`, `maxAutomaticRoundtrips`, `maxToolRoundtrips` - use `maxSteps` (value = roundtrips + 1)
  - Remove `options` parameter - use `headers` and `body` directly
  - `experimental_addToolResult()` → `addToolResult()`
  - `keepLastMessageOnError` defaults to `true` and is deprecated
- **useCompletion hook**: `streamMode` → `streamProtocol`
- **useAssistant hook**: Remove `experimental_useAssistant` export, use `useAssistant` directly. Remove `threadId` and `messageId` parameters from `AssistantResponse` callback - use outer scope variables. Remove `experimental_AssistantResponse` export
- **useObject hook**: Replace `setInput()` with `submit()`

## AI SDK Errors

- **isXXXError static methods**: Replace `APICallError.isAPICallError(error)` with `APICallError.isInstance(error)`
- **toJSON method**: Removed

## AI SDK 2.x Legacy Removals

- Legacy providers removed - use new provider architecture
- Legacy `function_call` and `tools` options removed from `useChat` and `Message` - use AI SDK Core tool calling
- Prompt helpers removed
- `AIStream` function removed - use `streamText().toDataStream()`
- `StreamingTextResponse` removed - use `streamText().toDataStreamResponse()`
- `streamToResponse` removed - use `streamText().pipeDataStreamToResponse()`
- RSC `Tokens` streaming removed

### migrate_3.3_to_3.4
AI SDK 3.3 to 3.4 upgrade has no breaking changes.

This migration guide covers upgrading from AI SDK version 3.3 to 3.4. The release contains no breaking changes, meaning existing code will continue to work without modifications. For detailed information about new features and improvements in this release, refer to the AI SDK 3.4 release blog post.

### migrate_ai_sdk_3.2_to_3.3
3.2→3.3 upgrade: no breaking changes; adds OpenTelemetry, useObject hook, useChat enhancements (attachments, streaming tool calls, onFinish), JSON schema support, AWS Bedrock, LangChain StreamEvent v2, UI framework expansions.

## New Features

**OpenTelemetry Support**: Experimental OpenTelemetry support added to all AI SDK Core functions for observability and tracing.

**AI SDK UI Improvements**:
- `useObject` hook (React) for streaming structured data with `streamObject` backend
- `useChat` enhancements: experimental attachments and streaming tool calls support, prevention of empty submissions, fixed `reload` function for proper data/body/headers transmission
- `setThreadId` helper for `useAssistant` to simplify thread management
- Stream data protocol documentation for `useChat` and `useCompletion`, enabling use with any backend and custom frontends with `streamText`
- Custom fetch functions and request body customization support
- `onFinish` callback to `useChat` hook for token usage and finish reason access

**Core Enhancements**:
- Custom request headers support
- Raw JSON schema support alongside Zod
- Usage information for `embed` and `embedMany` functions
- Additional settings: `stopSequences` and `topK` for finer text generation control
- Access to all steps information on `generateText` including intermediate tool calls and results

**New Providers**: AWS Bedrock provider added.

**Provider Improvements**:
- Anthropic, Google, Azure, OpenAI: various improvements and bug fixes
- LangChain adapter: StreamEvent v2 support and `toDataStreamResponse` function for converting LangChain output streams to data stream responses
- OpenAI provider: legacy function calling support
- Mistral AI provider: tool calling support fixes and improvements

**UI Framework Support Expansion**:
- SolidJS: `useChat` and `useCompletion` feature parity with React
- Vue.js: `useAssistant` hook introduced
- Vue.js/Nuxt: updated examples with latest features
- Svelte: tool calling support added to `useChat`

**Fixes and Improvements**: Various race conditions, error handling, and state management issues resolved across SDK components.

**No breaking changes** in this release.

### migrate_ai_sdk_3.1_to_3.2
3.1→3.2: StreamingReactResponse removed, nanoid deprecated (use generateId), Svelte/Vue/Solid UI moved to @ai-sdk/* packages

## Breaking Changes

**Removed Functionality:**
- Experimental `StreamingReactResponse` has been removed. Use AI SDK RSC instead to build streaming UIs.

**Deprecated Functionality:**
- `nanoid` export is deprecated. Use `generateId` instead.

## UI Package Separation

UI framework integrations (Svelte, Vue.js, SolidJS) have moved to separate Node modules. Update imports:
- `ai/svelte` → `@ai-sdk/svelte`
- `ai/vue` → `@ai-sdk/vue`
- `ai/solid` → `@ai-sdk/solid`

React and RSC integrations remain in the main package. Old exports still work but will be removed in a future release.

## Installation

Update to version 3.2:
```
pnpm add ai@latest
```

### migrate_ai_sdk_3.0_to_3.1
Upgrade to 3.1 with `pnpm add ai@3.1`; migrate from provider SDKs to unified AI SDK Core API using streamText; migrate render to streamUI with AI SDK providers, replacing provider/model params and render/generate tool keys.

## Upgrading to AI SDK 3.1

Run `pnpm add ai@3.1` to update.

## Key Changes

AI SDK 3.1 introduces two major features:
1. **AI SDK Core**: A unified API for interacting with LLMs across any provider implementing the AI SDK Language Model Specification
2. **streamUI**: A new abstraction built on AI SDK Core for building streaming UIs

## Migrating from Legacy Providers to AI SDK Core

**Before (using provider SDK directly):**
```tsx
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1',
    stream: true,
    messages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

**After (using AI SDK Core):**
```tsx
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages,
  });
  return result.toUIMessageStreamResponse();
}
```

The new approach provides a unified API that works with any compatible provider.

## Migrating from `render` to `streamUI`

**Before (using render with OpenAI SDK):**
```tsx
import { render } from '@ai-sdk/rsc';
import OpenAI from 'openai';
import { z } from 'zod';
import { Spinner, Weather } from '@/components';
import { getWeather } from '@/utils';

const openai = new OpenAI();

async function submitMessage(userInput = 'What is the weather in SF?') {
  'use server';
  return render({
    provider: openai,
    model: 'gpt-4.1',
    messages: [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: userInput },
    ],
    text: ({ content }) => <p>{content}</p>,
    tools: {
      get_city_weather: {
        description: 'Get the current weather for a city',
        parameters: z.object({ city: z.string().describe('the city') }).required(),
        render: async function* ({ city }) {
          yield <Spinner />;
          const weather = await getWeather(city);
          return <Weather info={weather} />;
        },
      },
    },
  });
}
```

**After (using streamUI with AI SDK provider):**
```tsx
import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { Spinner, Weather } from '@/components';
import { getWeather } from '@/utils';

async function submitMessage(userInput = 'What is the weather in SF?') {
  'use server';
  const result = await streamUI({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'You are a helpful assistant',
    messages: [{ role: 'user', content: userInput }],
    text: ({ content }) => <p>{content}</p>,
    tools: {
      get_city_weather: {
        description: 'Get the current weather for a city',
        parameters: z.object({ city: z.string().describe('Name of the city') }).required(),
        generate: async function* ({ city }) {
          yield <Spinner />;
          const weather = await getWeather(city);
          return <Weather info={weather} />;
        },
      },
    },
  });
  return result.value;
}
```

Key differences: `streamUI` uses AI SDK providers instead of provider SDKs, replaces `provider` parameter with `model`, uses `system` instead of system message in messages array, and replaces `render` key with `generate` in tool definitions.

