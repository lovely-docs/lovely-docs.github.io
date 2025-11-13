In legacy mode, `$$slots` is an object whose keys are the names of slots provided to a component. Use it to conditionally render optional slots:

```svelte
{#if $$slots.description}
	<slot name="description" />
{/if}
```

In runes mode, use snippet props instead.