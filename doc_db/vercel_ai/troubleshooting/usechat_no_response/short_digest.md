When `useChat` shows tool calls/results in logs but no model response, convert messages using `convertToModelMessages` before passing to `streamText`:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
});
```