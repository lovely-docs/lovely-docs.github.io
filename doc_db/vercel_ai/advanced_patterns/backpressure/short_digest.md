## Back-pressure and Cancellation

Back-pressure is the consumer signaling the producer that more data isn't needed yet. Cancellation is stopping production when consumption stops.

**Problem (Eager Approach):** Using `for await (...)` in `ReadableStream.start()` creates a perpetual loop that pushes data regardless of consumer demand, causing unbounded buffer growth and memory exhaustion if the consumer stops reading.

**Solution (Lazy Approach):** Use the `pull` handler to produce data only when requested:

```jsx
function createStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) controller.close();
      else controller.enqueue(value);
    },
  });
}
```

This ties producer lifetime to consumer lifetime—when the consumer stops (e.g., user navigates away), production stops automatically and resources are freed.