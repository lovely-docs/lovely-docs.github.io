## Core Functions

**Text Generation**
- `generateText()`: Non-streaming text generation with tool calling, structured outputs, multi-step generation via callbacks. Supports messages/prompt, tools with Zod/JSON schemas, generation parameters (temperature, topP, topK, penalties, seed), output modes (text/object/array/choice/json), callbacks (onStepFinish, onFinish).
- `streamText()`: Streaming variant returning textStream, fullStream (with tool calls/results/errors), partialOutputStream for structured outputs.

**Structured Data**
- `generateObject()`: Forces models to return validated structured data with output modes: object (default), array, enum, no-schema. Supports schema (Zod/JSON), schemaName/Description, mode (auto/json/tool), system/messages, generation controls.
- `streamObject()`: Streaming structured output with partialObjectStream, elementStream (for array mode), textStream, fullStream.

**Embeddings & Reranking**
- `embed()`: Single value embedding returning vector and usage tokens.
- `embedMany()`: Multiple values with automatic request chunking.
- `rerank()`: Rerank documents by semantic relevance to query, returns ranking array with originalIndex/score/document.

**Experimental: Media & Speech**
- `generateImage()`: Image generation from text prompts with parameters: model, prompt, n (count), size (WxH), aspectRatio, seed. Returns image/images (GeneratedFile with base64/uint8Array/mediaType).
- `transcribe()`: Audio-to-text transcription returning text, segments (with timing), language code, durationInSeconds.
- `generateSpeech()`: Text-to-speech with voice/outputFormat/speed/language/instructions parameters. Returns audio (GeneratedAudioFile with base64/uint8Array/mimeType/format).

## Agents

- `Agent` interface: Contract with version/id/tools properties, generate() and stream() methods accepting prompt/messages with optional call options and abortSignal.
- `ToolLoopAgent`: Multi-step agent class with configurable stop conditions (stepCountIs, hasToolCall), structured output parsing, tool calling loop. Constructor accepts model, instructions, tools, toolChoice, stopWhen, activeTools, output, prepareStep, callbacks, generation parameters.
- `createAgentUIStream()`: Runs agent and returns async iterable of UI message chunks. Validates/converts messages, invokes agent.stream(), supports AbortSignal.
- `createAgentUIStreamResponse()`: Executes agent and streams output as HTTP Response with UI messages. Server-side only.
- `pipeAgentUIStreamToResponse()`: Pipes agent UI message stream to Node.js ServerResponse for low-latency streaming.

## Tools

- `tool()`: Helper enabling TypeScript type inference for tool definitions. Connects inputSchema to execute method. Parameters: description, inputSchema (Zod/JSON), execute (async function receiving input and ToolCallOptions), outputSchema, toModelOutput, onInputStart/Delta/Available, providerOptions, type (function/provider-defined), id, name, args.
- `dynamicTool()`: Creates tools with unknown types determined at runtime. Returns Tool<unknown, unknown> with type: 'dynamic'.

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
- `generateId()`: Generates unique 16-char ID string.
- `createIdGenerator()`: Customizable ID generator with configurable prefix, separator, alphabet, size.

## UI Hooks & Streaming

**useChat** - Conversational UI hook with streaming, message state management, tool calling, and transport customization. Parameters: `chat` (existing instance), `transport` (ChatTransport with api endpoint, credentials, headers, body, request customization), `id` (unique identifier), `messages` (initial UIMessage[]), `onToolCall` (callback requiring `addToolOutput`), `sendAutomaticallyWhen` (resubmit condition), `onFinish`, `onError`, `onData`, `experimental_throttle`, `resume`. Returns: `id`, `messages` (UIMessage[]), `status` ('submitted'|'streaming'|'ready'|'error'), `error`, `sendMessage(message|string, options?)`, `regenerate(options?)`, `stop()`, `clearError()`, `resumeStream()`, `addToolOutput(tool, toolCallId, output|errorText)`, `setMessages(messages|function)`.

