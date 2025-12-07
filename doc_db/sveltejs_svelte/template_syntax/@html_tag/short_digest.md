`{@html ...}` injects raw HTML. Requires valid standalone HTML, sanitize to prevent XSS. Injected content bypasses scoped styles—use `:global` modifier to style it.

Example:
```svelte
<article>{@html content}</article>
<style>
	article :global {
		a { color: hotpink }
	}
</style>
```