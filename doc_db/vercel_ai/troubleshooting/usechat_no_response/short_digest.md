When `useChat` doesn't get a model response despite tool calls appearing in logs, wrap incoming messages with `convertToModelMessages()` before passing to `streamText()`:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
});
```