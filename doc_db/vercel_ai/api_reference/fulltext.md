
## Directories

### core_api_reference
Complete API reference for text generation, structured outputs, embeddings, agents, tools, MCP integration, schema validation, and provider management.

## Text Generation
- **generateText()**: Non-interactive text generation with tool calling, multi-step workflows, structured outputs. Returns text, tool calls, reasoning, token usage, and step history.
- **streamText()**: Streams text with tools and structured outputs. Returns promises (text, finishReason, usage) and streams (textStream, fullStream with all events).

## Structured Output
- **generateObject()**: Generates typed objects/arrays/enums from schemas (Zod or JSON). Supports object, array, enum, and no-schema modes.
- **streamObject()**: Streams structured objects with partial object stream and element stream for arrays.

## Embeddings & Retrieval
- **embed()**: Single value embedding generation.
- **embedMany()**: Multiple value embeddings with automatic request chunking.
- **rerank()**: Reranks documents by semantic relevance to query, returns ranking with scores (0-1).

## Multimodal
- **generateImage()**: Generates images from text prompts (experimental).
- **transcribe()**: Converts audio to text with segments and timing (experimental).
- **generateSpeech()**: Text-to-speech with voice and format options (experimental).

## Agents & Tools
- **Agent interface**: Contract with generate() and stream() methods for custom agents.
- **ToolLoopAgent**: Multi-step autonomous agent with tool calling loop, structured output parsing, type-safe UI message inference.
- **tool()**: TypeScript helper connecting inputSchema to execute for proper type inference.
- **dynamicTool()**: Tools with runtime-determined unknown input/output types for MCP or external tools.
- **createAgentUIStream()**: Streams agent output as async iterable UI messages.
- **createAgentUIStreamResponse()**: Returns HTTP Response with streamed UI messages.
- **pipeAgentUIStreamToResponse()**: Pipes agent UI stream to Node.js ServerResponse.

## MCP Integration
- **experimental_createMCPClient()**: Creates MCP client with tool/resource/prompt access. Configure transport (stdio/SSE/HTTP), call tools(), listResources(), readResource(), listPrompts(), getPrompt().
- **Experimental_StdioMCPTransport**: Stdio-based MCP transport for Node.js.

## Schema & Validation
- **jsonSchema()**: Creates typed JSON schema objects for structured generation.
- **zodSchema()**: Converts Zod schemas to JSON schemas with recursive schema support via useReferences.
- **valibotSchema()**: Converts Valibot schemas to JSON schemas (experimental).
- **ModelMessage**: Four message types (system, user, assistant, tool) with multimodal parts (text, image, file, tool-call, tool-result).
- **UIMessage**: Type-safe message interface with metadata, data parts, and tool interactions for UI rendering.
- **validateUIMessages()**: Validates UI messages with custom schemas for metadata, data parts, tools.
- **safeValidateUIMessages()**: Non-throwing message validator returning {success, data|error}.

## Providers & Models
- **createProviderRegistry()**: Centralized registry for multiple providers accessed via `providerId:modelId` identifiers.
- **customProvider()**: Maps model IDs to LanguageModel/EmbeddingModel/ImageModel instances with optional fallback.

## Utilities
- **cosineSimilarity()**: Calculates cosine similarity between vectors (-1 to 1).
- **wrapLanguageModel()**: Wraps language model with middleware for enhanced behavior.
- **LanguageModelV3Middleware**: Experimental interface with transformParams, wrapGenerate, wrapStream for intercepting model calls.
- **extractReasoningMiddleware()**: Extracts XML-tagged reasoning from responses.
- **simulateStreamingMiddleware()**: Converts non-streaming responses to simulated streams.
- **defaultSettingsMiddleware()**: Applies default LanguageModelV3CallOptions to model calls.
- **stepCountIs()**: Stop condition for tool loops when step count reaches specified number.
- **hasToolCall()**: Stop condition for tool loops when specific tool is invoked.
- **simulateReadableStream()**: Creates ReadableStream emitting values sequentially with configurable delays.
- **smoothStream()**: TransformStream for smoothing text streaming with word/line/regex/custom chunking.
- **generateId()**: Generates unique ID strings.
- **createIdGenerator()**: Creates customizable ID generator with prefix, separator, alphabet, size options.

