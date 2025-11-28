## Problem
Streaming AI responses with `useChat` or `useCompletion` cause "Maximum update depth exceeded" error due to re-rendering on every chunk.

## Solution
Add `experimental_throttle: 50` option to throttle UI updates:
```tsx
const { messages, ... } = useChat({ experimental_throttle: 50 })
const { completion, ... } = useCompletion({ experimental_throttle: 50 })
```