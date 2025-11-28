## Regular Errors
Regular errors thrown by the SDK are caught using try/catch blocks:
```ts
try {
  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
} catch (error) {
  // handle error
}
```

## Streaming Errors (Simple Streams)
Errors during streams without error chunk support are thrown as regular errors and caught with try/catch:
```ts
try {
  const { textStream } = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
} catch (error) {
  // handle error
}
```

## Streaming Errors (Full Streams with Error Support)
Full streams support error parts that can be handled within the stream iteration. Wrap with try/catch for errors outside the stream:
```ts
try {
  const { fullStream } = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
  for await (const part of fullStream) {
    switch (part.type) {
      case 'error': {
        const error = part.error;
        // handle error
        break;
      }
      case 'abort': {
        // handle stream abort
        break;
      }
      case 'tool-error': {
        const error = part.error;
        // handle error
        break;
      }
    }
  }
} catch (error) {
  // handle error
}
```

## Stream Aborts
When streams are aborted (e.g., via stop button), use the `onAbort` callback for cleanup operations. The `onAbort` callback is called on abort via AbortSignal but not on normal completion, while `onFinish` is called on normal completion:
```ts
const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  onAbort: ({ steps }) => {
    console.log('Stream aborted after', steps.length, 'steps');
  },
  onFinish: ({ steps, totalUsage }) => {
    console.log('Stream completed normally');
  },
});
for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

The `onAbort` callback receives `steps` - an array of all completed steps before abort. Alternatively, handle abort events directly in the stream by checking for `chunk.type === 'abort'` in the fullStream iteration.