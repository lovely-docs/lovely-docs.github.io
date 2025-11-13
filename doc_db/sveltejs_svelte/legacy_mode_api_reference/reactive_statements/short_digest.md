## Reactive $: Statements (Legacy)

Prefix top-level statements with `$:` to make them reactive—they re-run when dependencies change and are topologically ordered.

```svelte
<script>
	let a = 1, b = 2;
	$: sum = a + b;
	$: console.log(`${a} + ${b} = ${sum}`);
</script>
```

**Key points:**
- Dependencies determined at compile time by direct variable references
- Indirect dependencies (through function calls) don't work
- Runs during SSR—wrap browser-only code: `$: if (browser) { ... }`
- Can use blocks and destructuring assignments