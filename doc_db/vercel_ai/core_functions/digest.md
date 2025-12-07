## Core Functions Reference

AI SDK Core provides four main functions for LLM integration:

**Text Generation:**
- `generateText()`: Non-interactive text generation (automation, email drafting, summarization, agents). Returns complete text with callbacks `onFinish`, `onError`.
- `streamText()`: Interactive streaming with backpressure. Streams text as generated. Supports `onError`, `onChunk`, `onFinish` callbacks. Access all events via `fullStream` property with types: `start`, `text-start`, `text-delta`, `text-end`, `reasoning-start/delta/end`, `source`, `file`, `tool-call`, `tool-input-start/delta/end`, `tool-result`, `tool-error`, `finish-step`, `finish`, `error`, `raw`.

**Structured Data Generation:**
- `generateObject()`: Generates typed objects matching Zod/Valibot/JSON schemas. Supports output strategies: `object` (default), `array`, `enum`, `no-schema`. Throws `NoObjectGeneratedError` with preserved text, response, usage, cause. Experimental `experimental_repairText` for JSON repair.
- `streamObject()`: Streams structured objects. Use `elementStream` for arrays, `partialObjectStream` for objects. Errors part of stream via `onError`.

**Tool Calling:**
Tools are objects with `description`, `inputSchema` (Zod/JSON), optional `execute` async function. Pass as object with tool names as keys.

Multi-step tool calls via `stopWhen` (e.g., `stepCountIs(5)`). Callbacks: `onStepFinish({ text, toolCalls, toolResults, finishReason, usage })`, `prepareStep({ model, stepNumber, steps, messages })` for modifying settings per step.

Tool choice control: `auto` (default), `required`, `none`, `{ type: 'tool', toolName }`.

Tool execution receives second parameter with: `toolCallId`, `messages` (history), `abortSignal`, `experimental_context`.

Dynamic tools via `dynamicTool()` for unknown schemas. Type-safe handling with `toolCall.dynamic` flag.

Preliminary results: return `AsyncIterable` from `execute()` to stream multiple results.

Tool input lifecycle hooks (streamText only): `onInputStart`, `onInputDelta`, `onInputAvailable`.

Error handling: `NoSuchToolError`, `InvalidToolInputError`, `ToolCallRepairError`. Tool execution errors appear as `tool-error` parts in steps.

Experimental `experimental_repairToolCall` to fix invalid calls without additional steps.

Active tools: limit available tools via `activeTools: ['toolName']` while maintaining static typing.

Multi-modal tool results (Anthropic/OpenAI): use optional `toModelOutput` function to convert results to content parts.

Helper types: `TypedToolCall<typeof toolSet>`, `TypedToolResult<typeof toolSet>` for type-safe definitions outside generateText/streamText.

**MCP Tools:**
Connect to Model Context Protocol servers via `experimental_createMCPClient()` with transport options: HTTP (recommended), SSE, stdio, or custom.

Schema discovery: `await mcpClient.tools()` lists all server tools. Schema definition: explicit type-safe definitions via `schemas` parameter.

Resources: `listResources()`, `readResource({ uri })`, `listResourceTemplates()`.

Prompts: `listPrompts()`, `getPrompt({ name, arguments })`.

Elicitation: enable with `capabilities: { elicitation: {} }`, register handler via `onElicitationRequest()`.

**Common Settings:**
- Output: `maxOutputTokens`, `temperature` (0=deterministic), `topP`, `topK`, `stopSequences`, `seed`
- Penalties: `presencePenalty`, `frequencyPenalty`
- Request: `maxRetries` (default 2), `abortSignal` (for timeout/cancellation), `headers` (HTTP requests)

**Embeddings:**
- `embed()`: Single value embedding
- `embedMany()`: Batch embedding with `maxParallelCalls` concurrency control
- `cosineSimilarity()`: Calculate similarity between vectors
- Configuration: `providerOptions`, `maxRetries`, `abortSignal`, `headers`

**Reranking:**
`rerank()` reorders documents by query relevance. Returns `ranking` array with `{ originalIndex, score, document }` and `rerankedDocuments`. Supports string/JSON documents, `topN` limiting, provider options, retries, abort signals, headers.

**Image Generation:**
`experimental_generateImage()` generates images from text. Supports `size` (e.g., '1024x1024') or `aspectRatio` (e.g., '16:9'). Batch generation via `n` parameter with automatic request batching. Seed for reproducibility. Provider options, abort signals, headers. Returns `image` (single) or `images` (batch) with `base64`, `uint8Array`. Error: `NoImageGeneratedError`.

**Transcription:**
`experimental_transcribe()` transcribes audio to text. Audio input: Uint8Array, ArrayBuffer, Buffer, base64 string, or URL. Returns `text`, `segments` (with timestamps), `language`, `durationInSeconds`. Provider options, abort signals, headers, warnings. Error: `NoTranscriptGeneratedError`.

**Speech Generation:**
`experimental_generateSpeech()` converts text to audio. Configurable `voice`, `language`. Returns `audioData` (Uint8Array). Provider options, abort signals, headers, warnings. Error: `NoSpeechGeneratedError`.

**Prompt Engineering Tips:**
- Use strong tool-calling models (gpt-4, gpt-4.1)
- Keep tool count ≤5, minimal parameter complexity
- Use meaningful names for tools, parameters, properties
- Add `.describe("...")` to Zod schema properties
- Document tool output in description when unclear
- Include JSON examples of tool calls in prompts

Zod schema patterns:
- Dates: use `z.string().date().transform(v => new Date(v))` (models return strings)
- Optional params: use `.nullable()` instead of `.optional()` for strict validation
- Temperature: use `temperature: 0` for deterministic tool calls and object generation

**Debugging:**
- Check `result.warnings` for provider support
- Inspect raw requests via `result.request.body`

**Middleware:**
Wrap models with `wrapLanguageModel({ model, middleware })` to intercept/modify calls. Built-in: `extractReasoningMiddleware`, `simulateStreamingMiddleware`, `defaultSettingsMiddleware`. Custom implementations via `transformParams`, `wrapGenerate`, `wrapStream`. Examples: logging, caching, RAG, guardrails. Pass per-request metadata via `providerOptions`.

**Provider Management:**
- Custom providers: `customProvider()` for pre-configured settings, aliases, model limits
- Provider registry: `createProviderRegistry()` for managing multiple providers, access via string IDs (e.g., 'openai:gpt-5.1')
- Global default: set `globalThis.AI_SDK_DEFAULT_PROVIDER`

**Error Handling:**
- Regular errors: try/catch
- Streaming errors (simple): try/catch
- Full streams: switch on `part.type` for `error`, `abort`, `tool-error`
- Stream abort: `onAbort({ steps })` callback for cleanup

**Testing:**
Mock providers from `ai/test`: `MockLanguageModelV3`, `MockEmbeddingModelV3`. Test helpers: `mockId`, `mockValues`, `simulateReadableStream` for deterministic unit testing without calling real providers.

**Telemetry:**
OpenTelemetry integration via `experimental_telemetry: { isEnabled: true }`. Control input/output recording with `recordInputs`, `recordOutputs`. Provide `functionId` and `metadata` for context. Custom `tracer` for different TracerProvider. Records spans for text/object generation, embedding with detailed attributes: model, tokens, responses, tool calls, timing.