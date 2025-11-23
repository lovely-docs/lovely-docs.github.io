## Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

### Installation

```bash
npx shadcn-svelte@latest add scroll-area -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Content that exceeds the container dimensions will be scrollable.
</ScrollArea>
```

### Horizontal Scrolling

Set `orientation="horizontal"` to enable horizontal scrolling:

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="w-96 whitespace-nowrap rounded-md border" orientation="horizontal">
  <div class="flex w-max space-x-4 p-4">
    {#each items as item}
      <div class="shrink-0">
        {item}
      </div>
    {/each}
  </div>
</ScrollArea>
```

### Horizontal and Vertical Scrolling

Set `orientation="both"` to enable scrolling in both directions:

```svelte
<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4" orientation="both">
  <div class="w-[400px]">
    Content wider than container with vertical overflow.
  </div>
</ScrollArea>
```

### Props

- `orientation`: Controls scroll direction - `"vertical"` (default), `"horizontal"`, or `"both"`
- `class`: Tailwind classes for styling (dimensions, borders, padding, etc.)

The component wraps native scroll functionality with custom styling capabilities that work consistently across browsers.