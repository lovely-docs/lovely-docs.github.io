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