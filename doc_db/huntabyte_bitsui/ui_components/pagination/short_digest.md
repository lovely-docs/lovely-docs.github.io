## Pagination Component

Navigate through pages with `Pagination.Root`, `Pagination.Page`, `Pagination.PrevButton`, and `Pagination.NextButton`.

**Basic example:**
```svelte
<Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, range })}
    <Pagination.PrevButton><CaretLeft /></Pagination.PrevButton>
    {#each pages as page (page.key)}
      {#if page.type === "ellipsis"}
        <div>...</div>
      {:else}
        <Pagination.Page {page}>{page.value}</Pagination.Page>
      {/if}
    {/each}
    <Pagination.NextButton><CaretRight /></Pagination.NextButton>
    <p>Showing {range.start} - {range.end}</p>
  {/snippet}
</Pagination.Root>
```

**State management:**
- Two-way binding: `bind:page={myPage}`
- Fully controlled: `bind:page={getPage, setPage}` with function bindings

**Key props:**
- `count`: Total items (required)
- `perPage`: Items per page (default: 1)
- `siblingCount`: Page buttons around current (default: 1)
- `loop`: Wrap around at end (default: false)
- `orientation`: 'horizontal' or 'vertical' (default: 'horizontal')