## $effect

Effects run when state updates and are useful for side effects like calling third-party libraries, drawing on canvas, or making network requests. They only run in the browser, not during SSR.

**Basic usage:**
```svelte
$effect(() => {
  const context = canvas.getContext('2d');
  context.fillStyle = color;
  context.fillRect(0, 0, size, size);
});
```

Effects automatically track reactive values (`$state`, `$derived`, `$props`) that are synchronously read and re-run when dependencies change. Values read asynchronously (after `await` or in `setTimeout`) are not tracked.

**Lifecycle:** Effects run after component mount and in a microtask after state changes. Re-runs are batched. Effects can return a teardown function that runs before re-runs or when the component is destroyed.

```svelte
$effect(() => {
  const interval = setInterval(() => count += 1, milliseconds);
  return () => clearInterval(interval);
});
```

**Dependency tracking:** Effects only depend on values read during the last run. Object reassignments trigger re-runs, but mutations don't. Conditional code means dependencies only include values read in executed branches.

**$effect.pre:** Runs code before DOM updates:
```svelte
$effect.pre(() => {
  if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
    tick().then(() => div.scrollTo(0, div.scrollHeight));
  }
});
```

**$effect.tracking():** Returns whether code runs in a tracking context (effect or template).

**$effect.root():** Creates a non-tracked scope for manually controlled nested effects, allowing effects outside component initialization.

**Avoid using $effect for:**
- Synchronizing state: use `$derived` instead
- Linking values: use `$derived` or function bindings
- Avoid infinite loops by using `untrack` if you must read and write the same state