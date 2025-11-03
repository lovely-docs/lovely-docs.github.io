## $inspect

Development-only rune that logs values whenever they change, tracking deep reactivity in objects and arrays.

```svelte
$inspect(count, message); // logs on change
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect(stuff).with(console.trace); // find origin of changes
```

### $inspect.trace()

Traces which reactive state caused an effect/derived to re-run. Must be first statement in function body.

```svelte
$effect(() => {
	$inspect.trace();
	doSomeWork();
});
```