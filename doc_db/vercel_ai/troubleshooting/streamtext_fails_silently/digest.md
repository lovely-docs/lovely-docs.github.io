## Problem
`streamText` function does not work - it fails silently without throwing errors, and the stream only contains error parts.

## Why This Happens
`streamText` immediately starts streaming to enable sending data without waiting for the model. Errors become part of the stream rather than being thrown, which prevents servers from crashing when errors occur.

## Solution
Use the `onError` callback to capture and log errors:

```tsx
import { streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onError({ error }) {
    console.error(error); // your error logging logic here
  },
});
```

The `onError` callback is triggered whenever an error occurs during streaming, allowing you to implement custom error logging or handling logic.