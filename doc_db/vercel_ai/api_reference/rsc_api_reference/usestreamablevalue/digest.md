React hook that consumes streamable values created with `createStreamableValue`. Returns a tuple of `[data, error, pending]` where data is the current streamed value, error is any exception thrown during streaming, and pending is a boolean indicating if the stream is still in progress.

Import: `import { useStreamableValue } from "@ai-sdk/rsc"`

Usage example:
```tsx
function MyComponent({ streamableValue }) {
  const [data, error, pending] = useStreamableValue(streamableValue);

  if (pending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Data: {data}</div>;
}
```

Typical use case is consuming streamable values passed as component props from server-side streaming operations. Note: AI SDK RSC is experimental; AI SDK UI is recommended for production.