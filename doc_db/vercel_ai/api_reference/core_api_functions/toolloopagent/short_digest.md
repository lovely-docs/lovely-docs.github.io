## ToolLoopAgent

Multi-step autonomous agent that iteratively calls tools and reasons over results until completion.

### Key Features
- `generate()`: Runs agent loop, returns GenerateTextResult with steps array
- `stream()`: Streams agent reasoning and tool calls in real-time
- Configurable stop conditions, tool selection, output parsing, and callbacks
- Type-safe UI messages via `InferAgentUIMessage<AgentType, MetadataType>`

### Quick Example
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool, calculator: calculatorTool },
  stopWhen: stepCountIs(3),
});

const result = await agent.generate({
  prompt: 'What is the weather in NYC and what is 100 * 25?',
});
console.log(result.text, result.steps);

// Streaming
const stream = agent.stream({ prompt: 'Tell me a story.' });
for await (const chunk of stream.textStream) process.stdout.write(chunk);

// Type-safe output parsing
const analysisAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  output: { schema: z.object({ sentiment: z.enum(['positive', 'negative', 'neutral']), score: z.number() }) },
});
const result = await analysisAgent.generate({ prompt: 'Analyze: "Great product!"' });
console.log(result.output);
```