## Reactive $: Statements (Legacy)

Prefix top-level statements with `$:` to make them reactive. They re-run when dependencies change and are topologically ordered.

```svelte
<script>
	let a = 1, b = 2;
	$: sum = a + b;
	$: console.log(`${a} + ${b} = ${sum}`);
	
	$: {
		total = 0;
		for (const item of items) total += item.value;
	}
	
	$: ({ x, y } = obj);
	$: if (browser) document.title = title;
</script>
```

Dependencies are determined at compile time by variable references. Indirect dependencies and closures won't work—the compiler must see direct variable usage.