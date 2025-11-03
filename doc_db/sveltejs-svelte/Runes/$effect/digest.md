## $effect

Effects are functions that run when state updates. They're useful for side effects like calling third-party libraries, drawing on canvas elements, or making network requests. Effects only run in the browser, not during server-side rendering.

**Basic usage:**
```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');
	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

Effects automatically track reactive values ($state, $derived, $props) that are synchronously read and re-run when those dependencies change. Values read asynchronously (after await or inside setTimeout) are not tracked.

**Teardown functions:**
Effects can return a teardown function that runs before the effect re-runs or when the component is destroyed:
```svelte
$effect(() => {
	const interval = setInterval(() => count += 1, milliseconds);
	return () => clearInterval(interval);
});
```

**Lifecycle:** Effects run after the component mounts and in a microtask after state changes. Re-runs are batched.

**Understanding dependencies:** An effect only depends on values it read during its last run. If a value is conditionally read, the effect only depends on it when that condition is true. An effect only reruns when the object itself changes, not when properties inside it change (unless you read the property directly).

**$effect.pre:** Runs code before DOM updates:
```svelte
$effect.pre(() => {
	messages.length; // dependency
	if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
		tick().then(() => div.scrollTo(0, div.scrollHeight));
	}
});
```

**$effect.tracking():** Returns whether code is running inside a tracking context (effect or template).

**$effect.root():** Creates a non-tracked scope for manually controlled nested effects:
```js
const destroy = $effect.root(() => {
	$effect(() => { /* setup */ });
	return () => { /* cleanup */ };
});
destroy();
```

**Avoid using $effect for state synchronization.** Use $derived instead:
```svelte
// Don't do this:
$effect(() => { doubled = count * 2; });

// Do this:
let doubled = $derived(count * 2);
```

For complex derived values, use $derived.by. For linking multiple values, use function bindings or oninput callbacks instead of effects.