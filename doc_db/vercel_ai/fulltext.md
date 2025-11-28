
## Directories

### foundations
Foundational concepts for building AI applications: generative models, 50+ standardized provider integrations, multi-modal prompts, tools, and streaming.

## Core Concepts

**Generative AI**: Models that predict and generate outputs (text, images, audio) based on statistical patterns. LLMs predict text sequences but can hallucinate when information is absent from training data. Embedding models convert data into dense vector representations for semantic relationships.

## Providers & Models

The AI SDK provides a standardized interface across 50+ LLM providers (25+ official, OpenAI-compatible, and 25+ community providers). Official providers include OpenAI, Anthropic, Google, Mistral, Groq, xAI, and others. Models support varying capabilities: image input, object generation, tool usage, and tool streaming.

## Prompts

Three prompt types:
- **Text prompts**: Simple strings with template literals
- **System prompts**: Initial instructions guiding model behavior
- **Message prompts**: Arrays of user/assistant/tool messages for chat interfaces

Multi-modal content supports text, images (base64, binary, URL), and files (PDF, audio). Provider-specific options can be set at function, message, or message-part levels.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You help planning travel itineraries.',
  messages: [
    { role: 'user', content: [
      { type: 'text', text: 'Describe the image.' },
      { type: 'image', image: fs.readFileSync('./image.png') }
    ]},
    { role: 'assistant', content: [
      { type: 'tool-call', toolCallId: '123', toolName: 'search', input: { query: 'Berlin' }}
    ]},
    { role: 'tool', content: [
      { type: 'tool-result', toolCallId: '123', toolName: 'search', output: { type: 'json', value: {...}}}
    ]}
  ],
  providerOptions: { anthropic: { cacheControl: { type: 'ephemeral' }}}
});
```

## Tools

Tools are LLM-callable objects with `description`, `inputSchema` (Zod or JSON), and optional `execute` function. Pass to `generateText` or `streamText` via the `tools` parameter. Tools can be packaged and distributed via npm.

```ts
import z from 'zod';

const myTool = {
  description: 'Search the web',
  inputSchema: z.object({ query: z.string() }),
  execute: async ({ query }) => { /* ... */ }
};

const { text } = await generateText({
  model: 'anthropic/claude-haiku-4.5',
  prompt: 'When was Vercel Ship AI?',
  tools: { webSearch: myTool }
});
```

Ready-to-use tool packages: web search (@exalabs/ai-sdk), Stripe, Composio (250+ tools), AWS Bedrock (Browser, Code Interpreter), MCP servers (Smithery 6000+, Pipedream 3000+).

## Streaming

`streamText` displays LLM response chunks incrementally instead of waiting for complete generation. The `textStream` is an async iterable yielding text chunks as generated.

```ts
const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a poem about embedding models.'
});

for await (const textPart of textStream) {
  console.log(textPart);
}
```

### getting_started
Quickstart guides for building streaming chat applications across JavaScript frameworks using unified LLM API, UI hooks, and tool-calling patterns.

## SDK Architecture

**AI SDK Core**: Unified LLM API for text generation, structured objects, and tool calls. Works in any JavaScript environment (Node.js, Deno, Browser).

**AI SDK UI**: Framework-agnostic hooks for streaming chat and generative UIs. Supports React, Svelte, Vue.js with functions like `useChat`, `useCompletion`, `useObject`.

**AI SDK RSC**: Experimental server-to-client streaming via React Server Components for Next.js App Router only.

## Quick Start Patterns

All frameworks follow this pattern:

1. **API Route**: Use `streamText()` with model and messages, return `toUIMessageStreamResponse()`
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
});
return result.toUIMessageStreamResponse();
```

2. **UI Component**: Use framework hook (`useChat` for React/Svelte/Vue, `Chat` class for Svelte/Vue/Nuxt)
```ts
const { messages, sendMessage } = useChat();
// or
const chat = new Chat({});
```

3. **Message Structure**: Messages have `id`, `role`, and `parts` array where each part has `type` ('text', 'tool-{name}', etc.)

## Provider Configuration

Default: Vercel AI Gateway with string model references
```ts
model: 'anthropic/claude-sonnet-4.5'
```

Alternative providers require installation:
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

## Tools

Define with `tool()` function and Zod schemas:
```ts
tools: {
  weather: tool({
    description: 'Get weather in location',
    inputSchema: z.object({
      location: z.string().describe('Location'),
    }),
    execute: async ({ location }) => ({ temperature: 72 }),
  }),
}
```

Tool results appear in `message.parts` as `tool-{toolName}` type.

## Multi-Step Tool Calls

