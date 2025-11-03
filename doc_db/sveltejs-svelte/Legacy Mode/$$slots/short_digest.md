Use `$$slots` object in legacy mode to check if a named slot was provided. Keys are slot names passed by parent.

```svelte
{#if $$slots.description}
	<slot name="description" />
{/if}
```