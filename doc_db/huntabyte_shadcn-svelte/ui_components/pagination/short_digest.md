## Pagination Component

Navigation component for paginated content with page numbers, previous/next buttons, and ellipsis.

### Installation

```bash
npx shadcn-svelte@latest add pagination -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Pagination from "$lib/components/ui/pagination/index.js";
</script>

<Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton />
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton />
      </Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
```

### Key Props

- **Pagination.Root**: `count` (total items), `perPage` (items per page), `siblingCount` (optional, page numbers around current)
- **Pagination.Link**: `page` object, `isActive` boolean for highlighting current page