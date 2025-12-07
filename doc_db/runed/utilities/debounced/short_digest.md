Debounced state wrapper with `cancel()`, `setImmediately(value)`, and `updateImmediately()` methods. Access debounced value via `.current`.

```ts
const debounced = new Debounced(() => search, 500);
debounced.cancel(); // cancel pending update
debounced.setImmediately(value); // set immediately
await debounced.updateImmediately(); // run pending update now
```