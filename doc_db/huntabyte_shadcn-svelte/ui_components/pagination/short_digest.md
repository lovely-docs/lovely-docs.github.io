## Pagination Component

Navigable pagination UI with page numbers, prev/next buttons, and ellipsis.

```svelte
<Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item><Pagination.PrevButton /></Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item><Pagination.NextButton /></Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
```

Install: `pnpm dlx shadcn-svelte@latest add pagination`