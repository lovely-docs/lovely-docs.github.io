## useObject Hook

React/Svelte/Vue hook for streaming structured JSON object generation with partial results.

**Basic setup:**
```tsx
const { object, submit } = useObject({
  api: '/api/endpoint',
  schema: z.object({ /* ... */ }),
});
```

**Server-side:**
```ts
streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: notificationSchema,
  prompt: 'Generate...',
}).toTextStreamResponse();
```

**Enum classification mode:**
```tsx
useObject({
  schema: z.object({ enum: z.enum(['true', 'false']) }),
})
```
Server: `streamObject({ output: 'enum', enum: [...], ... })`

**State & callbacks:**
- Returns: `object`, `isLoading`, `error`, `submit()`, `stop()`
- Callbacks: `onFinish({ object, error })`, `onError(error)`
- Config: `api`, `headers`, `credentials`