### ui_hooks_&_utilities
React/Svelte/Vue hooks and utilities for streaming conversational and completion UIs with message transformation, pruning, and type-safe tool handling.

## UI Hooks & Utilities

### Hooks for Streaming UI

**useChat** - Conversational UI hook with streaming support, automatic state management, and tool calling. Accepts optional ChatTransport for custom endpoints, initial messages, and callbacks for tool calls, finish events, and errors. Returns current messages, status, and methods to send/regenerate/stop messages and handle tool outputs. Supports automatic resubmission via `sendAutomaticallyWhen`.

**useCompletion** - Text completion hook with streaming. Manages input and completion state, provides form handlers (`handleInputChange`, `handleSubmit`), and supports custom fetch, headers, and stream protocols. Returns completion text, input value, loading state, and control methods.

**useObject** (experimental) - Streams and parses JSON objects matching a Zod or JSON schema. Accepts schema and API endpoint, returns partial object updates as they stream, with error and loading states.

### Message Conversion & Transformation

**convertToModelMessages** - Transforms useChat UI messages to ModelMessage objects for backend functions like `streamText`. Supports multi-modal tool responses via `toModelOutput` and custom data part conversion with type-safe generics for attachments (URLs, code files).

**pruneMessages** - Filters ModelMessage arrays to reduce token count. Configurable strategies: remove all/some reasoning, remove tool calls except in recent messages, remove empty messages.

### Stream Creation & Response

**createUIMessageStream** - Creates a ReadableStream<UIMessageChunk> with writer API for emitting chunks. Supports merging streams, error handling, and onFinish callbacks. Messages use consistent IDs across text-start/delta/end lifecycle.

**createUIMessageStreamResponse** - Wraps UIMessageStream in an HTTP Response object with custom status, headers, and optional SSE consumption callback.

**pipeUIMessageStreamToResponse** - Pipes UIMessageStream to Node.js ServerResponse with HTTP metadata.

**readUIMessageStream** - Converts UIMessageChunk streams to AsyncIterableStream<UIMessage> for terminal UIs, custom clients, and React Server Components.

### Type Helpers

**InferUITools** - TypeScript type helper extracting input/output types from a ToolSet for type-safe tool handling in UIMessages.

**InferUITool** - Extracts input/output types from a single tool.

### rsc_api_reference
Complete API reference for React Server Components integration with streaming UI, state management, and LLM tool execution.

## RSC API Reference

**Core Streaming Functions:**
- `streamUI`: Streams LLM-generated React UI with tool support. Accepts model, system prompt, messages, generation parameters, tools, and callbacks. Returns ReactNode value and AsyncIterable stream of text-delta, tool-call, error, and finish events.
- `createStreamableUI`: Server-to-client UI streaming with `update()`, `append()`, and `done()` methods. Initial UI optional.
- `createStreamableValue`: Wraps serializable values for server-to-client streaming with `update()` method.

**State Management:**
- `createAI`: Context provider factory accepting server actions, initial AI/UI states, SSR callback (`onGetUIState`), and persistence callback (`onSetAIState`).
- `getAIState()`: Retrieves current AI state, optionally extracting a specific key.
- `getMutableAIState()`: Returns mutable AI state with `update()` and `done()` methods for server-side updates.
- `useAIState()`: Hook reading/updating globally-shared AI state under `<AI/>` provider. Returns `[state]`.
- `useUIState()`: Hook for client-side UI state management. Returns `[state, setState]` tuple.

**Client-Side Consumption:**
- `readStreamableValue()`: Async iterator for consuming server-streamed values. Usage: `for await (const value of readStreamableValue(stream)) { ... }`
- `useStreamableValue()`: Hook consuming streamable values. Returns `[data, error, pending]` tuple.

