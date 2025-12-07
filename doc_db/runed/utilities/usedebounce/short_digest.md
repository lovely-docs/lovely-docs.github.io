Creates a debounced version of a callback with configurable delay. Returns a function with `runScheduledNow()`, `cancel()`, and `pending` property.

```svelte
const debounced = useDebounce(callback, () => delayMs);
debounced(); // schedule execution
debounced.runScheduledNow(); // execute immediately
debounced.cancel(); // cancel pending
```