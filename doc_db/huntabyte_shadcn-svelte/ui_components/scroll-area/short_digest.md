## Scroll Area

Custom-styled scrollable container component.

### Installation

```bash
npx shadcn-svelte@latest add scroll-area -y -o
```

### Usage

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Scrollable content
</ScrollArea>
```

### Orientation Options

- `orientation="vertical"` (default): Vertical scrolling
- `orientation="horizontal"`: Horizontal scrolling
- `orientation="both"`: Both directions

Apply Tailwind classes for sizing, borders, and padding.