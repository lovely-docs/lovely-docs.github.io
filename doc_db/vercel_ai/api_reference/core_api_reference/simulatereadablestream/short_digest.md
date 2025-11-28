## simulateReadableStream()

Creates a ReadableStream that emits values sequentially with configurable delays. Useful for testing streaming or simulating time-delayed data.

**Parameters:**
- `chunks` (T[]): Values to emit
- `initialDelayInMs` (number | null): Delay before first value (default: 0)
- `chunkDelayInMs` (number | null): Delay between values (default: 0)

**Returns:** ReadableStream<T> that emits chunks sequentially with specified delays, then closes.

**Examples:**
```ts
// Basic
simulateReadableStream({ chunks: ['Hello', ' ', 'World'] });

// With delays
simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: 1000,
  chunkDelayInMs: 500,
});

// No delays
simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: null,
  chunkDelayInMs: null,
});
```