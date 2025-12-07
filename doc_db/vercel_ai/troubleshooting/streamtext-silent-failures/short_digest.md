## streamText Silent Failures

`streamText` streams immediately, so errors become part of the stream instead of throwing. Use the `onError` callback to capture errors:

```tsx
streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onError({ error }) {
    console.error(error);
  },
});
```