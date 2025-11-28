## Foundations

**Generative AI & Models**: LLMs predict text sequences; embedding models convert data to vectors. 50+ standardized provider integrations (OpenAI, Anthropic, Google, Mistral, Groq, xAI, etc.) with varying capabilities.

**Prompts**: Text, system, and message prompts. Multi-modal content supports text, images (base64, binary, URL), and files (PDF, audio).

**Tools**: LLM-callable objects with description, inputSchema (Zod/JSON), and optional execute function. Ready-to-use packages: web search, Stripe, Composio (250+ tools), AWS Bedrock, MCP servers.

**Streaming**: `streamText` displays LLM response chunks incrementally as async iterable.

## Getting Started

**SDK Architecture**: Core (unified LLM API), UI (framework hooks), RSC (React Server Components streaming).

**Quick Start Pattern**:
1. API Route: `streamText()` → `toUIMessageStreamResponse()`
2. UI Component: `useChat()` hook
3. Messages: `{ id, role, parts: [{ type, ... }] }`

**Tools**: Define with `tool()` and Zod schemas. Multi-step via `stopWhen: stepCountIs(n)`.

**Framework Notes**: Next.js (App/Pages Router), Svelte/Vue (Chat class), Node.js (textStream iterator), Expo (DefaultChatTransport).

## Agents

**ToolLoopAgent**: Automates LLM-based task execution. Orchestrates tool calls in loops with configurable control flow.

```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are helpful.',
  tools: { weather: tool({...}) },
  stopWhen: stepCountIs(20),
});
const result = await agent.generate({ prompt: '...' });
```

**Configuration**: Loop control (stopWhen), tool choice (required/none/auto), structured output (Zod schema), system instructions.

**Usage**: `generate()` (one-time), `stream()` (chunks), `createAgentUIStreamResponse()` (client apps).

**Advanced**: `prepareStep` (modify per step), `callOptionsSchema` (type-safe runtime config), manual loop control.

**Workflow Patterns**: Sequential, routing, parallel, orchestrator-worker, evaluator-optimizer.

## Core Functions & Features

**Text Generation**:
- `generateText()`: Non-interactive with tool calls, structured outputs
- `streamText()`: Interactive streaming with textStream, fullStream, callbacks

**Structured Data**:
- `generateObject()`: Schema-validated output (Zod/Valibot/JSON)
- `streamObject()`: Streams with partialObjectStream or elementStream

**Tool Calling**: Define with description, inputSchema, execute. Multi-step via `stopWhen`. Tool choice control. Dynamic tools via `dynamicTool`. MCP integration.

**Embeddings**: `embed()` (single), `embedMany()` (batch), `cosineSimilarity()`.

**Reranking**: Reorder documents by relevance (0-1 scores).

**Multimodal**: `generateImage()`, `transcribe()`, `generateSpeech()`.

**Common Settings**: `maxOutputTokens`, `stopSequences`, `temperature`, `topP`, `topK`, `seed`, penalties, `maxRetries`, `abortSignal`.

**Middleware**: `wrapLanguageModel()` with `transformParams`, `wrapGenerate`, `wrapStream`. Built-in: `extractReasoningMiddleware`, `simulateStreamingMiddleware`, `defaultSettingsMiddleware`.

**Provider Management**: `customProvider()` for pre-configured settings. `createProviderRegistry()` for multiple providers.

**Error Handling**: Try/catch for regular errors. `onError` callback for streams. `onAbort` for cleanup.

**Testing**: `MockLanguageModelV3`, `MockEmbeddingModelV3`, test utilities.

**Telemetry**: OpenTelemetry collection (experimental).

## UI Toolkit

**Hooks**:
- `useChat`: Streaming chat with message state, tool integration, cancellation/regeneration
- `useCompletion`: Text completion streaming
- `useObject`: Structured JSON streaming (React/Svelte/Angular)

**Message Management**: `parts` property (text, tool calls, results, reasoning, sources, files). Status tracking. Metadata attachment. Persistence with validation.

**Tool Integration**: Server-side auto-execution or client-side `onToolCall`. User-interaction tools with state transitions. Type inference via `InferUITool`.

**Request Customization**: Hook-level or per-message options. Dynamic configuration. Custom transformation.