Enable with `stopWhen: stepCountIs(n)` to allow model to use tool results for follow-up generations:
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  stopWhen: stepCountIs(5),
  tools: { /* tools */ },
});
```

Default is `stepCountIs(1)` (single step only).

## Framework-Specific Notes

**Next.js App Router**: Use `app/api/chat/route.ts` with `POST` handler
**Next.js Pages Router**: Use `pages/api/chat.ts` with `POST` handler
**Svelte/SvelteKit**: Use `Chat` class instead of hooks; pass reactive references not values; use `createAIContext()` for instance sync
**Vue/Nuxt**: Use `Chat` class; configure API key in runtime config
**Node.js**: Use `streamText()` with `textStream` iterator for CLI agents
**Expo**: Use `DefaultChatTransport` with `expo/fetch` for streaming support; requires polyfills for `structuredClone`, `TextEncoderStream`, `TextDecoderStream`

### agents
ToolLoopAgent automates LLM-based task execution by orchestrating tool calls in loops with configurable control flow and runtime options.

## Agents

LLM agents use tools in loops to accomplish tasks. The `ToolLoopAgent` class encapsulates model, tools, and behavior into reusable components that automatically orchestrate the agent loop.

### Core Concepts

Agents combine three components:
- **LLMs** process input and decide next actions
- **Tools** extend capabilities (file I/O, APIs, databases)
- **Loop** orchestrates execution through context management and stopping conditions

### Creating an Agent

```ts
import { ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: {
    weather: tool({
      description: 'Get weather in a location',
      inputSchema: z.object({
        location: z.string(),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72,
      }),
    }),
  },
  stopWhen: stepCountIs(20),
});

const result = await agent.generate({
  prompt: 'What is the weather in San Francisco?',
});
```

### Configuration

**Loop Control**: Default 20 steps. Combine multiple stop conditions:
```ts
stopWhen: [stepCountIs(20), hasToolCall('someTool')]
```

**Tool Choice**: Control tool usage with `'required'` (force), `'none'` (disable), or `'auto'` (default):
```ts
toolChoice: { type: 'tool', toolName: 'weather' }
```

**Structured Output**: Define output schema with Zod:
```ts
output: Output.object({
  schema: z.object({
    sentiment: z.enum(['positive', 'neutral', 'negative']),
    summary: z.string(),
  }),
})
```

**System Instructions**: Define behavior, personality, and constraints in the `instructions` field.

### Usage Patterns

**Generate**: One-time text generation
```ts
const result = await agent.generate({ prompt: '...' });
```

**Stream**: Stream text chunks
```ts
const stream = agent.stream({ prompt: '...' });
for await (const chunk of stream.textStream) { }
```

**API Response**: Create streaming response for client applications
```ts
return createAgentUIStreamResponse({ agent, messages });
```

### Advanced Control

**Prepare Step**: Modify model, tools, messages, or context before each step:
```ts
prepareStep: async ({ stepNumber, messages }) => {
  if (stepNumber > 2) {
    return { model: 'anthropic/claude-sonnet-4.5' };
  }
  return {};
}
```

**Call Options**: Type-safe runtime configuration via `callOptionsSchema` and `prepareCall`:
```ts
const agent = new ToolLoopAgent({
  callOptionsSchema: z.object({ userId: z.string() }),
  prepareCall: async ({ options }) => ({
    instructions: `User: ${options.userId}`,
  }),
});

agent.generate({ prompt: '...', options: { userId: 'user123' } });
```

**Manual Loop**: Use `generateText`/`streamText` for complete control over message history and stopping conditions.

### Workflow Patterns

Five patterns for structured agent workflows:
- **Sequential**: Steps execute in order, output feeds into next step
- **Routing**: Model decides path based on context
- **Parallel**: Independent subtasks run concurrently
- **Orchestrator-Worker**: Primary model coordinates specialized workers
- **Evaluator-Optimizer**: Evaluation steps assess results and trigger retries

### Type Safety

Infer types for agent UI messages:
```ts
export type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;
```

Use in client components for full type safety.

### core_functions_&_features
Standardized interface for text generation, structured data, tool calling, embeddings, reranking, image/speech/transcription with streaming, middleware, provider management, and testing utilities.

## Core Text Generation

**generateText**: Non-interactive text generation with complete response object containing text, usage, toolCalls, sources, reasoning, files, finishReason, and response metadata.

```ts
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a recipe.',
});
```

**streamText**: Interactive streaming with `textStream` (ReadableStream/AsyncIterable), `fullStream` for all events (text-delta, tool-call, reasoning, source, etc.), and callbacks (onFinish, onError, onChunk).

```ts
const result = streamText({ model, prompt });
for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

Stream transformations via `experimental_transform` for filtering/smoothing. Call `stopStream()` to halt generation.

## Structured Data Generation

**generateObject**: Schema-validated structured output matching Zod/Valibot/JSON schemas.

```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({ name: z.string(), age: z.number() }),
  prompt: 'Generate a person.',
});
```

