## Overview
AI SDK uses OpenTelemetry to collect telemetry data. The feature is experimental and may change. Telemetry is disabled by default and must be explicitly enabled per function call.

## Enabling Telemetry
For Next.js applications, follow the Next.js OpenTelemetry guide first. Then use the `experimental_telemetry` option on specific function calls:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: { isEnabled: true },
});
```

Control input/output recording with `recordInputs` and `recordOutputs` (both enabled by default). Disable for privacy, data transfer, or performance reasons.

## Telemetry Metadata
Provide a `functionId` to identify the function and `metadata` for additional information:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'my-awesome-function',
    metadata: {
      something: 'custom',
      someOtherThing: 'other-value',
    },
  },
});
```

## Custom Tracer
Provide a custom OpenTelemetry `Tracer` to use a `TracerProvider` other than the singleton:

```ts
const tracerProvider = new NodeTracerProvider();
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: {
    isEnabled: true,
    tracer: tracerProvider.getTracer('ai'),
  },
});
```

## Collected Data

### generateText
Records 3 span types:
- `ai.generateText`: full call span with attributes `operation.name`, `ai.operationId`, `ai.prompt`, `ai.response.text`, `ai.response.toolCalls`, `ai.response.finishReason`, `ai.settings.maxOutputTokens`
- `ai.generateText.doGenerate`: provider call span with `ai.prompt.messages`, `ai.prompt.tools` (stringified array), `ai.prompt.toolChoice` (stringified JSON with `type` and optional `toolName`), `ai.response.text`, `ai.response.toolCalls`, `ai.response.finishReason`
- `ai.toolCall`: tool call span (see Tool call spans section)

### streamText
Records 3 span types and 2 event types:
- `ai.streamText`: full call span with `ai.prompt`, `ai.response.text`, `ai.response.toolCalls`, `ai.response.finishReason`, `ai.settings.maxOutputTokens`
- `ai.streamText.doStream`: provider call span with `ai.prompt.messages`, `ai.prompt.tools`, `ai.prompt.toolChoice`, `ai.response.text`, `ai.response.toolCalls`, `ai.response.msToFirstChunk`, `ai.response.msToFinish`, `ai.response.avgCompletionTokensPerSecond`, `ai.response.finishReason`
- `ai.toolCall`: tool call span
- `ai.stream.firstChunk` event: emitted when first chunk received, contains `ai.response.msToFirstChunk`
- `ai.stream.finish` event: emitted when finish part received

### generateObject
Records 2 span types:
- `ai.generateObject`: full call span with `ai.prompt`, `ai.schema` (stringified JSON schema), `ai.schema.name`, `ai.schema.description`, `ai.response.object` (stringified JSON), `ai.settings.output`
- `ai.generateObject.doGenerate`: provider call span with `ai.prompt.messages`, `ai.response.object`, `ai.response.finishReason`

### streamObject
Records 2 span types and 1 event type:
- `ai.streamObject`: full call span with `ai.prompt`, `ai.schema` (stringified), `ai.schema.name`, `ai.schema.description`, `ai.response.object` (stringified), `ai.settings.output`
- `ai.streamObject.doStream`: provider call span with `ai.prompt.messages`, `ai.response.object`, `ai.response.msToFirstChunk`, `ai.response.finishReason`
- `ai.stream.firstChunk` event: contains `ai.response.msToFirstChunk`

### embed
Records 2 span types:
- `ai.embed`: full call span with `ai.value`, `ai.embedding` (JSON-stringified)
- `ai.embed.doEmbed`: provider call span with `ai.values` (array), `ai.embeddings` (array of JSON-stringified embeddings)

### embedMany
Records 2 span types:
- `ai.embedMany`: full call span with `ai.values`, `ai.embeddings` (array of JSON-stringified embeddings)
- `ai.embedMany.doEmbed`: provider call span with `ai.values`, `ai.embeddings` (array of JSON-stringified embeddings)

## Span Details

### Basic LLM span information
Spans for `ai.generateText`, `ai.generateText.doGenerate`, `ai.streamText`, `ai.streamText.doStream`, `ai.generateObject`, `ai.generateObject.doGenerate`, `ai.streamObject`, `ai.streamObject.doStream` contain:
- `resource.name`: functionId
- `ai.model.id`: model id
- `ai.model.provider`: provider name
- `ai.request.headers.*`: request headers
- `ai.response.providerMetadata`: provider-specific metadata
- `ai.settings.maxRetries`: max retries
- `ai.telemetry.functionId`: functionId
- `ai.telemetry.metadata.*`: custom metadata
- `ai.usage.completionTokens`: completion token count
- `ai.usage.promptTokens`: prompt token count

### Call LLM span information
Spans for individual LLM calls (`ai.generateText.doGenerate`, `ai.streamText.doStream`, `ai.generateObject.doGenerate`, `ai.streamObject.doStream`) contain basic LLM span information plus:
- `ai.response.model`: actual model used (may differ from requested if provider supports aliases)
- `ai.response.id`: response id from provider
- `ai.response.timestamp`: response timestamp from provider
- OpenTelemetry GenAI semantic conventions: `gen_ai.system`, `gen_ai.request.model`, `gen_ai.request.temperature`, `gen_ai.request.max_tokens`, `gen_ai.request.frequency_penalty`, `gen_ai.request.presence_penalty`, `gen_ai.request.top_k`, `gen_ai.request.top_p`, `gen_ai.request.stop_sequences`, `gen_ai.response.finish_reasons`, `gen_ai.response.model`, `gen_ai.response.id`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`

### Basic embedding span information
Spans for `ai.embed`, `ai.embed.doEmbed`, `ai.embedMany`, `ai.embedMany.doEmbed` contain:
- `ai.model.id`: model id
- `ai.model.provider`: provider name
- `ai.request.headers.*`: request headers
- `ai.settings.maxRetries`: max retries
- `ai.telemetry.functionId`: functionId
- `ai.telemetry.metadata.*`: custom metadata
- `ai.usage.tokens`: token count
- `resource.name`: functionId

### Tool call spans
`ai.toolCall` spans contain:
- `operation.name`: `"ai.toolCall"`
- `ai.operationId`: `"ai.toolCall"`
- `ai.toolCall.name`: tool name
- `ai.toolCall.id`: tool call id
- `ai.toolCall.args`: input parameters
- `ai.toolCall.result`: output result (only if successful and serializable)