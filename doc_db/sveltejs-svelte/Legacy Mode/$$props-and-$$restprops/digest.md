## $$props and $$restProps in Legacy Mode

In legacy mode (non-runes), use `$$props` and `$$restProps` to work with component props:

- **`$$props`**: Object containing all props passed to the component, including undeclared ones
- **`$$restProps`**: Object containing all props except those individually declared with `export`

### Example: Button Component

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>
```

Here, `variant` is explicitly exported, so it's excluded from `$$restProps`. The `$$restProps` are spread onto the button element, and `$$props.class` is used to merge any class prop with the variant class.

### Performance Note

In Svelte 3/4, using `$$props` and `$$restProps` incurs a modest performance penalty, so use them only when necessary.