Reactive utility that tracks the previous value of a getter function via `previous.current` property. Useful for state change comparisons and transitions.

```ts
const previous = new Previous(() => count);
console.log(previous.current); // previous value
```