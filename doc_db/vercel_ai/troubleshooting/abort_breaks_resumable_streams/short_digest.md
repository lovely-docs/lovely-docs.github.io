## Issue
`useChat` with `resume: true` breaks when abort is triggered (tab close, page refresh, or `stop()` call).

## Workaround
Choose one approach:
- **Stream resumption**: `useChat({ id: chatId, resume: true })`
- **Abort support**: `useChat({ id: chatId, resume: false })`