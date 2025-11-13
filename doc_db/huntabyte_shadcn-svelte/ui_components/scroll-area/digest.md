## Scroll Area

Custom scrollable container component that augments native scroll functionality with cross-browser styling.

### Installation

```bash
npm install shadcn-svelte@latest add scroll-area
```

### Basic Usage

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Content that overflows the container...
</ScrollArea>
```

### Horizontal Scrolling

Set `orientation="horizontal"` to enable horizontal scrolling:

```svelte
<ScrollArea class="w-96 rounded-md border" orientation="horizontal">
  <div class="flex w-max space-x-4 p-4">
    {#each items as item}
      <div class="shrink-0">{item}</div>
    {/each}
  </div>
</ScrollArea>
```

### Both Directions

Set `orientation="both"` for both horizontal and vertical scrolling:

```svelte
<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4" orientation="both">
  <div class="w-[400px]">
    Wide content that also overflows vertically...
  </div>
</ScrollArea>
```

The component accepts standard Tailwind classes for sizing and styling.