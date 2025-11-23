## Pagination Component

A UI component for navigating through paginated content with page numbers, previous/next buttons, and ellipsis for skipped pages.

### Installation

```bash
npx shadcn-svelte@latest add pagination -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import and use the Pagination component:

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

### Component Structure

- **Pagination.Root**: Container that accepts `count` (total items), `perPage` (items per page), and optional `siblingCount` (page numbers shown around current page)
- **Pagination.Content**: Wrapper for pagination items
- **Pagination.Item**: Individual pagination element container
- **Pagination.Link**: Clickable page number link with `isActive` prop to highlight current page
- **Pagination.PrevButton**: Previous page button
- **Pagination.NextButton**: Next page button
- **Pagination.Ellipsis**: Ellipsis indicator for skipped pages

### Advanced Example with Responsive Behavior

```svelte
<script lang="ts">
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import { MediaQuery } from "svelte/reactivity";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  
  const isDesktop = new MediaQuery("(min-width: 768px)");
  const count = 20;
  const perPage = $derived(isDesktop.current ? 3 : 8);
  const siblingCount = $derived(isDesktop.current ? 1 : 0);
</script>

<Pagination.Root {count} {perPage} {siblingCount}>
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

This example shows responsive pagination that adjusts `perPage` and `siblingCount` based on screen size, and adds icons and conditional text labels to navigation buttons.