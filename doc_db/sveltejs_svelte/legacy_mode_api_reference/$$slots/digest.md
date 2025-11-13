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

This allows conditional rendering of optional slots. If a parent doesn't provide `slot="description"`, the `$$slots.description` check will be falsy and that section won't render.

In runes mode, use snippet props instead since they're normal props and you can check them directly.