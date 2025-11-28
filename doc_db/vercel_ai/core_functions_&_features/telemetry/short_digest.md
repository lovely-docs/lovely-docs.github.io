## Enabling Telemetry
Use `experimental_telemetry` option on function calls (disabled by default):

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: { isEnabled: true },
});
```

Control recording with `recordInputs` and `recordOutputs` (both enabled by default).

## Metadata and Custom Tracer
Add `functionId` and `metadata`:

```ts
experimental_telemetry: {
  isEnabled: true,
  functionId: 'my-awesome-function',
  metadata: { something: 'custom' },
}
```

Or provide custom `tracer`:

```ts
experimental_telemetry: {
  isEnabled: true,
  tracer: tracerProvider.getTracer('ai'),
}
```

## Collected Spans and Events
- **generateText**: `ai.generateText`, `ai.generateText.doGenerate`, `ai.toolCall` spans
- **streamText**: `ai.streamText`, `ai.streamText.doStream`, `ai.toolCall` spans + `ai.stream.firstChunk`, `ai.stream.finish` events
- **generateObject**: `ai.generateObject`, `ai.generateObject.doGenerate` spans
- **streamObject**: `ai.streamObject`, `ai.streamObject.doStream` spans + `ai.stream.firstChunk` event
- **embed**: `ai.embed`, `ai.embed.doEmbed` spans
- **embedMany**: `ai.embedMany`, `ai.embedMany.doEmbed` spans

All spans include model info, usage tokens, headers, and custom metadata. LLM call spans include OpenTelemetry GenAI semantic conventions. Tool call spans include tool name, id, args, and result.