**streamObject**: Streams structured data with `partialObjectStream` or `elementStream` (for array output).

**Output strategies**: `object` (default), `array`, `enum`, `no-schema`. Use `Output.*` types with generateText/streamText for structured outputs.

Error handling: `NoObjectGeneratedError` with text, response, usage, and cause properties.

## Tool Calling

Define tools with description, inputSchema (Zod), and execute function:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get weather',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temperature: 72 }),
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

**Multi-step calls**: Use `stopWhen` (e.g., `stepCountIs(5)`) to enable agentic loops. Access intermediate results via `steps` property. Callbacks: `onStepFinish`, `prepareStep`.

**Tool choice**: Control with `toolChoice` ('auto', 'required', 'none', or specific tool).

**Tool execution options**: Receive `toolCallId`, `messages`, `abortSignal`, `experimental_context` as second parameter.

**Tool input lifecycle hooks**: `onInputStart`, `onInputDelta`, `onInputAvailable` (streamText only).

**Dynamic tools**: Use `dynamicTool` for unknown schemas. Check `toolCall.dynamic` flag for type narrowing.

**Preliminary results**: Tools can yield multiple results via `AsyncIterable` for streaming status.

**Error handling**: `NoSuchToolError`, `InvalidToolInputError`, `ToolCallRepairError`. Tool execution errors appear as `tool-error` content parts.

**Tool call repair** (experimental): Custom repair strategies via `experimental_repairToolCall` using model with structured outputs or re-ask strategy.

**Active tools**: Limit available tools with `activeTools` array while maintaining static typing.

**Multi-modal results** (experimental): Tools have optional `toModelOutput` function converting results to content parts.

**MCP integration**: Connect to Model Context Protocol servers via HTTP/SSE/stdio transport to access tools, resources, and prompts.

## Embeddings

**embed**: Single value embedding.

```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

**embedMany**: Batch embedding with `maxParallelCalls` for concurrency control.

**cosineSimilarity**: Measure similarity between embeddings.

Configuration: `providerOptions`, `maxRetries`, `abortSignal`, `headers`.

## Reranking

Reorder documents by query relevance using trained models:

```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['doc1', 'doc2', 'doc3'],
  query: 'relevant information',
  topN: 2,
});
```

Returns `ranking` array with `{ originalIndex, score, document }` and `rerankedDocuments` convenience property.

## Image Generation

**generateImage**: Generate images from text prompts.

```ts
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  size: '1024x1024',
});
```

**Multiple images**: Use `n` parameter with automatic batching. Override with `maxImagesPerCall`.

Configuration: `size`/`aspectRatio`, `seed`, `providerOptions`, `abortSignal`, `headers`.

Error handling: `NoImageGeneratedError`.

Some language models return images via `files` property.

## Transcription

**transcribe**: Convert audio to text.

```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});
```

Returns `text`, `segments`, `language`, `durationInSeconds`.

Configuration: `providerOptions`, `abortSignal`, `headers`.

Error handling: `NoTranscriptGeneratedError`.

## Speech Generation

**generateSpeech**: Convert text to audio.

```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  voice: 'alloy',
});
```

Configuration: `language`, `providerOptions`, `abortSignal`, `headers`.

Error handling: `NoSpeechGeneratedError`.

## Common Settings

All functions support: `maxOutputTokens`, `stopSequences`, `temperature`, `topP`, `topK`, `seed`, `presencePenalty`, `frequencyPenalty`, `maxRetries`, `abortSignal`, `headers`.

Check `result.warnings` for unsupported settings.

## Middleware

Intercept and modify language model calls via `wrapLanguageModel({ model, middleware })`:

```ts
const model = wrapLanguageModel({
  model: gateway('openai/gpt-5.1'),
  middleware: [extractReasoningMiddleware({ tagName: 'think' }), customMiddleware]
});
```

Implement `LanguageModelV3Middleware` with `transformParams`, `wrapGenerate`, or `wrapStream`.

Built-in: `extractReasoningMiddleware`, `simulateStreamingMiddleware`, `defaultSettingsMiddleware`.

## Provider Management

**Custom providers**: Pre-configure settings, aliases, and available models.

```ts
export const myProvider = customProvider({
  languageModels: {
    'fast': gateway('anthropic/claude-haiku-4-5'),
    'reasoning': wrapLanguageModel({ model: gateway('openai/gpt-5.1'), middleware: [...] })
  }
});
```

**Provider registry**: Manage multiple providers with `providerId:modelId` format.

```ts
const registry = createProviderRegistry({ gateway, anthropic, openai });
const model = registry.languageModel('openai:gpt-5.1');
```

**Global provider**: Set default provider via `globalThis.AI_SDK_DEFAULT_PROVIDER` to use plain model IDs.

## Error Handling

**Regular errors**: Use try/catch.

**Streaming errors**: Handle via `onError` callback or check `part.type === 'error'` in fullStream.

**Stream aborts**: Use `onAbort` callback for cleanup (called on abort, not normal completion).

## Testing

Mock providers and helpers from `ai/test`:
- `MockLanguageModelV3`: Mock language model with `doGenerate`/`doStream`
- `MockEmbeddingModelV3`: Mock embedding model
- `mockId`, `mockValues`, `simulateReadableStream`: Test utilities

```ts
const result = await generateText({
  model: new MockLanguageModelV3({
    doGenerate: async () => ({
      finishReason: 'stop',
      usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      content: [{ type: 'text', text: 'Hello, world!' }],
    }),
  }),
  prompt: 'Hello, test!',
});
```

## Telemetry

OpenTelemetry collection (experimental, disabled by default):

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a story.',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'my-function',
    metadata: { custom: 'data' },
    recordInputs: true,
    recordOutputs: true,
  },
});
```

