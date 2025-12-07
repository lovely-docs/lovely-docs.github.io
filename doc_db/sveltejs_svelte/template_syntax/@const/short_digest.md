The `{@const ...}` tag defines a local constant scoped to a block, component, or boundary. Can only be used as an immediate child of blocks like `{#if}`, `{#each}`, `{#snippet}`, components, or `<svelte:boundary>`.

Example: `{@const area = box.width * box.height}` inside an `{#each}` block.