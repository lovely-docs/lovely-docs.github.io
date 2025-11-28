## Versioning & API Stability

**Version Format**: `MAJOR.MINOR.PATCH`
- **Stable APIs**: Production-ready, backward compatible, breaking changes only in major releases
- **Experimental APIs**: Prefixed with `experimental_`, can change in any release, pin exact versions
- **Deprecated APIs**: Marked as `deprecated`, removed in future major versions with migration guides and codemods

## Major Version Migrations

### 4.x → 5.0
**Message Structure**: `content`/`reasoning`/`toolInvocations` → `parts` array with typed objects
- v4: `{ content: "text", reasoning: "...", toolInvocations: [...] }`
- v5: `{ parts: [{ type: 'text', text: "..." }, { type: 'reasoning', text: "..." }, { type: 'tool-${name}', input: {...}, output: {...} }] }`

**Core API Changes**:
- `maxTokens` → `maxOutputTokens`
- `CoreMessage` → `ModelMessage`, `Message` → `UIMessage`
- `parameters` → `inputSchema` in tools
- `args`/`result` → `input`/`output` in tool calls
- Tool states: `partial-call` → `input-streaming`, `call` → `input-available`, `result` → `output-available`
- `maxSteps` → `stopWhen` with conditions: `stepCountIs(n)`, `hasToolCall('toolName')`, or custom function
- Stream protocol: single chunks → start/delta/end pattern with IDs
- Data stream → Server-Sent Events (SSE)
- `step.reasoning` → `step.reasoningText`

**UI Changes**:
- `ai/rsc` → `@ai-sdk/rsc`, `ai/react` → `@ai-sdk/react`
- `useChat`: `initialMessages` → `messages`, `append()` → `sendMessage()`, `reload()` → `regenerate()`
- Transport architecture: `api`/`credentials`/`headers` → `transport: new DefaultChatTransport({...})`
- `addToolResult()` → `addToolOutput()` with `tool` name and `output` parameter
- `isLoading` → `status`

**Data Migration** (two-phase approach):
1. **Phase 1 (Runtime Conversion)**: Add conversion layer without schema changes
   ```typescript
   // Install v4 types alongside v5
   { "dependencies": { "ai": "^5.0.0", "ai-legacy": "npm:ai@^4.3.2" } }
   
   // Convert on read/write
   const messages = rawMessages.map(msg => convertV4MessageToV5(msg));
   await db.insert(messages).values(convertV5MessageToV4(message));
   ```

2. **Phase 2 (Schema Migration)**: Create `messages_v5` table, dual-write, batch migrate, switch reads, drop old table

### 3.4 → 4.0
- `baseUrl` → `baseURL`
- Remove `await` from `streamText`/`streamObject`
- `maxToolRoundtrips` → `maxSteps` (value = roundtrips + 1)
- `roundtrips` → `steps`
- `ExperimentalMessage` → `ModelMessage`
- `toAIStream()` → `toDataStream()`
- `rawResponse` → `response`
- Error methods: `isXXXError()` → `isInstance()`
- Framework exports split: `ai/svelte` → `@ai-sdk/svelte`, `ai/vue` → `@ai-sdk/vue`

### 4.1 → 4.2
- Stabilize APIs: remove `experimental_` prefix from `customProvider`, `providerOptions`, `toolCallStreaming`
- Require `zod ^3.23.8`
- Message structure: combine assistant messages into single message with `parts` array instead of separate properties
  ```javascript
  // Before: message.content, message.reasoning, message.toolInvocations
  // After: message.parts = [
  //   { type: 'text', text: '...' },
  //   { type: 'reasoning', reasoning: '...' },
  //   { type: 'tool-invocation', toolInvocation: {...} }
  // ]
  ```

### 5.0 → 6.0 Beta
- Update packages to `@beta` versions: `ai@6.0.0-beta`, `@ai-sdk/provider@3.0.0-beta`, `@ai-sdk/provider-utils@4.0.0-beta`, `@ai-sdk/*@3.0.0-beta`
- Introduces agents and tool approval features
- Codemods available for automatic transformations

## Minor Version Migrations

**3.3 → 3.4**: No breaking changes
**4.0 → 4.1**: No breaking changes
**3.1 → 3.2**: 
- `StreamingReactResponse` removed, use AI SDK RSC
- `nanoid` deprecated, use `generateId`
- UI frameworks moved to separate packages: `@ai-sdk/svelte`, `@ai-sdk/vue`, `@ai-sdk/solid`

**3.2 → 3.3**: No breaking changes (adds OpenTelemetry, `useObject` hook, attachments, streaming tool calls)

**3.0 → 3.1**: Migrate from provider SDKs to unified AI SDK Core API
- Replace provider SDK calls with `streamText` using AI SDK providers
- Replace `render` with `streamUI`, use `generate` instead of `render` in tool definitions

## Migration Process

1. Backup and commit all changes
2. Upgrade packages to target versions
3. Run codemods: `npx @ai-sdk/codemod upgrade`
4. Manually address remaining breaking changes
5. Verify and commit

## Provider-Specific Changes

**OpenAI 5.0**: Default instance now uses Responses API; use `openai.chat()` for Chat Completions API
**Google 5.0**: Search grounding: `useSearchGrounding: true` → `tools: { google_search: google.tools.googleSearch({}) }`
**Amazon Bedrock 5.0**: Provider options: snake_case → camelCase (e.g., `reasoning_config` → `reasoningConfig`)