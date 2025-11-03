The `{#key expression}...{/key}` block destroys and recreates its contents when the expression changes. Useful for reinitializing components or replaying transitions:

```svelte
{#key value}
	<Component />
{/key}
```