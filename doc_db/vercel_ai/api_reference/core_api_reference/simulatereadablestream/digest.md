## simulateReadableStream()

Utility function that creates a ReadableStream emitting provided values sequentially with configurable delays. Useful for testing streaming functionality or simulating time-delayed data streams.

### Import
```ts
import { simulateReadableStream } from 'ai';
```

### Parameters
- `chunks` (T[], required): Array of values to be emitted by the stream
- `initialDelayInMs` (number | null, optional): Initial delay in milliseconds before emitting the first value. Defaults to 0. Set to null to skip the initial delay entirely.
- `chunkDelayInMs` (number | null, optional): Delay in milliseconds between emitting each value. Defaults to 0. Set to null to skip delays between chunks.

### Returns
ReadableStream<T> that:
- Emits each value from the chunks array sequentially
- Waits for initialDelayInMs before emitting the first value (if not null)
- Waits for chunkDelayInMs between emitting subsequent values (if not null)
- Closes automatically after all chunks have been emitted

### Type Parameters
- T: The type of values contained in the chunks array and emitted by the stream

### Examples

Basic usage:
```ts
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
});
```

With delays (1 second initial, 0.5 seconds between chunks):
```ts
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: 1000,
  chunkDelayInMs: 500,
});
```

Without delays:
```ts
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: null,
  chunkDelayInMs: null,
});
```