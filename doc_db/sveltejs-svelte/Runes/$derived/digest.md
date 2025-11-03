## $derived

Declare derived state that automatically updates when dependencies change:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>{doubled}</button>
```

Expressions must be side-effect free. Svelte prevents state mutations inside derived expressions.

### $derived.by

For complex derivations, use `$derived.by` with a function:

```svelte
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let sum = 0;
		for (const n of numbers) sum += n;
		return sum;
	});
</script>
```

`$derived(expression)` is equivalent to `$derived.by(() => expression)`.

### Dependencies

Anything read synchronously inside the derived expression becomes a dependency. When dependencies change, the derived is marked dirty and recalculated on next read. Use `untrack` to exempt state from being treated as a dependency.

### Overriding derived values

You can temporarily reassign derived values (unless declared with `const`) for optimistic UI:

```svelte
<script>
	let { post, like } = $props();
	let likes = $derived(post.likes);

	async function onclick() {
		likes += 1;
		try {
			await like();
		} catch {
			likes -= 1;
		}
	}
</script>

<button {onclick}>🧡 {likes}</button>
```

### Reactivity behavior

Unlike `$state`, `$derived` values are not converted to deeply reactive proxies. However, if a derived contains an object/array from reactive state, mutating its properties will affect the source.

### Update propagation

Svelte uses push-pull reactivity: state changes immediately notify dependents (push), but derived values only re-evaluate when read (pull). If a derived's new value is referentially identical to its previous value, downstream updates are skipped.