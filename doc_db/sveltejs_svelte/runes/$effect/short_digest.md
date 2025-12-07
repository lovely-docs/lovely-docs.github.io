## $effect

Runs functions when state updates (browser-only). Automatically tracks reactive value dependencies and re-runs when they change.

**Basic usage:**
```svelte
$effect(() => {
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

**Lifecycle:** Runs after mount, in microtask after state changes, batched. Can return teardown function.

**Dependencies:** Tracks synchronous reads of `$state`/`$derived`/`$props`. Asynchronous reads not tracked. Only re-runs when object itself changes, not properties. Conditional code affects which values are dependencies.

**Variants:**
- `$effect.pre()` — runs before DOM updates
- `$effect.tracking()` — returns if in tracking context
- `$effect.pending()` — count of pending promises
- `$effect.root()` — non-tracked scope with manual cleanup

**Don't use for state sync** — use `$derived` instead. Don't create circular dependencies — use `$derived` + function bindings. Use `untrack()` if you must update state in effect.