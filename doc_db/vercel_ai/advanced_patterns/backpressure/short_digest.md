## Back-pressure and Cancellation

**Problem:** Eager `for await (...)` in `ReadableStream.start()` continuously pushes values without respecting back-pressure, causing unbounded buffer growth and preventing cancellation.

**Solution:** Use the `pull` handler with manual `iterator.next()` calls to produce values lazily, only when the consumer requests them.

**Eager (bad):**
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

**Lazy (good):**
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

Lazy approach ties producer lifetime to consumer lifetime, preventing memory leaks when consumers disconnect and enabling proper resource cleanup in streaming AI responses.