## Cancelling Streams

**Core:** Use `abortSignal` to cancel server-to-LLM streams, with `onAbort` callback for cleanup:
```tsx
streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt,
  abortSignal: req.signal,
  onAbort: ({ steps }) => { /* persist partial results */ },
  onFinish: ({ steps, totalUsage }) => { /* normal completion */ },
})
```

**UI:** Use `stop()` from `useChat`/`useCompletion` hooks to cancel client-to-server streams. Incompatible with `resume: true`.

**UI Message Streams:** Use `toUIMessageStreamResponse` with `consumeStream` function and `onFinish({ isAborted })` callback for proper abort handling.