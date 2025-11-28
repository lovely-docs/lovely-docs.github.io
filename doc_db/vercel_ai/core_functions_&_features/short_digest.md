## Core Functions

**generateText**: Non-interactive text generation returning complete response with text, usage, toolCalls, sources, reasoning.

**streamText**: Interactive streaming with textStream, fullStream events, and callbacks (onFinish, onError, onChunk).

**generateObject/streamObject**: Schema-validated structured output with Zod/Valibot schemas. Supports object/array/enum/no-schema strategies.

## Tool Calling

Define tools with description, inputSchema, execute function. Multi-step calls via `stopWhen`. Tool choice control, execution options (toolCallId, messages, abortSignal), input lifecycle hooks, dynamic tools, preliminary results, error handling, repair strategies, active tools, multi-modal results, MCP integration.

## Other Core Functions

**embed/embedMany**: Text to vector embeddings with cosineSimilarity for measuring similarity.

**rerank**: Reorder documents by query relevance.

**generateImage**: Generate images from text prompts with size/seed/batch control.

**transcribe**: Audio to text conversion.

**generateSpeech**: Text to audio conversion.

## Configuration & Utilities

Common settings: maxOutputTokens, temperature, topP, topK, seed, penalties, maxRetries, abortSignal, headers.

Middleware: Intercept/modify LLM calls via wrapLanguageModel with transformParams/wrapGenerate/wrapStream.

Provider management: Custom providers, provider registry with `providerId:modelId` format, global provider configuration.

Error handling: try/catch for regular errors, onError callback or fullStream error parts for streaming, onAbort for stream cleanup.

Testing: MockLanguageModelV3, MockEmbeddingModelV3, mockId, mockValues, simulateReadableStream.

Telemetry: OpenTelemetry collection with experimental_telemetry option.

Prompt engineering: Use strong models, keep tools ≤5, meaningful names, .describe() for properties, temperature: 0 for determinism.

MCP: Connect to servers for tools, resources, prompts; handle elicitation requests.