Records nested spans for each function with model, usage, headers, and semantic convention attributes.

## Prompt Engineering Tips

- Use strong tool-calling models (gpt-4.1, gpt-5)
- Keep tool count ≤5 with minimal parameter complexity
- Use meaningful names and `.describe()` for Zod properties
- Document tool output in description field
- Include JSON examples in prompts
- Use `z.string().datetime()` for dates (models return strings)
- Use `.nullable()` instead of `.optional()` for strict schema validation
- Set `temperature: 0` for deterministic tool calls and object generation

## MCP Resources & Prompts

**Resources**: Application-driven data sources. List with `listResources()`, read with `readResource({ uri })`, get templates with `listResourceTemplates()`.

**Prompts**: User-controlled templates. List with `listPrompts()`, get with `getPrompt({ name, arguments })`.

**Elicitation**: MCP servers can request client input. Enable with `capabilities: { elicitation: {} }` and register handler with `onElicitationRequest()`.


### ui_toolkit
Framework-agnostic React/Svelte/Vue/Angular hooks for streaming chat, completions, and structured objects with real-time UI updates, tool integration, message persistence, and resumable streams.

## Framework-Agnostic UI Hooks

Three main hooks for building interactive AI applications:

- **useChat**: Real-time streaming chat with message state management, input handling, error recovery, message manipulation, cancellation/regeneration, and tool integration
- **useCompletion**: Text completion streaming with input control and throttling
- **useObject**: Structured JSON object streaming with partial results (React/Svelte/Angular only)

## Core Features

**Message Management**
- Messages use `parts` property containing text, tool calls, tool results, reasoning, sources, and files
- Status tracking: `submitted`, `streaming`, `ready`, `error`
- Metadata attachment for timestamps, token usage, model info
- Message persistence with validation, server-side ID generation, and disconnect handling

**Tool Integration**
- Server-side auto-execution via `execute()` method
- Client-side handling via `onToolCall` callback
- User-interaction tools displayed in UI with state transitions (input-streaming → input-available → output-available/output-error)
- Tool call streaming enabled by default with partial results
- Type inference via `InferUITool` and `InferUITools`

**Request Customization**
- Hook-level: headers, body, credentials via `DefaultChatTransport`
- Request-level: per-message options override hook config
- Dynamic configuration via functions for auth tokens and session data
- Custom request transformation with `prepareSendMessagesRequest`

**Advanced Features**
- UI throttling to reduce render frequency during streaming
- Event callbacks: `onFinish`, `onError`, `onData`
- Reasoning tokens support (DeepSeek, Anthropic models)
- Sources forwarding for RAG applications
- Image generation support
- File attachments (FileList or file objects)
- Stream resumption after page reloads with Redis persistence
- Custom data streaming alongside responses with type-safe schemas
- Text stream protocol (plain text) or data stream protocol (SSE-based)

## Chat Persistence Pattern

```tsx
// Create chat with unique ID
const id = await createChat(); // generates ID, stores empty message array

// Load messages on page load
const messages = await loadChat(id);

// Validate messages against current tools/schemas
const validatedMessages = await validateUIMessages({
  messages: [...previousMessages, newMessage],
  tools, metadataSchema, dataPartsSchema,
});

// Save in onFinish callback
return result.toUIMessageStreamResponse({
  originalMessages: validatedMessages,
  onFinish: ({ messages }) => saveChat({ chatId: id, messages }),
});
```

## Stream Resumption

Enable with `resume: true` in `useChat`. Requires:
1. POST handler creates resumable stream via `consumeSseStream` callback, stores ID in persistence
2. GET handler resumes via `resumeExistingStream`, returns 204 if no active stream
3. Uses `resumable-stream` package with Redis backend

**Warning**: Incompatible with abort functionality.

## Generative UI

