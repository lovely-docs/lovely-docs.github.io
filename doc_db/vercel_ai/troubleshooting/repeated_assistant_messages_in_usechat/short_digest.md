## Problem
Assistant messages duplicate in UI when using `useChat` with `streamText` because `toUIMessageStreamResponse` generates new message IDs.

## Solution
Pass `originalMessages` option to `toUIMessageStreamResponse()` to reuse existing message IDs:
```tsx
return result.toUIMessageStreamResponse({
  originalMessages: messages,
  generateMessageId: generateId,
  onFinish: ({ messages }) => {
    saveChat({ id, messages });
  },
});
```