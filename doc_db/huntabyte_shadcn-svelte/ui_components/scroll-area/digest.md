## Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

### Installation

```bash
npx shadcn-svelte@latest add scroll-area -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Content that overflows the container will be scrollable.
</ScrollArea>
```

### Orientation Prop

Control scrolling direction with the `orientation` prop:

- `"vertical"` (default): Vertical scrolling only
- `"horizontal"`: Horizontal scrolling only
- `"both"`: Both horizontal and vertical scrolling

**Horizontal example:**
```svelte
<ScrollArea class="w-96 rounded-md border" orientation="horizontal">
  <div class="flex w-max space-x-4 p-4">
    {#each items as item}
      <div class="shrink-0">{item}</div>
    {/each}
  </div>
</ScrollArea>
```

**Both directions example:**
```svelte
<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4" orientation="both">
  <div class="w-[400px]">
    Content wider than container with vertical overflow.
  </div>
</ScrollArea>
```

### Styling

Apply Tailwind classes directly to the ScrollArea component for sizing and appearance (e.g., `h-72`, `w-48`, `rounded-md`, `border`).