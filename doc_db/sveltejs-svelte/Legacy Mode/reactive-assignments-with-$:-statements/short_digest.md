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
- Dependencies determined at compile time by variable references
- Indirect dependencies won't trigger re-runs
- Statements run during SSR; wrap browser-only code: `$: if (browser) { ... }`