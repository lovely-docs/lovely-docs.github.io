## Agent Abstraction
```typescript
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful weather assistant.',
  tools: { weather: weatherTool },
  callOptionsSchema: z.object({ userId: z.string() }),
  prepareCall: ({ options, ...settings }) => ({ ...settings, instructions: settings.instructions + `\nUser: ${options.userId}` }),
});
const result = await agent.generate({ prompt: 'What is the weather?', options: { userId: 'user_123' } });
```

## Tool Execution Approval
```typescript
const tool = tool({
  description: 'Process payment',
  inputSchema: z.object({ amount: z.number() }),
  needsApproval: async ({ amount }) => amount > 1000,
  execute: async ({ amount }) => processPayment(amount),
});

// Client UI
if (invocation.state === 'approval-requested') {
  return <button onClick={() => addToolApprovalResponse({ id: invocation.approval.id, approved: true })}>Approve</button>;
}
```

## Structured Output with Tools
```typescript
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: weatherTool },
  output: Output.object({ schema: z.object({ summary: z.string(), temperature: z.number() }) }),
});
const { output } = await agent.generate({ prompt: 'Weather in SF and what to wear?' });
// Streams with: for await (const partial of agent.stream(...).partialOutputStream)
```

## Reranking
```typescript
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day', 'rainy afternoon', 'snowy night'],
  query: 'talk about rain',
  topN: 2,
});
// Works with structured documents too
```

Installation: `npm install ai@beta @ai-sdk/openai@beta @ai-sdk/react@beta`