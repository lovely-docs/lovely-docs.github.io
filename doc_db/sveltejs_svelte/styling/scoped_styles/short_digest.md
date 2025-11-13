Svelte scopes component styles by adding a hash-based class (e.g., `svelte-123xyz`) to elements. Scoped selectors get a 0-1-0 specificity boost, overriding global styles. Keyframe names are also scoped automatically.

```svelte
<style>
	p { color: burlywood; } /* only affects <p> in this component */
	@keyframes bounce { /* scoped to component */ }
</style>
```