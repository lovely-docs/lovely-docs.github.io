Use `:global(selector)` to apply styles globally. Use `-global-` prefix for keyframes. Use `:global {...}` block for multiple global selectors:

```svelte
<style>
	:global(body) { margin: 0; }
	@keyframes -global-my-animation { }
	:global { div { } p { } }
</style>
```