**useCompletion** - Text completion hook with streaming, state management, and UI updates. Parameters: `api` (default '/api/completion'), `id`, `initialInput`, `initialCompletion`, `onFinish((prompt, completion))`, `onError`, `headers`, `body`, `credentials`, `fetch`, `streamProtocol` ('text'|'data'), `experimental_throttle`. Returns: `completion`, `input`, `error`, `isLoading`, `setCompletion`, `setInput`, `complete(prompt, options?)`, `stop()`, `handleInputChange`, `handleSubmit`.

**useObject** (experimental) - Streams and parses JSON objects into typed objects using schemas. Parameters: `api`, `schema` (Zod or JSON Schema), `id`, `initialValue`, `fetch`, `headers`, `credentials`, `onError`, `onFinish({object, error})`. Returns: `submit(input)`, `object` (DeepPartial<RESULT>), `error`, `isLoading`, `stop()`, `clear()`.

**Message Conversion & Utilities**
- `convertToModelMessages`: Transforms useChat messages to ModelMessage objects for AI core functions. Supports multi-modal tool responses via `toModelOutput` method and custom data part conversion with `convertDataPart` callback.
- `pruneMessages`: Filters ModelMessage arrays to reduce context size. Parameters: `messages`, `reasoning` ('all'|'before-last-message'|'none'), `toolCalls` ('all'|'before-last-message'|'before-last-${number}-messages'|'none'|PruneToolCallsOption[]), `emptyMessages` ('keep'|'remove').
- `createUIMessageStream`: Creates readable stream for UI messages with message merging and error handling. Parameters: `execute({writer})` with `writer.write(UIMessageChunk)` and `writer.merge(stream)`, `onError`, `originalMessages`, `onFinish({messages, isContinuation, responseMessage})`, `generateId`. Returns: ReadableStream<UIMessageChunk>.
- `createUIMessageStreamResponse`: Creates HTTP Response streaming UI message chunks (data, text, sources, LLM output). Parameters: `stream` (ReadableStream<UIMessageChunk>), `status`, `statusText`, `headers`, `consumeSseStream`. Returns: Response object.
- `pipeUIMessageStreamToResponse`: Pipes ReadableStream<UIMessageChunk> to Node.js ServerResponse.
- `readUIMessageStream`: Transforms UIMessageChunk stream to AsyncIterableStream<UIMessage> for terminal UIs, custom clients, or RSCs. Parameters: `message` (optional starting message), `stream`, `onError`, `terminateOnError`. Returns: AsyncIterableStream<UIMessage>.

**Type Helpers**
- `InferUITools`: Maps ToolSet to inferred input/output types for each tool: `{ [NAME]: { input: InferToolInput; output: InferToolOutput } }`.
- `InferUITool`: Infers input/output types from single tool definition: `{ input: InferToolInput; output: InferToolOutput }`.

**Framework Support**: React (useChat, useCompletion, useObject), Svelte (Chat, Completion, StructuredObject), Vue.js (useChat, useCompletion).

## RSC API

**Server-Side Functions**
- `streamUI(model, system?, prompt?, messages?, tools?, ...)`: Creates streamable React UI from LLM output. Returns `{ value: ReactNode, stream: AsyncIterable<StreamPart>, response?, warnings? }`. Stream emits `{ type: 'text-delta', textDelta }`, `{ type: 'tool-call', toolCallId, toolName, args }`, `{ type: 'error', error }`, or `{ type: 'finish', finishReason, usage }`. Supports messages array (CoreSystemMessage, CoreUserMessage with TextPart/ImagePart/FilePart, CoreAssistantMessage, CoreToolMessage, UIMessage), tools with optional `generate` callback yielding React nodes, generation options (maxOutputTokens, temperature, topP, topK, presencePenalty, frequencyPenalty, stopSequences, seed), toolChoice ("auto"/"none"/"required"/`{ type, toolName }`), callbacks (text, onFinish), and standard options (maxRetries, abortSignal, headers, providerOptions).
- `createAI(actions, initialAIState, initialUIState, onGetUIState?, onSetAIState?)`: Context provider factory for client-server state management. `actions` is Record<string, Action> of server-side callables. `onSetAIState` callback receives `{ state, done }` when mutable AI state updates occur, enabling database persistence. Returns `<AI/>` provider component.
- `createStreamableUI(initialValue?)`: Creates server-to-client stream for React components. Returns object with `value: ReactNode` (returnable from Server Action), `update(ReactNode)`, `append(ReactNode)`, `done(ReactNode | null)` (required to close stream), `error(Error)`.
- `createStreamableValue(value)`: Creates server-to-client stream for serializable data. Returns streamable object with initial data and update method, returnable from Server Actions.
- `getAIState(key?)`: Reads current AI state (read-only). Optional `key` parameter accesses object property.
- `getMutableAIState(key?)`: Returns mutable AI state with `update(newState)` and `done(newState)` methods for server-side updates.

