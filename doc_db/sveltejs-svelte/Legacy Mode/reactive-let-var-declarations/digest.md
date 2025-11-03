## Reactive let/var declarations in legacy mode

In legacy mode, top-level variables are automatically reactive. Reassigning or mutating them triggers UI updates.

```svelte
<script>
	let count = 0;
</script>

<button on:click={() => count += 1}>
	clicks: {count}
</button>
```

Reactivity is based on assignments, not mutations. Array methods like `.push()` and `.splice()` won't trigger updates—you must reassign the variable afterward:

```svelte
<script>
	let numbers = [1, 2, 3, 4];

	function addNumber() {
		numbers.push(numbers.length + 1); // doesn't trigger update
		numbers = numbers; // reassignment triggers update
	}
</script>
```