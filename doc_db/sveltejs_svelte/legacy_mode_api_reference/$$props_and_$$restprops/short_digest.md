## Legacy Props in Svelte

- **`$$props`**: All passed props (including undeclared)
- **`$$restProps`**: All props except explicitly exported ones

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>
```

Note: Has performance penalty; use only when needed. Modern alternative: `$props` rune.