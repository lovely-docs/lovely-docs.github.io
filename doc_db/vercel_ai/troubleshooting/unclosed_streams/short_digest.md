Streamable UI updates slowly when not closed. Call `.done()` on the stream to close it properly:

```tsx
const stream = createStreamableUI('1');
stream.update('2');
stream.done('3'); // Closes the stream
```