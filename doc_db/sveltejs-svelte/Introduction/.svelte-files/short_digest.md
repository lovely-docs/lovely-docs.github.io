Svelte components use `.svelte` files with optional `<script>`, `<style>`, and markup sections. `<script>` runs per instance, `<script module>` runs once at module load. CSS in `<style>` is automatically scoped to the component.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
</script>

<style>
	p { color: burlywood; }
</style>
```