Tools can return React components dynamically. Define tools with Zod schemas, add to `streamText`, render based on tool part states:
- `input-available`: Loading state
- `output-available`: Render component with `part.output`
- `output-error`: Show error with `part.errorText`

## Error Handling

- Warnings prefixed "AI SDK Warning:" for unsupported features; control via `globalThis.AI_SDK_LOG_WARNINGS`
- Hook `error` object for UI display
- `regenerate()` or `setMessages()` for recovery
- `onError` callback for custom handling
- Server-side: throw errors in route handlers for testing

## Transport

`DefaultChatTransport` handles HTTP POST to `/api/chat` by default. Customize endpoint, headers, credentials, and request transformation. Implement `ChatTransport` interface for custom protocols (WebSockets, etc).

## Stream Protocols

**Text Stream**: Plain text chunks via `toTextStreamResponse()`, limited to text only
**Data Stream** (default): SSE-based via `toUIMessageStreamResponse()`, supports text/reasoning/tool/source/file/custom-data parts, ends with `[DONE]`

### react_server_components
Experimental React Server Components package for streaming LLM-generated UI with split AI/UI state management and Server Actions integration.

## React Server Components (RSC) Package

Experimental package for building AI applications with React Server Components, enabling server-side UI rendering and streaming to clients with end-to-end type safety.

### Core Abstractions

**Streaming UI & State:**
- `streamUI`: Calls a model with tools that return React components; model acts as router selecting relevant UI based on intent
- `useUIState` / `useAIState`: Client-side hooks managing visual (UI) and serializable (AI) state respectively
- `useActions`: Provides client access to Server Actions
- `createAI`: Context provider wrapping application, managing both UI and AI state with `initialAIState`, `initialUIState`, and `actions` object

**Streamable Values:**
- `createStreamableValue`: Streams serializable data from server to client with `.update()` and `.done()` methods
- `createStreamableUI`: Streams React components with `.update()`, `.done()`, and `.error()` methods
- `readStreamableValue`: Client-side async iterator consuming streamable values

### State Management

Split state into two parts:
- **AI State**: Serializable JSON (conversation history, metadata) shared with LLM, accessible server/client via `getAIState()` / `getMutableAIState()` / `useAIState()`
- **UI State**: Client-only React components, managed via `useUIState()`

Persist AI state with `onSetAIState` callback (save when `done: true`), restore with `initialAIState` prop. Reconstruct UI state via `onGetUIState` callback by comparing database vs app history.

### Patterns

**Streaming Components with Loading States:**
Generator functions in tool `generate` methods yield intermediate values (loading UI) before returning final components:
```tsx
generate: async function* ({ location }) {
  yield <LoadingComponent />;
  const data = await fetchData(location);
  return <FinalComponent data={data} />;
}
```

**Multistep Interfaces:**
Compose multiple tools into conversational flows. User sends message → appended to AI State → passed to model with tools → model calls tool → component renders → within component use `useActions` to trigger next step.

**Client Interactions:**
Convert tool components to client components using `useActions` to call Server Actions and `useUIState` to update conversation without requiring text input.

**Loading State Approaches:**
1. Client-side: Traditional `useState` with disabled inputs
2. Server-streamed: Separate `createStreamableValue` for loading state
3. Generator functions: Yield loading UI before final result

**Error Handling:**
- UI errors: Use `streamableUI.error()` and wrap with React Error Boundary
- Other errors: Return error objects from try-catch blocks

**Authentication:**
Validate authorization in Server Actions by checking cookies before executing protected logic; return error object if token invalid.

### Migration to AI SDK UI

AI SDK RSC is experimental with limitations (no stream abort, component remounting flicker, quadratic data transfer). Migrate by:
- Separating generation (route handler with `streamText`) from rendering (client with `useChat`)
- Replacing `streamUI` tools with `streamText` tools that return data instead of components
- Rendering components client-side based on `toolInvocations` state
- Using `useChat` hook instead of `useActions` for client interactions
- Replacing `onSetAIState` with `onFinish` callback in `streamText`
- Loading initial messages via page static generation and passing to `useChat`

### Setup Example

```tsx
// app/ai.ts
import { createAI } from '@ai-sdk/rsc';

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  initialAIState: [],
  initialUIState: [],
  actions: { sendMessage },
  onSetAIState: async ({ state, done }) => {
    if (done) await saveChatToDB(state);
  },
});

// app/layout.tsx
import { AI } from './ai';
export default function RootLayout({ children }) {
  return <AI>{children}</AI>;
}

// app/actions.tsx
export async function sendMessage(input: string) {
  'use server';
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt: input,
    text: ({ content }) => <div>{content}</div>,
    tools: { /* tool definitions */ },
  });
  return result.value;
}

// app/page.tsx
'use client';
const { sendMessage } = useActions();
const [messages, setMessages] = useUIState();
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await sendMessage(input);
  setMessages([...messages, response]);
};
```

