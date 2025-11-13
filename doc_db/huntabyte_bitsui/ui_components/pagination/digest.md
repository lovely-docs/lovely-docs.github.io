## Pagination Component

Enables users to navigate through a series of pages.

### Basic Usage

```svelte
<script lang="ts">
  import { Pagination } from "bits-ui";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
</script>

<Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, range })}
    <div class="flex items-center">
      <Pagination.PrevButton>
        <CaretLeft class="size-6" />
      </Pagination.PrevButton>
      <div class="flex items-center gap-2.5">
        {#each pages as page (page.key)}
          {#if page.type === "ellipsis"}
            <div>...</div>
          {:else}
            <Pagination.Page {page}>
              {page.value}
            </Pagination.Page>
          {/if}
        {/each}
      </div>
      <Pagination.NextButton>
        <CaretRight class="size-6" />
      </Pagination.NextButton>
    </div>
    <p>Showing {range.start} - {range.end}</p>
  {/snippet}
</Pagination.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let myPage = $state(1);
</script>
<button onclick={() => (myPage = 2)}>Go to page 2</button>
<Pagination.Root bind:page={myPage}>
  <!-- ... -->
</Pagination.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myPage = $state(1);
  function getPage() { return myPage; }
  function setPage(newPage: number) { myPage = newPage; }
</script>
<Pagination.Root bind:page={getPage, setPage}>
  <!-- ... -->
</Pagination.Root>
```

### API Reference

**Pagination.Root** - Main component
- `count` (required): Total number of items
- `page` ($bindable): Selected page number
- `onPageChange`: Callback when page changes
- `perPage`: Items per page (default: 1)
- `siblingCount`: Page triggers to show on either side of current page (default: 1)
- `loop`: Whether pagination loops when reaching end (default: false)
- `orientation`: 'horizontal' or 'vertical' (default: 'horizontal')
- `children`: Snippet receiving `{ pages, range, currentPage }`

**Pagination.Page** - Page button
- `page`: PageItem object with type ('page' or 'ellipsis') and value
- Data attribute: `data-selected` on current page, `data-pagination-page` on all page triggers

**Pagination.PrevButton** - Previous button
- Data attribute: `data-pagination-prev-button`

**Pagination.NextButton** - Next button
- Data attribute: `data-pagination-next-button`

The `pages` snippet prop contains items of type 'page' (actual page number) or 'ellipsis' (placeholder between pages).