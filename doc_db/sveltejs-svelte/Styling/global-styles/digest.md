## :global(...) modifier

Apply styles to a single selector globally using `:global(...)`:

```svelte
<style>
	:global(body) {
		margin: 0;
	}

	div :global(strong) {
		color: goldenrod;
	}

	p:global(.big.red) {
		/* applies to p elements in this component with class="big red" */
	}
</style>
```

## Global keyframes

Prepend keyframe names with `-global-` to make them accessible globally. The `-global-` prefix is removed during compilation:

```svelte
<style>
	@keyframes -global-my-animation-name {
		/* code goes here */
	}
</style>
```

## :global block

Apply styles to multiple selectors globally using `:global {...}` block:

```svelte
<style>
	:global {
		div { ... }
		p { ... }
	}

	.a :global {
		.b .c .d { ... }
	}
</style>
```

Equivalent to `.a :global .b .c .d` where everything after `:global` is unscoped.