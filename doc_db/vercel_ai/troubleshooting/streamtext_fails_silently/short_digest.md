## Problem
`streamText` fails silently without throwing errors; errors appear only in the stream.

## Solution
Use the `onError` callback to capture errors:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onError({ error }) {
    console.error(error);
  },
});
```