### advanced_patterns
Production patterns for streaming, caching, UI rendering, routing, rate limiting, and deploying AI applications.

## Prompt Engineering

LLMs predict text sequences by assigning probabilities. Prompt engineering shapes responses through clear instructions, examples, and temperature tuning (0=deterministic, 1=random). Different models have varying performance, context windows, and costs—optimize the cost-performance tradeoff by adding descriptive terms, providing examples of expected output, and adjusting temperature for desired diversity.

## Stream Management

**Cancellation**: Use `abortSignal` with `onAbort` callback for server-side cancellation, or `stop()` hook for client-side cancellation. The `onAbort` callback receives completed steps for persisting partial results.

**Back-pressure**: Implement lazy evaluation using `ReadableStream.pull()` instead of eager `for await (...)` loops. This ensures producers only generate data when consumers request it, preventing unbounded buffer growth and memory leaks.

## Caching

Cache AI responses via language model middleware using `LanguageModelV3Middleware` with `wrapGenerate` and `wrapStream` methods. For streams, use `simulateReadableStream()` to replay cached chunks. Alternatively, use `onFinish` callbacks with KV storage like Upstash Redis.

## UI Rendering & Routing

**Multiple Streamables**: Return multiple independent streamable UIs from a single server action. Nest streamables as props for composable UIs that update separately.

**Server-Side Rendering**: Use `createStreamableUI()` from `@ai-sdk/rsc` to render React components server-side and stream them to clients, eliminating complex client-side conditional rendering.

**Language Models as Routers**: Use function calling to deterministically choose UIs and execute multi-step sequences based on user intent. Models can generate correct parameters for dynamic routes and sequences of function calls for complex tasks.

## Multistep Interfaces

Design multistep interfaces through tool composition and application context. Compose multiple tools to create new tools that break complex tasks into manageable steps. Maintain rich conversation history so user input in one step affects model output in subsequent steps.

Example: Flight booking with `searchFlights`, `lookupFlight`, and `bookFlight` tools. Compose with `lookupContacts` to auto-populate passenger details, reducing user steps.

## Sequential Generations

Chain multiple `generateText()` calls where outputs feed into subsequent prompts. Each generation is awaited sequentially, allowing the full text output to be used in the next prompt for dependent multi-step workflows.

## Rate Limiting

Implement API rate limiting with Vercel KV and Upstash Ratelimit. Extract client IP from request, check limit before processing, and return HTTP 429 on failure:

```ts
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, '30s'),
});

const { success } = await ratelimit.limit(ip);
if (!success) return new Response('Ratelimited!', { status: 429 });
```

## Deployment

Deploy Next.js AI apps to Vercel via git workflow. Set `maxDuration` for LLM timeouts (default 10s on Hobby Tier, max 60s). Add rate limiting and firewall security for production.

### api_reference
Complete API reference for text generation, structured outputs, embeddings, agents, tools, MCP, React hooks, RSC integration, and error types.

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

### migration_guides
Step-by-step guides for upgrading between AI SDK versions with breaking changes, data migration strategies, and automated codemods.

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

### troubleshooting
Solutions for common AI SDK issues including streaming problems, useChat configuration, tool calling, server actions, error handling, and version compatibility.

## Common Issues and Solutions

**Streaming Problems**
- Azure OpenAI slow streaming: Update content filter to "Asynchronous Filter" in Azure AI Studio or use `smoothStream()` transformation
- Streaming not working when deployed: Add `Transfer-Encoding: chunked` and `Connection: keep-alive` headers to `toUIMessageStreamResponse()`
- Streaming not working when proxied: Disable compression with `'Content-Encoding': 'none'` header
- Streaming timeouts on Vercel: Increase `maxDuration` (default 300s, Pro/Enterprise up to 800s)
- Unclosed streams: Call `.done()` on streamable UI to close streams

**useChat/useCompletion Issues**
- Failed to parse stream: Set `streamProtocol: 'text'` when using incompatible stream sources
- No response: Convert messages with `convertToModelMessages()` before `streamText()`
- Custom headers/body/credentials not working: Use `DefaultChatTransport` for static values or pass options to `sendMessage()` for dynamic values
- Stale body values: Pass dynamic values via `sendMessage()`'s second argument, not hook-level config
- Status shows but no text appears: Check `lastMessage?.parts?.length === 0` to distinguish metadata streaming from content
- Maximum update depth exceeded: Use `experimental_throttle` option to batch stream chunks

**Tool Calling**
- Tool invocation missing result: Add `execute` functions to tools or provide results via `addToolOutput` in `onToolCall` handler
- Type errors with onToolCall: Check `toolCall.dynamic` before using `toolCall.toolName` with `addToolOutput`
- Tool calling with structured outputs: Use `generateText`/`streamText` with `output` option; adjust `stopWhen` to account for extra generation step

