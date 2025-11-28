## streamText()

Streams text from language models for real-time applications with tool support.

### Basic Usage
```ts
const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

### Key Parameters
- **Model & Input**: `model`, `system`, `prompt`, `messages` (supports text, images, files)
- **Tools**: `tools`, `toolChoice` ("auto"|"none"|"required"|specific), `activeTools`
- **Generation**: `maxOutputTokens`, `temperature`, `topP`, `topK`, `presencePenalty`, `frequencyPenalty`, `stopSequences`, `seed`
- **Advanced**: `maxRetries`, `abortSignal`, `headers`, `output` (structured outputs), `providerOptions`, `stopWhen`, `prepareStep`
- **Callbacks**: `onChunk`, `onError`, `onStepFinish`, `onFinish`, `onAbort`

### Return Values
**Promises** (auto-consume): `content`, `finishReason`, `usage`, `totalUsage`, `text`, `reasoning`, `reasoningText`, `sources`, `files`, `toolCalls`, `toolResults`, `request`, `response`, `warnings`, `steps`

**Streams**: 
- `textStream`: Text deltas only
- `fullStream`: All events (text, reasoning, sources, tool-calls, tool-results, errors)
- `partialOutputStream`: Partial parsed outputs
- `output`: Complete parsed output

**Utilities**: `consumeStream`, `toUIMessageStream`, `toUIMessageStreamResponse`, `toTextStreamResponse`, `pipeUIMessageStreamToResponse`, `pipeTextStreamToResponse`