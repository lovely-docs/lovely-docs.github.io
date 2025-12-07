## ToolLoopAgent

Encapsulates LLM configuration, tools, and behavior. Handles agent loop automatically for multi-step tool calling.

```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: {
    runCode: tool({
      description: 'Execute Python code',
      inputSchema: z.object({ code: z.string() }),
      execute: async ({ code }) => ({ output: 'Code executed successfully' }),
    }),
  },
  toolChoice: 'auto', // 'required', 'none', or { type: 'tool', toolName: '...' }
  stopWhen: stepCountIs(20), // or [stepCountIs(20), customCondition()]
  output: Output.object({ schema: z.object({ /* ... */ }) }),
});
```

**System instructions** guide behavior, personality, and constraints. Can specify role, detailed guidelines, rules, tool usage patterns, and output format.

**Usage:**
- `await agent.generate({ prompt: '...' })` - one-time generation
- `agent.stream({ prompt: '...' })` - streaming
- `createAgentUIStreamResponse({ agent, messages })` - API response

**Type safety:** `InferAgentUIMessage<typeof agent>` for client components with `useChat`.