**Server Actions & RSC**
- Server Actions in Client Components: Export from separate file with `"use server"` at top level, pass via props, or use `createAI` and `useActions` hooks
- Streamable UI errors: Use `.tsx` extension instead of `.ts` for JSX support
- Plain objects error: Use `createStreamableValue` to wrap serializable data instead of returning entire streamText result

**Stream Protocol & Response Format**
- Stream output contains protocol markers: Use `streamText().toTextStreamResponse()` or pin SDK to 3.0.19
- Client-side function calls not invoked: Add stub `experimental_onFunctionCall` to OpenAIStream options

**Error Handling**
- Generic "An error occurred": Pass `getErrorMessage` to `toUIMessageStreamResponse()` or `onError` to `createDataStreamResponse()`
- streamText fails silently: Use `onError` callback to capture and log errors

**Message Management**
- Repeated assistant messages: Pass `originalMessages` to `toUIMessageStreamResponse()` to reuse message IDs
- onFinish not called on abort: Add `consumeSseStream: consumeStream` to `toUIMessageStreamResponse()`

**Stream Resumption & Abort**
- Abort breaks resumable streams: Choose between `resume: true` or abort functionality, not both

**Schema & Type Issues**
- TypeScript performance crashes with Zod: Upgrade Zod to 4.1.8+ or set `moduleResolution: "nodenext"`
- OpenAI structured outputs reject `.nullish()` and `.optional()`: Use `.nullable()` instead
- Unsupported model version error: Update `@ai-sdk/*` to 2.0.0+ and `ai` to 5.0.0+
- Type incompatibility with LanguageModelV1: Update SDK and provider packages to latest versions
- Cannot find namespace 'JSX': Install `@types/react`

**Testing**
- Jest cannot find '@ai-sdk/rsc': Add `moduleNameMapper` entry mapping to dist directory



## Pages

### ai_sdk_6_beta
AI SDK 6 beta introduces Agent abstraction with ToolLoopAgent, tool execution approval for human-in-the-loop, stable structured output with tool calling, native reranking support, and upcoming image editing—minimal breaking changes from v5.

## AI SDK 6 Beta Overview

AI SDK 6 is a major version bump due to the v3 Language Model Specification, but is not expected to have major breaking changes for most users. Migration from AI SDK 5 should be straightforward with minimal code changes.

Install with: `npm install ai@beta @ai-sdk/openai@beta @ai-sdk/react@beta`

### Agent Abstraction

New unified `Agent` interface for building agents with full control over execution flow, tool loops, and state management.

**ToolLoopAgent** - Default implementation that automatically handles the tool execution loop:
1. Calls the LLM with your prompt
2. Executes any requested tool calls
3. Adds results back to the conversation
4. Repeats until complete (default `stopWhen: stepCountIs(20)`)

```typescript
import { openai } from '@ai-sdk/openai';
import { ToolLoopAgent } from 'ai';
import { weatherTool } from '@/tool/weather';

const weatherAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful weather assistant.',
  tools: { weather: weatherTool },
});

const result = await weatherAgent.generate({
  prompt: 'What is the weather in San Francisco?',
});
```

**Call Options** - Type-safe runtime configuration using Zod schemas to dynamically configure agents:

```typescript
const supportAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  callOptionsSchema: z.object({
    userId: z.string(),
    accountType: z.enum(['free', 'pro', 'enterprise']),
  }),
  instructions: 'You are a helpful customer support agent.',
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: settings.instructions + `\nUser context:\n- Account type: ${options.accountType}\n- User ID: ${options.userId}`,
  }),
});

const result = await supportAgent.generate({
  prompt: 'How do I upgrade my account?',
  options: { userId: 'user_123', accountType: 'free' },
});
```

Use cases: RAG (inject retrieved documents), dynamic model selection, tool configuration per request, provider options.

**UI Integration** - Server-side and client-side integration with React:

```typescript
// Server
import { createAgentUIStreamResponse } from 'ai';
export async function POST(request: Request) {
  const { messages } = await request.json();
  return createAgentUIStreamResponse({ agent: weatherAgent, messages });
}

// Client
import { useChat } from '@ai-sdk/react';
import { InferAgentUIMessage } from 'ai';
type WeatherAgentUIMessage = InferAgentUIMessage<typeof weatherAgent>;
const { messages, sendMessage } = useChat<WeatherAgentUIMessage>();
```

**Custom Agent Implementations** - `Agent` is an interface, not a concrete class. Implement it to build custom architectures like multi-agent orchestrators:

```typescript
import { Agent } from 'ai';
class Orchestrator implements Agent {
  constructor(private subAgents: Record<string, Agent>) {}
}
```

