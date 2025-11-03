Svelte scopes component styles by adding a hash-based class (e.g., `svelte-123xyz`) to elements. Scoped selectors get a 0-1-0 specificity boost, taking precedence over global styles. Keyframes are also scoped automatically:

```svelte
<style>
	@keyframes bounce { /* ... */ }
	.bouncy { animation: bounce 10s; }
</style>
```