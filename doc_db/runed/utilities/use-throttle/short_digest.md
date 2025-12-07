**useThrottle** - Throttles function execution to limit call frequency.

```svelte
const throttledUpdate = useThrottle(
	() => { throttledSearch = search; },
	() => 1000  // duration in ms
);
throttledUpdate(); // executes at most once per 1000ms
```