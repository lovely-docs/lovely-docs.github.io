## Props Declaration

In legacy mode, component props are declared using the `export` keyword:

```svelte
<script>
	export let foo;
	export let bar = 'default value';
</script>
```

Props with default values use that value if the prop is `undefined` when the component is created. Props without defaults are required and trigger a development warning if not provided. Suppress the warning by setting `undefined` as the default:

```js
export let foo = undefined;
```

## Component Exports

Exported `const`, `class`, or `function` declarations are not props—they become part of the component's public API:

```svelte
<script>
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script>
```

Parent components can access these via a bound reference:

```svelte
<script>
	import Greeter from './Greeter.svelte';
	let greeter;
</script>

<Greeter bind:this={greeter} />
<button on:click={() => greeter.greet('world')}>greet</button>
```

## Renaming Props

Use separate `export` syntax to rename props, useful for reserved words:

```svelte
<script>
	let className;
	export { className as class };
</script>
```