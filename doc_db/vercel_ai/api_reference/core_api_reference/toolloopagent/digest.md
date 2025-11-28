## ToolLoopAgent

A reusable AI agent class that creates autonomous, multi-step agents capable of generating text, streaming responses, and using tools iteratively until a stop condition is reached. Unlike single-step calls like `generateText()`, agents can invoke tools, collect results, and decide next actions in a reasoning-and-acting loop.

### Constructor Parameters

**Required:**
- `model` (LanguageModel): The language model instance to use

**Optional:**
- `instructions` (string | SystemModelMessage): System prompt/context for the agent
- `tools` (Record<string, Tool>): Set of tools the agent can call (requires model support for tool calling)
- `toolChoice` (ToolChoice): Tool selection strategy - 'auto' | 'none' | 'required' | { type: 'tool', toolName: string }. Default: 'auto'
- `stopWhen` (StopCondition | StopCondition[]): Condition(s) for ending the loop. Default: stepCountIs(20)
- `activeTools` (Array<string>): Limits available tools for a specific call
- `output` (Output): Structured output specification for type-safe response parsing
- `prepareStep` (PrepareStepFunction): Function to mutate step settings or inject state per step
- `experimental_repairToolCall` (ToolCallRepairFunction): Callback for automatic recovery from unparseable tool calls
- `onStepFinish` (GenerateTextOnStepFinishCallback): Callback after each agent step completes
- `experimental_context` (unknown): Custom context object passed to each tool call
- `experimental_telemetry` (TelemetrySettings): Telemetry configuration
- `experimental_download` (DownloadFunction): Custom download function for files/URLs
- `maxOutputTokens` (number): Maximum tokens the model can generate
- `temperature` (number): Sampling temperature for randomness
- `topP` (number): Top-p (nucleus) sampling parameter
- `topK` (number): Top-k sampling parameter
- `presencePenalty` (number): Presence penalty parameter
- `frequencyPenalty` (number): Frequency penalty parameter
- `stopSequences` (string[]): Custom token sequences that stop output
- `seed` (number): Seed for deterministic generation
- `maxRetries` (number): Retry attempts on failure. Default: 2
- `abortSignal` (AbortSignal): Signal to cancel the request
- `providerOptions` (ProviderOptions): Provider-specific configuration
- `id` (string): Custom agent identifier

### Methods

**`generate()`**: Generates a response and triggers tool calls as needed, running the agent loop until completion. Returns a GenerateTextResult.
- Parameters: `prompt` (string | Array<ModelMessage>) or `messages` (Array<ModelMessage>), optional `abortSignal`
- Example:
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
console.log(result.text);
console.log(result.steps); // Array of all steps taken
```

**`stream()`**: Streams a response from the agent including reasoning and tool calls as they occur. Returns a StreamTextResult.
- Parameters: `prompt` (string | Array<ModelMessage>) or `messages` (Array<ModelMessage>), optional `abortSignal`, optional `experimental_transform`
- Example:
```ts
const stream = agent.stream({
  prompt: 'Tell me a short story about a time traveler.',
});
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

### Types

**`InferAgentUIMessage<AgentType, MetadataType?>`**: Infers the UI message type for a given agent instance for type-safe UI and message exchanges. Optionally accepts a second type argument for custom message metadata.

Example with metadata:
```ts
import { z } from 'zod';
const metadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
  finishReason: z.string().optional(),
});
type AgentUIMessage = InferAgentUIMessage<typeof agent, z.infer<typeof metadataSchema>>;
```

### Additional Examples

**Agent with Output Parsing**:
```ts
import { z } from 'zod';
const analysisAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  output: {
    schema: z.object({
      sentiment: z.enum(['positive', 'negative', 'neutral']),
      score: z.number(),
      summary: z.string(),
    }),
  },
});
const result = await analysisAgent.generate({
  prompt: 'Analyze this review: "The product exceeded my expectations!"',
});
console.log(result.output); // Type-safe output
```