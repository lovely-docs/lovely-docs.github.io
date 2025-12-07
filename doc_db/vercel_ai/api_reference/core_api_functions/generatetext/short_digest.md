## generateText()

Generates text and optionally calls tools using a language model. Supports conversation messages, structured outputs, tool execution, multi-step generation, and callbacks.

**Core parameters:** model, prompt/messages, system, tools, toolChoice, output

**Generation control:** temperature, topP, topK, maxOutputTokens, stopSequences, seed, penalties

**Advanced:** maxRetries, abortSignal, prepareStep (per-step customization), onStepFinish/onFinish callbacks, experimental features (telemetry, download, repairToolCall)

**Returns:** text, reasoning, toolCalls, toolResults, usage (input/output/total tokens), finishReason, response metadata, steps array

**Examples:**
```ts
// Text generation
const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Invent a holiday'
});

// With tools
const { toolCalls } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Get weather',
  tools: { getWeather: { inputSchema: z.object(...), execute: async (...) => ... } }
});

// Structured output
const { output } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Generate person',
  output: Output.object({ schema: z.object({ name: z.string() }) })
});

// Multi-step with callbacks
const { text, steps } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Solve problem',
  tools: { ... },
  prepareStep: ({ stepNumber }) => stepNumber === 1 ? { toolChoice: 'required' } : {},
  onFinish: ({ text, totalUsage }) => console.log(text, totalUsage)
});
```