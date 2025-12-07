## Call Options

Pass type-safe runtime inputs to dynamically modify agent behavior without creating multiple agent instances.

**Define and use:**
```ts
const agent = new ToolLoopAgent({
  callOptionsSchema: z.object({ userId: z.string(), complexity: z.enum(['simple', 'complex']) }),
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    model: options.complexity === 'simple' ? 'gpt-4o-mini' : 'o1-mini',
    instructions: settings.instructions + `\nUser: ${options.userId}`,
  }),
});

await agent.generate({ prompt: '...', options: { userId: 'user_123', complexity: 'simple' } });
```

**Use cases:** Dynamic context injection, model selection, tool configuration, provider options, RAG, combining multiple modifications. `prepareCall` can be async for data fetching.