## Cancelling Streams

**Core**: Use `abortSignal` to cancel server-side streams, with `onAbort` callback for cleanup:
```tsx
streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt,
  abortSignal: req.signal,
  onAbort: ({ steps }) => { /* persist partial results */ },
});
```

**UI Hooks**: Use `stop()` function from `useChat`/`useCompletion` to cancel client-side streams. Incompatible with `resume: true`.

**Cleanup**: `onAbort` callback receives `steps` array for persisting partial results, cleaning resources, or logging. For UI message streams, use `onFinish` with `isAborted` parameter and pass `consumeStream` function.

**RSC**: Not supported.