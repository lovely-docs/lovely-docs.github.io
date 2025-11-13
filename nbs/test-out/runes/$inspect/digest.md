## $inspect

A development-only rune that logs values whenever they change, similar to `console.log` but reactive. Tracks deep changes in objects and arrays.

```svelte
<script>
	let count = $state(0);
	let message = $state('hello');
	$inspect(count, message); // logs when either changes
</script>
```

### $inspect(...).with

Returns a `with` method that accepts a callback instead of using `console.log`. The callback receives `"init"` or `"update"` as the first argument, followed by the inspected values.

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

Use `$inspect(stuff).with(console.trace)` to trace where changes originate.

### $inspect.trace()

Traces function execution in development. Must be the first statement in a function body. Logs which reactive state caused an effect or derived to re-run.

```svelte
<script>
	$effect(() => {
		$inspect.trace();
		doSomeWork();
	});
</script>
```

Accepts an optional label argument.