**Client-Side Hooks**
- `useAIState()`: Returns `[state]` array of globally-shared AI state under `<AI/>` provider.
- `useUIState()`: Returns `[state, setState]` array for client-side UI state (can contain functions, React nodes, data).
- `useActions()`: Returns `Record<string, Action>` of patched Server Actions.
- `useStreamableValue(streamableValue)`: Returns `[data, error, pending]` tuple. Consumes streamable values created with `createStreamableValue`.
- `readStreamableValue(stream)`: Async iterator for consuming server-streamed values. Use with `for await...of` loop.

**Example**:
```typescript
// Server (app/actions.ts)
'use server';
import { streamUI, createStreamableUI, getMutableAIState } from '@ai-sdk/rsc';

export async function generate(input: string) {
  const mutableState = getMutableAIState();
  const { value, stream } = await streamUI({
    model: openai('gpt-4'),
    prompt: input,
    tools: {
      renderComponent: {
        description: 'Render a React component',
        parameters: z.object({ content: z.string() }),
        generate: async ({ content }) => {
          const ui = createStreamableUI(<div>{content}</div>);
          mutableState.update([...mutableState.get(), { role: 'assistant', content }]);
          ui.done();
          return ui.value;
        }
      }
    }
  });
  mutableState.done(value);
  return { value, stream };
}

// Client (app/page.tsx)
import { useActions, useAIState, useUIState } from '@ai-sdk/rsc';

export default function Page() {
  const [aiState] = useAIState();
  const [uiState, setUIState] = useUIState();
  const { generate } = useActions();
  
  return (
    <button onClick={async () => {
      const result = await generate('prompt');
      setUIState([...uiState, result.value]);
    }}>
      Generate
    </button>
  );
}

// Root (app/layout.tsx)
import { createAI } from '@ai-sdk/rsc';
import { generate } from './actions';

const AI = createAI({
  actions: { generate },
  initialAIState: [],
  initialUIState: [],
  onSetAIState: ({ state, done }) => {
    if (done) saveToDatabase(state);
  }
});

export default function RootLayout({ children }) {
  return <AI>{children}</AI>;
}
```

**Status**: Experimental. Production use should migrate to AI SDK UI.

## Stream Helpers

Collection of utilities for converting and streaming responses from various AI frameworks and APIs into AI SDK-compatible data streams.

**StreamingTextResponse** (DEPRECATED in SDK 4.0, use `streamText.toDataStreamResponse()` instead)
- Wraps native Response class to return ReadableStream of text
- Auto-sets status 200 and Content-Type: 'text/plain; charset=utf-8'
- Accepts optional ResponseInit for customization and StreamData for additional response data

**AWSBedrockLlama2Stream** (DEPRECATED in SDK 4.0)
- Transforms AWS Bedrock API responses into ReadableStream using AIStream
- Supports callbacks: onStart(), onToken(token), onCompletion(completion), onFinal(completion)

**LangChain Adapter** (@ai-sdk/langchain)
- `toDataStream`: Converts LangChain StringOutputParser or AIMessageChunk streams to AIStream
- `toDataStreamResponse`: Converts to Response object with optional ResponseInit, StreamData, callbacks
- `mergeIntoDataStream`: Merges LangChain streams into existing DataStreamWriter
- Supports LangChain Expression Language, StringOutputParser, and StreamEvents v2

Example:
```typescript
import { toDataStream } from '@ai-sdk/langchain';
import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({ model: 'gpt-3.5-turbo-0125' });
const stream = await model.stream(prompt);
const aiStream = toDataStream(stream);
```

**LlamaIndex Adapter** (@ai-sdk/llamaindex)
- `toDataStream`: Converts LlamaIndex ChatEngine/QueryEngine streams to data stream
- `toDataStreamResponse`: Converts to Response with optional init, data, callbacks
- `mergeIntoDataStream`: Merges into existing DataStreamWriter

