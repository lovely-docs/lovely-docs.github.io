The `{@html ...}` tag injects raw HTML. Always sanitize input to prevent XSS. The expression must be valid standalone HTML and won't receive scoped styles—use `:global` to style injected content:

```svelte
<article>
	{@html content}
</article>

<style>
	article :global {
		a { color: hotpink }
	}
</style>
```