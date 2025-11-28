## Problem
`useChat` status shows "streaming" immediately but no text appears for seconds because status changes on connection/metadata streaming, not just LLM tokens.

## Solution
Check if last assistant message has actual content before showing loader:

```tsx
const showLoader =
  status === 'streaming' &&
  lastMessage?.role === 'assistant' &&
  lastMessage?.parts?.length === 0;
```

Or check for text parts specifically:
```tsx
const showLoader =
  status === 'streaming' &&
  lastMessage?.role === 'assistant' &&
  !lastMessage?.parts?.some(part => part.type === 'text');
```