**Advanced**: UI throttling. Event callbacks. Reasoning tokens. Sources forwarding. Image generation. File attachments. Stream resumption with Redis. Custom data streaming.

**Chat Persistence**: Create chat with ID, load messages, validate, save in onFinish.

**Generative UI**: Tools return React components. Render based on tool part states (input-available, output-available, output-error).

**Transport**: `DefaultChatTransport` for HTTP POST. Customize endpoint, headers, credentials. Implement `ChatTransport` for custom protocols.

**Stream Protocols**: Text (plain chunks) or Data (SSE-based, default).

## React Server Components

**Core Abstractions**:
- `streamUI`: Calls model with tools returning React components
- `useUIState`/`useAIState`: Client hooks for visual and serializable state
- `useActions`: Client access to Server Actions
- `createAI`: Context provider with state management

**Streamable Values**: `createStreamableValue` (data), `createStreamableUI` (components) with `.update()`, `.done()`, `.error()`.

**State Management**: Split into AI State (serializable JSON) and UI State (client-only components). Persist with `onSetAIState`, restore with `initialAIState`.

**Patterns**: Streaming components with loading states (generator functions yield intermediate values). Multistep interfaces. Client interactions via `useActions`. Error handling with Error Boundary.

**Migration to AI SDK UI**: Separate generation (route handler) from rendering (client). Replace `streamUI` tools with `streamText` tools returning data. Render client-side based on `toolInvocations`. Use `useChat` instead of `useActions`.

## Advanced Patterns

**Prompt Engineering**: Clear instructions, examples, temperature tuning (0=deterministic, 1=random).

**Stream Management**: Cancellation via `abortSignal` with `onAbort`. Back-pressure via lazy evaluation with `ReadableStream.pull()`.

**Caching**: Language model middleware with `wrapGenerate`/`wrapStream`. Or `onFinish` callbacks with KV storage.

**UI Rendering & Routing**: Multiple streamables. Server-side rendering with `createStreamableUI()`. Language models as routers via function calling.

**Multistep Interfaces**: Tool composition. Rich conversation history.

**Sequential Generations**: Chain `generateText()` calls where outputs feed into next prompts.

**Rate Limiting**: Vercel KV + Upstash Ratelimit. Extract client IP, check limit, return HTTP 429.

**Deployment**: Next.js to Vercel. Set `maxDuration` for LLM timeouts. Add rate limiting and firewall.

## API Reference

**Core**: `generateText()`, `streamText()`, `generateObject()`, `streamObject()`, `embed()`, `embedMany()`, `rerank()`, `generateImage()`, `transcribe()`, `generateSpeech()`.

**Agents & Tools**: `ToolLoopAgent`, `tool()`, `dynamicTool()`, `createAgentUIStream()`, `createAgentUIStreamResponse()`.

**MCP**: `experimental_createMCPClient()` with stdio/SSE/HTTP transport.

**Schema**: `jsonSchema()`, `zodSchema()`, `valibotSchema()`, `ModelMessage`, `UIMessage`, `validateUIMessages()`.

**Provider Registry**: `createProviderRegistry()`, `customProvider()`.

**Utilities**: `cosineSimilarity()`, `wrapLanguageModel()`, middleware, `stepCountIs()`, `hasToolCall()`, `smoothStream()`, `generateId()`.

**UI Hooks**: `useChat`, `useCompletion`, `useObject`, `convertToModelMessages()`, `pruneMessages()`, `createUIMessageStream()`, `InferUITools`.

**RSC**: `streamUI()`, `createStreamableUI()`, `createStreamableValue()`, `createAI()`, `getAIState()`, `useAIState()`, `useUIState()`, `useActions()`, `readStreamableValue()`.

**Errors**: `APICallError`, `InvalidPromptError`, `NoObjectGeneratedError`, `NoSuchToolError`, `ToolCallRepairError`, etc. Use `.isInstance()` for type checking.

## Migration Guides

**4.x → 5.0**: Message structure `content`/`reasoning`/`toolInvocations` → `parts` array. `maxTokens` → `maxOutputTokens`. `parameters` → `inputSchema`. `maxSteps` → `stopWhen`. Stream protocol changes. UI: `initialMessages` → `messages`, `append()` → `sendMessage()`, `isLoading` → `status`. Two-phase data migration: runtime conversion then schema migration.