Example:
```typescript
import { SimpleChatEngine } from 'llamaindex';
import { toDataStreamResponse } from '@ai-sdk/llamaindex';

const chatEngine = new SimpleChatEngine({ llm });
const stream = await chatEngine.chat({ message: prompt, stream: true });
return toDataStreamResponse(stream);
```

## Error Classes

Comprehensive set of error classes thrown by the AI SDK. All errors support type checking via `ErrorClass.isInstance(error)` method.

**API & Network Errors**
- `APICallError`: Failed API calls with `url`, `requestBodyValues`, `statusCode`, `responseHeaders`, `responseBody`, `isRetryable`, `data` properties
- `DownloadError`: Download failures with `url`, `statusCode`, `statusText`, `message`
- `EmptyResponseBodyError`: Server returned empty response body
- `LoadAPIKeyError`: API key loading failed
- `LoadSettingError`: Setting loading failed

**Data Validation Errors**
- `InvalidArgumentError`: Invalid function argument with `parameter`, `value`, `message`
- `InvalidDataContentError`: Invalid multi-modal message content with `content`, `message`
- `InvalidDataContent`: Invalid data content with `content`, `message`, `cause`
- `InvalidMessageRoleError`: Invalid message role with `role`, `message`
- `InvalidPromptError`: Invalid prompt (common cause: passing `UIMessage[]` instead of `ModelMessage[]`). Solution: use `convertToModelMessages()` to convert. Properties: `prompt`, `message`, `cause`
- `InvalidResponseDataError`: Server response with invalid data with `data`, `message`
- `InvalidToolInputError`: Tool received invalid input with `toolName`, `toolInput`, `message`, `cause`
- `TypeValidationError`: Type validation failed with `value`, `message`

**Generation Errors**
- `NoContentGeneratedError`: AI provider failed to generate content
- `NoImageGeneratedError`: Image generation failed with `message`, `responses` (metadata), `cause`
- `NoObjectGeneratedError`: `generateObject()` failed to produce schema-conforming object. Properties: `message`, `text` (raw generated), `response` (metadata), `usage`, `finishReason`, `cause`. Causes: model failed, response unparseable, or failed schema validation
- `NoSpeechGeneratedError`: Audio generation failed with `responses`, `message`
- `NoTranscriptGeneratedError`: Transcript generation failed with `responses`, `message`

**Model & Provider Errors**
- `NoSuchModelError`: Model ID not found with `modelId`, `modelType`, `message`
- `NoSuchProviderError`: Provider ID not found with `providerId`, `availableProviders`, `modelId`, `modelType`, `message`
- `NoSuchToolError`: Model called non-existent tool with `toolName`, `availableTools`, `message`
- `TooManyEmbeddingValuesForCallError`: Embedding call exceeded provider's `maxEmbeddingsPerCall` limit with `provider`, `modelId`, `maxEmbeddingsPerCall`, `values`

**Parsing & Conversion Errors**
- `JSONParseError`: JSON parsing failed with `text`, `message`
- `MessageConversionError`: Message conversion failed with `originalMessage`, `message`

**Retry & Repair Errors**
- `RetryError`: Retry operation failed after multiple attempts with `reason`, `lastError`, `errors` (array of all errors), `message`
- `ToolCallRepairError`: AI failed to repair `NoSuchToolError` or `InvalidToolInputError` with `originalError`, `message`, `cause`

**Other Errors**
- `UnsupportedFunctionalityError`: Feature not supported with `functionality`, `message`

**Usage Pattern**:
```typescript
import { APICallError, InvalidPromptError, NoObjectGeneratedError } from 'ai';

try {
  await generateObject({ model, schema, messages: convertToModelMessages(uiMessages) });
} catch (error) {
  if (APICallError.isInstance(error)) {
    console.log('API failed:', error.statusCode, error.isRetryable);
  } else if (InvalidPromptError.isInstance(error)) {
    console.log('Invalid prompt:', error.cause);
  } else if (NoObjectGeneratedError.isInstance(error)) {
    console.log('Generation failed:', error.cause, error.finishReason);
  }
}
```