## useObject Hook
React/Svelte/Vue hook for streaming structured JSON objects. Define a Zod schema, use `useObject` on client with `streamObject` on server.

Client:
```tsx
const { object, submit, isLoading, error, stop } = useObject({
  api: '/api/endpoint',
  schema: yourSchema,
  onFinish({ object, error }) { },
  onError(error) { },
});
```

Server:
```ts
const result = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: notificationSchema,
  prompt: 'Your prompt',
});
return result.toTextStreamResponse();
```

For enum classification, use `output: 'enum'` with schema `z.object({ enum: z.enum([...]) })`.

Handle partial results during streaming. Use `isLoading`, `error`, `stop()` for UI states. Optional callbacks: `onFinish`, `onError`. Configure with `api`, `headers`, `credentials`.