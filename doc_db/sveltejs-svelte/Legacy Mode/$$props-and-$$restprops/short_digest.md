## $$props and $$restProps

- **`$$props`**: All props passed to component
- **`$$restProps`**: All props except those declared with `export`

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>
```

Note: Modest performance penalty in Svelte 3/4, use only when needed.