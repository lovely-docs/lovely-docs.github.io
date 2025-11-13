## Pagination Component

A UI component for navigating through paginated content with page numbers, previous/next buttons, and ellipsis for skipped pages.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add pagination
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

- `count`: Total number of items
- `perPage`: Items per page
- `siblingCount`: Number of page links to show around current page (responsive example shows 1 on desktop, 0 on mobile)

### Components

- `Pagination.Root`: Container with pagination logic
- `Pagination.Content`: Wrapper for pagination items
- `Pagination.Item`: Individual pagination element
- `Pagination.Link`: Clickable page number
- `Pagination.PrevButton` / `Pagination.NextButton`: Navigation buttons
- `Pagination.Ellipsis`: Placeholder for skipped pages