### Tool Execution Approval

Tool approval system for human-in-the-loop patterns. Enable approval by setting `needsApproval`:

```typescript
import { tool } from 'ai';
import { z } from 'zod';

const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({ city: z.string() }),
  needsApproval: true,
  execute: async ({ city }) => fetchWeather(city),
});
```

**Dynamic Approval** - Make approval decisions based on tool input:

```typescript
const paymentTool = tool({
  description: 'Process a payment',
  inputSchema: z.object({ amount: z.number(), recipient: z.string() }),
  needsApproval: async ({ amount }) => amount > 1000,
  execute: async ({ amount, recipient }) => processPayment(amount, recipient),
});
```

**Client-Side Approval UI** - Handle approval requests in React:

```tsx
export function WeatherToolView({ invocation, addToolApprovalResponse }) {
  if (invocation.state === 'approval-requested') {
    return (
      <div>
        <p>Can I retrieve the weather for {invocation.input.city}?</p>
        <button onClick={() => addToolApprovalResponse({ id: invocation.approval.id, approved: true })}>Approve</button>
        <button onClick={() => addToolApprovalResponse({ id: invocation.approval.id, approved: false })}>Deny</button>
      </div>
    );
  }
  if (invocation.state === 'output-available') {
    return <div>Weather: {invocation.output.weather}, Temperature: {invocation.output.temperature}°F</div>;
  }
}
```

**Auto-Submit After Approvals** - Automatically continue conversation:

```typescript
import { useChat } from '@ai-sdk/react';
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';
const { messages, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
});
```

### Structured Output (Stable)

Generate structured data alongside multi-step tool calling. Previously only available with `generateObject`/`streamObject` (no tool calling). Now `ToolLoopAgent`, `generateText`, and `streamText` support structured output via the `output` parameter:

```typescript
import { Output, ToolLoopAgent, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ temperature: 72, condition: 'sunny' }),
    }),
  },
  output: Output.object({
    schema: z.object({
      summary: z.string(),
      temperature: z.number(),
      recommendation: z.string(),
    }),
  }),
});

const { output } = await agent.generate({
  prompt: 'What is the weather in San Francisco and what should I wear?',
});
// { summary: "It's sunny in San Francisco", temperature: 72, recommendation: "Wear light clothing and sunglasses" }
```

**Output Types** - `Output` object provides multiple strategies:
- `Output.object()` - Generate structured objects with Zod schemas
- `Output.array()` - Generate arrays of structured objects
- `Output.choice()` - Select from specific set of options
- `Output.text()` - Generate plain text (default)

**Streaming Structured Output** - Use `agent.stream()` to stream structured output as generated:

```typescript
const profileAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'Generate realistic person profiles.',
  output: Output.object({
    schema: z.object({ name: z.string(), age: z.number(), occupation: z.string() }),
  }),
});

const { partialOutputStream } = await profileAgent.stream({
  prompt: 'Generate a person profile.',
});

for await (const partial of partialOutputStream) {
  console.log(partial);
  // { name: "John" }
  // { name: "John", age: 30 }
  // { name: "John", age: 30, occupation: "Engineer" }
}
```

When using structured output with `generateText` or `streamText`, configure multiple steps with `stopWhen` because generating the structured output is itself a step (e.g., `stopWhen: stepCountIs(2)`).

### Reranking Support

Native reranking support to improve search relevance by reordering documents based on query-document relationships. Reranking models are specifically trained for this, producing more accurate relevance scores than embedding-based similarity search:

```typescript
import { rerank } from 'ai';
import { cohere } from '@ai-sdk/cohere';

const documents = ['sunny day at the beach', 'rainy afternoon in the city', 'snowy night in the mountains'];

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'talk about rain',
  topN: 2,
});

console.log(ranking);
// [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon in the city' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day at the beach' }
// ]
```

**Structured Document Reranking** - Reranking supports structured documents for searching databases, emails, etc.:

```typescript
const documents = [
  { from: 'Paul Doe', subject: 'Follow-up', text: 'We are happy to give you a discount of 20% on your next order.' },
  { from: 'John McGill', subject: 'Missing Info', text: 'Sorry, but here is the pricing information from Oracle: $5000/month' },
];

const { rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  topN: 1,
});

console.log(rerankedDocuments[0]);
// { from: 'John McGill', subject: 'Missing Info', text: '...' }
```

**Supported Providers** - Cohere, Amazon Bedrock, Together.ai

### Image Editing Support

Native support for image editing and generation workflows coming soon, enabling image-to-image transformations and multi-modal editing with text prompts.

### Migration from AI SDK 5.x

AI SDK 6 is expected to have minimal breaking changes. Most AI SDK 5 code will work with little or no modification.

**Timeline**: Beta available now, stable release end of 2025.

