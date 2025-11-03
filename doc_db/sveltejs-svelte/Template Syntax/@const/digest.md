The `{@const ...}` tag defines a local constant within a block scope.

**Usage:**
```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```

**Constraints:**
`{@const}` can only be used as an immediate child of:
- Block statements: `{#if ...}`, `{#each ...}`, `{#snippet ...}`, etc.
- Component elements: `<Component />`
- Boundary elements: `<svelte:boundary>`