## Props in Legacy Mode

Declare props with `export` keyword, optionally with defaults:

```svelte
<script>
	export let foo;
	export let bar = 'default value';
</script>
```

## Component Exports

Export functions/classes as public API:

```svelte
<script>
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script>
```

Access via `bind:this`:

```svelte
<Greeter bind:this={greeter} />
<button on:click={() => greeter.greet('world')}>greet</button>
```

## Renaming Props

Rename props using separate export syntax:

```svelte
<script>
	let className;
	export { className as class };
</script>
```