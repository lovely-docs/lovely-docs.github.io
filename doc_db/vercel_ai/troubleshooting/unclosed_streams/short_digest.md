Streamable UI updates slowly if not closed. Call `.done()` on the stream to fix it:
```tsx
const stream = createStreamableUI('1');
stream.update('2');
stream.done('3'); // Required to close
```