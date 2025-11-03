## $effect

Effects run when state updates for side effects like API calls or canvas drawing. They automatically track reactive values ($state, $derived, $props) read synchronously and re-run when dependencies change.

**Basic example:**
```svelte
$effect(() => {
	const context = canvas.getContext('2d');
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

**Teardown function** (runs before re-run or on destroy):
```svelte
$effect(() => {
	const interval = setInterval(() => count += 1, ms);
	return () => clearInterval(interval);
});
```

**Key points:**
- Only reruns when objects change, not properties inside them
- Asynchronously read values are not tracked
- Conditionally read values only create dependencies when the condition is true
- Use $derived for state synchronization, not $effect
- $effect.pre runs before DOM updates
- $effect.tracking() checks if in tracking context
- $effect.root() creates manually-controlled effects