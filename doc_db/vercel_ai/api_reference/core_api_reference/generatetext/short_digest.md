## generateText()

Generates text and calls tools using a language model for non-interactive use cases (automation, agents).

### Basic Usage
```ts
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

### Key Parameters
- `model`: Language model to use
- `system`/`prompt`/`messages`: Input specification
- `tools`: Callable tools with description, inputSchema, optional execute function
- `toolChoice`: "auto" | "none" | "required" | specific tool
- `maxOutputTokens`, `temperature`, `topP`, `topK`, `presencePenalty`, `frequencyPenalty`, `stopSequences`, `seed`
- `maxRetries`, `abortSignal`, `headers`, `providerOptions`
- `stopWhen`, `prepareStep`: Multi-step control
- `output`: Structured output (text, object, array, choice, json)
- `onStepFinish`, `onFinish`: Callbacks for step and completion events
- `experimental_telemetry`, `experimental_context`, `experimental_download`, `experimental_repairToolCall`

### Return Value
- `text`: Generated text
- `reasoning`/`reasoningText`: Model reasoning (if available)
- `toolCalls`/`toolResults`: Tool invocations and results
- `finishReason`: Why generation stopped
- `usage`/`totalUsage`: Token counts
- `sources`, `files`: Generated sources and files
- `response`: Response metadata with id, modelId, timestamp, headers, messages
- `steps`: Per-step results for multi-step generation