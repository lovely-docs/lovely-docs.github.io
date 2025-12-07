When `useChat` shows "streaming" status but no text appears, check if the last assistant message has actual content parts. Only show a loader when `status === 'streaming'` and the message has no text parts yet:

```tsx
const showLoader =
  status === 'streaming' &&
  lastMessage?.role === 'assistant' &&
  lastMessage?.parts?.length === 0;
```