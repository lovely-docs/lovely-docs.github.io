## ToolLoopAgent

Reusable AI agent for multi-step autonomous reasoning with tool calling in a loop until a stop condition.

### Constructor
- **Required**: `model` (LanguageModel)
- **Key Optional**: `instructions`, `tools`, `toolChoice` ('auto'|'none'|'required'|{type,toolName}), `stopWhen` (default: stepCountIs(20)), `activeTools`, `output`, `onStepFinish`, plus standard LLM parameters (temperature, topP, topK, penalties, seed, maxRetries, etc.)

### Methods
- **`generate(prompt | messages, abortSignal?)`**: Runs agent loop, returns GenerateTextResult with text and steps array
- **`stream(prompt | messages, abortSignal?, experimental_transform?)`**: Streams agent response, returns StreamTextResult

### Types
- **`InferAgentUIMessage<AgentType, MetadataType?>`**: Type-safe UI message type inference

### Examples
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: weatherTool, calculator: calculatorTool },
  stopWhen: stepCountIs(3),
});
const result = await agent.generate({ prompt: 'What is the weather in NYC and what is 100 * 25?' });
console.log(result.text, result.steps);

// Streaming
const stream = agent.stream({ prompt: 'Tell me a story.' });
for await (const chunk of stream.textStream) process.stdout.write(chunk);

// Output parsing
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  output: { schema: z.object({ sentiment: z.enum(['positive', 'negative', 'neutral']), score: z.number() }) },
});
```