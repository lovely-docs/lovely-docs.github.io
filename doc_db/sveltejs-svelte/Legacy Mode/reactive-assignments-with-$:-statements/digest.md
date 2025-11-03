## Reactive $: Statements (Legacy Mode)

In legacy Svelte, prefix top-level statements with `$:` to make them reactive. These run after other script code and before markup renders, then re-run whenever their dependencies change.

**Basic reactive statement and assignment:**
```svelte
<script>
	let a = 1;
	let b = 2;

	$: console.log(`${a} + ${b} = ${sum}`);
	$: sum = a + b;
</script>
```

Statements are ordered topologically by dependencies—`sum` calculates before the console.log even though it appears later.

**Multiple statements in a block:**
```js
$: {
	total = 0;
	for (const item of items) {
		total += item.value;
	}
}
```

**Destructuring assignment:**
```js
$: ({ larry, moe, curly } = stooges);
```

## Understanding Dependencies

Dependencies are determined at compile time based on which variables are referenced (not assigned). Indirect dependencies won't trigger re-runs:

```js
let count = 0;
let double = () => count * 2;
$: doubled = double();  // won't re-run when count changes
```

Topological ordering fails with indirect references. This won't work:
```svelte
<script>
	let x = 0;
	let y = 0;
	$: z = y;
	$: setY(x);  // y updates here, but z already ran
	function setY(value) { y = value; }
</script>
```

Move `$: z = y` after `$: setY(x)` to fix it.

## Browser-Only Code

Reactive statements run during server-side rendering. Wrap browser-only code in a conditional:
```js
$: if (browser) {
	document.title = title;
}
```