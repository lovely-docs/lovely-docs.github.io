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
