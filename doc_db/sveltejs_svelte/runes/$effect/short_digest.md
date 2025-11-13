## $effect

Effects run when state updates for side effects (canvas drawing, network requests, etc). They track synchronously-read reactive values and re-run when dependencies change. Asynchronously-read values are not tracked.

```svelte
$effect(() => {
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

Effects can return teardown functions that run before re-runs or on component destroy.

**Variants**: `$effect.pre` (runs before DOM updates), `$effect.tracking()` (checks if in tracking context), `$effect.pending()` (counts pending promises), `$effect.root()` (manual control).

**Don't use effects for state synchronization** — use `$derived` instead. Avoid multiple effects updating each other; use derived values or function bindings.