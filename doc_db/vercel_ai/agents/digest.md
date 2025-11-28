## Agents

LLM agents use tools in loops to accomplish tasks. The `ToolLoopAgent` class encapsulates model, tools, and behavior into reusable components that automatically orchestrate the agent loop.

### Core Concepts

Agents combine three components:
- **LLMs** process input and decide next actions
- **Tools** extend capabilities (file I/O, APIs, databases)
- **Loop** orchestrates execution through context management and stopping conditions

### Creating an Agent

```ts
import { ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: {
    weather: tool({
      description: 'Get weather in a location',
      inputSchema: z.object({
        location: z.string(),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72,
      }),
    }),
  },
  stopWhen: stepCountIs(20),
});

const result = await agent.generate({
  prompt: 'What is the weather in San Francisco?',
});
```

### Configuration

**Loop Control**: Default 20 steps. Combine multiple stop conditions:
```ts
stopWhen: [stepCountIs(20), hasToolCall('someTool')]
```

**Tool Choice**: Control tool usage with `'required'` (force), `'none'` (disable), or `'auto'` (default):
```ts
toolChoice: { type: 'tool', toolName: 'weather' }
```

**Structured Output**: Define output schema with Zod:
```ts
output: Output.object({
  schema: z.object({
    sentiment: z.enum(['positive', 'neutral', 'negative']),
    summary: z.string(),
  }),
})
```

**System Instructions**: Define behavior, personality, and constraints in the `instructions` field.

### Usage Patterns

**Generate**: One-time text generation
```ts
const result = await agent.generate({ prompt: '...' });
```

**Stream**: Stream text chunks
```ts
const stream = agent.stream({ prompt: '...' });
for await (const chunk of stream.textStream) { }
```

**API Response**: Create streaming response for client applications
```ts
return createAgentUIStreamResponse({ agent, messages });
```

### Advanced Control

**Prepare Step**: Modify model, tools, messages, or context before each step:
```ts
prepareStep: async ({ stepNumber, messages }) => {
  if (stepNumber > 2) {
    return { model: 'anthropic/claude-sonnet-4.5' };
  }
  return {};
}
```

**Call Options**: Type-safe runtime configuration via `callOptionsSchema` and `prepareCall`:
```ts
const agent = new ToolLoopAgent({
  callOptionsSchema: z.object({ userId: z.string() }),
  prepareCall: async ({ options }) => ({
    instructions: `User: ${options.userId}`,
  }),
});

agent.generate({ prompt: '...', options: { userId: 'user123' } });
```

**Manual Loop**: Use `generateText`/`streamText` for complete control over message history and stopping conditions.

### Workflow Patterns

Five patterns for structured agent workflows:
- **Sequential**: Steps execute in order, output feeds into next step
- **Routing**: Model decides path based on context
- **Parallel**: Independent subtasks run concurrently
- **Orchestrator-Worker**: Primary model coordinates specialized workers
- **Evaluator-Optimizer**: Evaluation steps assess results and trigger retries

### Type Safety

Infer types for agent UI messages:
```ts
export type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;
```

Use in client components for full type safety.