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

**State management:** Use `bind:page={myPage}` for two-way binding or `bind:page={getPage, setPage}` for full control.

**Key props:** `count` (total items), `perPage` (default: 1), `siblingCount` (default: 1), `loop` (default: false), `orientation` ('horizontal' | 'vertical', default: 'horizontal'), `onPageChange` callback.

**Data attributes:** `data-selected` on current page, `data-pagination-page` on page triggers, `data-pagination-prev-button`, `data-pagination-next-button`.