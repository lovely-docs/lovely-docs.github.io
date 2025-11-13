The `{@const ...}` tag defines a local constant within a block scope. Can only be used as an immediate child of blocks like `{#if}`, `{#each}`, `{#snippet}`, components, or `<svelte:boundary>`.

```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```