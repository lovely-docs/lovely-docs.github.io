## Structure

Svelte components are written in `.svelte` files using HTML superset syntax. All three sections (script, styles, markup) are optional.

```svelte
<script module>
	// module-level logic (runs once when module evaluates)
</script>

<script>
	// instance-level logic (runs per component instance)
</script>

<!-- markup -->

<style>
	/* scoped styles */
</style>
```

## `<script>`

Contains JavaScript or TypeScript (add `lang="ts"` attribute) that runs when a component instance is created. Top-level variables are accessible in markup. Use runes to declare component props and add reactivity.

## `<script module>`

Runs once when the module first evaluates, not per instance. Variables declared here can be referenced elsewhere in the component. You can export bindings from this block (they become module exports), but not `export default` since the component itself is the default export.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

In Svelte 4, this was created using `<script context="module">`.

## `<style>`

CSS is scoped to the component only. Selectors only affect elements within that component.

```svelte
<style>
	p {
		color: burlywood;
	}
</style>
```