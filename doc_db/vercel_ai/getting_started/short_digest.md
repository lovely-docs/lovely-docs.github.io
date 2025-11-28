## SDK Components

- **Core**: Unified LLM API for any JS environment
- **UI**: Framework hooks (React/Svelte/Vue) for streaming chat
- **RSC**: Experimental server-to-client streaming for Next.js App Router

## Pattern

1. API route: `streamText()` → `toUIMessageStreamResponse()`
2. UI: `useChat()` hook or `Chat` class
3. Messages: `{ id, role, parts[] }` where parts have `type` and data

## Tools & Multi-Step

```ts
tools: {
  weather: tool({
    description: 'Get weather',
    inputSchema: z.object({ location: z.string() }),
    execute: async ({ location }) => ({ temp: 72 }),
  }),
}

stopWhen: stepCountIs(5)  // Enable multi-step tool use
```

## Providers

Default: Vercel AI Gateway with string refs (`'anthropic/claude-sonnet-4.5'`)
Alternative: Install package and import (`openai('gpt-5.1')`)