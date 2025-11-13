## $effect

Effects run when state updates and are used for side effects like calling third-party libraries, drawing on canvas, or making network requests. They only run in the browser, not during SSR.

Effects automatically track reactive values (`$state`, `$derived`, `$props`) that are synchronously read and re-run when those dependencies change. Values read asynchronously (after `await` or inside `setTimeout`) are not tracked.

```svelte
$effect(() => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

Effects run after component mount and in a microtask after state changes. Re-runs are batched and happen after DOM updates. Effects can return a teardown function that runs before re-runs or when the component is destroyed.

```svelte
$effect(() => {
	const interval = setInterval(() => count += 1, milliseconds);
	return () => clearInterval(interval);
});
```

An effect only re-runs when the object it reads changes, not when properties inside it change. An effect only depends on values read during its last run, so conditional code affects dependencies.

**$effect.pre**: Runs code before DOM updates.

**$effect.tracking()**: Returns whether code is running inside a tracking context (effect or template).

**$effect.pending()**: Returns the count of pending promises in the current boundary.

**$effect.root()**: Creates a non-tracked scope for manually controlled nested effects outside component initialization.

## When not to use $effect

Don't use effects to synchronize state. Use `$derived` instead:

```svelte
// Don't do this
$effect(() => { doubled = count * 2; });

// Do this
let doubled = $derived(count * 2);
```

Avoid using effects to link values together. Use derived values or function bindings instead of multiple effects that update each other.