**Server Action Access:**
- `useActions()`: Hook accessing patched Server Actions from clients. Returns `Record<string, Action>` dictionary.

**Message Types:**
- CoreSystemMessage: `{ role: 'system', content: string }`
- CoreUserMessage: `{ role: 'user', content: string | Array<TextPart | ImagePart | FilePart> }`
- CoreAssistantMessage: `{ role: 'assistant', content: string | Array<TextPart | ToolCallPart> }`
- CoreToolMessage: `{ role: 'tool', content: Array<ToolResultPart> }`

**Tool Definition:**
```ts
{ description?: string, parameters: zod schema, generate?: (async (parameters) => ReactNode) | AsyncGenerator<ReactNode, ReactNode, void> }
```

**Generation Parameters:** maxOutputTokens, temperature, topP, topK, presencePenalty, frequencyPenalty, stopSequences, seed

**Note:** AI SDK RSC is experimental. AI SDK UI recommended for production.

### error_reference
Comprehensive reference of all SDK error types with properties and isInstance() detection pattern.

## Error Types

All errors implement `isInstance()` static method for type checking.

### API & Network Errors
- **APICallError**: Failed API calls with `url`, `statusCode`, `responseHeaders`, `responseBody`, `isRetryable`, `requestBodyValues`
- **DownloadError**: Failed downloads with `url`, `statusCode`, `statusText`
- **LoadAPIKeyError**: API key loading failure
- **LoadSettingError**: Setting loading failure

### Response Errors
- **EmptyResponseBodyError**: Server returned empty response body
- **InvalidResponseDataError**: Server returned invalid response data with `data` property
- **JSONParseError**: JSON parsing failure with `text` property

### Input Validation Errors
- **InvalidArgumentError**: Invalid function argument with `parameter`, `value`
- **InvalidPromptError**: Invalid prompt (common: passing `UIMessage[]` instead of `ModelMessage[]`). Use `convertToModelMessages()` to fix
- **InvalidMessageRoleError**: Invalid message role with `role` property
- **InvalidDataContentError**: Invalid multi-modal message content with `content` property
- **InvalidToolInputError**: Invalid tool arguments with `toolName`, `toolInput`, `cause`
- **TypeValidationError**: Type validation failure with `value` property

### Generation Errors
- **NoContentGeneratedError**: AI provider failed to generate content
- **NoObjectGeneratedError**: Failed object generation with `text`, `response`, `usage`, `finishReason`, `cause`
- **NoImageGeneratedError**: Failed image generation with `responses`, `cause`
- **NoSpeechGeneratedError**: Failed audio generation with `responses`
- **NoTranscriptGeneratedError**: Failed transcript generation with `responses`

### Model & Tool Errors
- **NoSuchModelError**: Model ID not found with `modelId`, `modelType`
- **NoSuchProviderError**: Provider ID not found with `providerId`, `availableProviders`, `modelId`, `modelType`
- **NoSuchToolError**: Model called unavailable tool with `toolName`, `availableTools`
- **ToolCallRepairError**: Failed to auto-repair invalid tool call with `originalError`, `cause`

### Other Errors
- **MessageConversionError**: Message conversion failure with `originalMessage`
- **RetryError**: Retry operation failed with `reason`, `lastError`, `errors` array
- **TooManyEmbeddingValuesForCallError**: Embedding call exceeded limit with `provider`, `modelId`, `maxEmbeddingsPerCall`, `values`
- **UnsupportedFunctionalityError**: Unsupported feature with `functionality`

### Error Detection Pattern
```typescript
import { APICallError, InvalidPromptError } from 'ai';

try {
  // operation
} catch (error) {
  if (APICallError.isInstance(error)) {
    console.log(error.statusCode, error.url);
  } else if (InvalidPromptError.isInstance(error)) {
    console.log(error.cause);
  }
}
```


