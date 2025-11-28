## Problem
When using `useChat` or `useCompletion` hooks in React with the AI SDK, streaming AI responses cause a "Maximum update depth exceeded" error.

## Root Cause
By default, the UI re-renders on every chunk that arrives from the stream. This excessive rendering can overload the rendering pipeline, particularly on slower devices or when complex components like Markdown need updating, causing React's update depth limit to be exceeded.

## Solution
Use the `experimental_throttle` option to throttle UI updates to a specified millisecond interval.

### useChat Example
```tsx
const { messages, ... } = useChat({
  experimental_throttle: 50
})
```

### useCompletion Example
```tsx
const { completion, ... } = useCompletion({
  experimental_throttle: 50
})
```

The throttle value (50ms in examples) delays UI updates, batching multiple stream chunks together before re-rendering, preventing the maximum update depth error.