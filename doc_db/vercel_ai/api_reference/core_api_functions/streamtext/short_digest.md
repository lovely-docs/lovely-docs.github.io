## streamText()

Streams text from language models for real-time applications. Supports tools, structured outputs, and multi-step generation.

### Basic Usage
```ts
const { textStream } = streamText({
  model: openai('gpt-4'),
  prompt: 'Invent a new holiday',
});

for await (const text of textStream) {
  process.stdout.write(text);
}
```

### Key Parameters
- **Model & Input**: `model`, `system`, `prompt`, `messages` (with text/image/file support)
- **Tools**: `tools`, `toolChoice`, `activeTools`, `stopWhen`
- **Generation**: `maxOutputTokens`, `temperature`, `topP`, `topK`, `presencePenalty`, `frequencyPenalty`, `stopSequences`, `seed`
- **Advanced**: `output` (structured outputs), `prepareStep` (per-step customization), `experimental_telemetry`, `experimental_transform`
- **Callbacks**: `onChunk`, `onError`, `onStepFinish`, `onFinish`, `onAbort`

### Return Values
**Promises** (auto-consume): `text`, `content`, `finishReason`, `usage`, `totalUsage`, `toolCalls`, `toolResults`, `sources`, `files`, `reasoning`, `response`, `steps`

**Streams**: 
- `textStream`: Text deltas only
- `fullStream`: All events (text, tool calls, tool results, errors, step markers)
- `partialOutputStream`: Partial parsed outputs
- `output`: Complete parsed output

**Response Conversion**: `toTextStreamResponse()`, `toUIMessageStreamResponse()`, `pipeTextStreamToResponse()`, `pipeUIMessageStreamToResponse()`

### Examples
```ts
// Chat
const { text } = await streamText({
  model: openai('gpt-4'),
  messages: [{ role: 'user', content: 'What is the capital of France?' }]
});

// With tools
const { fullStream } = streamText({
  model: openai('gpt-4'),
  prompt: 'Get weather',
  tools: {
    getWeather: {
      description: 'Get weather',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temp: 72 })
    }
  }
});

// Structured output
const { output } = await streamText({
  model: openai('gpt-4'),
  prompt: 'Generate recipe',
  output: Output.object({ schema: z.object({ name: z.string() }) })
});

// With callbacks
streamText({
  model: openai('gpt-4'),
  prompt: 'Hello',
  onChunk: (event) => console.log(event.chunk),
  onFinish: (result) => console.log(result.text)
});

// Next.js response
export async function POST(req: Request) {
  const result = streamText({
    model: openai('gpt-4'),
    messages: await req.json()
  });
  return result.toTextStreamResponse();
}
```