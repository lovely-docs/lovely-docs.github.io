## Props in Legacy Mode

Declare props with `export let`:

```svelte
<script>
	export let foo;
	export let bar = 'default value';
</script>
```

Props without defaults are required. Set `undefined` as default to suppress warnings.

## Component Exports

Export functions/classes as public API:

```svelte
<script>
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script>
```

## Renaming Props

```svelte
<script>
	let className;
	export { className as class };
</script>
```