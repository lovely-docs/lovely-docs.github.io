## Core Functions

**Text Generation**
- `generateText()`: Non-interactive generation with tool calling, structured outputs. Returns text, tool calls, reasoning, token usage, step history.
- `streamText()`: Streams text with tools and structured outputs.

**Structured Output**
- `generateObject()`: Generates typed objects/arrays/enums from Zod or JSON schemas.
- `streamObject()`: Streams structured objects with partial updates.

**Embeddings & Retrieval**
- `embed()`, `embedMany()`: Generate embeddings with automatic chunking.
- `rerank()`: Reranks documents by semantic relevance (0-1 scores).

**Multimodal**
- `generateImage()`, `transcribe()`, `generateSpeech()`: Image generation, audio-to-text, text-to-speech (experimental).

**Agents & Tools**
- `ToolLoopAgent`: Multi-step autonomous agent with tool calling loop.
- `tool()`: TypeScript helper for type-safe tool definitions.
- `dynamicTool()`: Tools with runtime-determined types for MCP/external tools.
- `createAgentUIStream()`, `createAgentUIStreamResponse()`: Stream agent output as UI messages.

**MCP Integration**
- `experimental_createMCPClient()`: Creates MCP client with tool/resource/prompt access. Configure transport (stdio/SSE/HTTP).

**Schema & Validation**
- `jsonSchema()`, `zodSchema()`, `valibotSchema()`: Create/convert typed schemas.
- `ModelMessage`: Four types (system, user, assistant, tool) with multimodal parts.
- `UIMessage`: Type-safe interface for UI rendering with metadata and tool interactions.
- `validateUIMessages()`, `safeValidateUIMessages()`: Message validation.

**Provider Registry**
- `createProviderRegistry()`: Centralized registry for multiple providers via `providerId:modelId`.
- `customProvider()`: Maps model IDs to LanguageModel/EmbeddingModel/ImageModel instances.

**Utilities**
- `cosineSimilarity()`: Cosine similarity between vectors (-1 to 1).
- `wrapLanguageModel()`: Middleware for intercepting model calls (transformParams, wrapGenerate, wrapStream).
- `extractReasoningMiddleware()`, `simulateStreamingMiddleware()`, `defaultSettingsMiddleware()`: Common middleware patterns.
- `stepCountIs()`, `hasToolCall()`: Stop conditions for tool loops.
- `smoothStream()`: TransformStream for text streaming with word/line/regex/custom chunking.
- `generateId()`, `createIdGenerator()`: ID generation with customizable options.

## UI Hooks & Utilities

**Streaming Hooks**
- `useChat`: Conversational UI with streaming, tool calling, automatic state management. Supports `sendAutomaticallyWhen` for resubmission.
- `useCompletion`: Text completion with streaming, form handlers, custom fetch/headers.
- `useObject`: Streams and parses JSON objects matching Zod/JSON schema (experimental).

**Message Transformation**
- `convertToModelMessages()`: Transforms UI messages to ModelMessage for backend functions. Supports multi-modal tool responses.
- `pruneMessages()`: Filters messages to reduce token count (remove reasoning, tool calls, empty messages).

**Stream Creation**
- `createUIMessageStream()`: ReadableStream<UIMessageChunk> with writer API, error handling, onFinish callbacks.
- `createUIMessageStreamResponse()`: Wraps UIMessageStream in HTTP Response.
- `readUIMessageStream()`: Converts UIMessageChunk streams to AsyncIterableStream<UIMessage>.

**Type Helpers**
- `InferUITools`, `InferUITool`: Extract input/output types from tools for type-safe handling.

## RSC API Reference

**Streaming**
- `streamUI()`: Streams LLM-generated React UI with tool support. Returns ReactNode and AsyncIterable of events.
- `createStreamableUI()`, `createStreamableValue()`: Server-to-client streaming with `update()`, `append()`, `done()`.

**State Management**
- `createAI()`: Context provider with server actions, initial states, SSR/persistence callbacks.
- `getAIState()`, `getMutableAIState()`: Access/update AI state server-side.
- `useAIState()`, `useUIState()`: Hooks for client-side state management.
- `useActions()`: Access patched Server Actions from clients.

**Consumption**
- `readStreamableValue()`: Async iterator for server-streamed values.
- `useStreamableValue()`: Hook consuming streamable values, returns `[data, error, pending]`.

**Message Types**
- CoreSystemMessage, CoreUserMessage, CoreAssistantMessage, CoreToolMessage with multimodal parts.

**Tool Definition**
```ts
{ description?: string, parameters: zod schema, generate?: (async (parameters) => ReactNode) | AsyncGenerator<ReactNode, ReactNode, void> }
```

## Error Reference

All errors implement `isInstance()` static method for type checking.

**API & Network**: APICallError, DownloadError, LoadAPIKeyError, LoadSettingError
**Response**: EmptyResponseBodyError, InvalidResponseDataError, JSONParseError
**Input Validation**: InvalidArgumentError, InvalidPromptError, InvalidMessageRoleError, InvalidDataContentError, InvalidToolInputError, TypeValidationError
**Generation**: NoContentGeneratedError, NoObjectGeneratedError, NoImageGeneratedError, NoSpeechGeneratedError, NoTranscriptGeneratedError
**Model & Tool**: NoSuchModelError, NoSuchProviderError, NoSuchToolError, ToolCallRepairError
**Other**: MessageConversionError, RetryError, TooManyEmbeddingValuesForCallError, UnsupportedFunctionalityError

**Error Detection**
```typescript
import { APICallError, InvalidPromptError } from 'ai';

try {
  // operation
} catch (error) {
  if (APICallError.isInstance(error)) {
    console.log(error.statusCode, error.url);
  }
}
```