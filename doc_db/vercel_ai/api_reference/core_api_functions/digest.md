## Text Generation
- `generateText()`: Non-streaming text generation with tool calling, structured outputs, multi-step generation via callbacks. Supports messages/prompt, tools with Zod/JSON schemas, generation parameters (temperature, topP, topK, penalties, seed), output modes (text/object/array/choice/json), and callbacks (onStepFinish, onFinish).
- `streamText()`: Streaming variant returning textStream, fullStream (with tool calls/results/errors), partialOutputStream for structured outputs. Same parameters as generateText plus experimental_transform for stream processing.

## Structured Data
- `generateObject()`: Forces models to return validated structured data. Supports output modes: object (default), array, enum, no-schema. Parameters include schema (Zod/JSON), schemaName/Description, mode (auto/json/tool), system/messages, generation controls, and returns typed object with usage/metadata.
- `streamObject()`: Streaming structured output with partialObjectStream (partial objects as they stream), elementStream (for array mode), textStream, fullStream. Same modes and parameters as generateObject.

## Embeddings
- `embed()`: Single value embedding returning embedding vector and usage tokens.
- `embedMany()`: Multiple values with automatic request chunking for models with embedding limits. Returns embeddings array in same order as inputs.

## Reranking
- `rerank()`: Rerank documents by semantic relevance to query. Returns ranking array with originalIndex/score/document, rerankedDocuments sorted by relevance, and response metadata.

## Experimental Features
- `generateImage()`: Image generation from text prompts. Parameters: model, prompt, n (count), size (WxH), aspectRatio, seed. Returns image/images (GeneratedFile with base64/uint8Array/mediaType), warnings, providerMetadata.
- `transcribe()`: Audio-to-text transcription. Returns text, segments (with timing), language code, durationInSeconds, warnings, response metadata.
- `generateSpeech()`: Text-to-speech with voice/outputFormat/speed/language/instructions parameters. Returns audio (GeneratedAudioFile with base64/uint8Array/mimeType/format), warnings, responses.

## Agents
- `Agent` interface: Contract with version/id/tools properties, generate() and stream() methods accepting prompt/messages with optional call options and abortSignal.
- `ToolLoopAgent`: Multi-step agent class with configurable stop conditions (stepCountIs, hasToolCall), structured output parsing, tool calling loop. Constructor accepts model, instructions, tools, toolChoice, stopWhen, activeTools, output, prepareStep, callbacks, generation parameters.
- `createAgentUIStream()`: Runs agent and returns async iterable of UI message chunks. Validates/converts messages, invokes agent.stream(), supports AbortSignal.
- `createAgentUIStreamResponse()`: Executes agent and streams output as HTTP Response with UI messages. Server-side only.
- `pipeAgentUIStreamToResponse()`: Pipes agent UI message stream to Node.js ServerResponse for low-latency streaming. Node.js-only.

## Tools
- `tool()`: Helper enabling TypeScript type inference for tool definitions. Connects inputSchema to execute method. Parameters: description, inputSchema (Zod/JSON), execute (async function receiving input and ToolCallOptions), outputSchema, toModelOutput, onInputStart/Delta/Available, providerOptions, type (function/provider-defined), id, name, args.
- `dynamicTool()`: Creates tools with unknown types determined at runtime. Returns Tool<unknown, unknown> with type: 'dynamic'. Useful for MCP tools, user-defined functions, external sources.

## MCP (Model Context Protocol)
- `createMCPClient()`: Lightweight MCP client factory. Methods: tools(), listResources(), readResource(), listResourceTemplates(), listPrompts(), getPrompt(), onElicitationRequest(), close(). Configuration: transport (MCPTransport/MCPTransportConfig), name, onUncaughtError, capabilities.
- `Experimental_StdioMCPTransport`: Stdio-based MCP transport for Node.js. Configuration: command (required), args, env, stderr, cwd.

## Schemas
- `jsonSchema()`: Creates JSON schema objects with optional validation function. Alternative to Zod for dynamic schemas or OpenAPI definitions.
- `zodSchema()`: Converts Zod schemas to JSON schema. Supports useReferences option for recursive schemas via z.lazy(). Critical: metadata methods (.meta(), .describe()) must be last in chain.
- `valibotSchema()`: Experimental helper converting Valibot schemas to AI SDK-compatible JSON schemas.

## Messages
- `ModelMessage`: Fundamental message structure with types: SystemModelMessage (role: system, content: string), UserModelMessage (role: user, content: string | TextPart/ImagePart/FilePart array), AssistantModelMessage (role: assistant, content: string | TextPart/ToolCallPart array), ToolModelMessage (role: tool, content: ToolResultPart array). Content parts: TextPart, ImagePart (base64/Uint8Array/Buffer/URL with optional mediaType), FilePart (data + mediaType), ToolCallPart (toolCallId/toolName/args), ToolResultPart (toolCallId/toolName/output with type: text/json/execution-denied/error-text/error-json/content).
- `UIMessage`: Type-safe message container for UI state with id, role, optional metadata, polymorphic parts (text, reasoning, tool invocations, files, sources, custom data, step markers). Generic parameters: METADATA, DATA_PARTS, TOOLS. Parts: TextUIPart, ReasoningUIPart, ToolUIPart (type: tool-{name}, states: input-streaming/input-available/output-available/output-error), SourceUrlUIPart, SourceDocumentUIPart, FileUIPart, DataUIPart (type: data-{name}), StepStartUIPart.
- `validateUIMessages()`: Async validator for UI message arrays with optional Zod schemas for metadata, data parts, tools. Throws on validation failure.
- `safeValidateUIMessages()`: Safe wrapper returning {success: boolean, data?: ValidatedMessages, error?: Error}.

## Providers
- `createProviderRegistry()`: Centralized registry for multiple providers. Access via providerId:modelId format (customizable separator). Methods: languageModel(id), embeddingModel(id), imageModel(id).
- `customProvider()`: Maps model IDs to custom LanguageModel/EmbeddingModel/ImageModel instances with optional fallback provider.

## Utilities
- `cosineSimilarity(vector1, vector2)`: Returns number [-1, 1] comparing embedding similarity.
- `wrapLanguageModel()`: Applies middleware to LanguageModelV3 instances. Parameters: model, middleware (single/array), optional modelId/providerId overrides.
- `LanguageModelV3Middleware`: Experimental middleware with transformParams, wrapGenerate, wrapStream hooks for intercepting model calls.
- `extractReasoningMiddleware()`: Extracts XML-tagged reasoning from generated text. Parameters: tagName (required), separator (default "\n"), startWithReasoning (default false).
- `simulateStreamingMiddleware()`: Converts non-streaming responses into simulated streams.
- `defaultSettingsMiddleware()`: Applies default language model settings (temperature, tokens, provider options) overridable per-call.
- `stepCountIs(count)`: Stop condition for tool loops, halts after specified step count.
- `hasToolCall(toolName)`: Stop condition triggering when named tool is invoked.
- `simulateReadableStream()`: Creates ReadableStream emitting array values with configurable initial and inter-chunk delays.
- `smoothStream()`: TransformStream for smoothing text streaming with configurable delays and chunking strategies (word/line/regex/callback). Handles non-space-delimited languages via custom regex.
- `generateId()`: Generates unique 16-char ID string (size parameter deprecated).
- `createIdGenerator()`: Customizable ID generator with configurable prefix, separator, alphabet, size. Uses non-secure randomization.