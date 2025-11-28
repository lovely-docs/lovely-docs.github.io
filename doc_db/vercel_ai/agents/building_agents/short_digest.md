## ToolLoopAgent Class

Encapsulates LLM configuration, tools, and behavior into reusable components with automatic agent loop handling.

### Basic Creation
```ts
const myAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { /* tools */ },
});
```

### Key Configuration

**Tools:**
```ts
tools: {
  runCode: tool({
    description: 'Execute Python code',
    inputSchema: z.object({ code: z.string() }),
    execute: async ({ code }) => ({ output: 'Code executed successfully' }),
  }),
}
```

**Loop Control:** Default 20 steps, each step is one generation (text or tool call).
```ts
stopWhen: stepCountIs(20)
// or combine: stopWhen: [stepCountIs(20), yourCustomCondition()]
```

**Tool Choice:** `'required'`, `'none'`, `'auto'` (default), or force specific tool:
```ts
toolChoice: { type: 'tool', toolName: 'weather' }
```

**Structured Output:**
```ts
output: Output.object({
  schema: z.object({
    sentiment: z.enum(['positive', 'neutral', 'negative']),
    summary: z.string(),
  }),
})
```

### System Instructions

Define behavior, personality, and constraints. Examples: role definition, behavioral guidelines, behavior constraints, tool usage guidance, format/style requirements.

### Usage

```ts
// Generate text
const result = await myAgent.generate({ prompt: 'What is the weather like?' });

// Stream text
const stream = myAgent.stream({ prompt: 'Tell me a story' });
for await (const chunk of stream.textStream) { console.log(chunk); }

// API response
return createAgentUIStreamResponse({ agent: myAgent, messages });
```

### Type Safety

```ts
export type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;

// Use in client
const { messages } = useChat<MyAgentUIMessage>();
```