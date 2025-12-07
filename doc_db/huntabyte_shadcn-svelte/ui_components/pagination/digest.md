## Pagination Component

A UI component for navigating through paginated content with page numbers, previous/next buttons, and ellipsis for skipped pages.

### Installation

```bash
npx shadcn-svelte@latest add pagination -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

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

### Configuration

- `count`: Total number of items to paginate
- `perPage`: Items per page
- `siblingCount`: Number of page links to show on either side of the current page (useful for responsive design)

### Responsive Example

Use `MediaQuery` to adjust pagination behavior on different screen sizes:

```svelte
<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  
  const isDesktop = new MediaQuery("(min-width: 768px)");
  const perPage = $derived(isDesktop.current ? 3 : 8);
  const siblingCount = $derived(isDesktop.current ? 1 : 0);
</script>

<Pagination.Root count={20} {perPage} {siblingCount}>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton>
          <ChevronLeftIcon class="size-4" />
          <span class="hidden sm:block">Previous</span>
        </Pagination.PrevButton>
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
        <Pagination.NextButton>
          <span class="hidden sm:block">Next</span>
          <ChevronRightIcon class="size-4" />
        </Pagination.NextButton>
      </Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
```

### Components

- `Pagination.Root`: Container with `count`, `perPage`, and `siblingCount` props
- `Pagination.Content`: Wrapper for pagination items
- `Pagination.Item`: Individual pagination element wrapper
- `Pagination.Link`: Clickable page number with `page` and `isActive` props
- `Pagination.PrevButton`: Previous page button
- `Pagination.NextButton`: Next page button
- `Pagination.Ellipsis`: Ellipsis indicator for skipped pages

The snippet receives `pages` (array of page objects with `type`, `key`, and `value` properties) and `currentPage` (current page number).