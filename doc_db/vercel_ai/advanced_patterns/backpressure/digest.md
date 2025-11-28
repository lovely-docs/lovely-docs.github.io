## Back-pressure and Cancellation with Streams

Back-pressure is the signal from a consumer to a producer that more values aren't needed yet. Cancellation is the ability to stop producing values when the consumer stops consuming them.

### The Problem: Eager Approach

When wrapping a generator into a `ReadableStream` using an eager `for await (...)` loop in the `start` handler, the stream doesn't respect back-pressure:

```jsx
function createStream(iterator) {
  return new ReadableStream({
    async start(controller) {
      for await (const v of iterator) {
        controller.enqueue(v);
      }
      controller.close();
    },
  });
}
```

This spawns a perpetual loop that pushes data as fast as possible, regardless of whether the consumer needs it. The stream's internal buffer grows unbounded, and there's no way to signal the producer to stop. If a consumer stops reading (e.g., user navigates away), the producer continues indefinitely, consuming memory until the program crashes.

### The Solution: Lazy Approach

Use the `pull` handler instead, which is called only when the consumer attempts to read more data:

```jsx
function createStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
```

This approach:
- Manually calls `iterator.next()` to get the next value
- Only produces data when requested by the consumer
- Ties the producer's lifetime to the consumer's lifetime
- Keeps the internal buffer minimal (typically 1 item)
- Automatically stops producing when the consumer stops consuming

### Real-world Example: AI Streaming

When streaming infinite AI responses (e.g., "count from 1 to infinity"), the eager approach causes the server to continue requesting data from the AI service even after the user navigates away. The fetch connection doesn't abort, and memory grows unbounded.

With the lazy approach, when the user navigates away and the fetch connection aborts, the `ReadableStream` stops requesting new data from the AI service. The connection is freed and can be garbage collected. This is how the AI SDK handles streaming responses.