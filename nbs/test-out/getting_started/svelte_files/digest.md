## Structure

Components are written in `.svelte` files using HTML superset. All three sections (script, styles, markup) are optional.

## `<script>`

Runs when a component instance is created. Variables declared at top level are accessible in markup. Use runes to declare component props and add reactivity.

## `<script module>`

Runs once when the module first evaluates, not per instance. Variables are accessible elsewhere in the component but not vice versa. You can export bindings from this block (they become module exports), but not `export default` since the component itself is the default export.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

## `<style>`

CSS is scoped to the component only:

```svelte
<style>
	p {
		color: burlywood;
	}
</style>
```