## Structure

`.svelte` files contain optional script, styles, and markup sections.

## `<script>` vs `<script module>`

- `<script>`: Runs per instance, variables accessible in markup
- `<script module>`: Runs once at module load, can export bindings (not `export default`)

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
</script>
```

## `<style>`

CSS is automatically scoped to the component.