**3.4 → 4.0**: `baseUrl` → `baseURL`. Remove `await` from stream functions. `maxToolRoundtrips` → `maxSteps`. Error methods: `isXXXError()` → `isInstance()`. Framework exports split to separate packages.

**4.1 → 4.2**: Stabilize APIs (remove `experimental_` prefix). Require `zod ^3.23.8`. Message structure: combine into `parts` array.

**5.0 → 6.0 Beta**: Update to `@beta` versions. Introduces agents and tool approval.

**Minor versions**: Generally no breaking changes.

**Process**: Backup, upgrade packages, run codemods, manually address remaining changes, verify.

## Troubleshooting

**Streaming**: Azure OpenAI slow → use `smoothStream()`. Deployed streaming fails → add chunked/keep-alive headers. Proxied → disable compression. Timeouts → increase `maxDuration`. Unclosed streams → call `.done()`.

**useChat/useCompletion**: Failed to parse → set `streamProtocol: 'text'`. No response → convert messages with `convertToModelMessages()`. Custom headers/body/credentials → use `DefaultChatTransport`. Stale values → pass via `sendMessage()` options. Status shows but no text → check `lastMessage?.parts?.length`. Max update depth → use `experimental_throttle`.

**Tool Calling**: Missing result → add `execute` or provide via `addToolOutput`. Type errors → check `toolCall.dynamic`. With structured outputs → adjust `stopWhen`.

**Server Actions & RSC**: In Client Components → export from separate file with `"use server"`. Streamable UI errors → use `.tsx`. Plain objects error → use `createStreamableValue`.

**Stream Protocol**: Contains markers → use `toTextStreamResponse()` or pin SDK. Function calls not invoked → add stub `experimental_onFunctionCall`.

**Error Handling**: Generic errors → pass `getErrorMessage` or `onError`. Silent failures → use `onError` callback.

**Messages**: Repeated → pass `originalMessages` to `toUIMessageStreamResponse()`. onFinish not called on abort → add `consumeSseStream`.

**Schema & Types**: TypeScript crashes → upgrade Zod to 4.1.8+. OpenAI rejects `.nullish()` → use `.nullable()`. Unsupported model version → update SDK/providers. Type incompatibility → update to latest. Cannot find JSX namespace → install `@types/react`.

**Testing**: Jest cannot find RSC → add `moduleNameMapper`.

## AI SDK 6 Beta

**Agent Abstraction**: New unified `Agent` interface. `ToolLoopAgent` automatically handles tool execution loop (default 20 steps).

```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are helpful.',
  tools: { weather: weatherTool },
});
const result = await agent.generate({ prompt: '...' });
```

**Call Options**: Type-safe runtime configuration via Zod schemas. Use cases: RAG (inject documents), dynamic model selection, tool configuration.

```ts
const agent = new ToolLoopAgent({
  callOptionsSchema: z.object({ userId: z.string() }),
  prepareCall: ({ options }) => ({
    instructions: `User: ${options.userId}`,
  }),
});
agent.generate({ prompt: '...', options: { userId: 'user123' } });
```

**UI Integration**: `createAgentUIStreamResponse()` server-side, `useChat` + `InferAgentUIMessage` client-side.

**Custom Agents**: `Agent` is an interface. Implement for custom architectures (multi-agent orchestrators).

**Tool Execution Approval**: Set `needsApproval: true` or dynamic function. Client-side approval UI with `addToolApprovalResponse()`. Auto-submit with `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses`.

**Structured Output (Stable)**: Generate structured data with tool calling via `output` parameter.

```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: tool({...}) },
  output: Output.object({
    schema: z.object({ summary: z.string(), temperature: z.number() }),
  }),
});
const { output } = await agent.generate({ prompt: '...' });
```

**Output Types**: `Output.object()`, `Output.array()`, `Output.choice()`, `Output.text()`.

**Streaming Structured Output**: `agent.stream()` with `partialOutputStream`.

**Reranking Support**: Native reranking to reorder documents by query relevance.

```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['doc1', 'doc2', 'doc3'],
  query: 'relevant info',
  topN: 2,
});
```

Supports structured documents. Providers: Cohere, Amazon Bedrock, Together.ai.

**Image Editing**: Coming soon.

**Migration from 5.x**: Minimal breaking changes expected. Most code works with little modification. Beta now, stable end of 2025.