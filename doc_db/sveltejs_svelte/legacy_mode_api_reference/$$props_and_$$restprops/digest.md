## Legacy Props Handling

In legacy mode (pre-runes), use `$$props` and `$$restProps` to work with component props:

- **`$$props`**: Object containing all props passed to the component, including undeclared ones
- **`$$restProps`**: Object containing all props except those explicitly declared with `export`

### Example: Button Component

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>
```

This passes all props to the `<button>` element except `variant`, which is handled separately. The `class` prop is merged with the variant class.

**Performance Note**: Using `$$props` and `$$restProps` incurs a modest performance penalty in Svelte 3/4, so use them only when necessary. In modern runes mode, use the `$props` rune instead.