## Issue
When using `useChat` with `resume: true` for stream resumption, the abort functionality breaks. Closing a tab, refreshing the page, or calling the `stop()` function triggers an abort signal that interferes with the resumption mechanism, preventing streams from being properly resumed.

## Root Cause
When a page is closed or refreshed, the browser automatically sends an abort signal, which breaks the resumption flow.

## Current Limitation
Abort functionality and stream resumption are incompatible. Choose one based on your application's requirements.

## Option 1: Stream resumption without abort
For long-running generations that persist across page reloads:
```tsx
const { messages, sendMessage } = useChat({
  id: chatId,
  resume: true,
});
```

## Option 2: Abort without stream resumption
For allowing users to stop streams manually:
```tsx
const { messages, sendMessage, stop } = useChat({
  id: chatId,
  resume: false,
});
```

Related topics: Chatbot Resume Streams, Stopping Streams