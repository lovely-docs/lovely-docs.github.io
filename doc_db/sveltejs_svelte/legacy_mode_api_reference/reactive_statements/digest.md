## Reactive $: Statements (Legacy Mode)

In legacy Svelte, top-level statements can be made reactive by prefixing with `$:`. These run after other script code and before markup renders, then re-run whenever their dependencies change.

**Basic Usage:**
```svelte
<script>
	let a = 1;
	let b = 2;
	$: console.log(`${a} + ${b} = ${sum}`);
	$: sum = a + b;
</script>
```

Statements are ordered topologically by dependencies—`sum` calculates before the console.log even though it appears later.

**Block Statements:**
Multiple statements can be combined in a block:
```js
$: {
	total = 0;
	for (const item of items) {
		total += item.value;
	}
}
```

**Destructuring:**
The left-hand side can be a destructuring assignment:
```js
$: ({ larry, moe, curly } = stooges);
```

## Understanding Dependencies

Dependencies are determined at compile time by which variables are referenced (not assigned). Indirect dependencies fail—a statement won't re-run if a dependency is accessed through a function call rather than directly referenced.

Example of broken dependency:
```js
let count = 0;
let double = () => count * 2;
$: doubled = double();  // won't re-run when count changes
```

## Browser-Only Code

Reactive statements run during server-side rendering. Wrap browser-only code in a conditional:
```js
$: if (browser) {
	document.title = title;
}
```