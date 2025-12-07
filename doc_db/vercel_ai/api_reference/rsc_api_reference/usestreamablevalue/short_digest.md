React hook that consumes streamable values and returns `[data, error, pending]` tuple. Useful for handling streamed data in components.

```tsx
const [data, error, pending] = useStreamableValue(streamableValue);
```