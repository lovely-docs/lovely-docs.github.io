## Structure

`.svelte` files contain optional `<script>`, `<style>`, and markup sections.

## `<script>` vs `<script module>`

- `<script>`: runs per component instance, variables accessible in markup
- `<script module>`: runs once at module load, can export bindings (not `export default`)

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