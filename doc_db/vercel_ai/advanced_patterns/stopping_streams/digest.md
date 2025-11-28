## Cancelling Streams

Streams can be cancelled when users want to stop responses or from server-side logic.

### AI SDK Core

Use the `abortSignal` argument to cancel streams from server to LLM API, typically by forwarding the request's abort signal:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt,
  abortSignal: req.signal,
  onAbort: ({ steps }) => {
    console.log('Stream aborted after', steps.length, 'steps');
    // Persist partial results to database
  },
});
return result.toTextStreamResponse();
```

### AI SDK UI

Hooks like `useChat` and `useCompletion` provide a `stop()` helper function to cancel streams from client to server:

```tsx
const { input, completion, stop, status, handleSubmit, handleInputChange } = useCompletion();
return (
  <div>
    {(status === 'submitted' || status === 'streaming') && (
      <button type="button" onClick={() => stop()}>Stop</button>
    )}
    {completion}
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={handleInputChange} />
    </form>
  </div>
);
```

**Warning**: Stream abort is incompatible with stream resumption (`resume: true`). Choose one or the other.

### Handling Stream Abort Cleanup

The `onAbort` callback is called when a stream is aborted via `AbortSignal`, distinct from `onFinish` which handles normal completion:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a long story...',
  abortSignal: controller.signal,
  onAbort: ({ steps }) => {
    await savePartialResults(steps);
    await logAbortEvent(steps.length);
  },
  onFinish: ({ steps, totalUsage }) => {
    await saveFinalResults(steps, totalUsage);
  },
});
```

The `onAbort` callback receives `steps` (array of completed steps before abort). Use it for:
- Persisting partial conversation history
- Saving partial progress for later continuation
- Cleaning up server-side resources
- Logging abort events for analytics

You can also handle abort events directly in the stream:

```tsx
for await (const part of result.fullStream) {
  switch (part.type) {
    case 'abort':
      console.log('Stream was aborted');
      break;
  }
}
```

### UI Message Streams

For `toUIMessageStreamResponse`, the `onFinish` callback receives an `isAborted` parameter. Pass the `consumeStream` function for proper abort handling:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  abortSignal: req.signal,
});

return result.toUIMessageStreamResponse({
  onFinish: async ({ isAborted }) => {
    if (isAborted) {
      console.log('Stream was aborted');
    } else {
      console.log('Stream completed normally');
    }
  },
  consumeSseStream: consumeStream,
});
```

The `consumeStream` function ensures proper stream consumption even when aborted, preventing memory leaks or hanging connections.

### AI SDK RSC

Stream stopping is not currently supported in AI SDK RSC.