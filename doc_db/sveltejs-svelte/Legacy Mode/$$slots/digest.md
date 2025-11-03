In legacy mode, use the `$$slots` object to check which slots were provided to a component. The object's keys are the names of slots passed by the parent component.

```svelte
<!-- Card.svelte -->
<div>
	<slot name="title" />
	{#if $$slots.description}
		<hr />
		<slot name="description" />
	{/if}
</div>
```

This pattern allows rendering optional content only when a corresponding slot is provided. In runes mode, use snippets as normal props instead.