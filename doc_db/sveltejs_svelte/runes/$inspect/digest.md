## $inspect

A development-only rune for debugging reactive state changes, equivalent to `console.log` but re-runs whenever its arguments change. Tracks reactive state deeply, so updates to nested properties in objects or arrays trigger re-execution.

```svelte
<script>
	let count = $state(0);
	let message = $state('hello');
	$inspect(count, message); // logs when either changes
</script>
```

On updates, a stack trace is printed to help identify the origin of state changes.

### $inspect(...).with

Returns a `with` property that accepts a callback invoked instead of `console.log`. The callback receives `"init"` or `"update"` as the first argument, followed by the inspected values.

```svelte
<script>
	let count = $state(0);
	$inspect(count).with((type, count) => {
		if (type === 'update') {
			debugger;
		}
	});
</script>
```

### $inspect.trace()

Added in 5.14. Traces the surrounding function in development, printing to console which reactive state caused an effect or derived to re-run. Must be the first statement in a function body. Accepts an optional label argument.

```svelte
<script>
	$effect(() => {
		$inspect.trace();
		doSomeWork();
	});
</script>
```