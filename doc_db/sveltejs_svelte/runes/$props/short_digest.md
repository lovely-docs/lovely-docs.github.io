## $props rune

Receive component props with destructuring:
```svelte
<script>
	let { adjective = 'happy' } = $props();
</script>
```

Supports renaming (`{ super: trouper }`), rest properties (`...others`), and type annotations. Props update reactively but should not be mutated unless bindable. Use `$props.id()` to generate unique instance IDs for linking elements.