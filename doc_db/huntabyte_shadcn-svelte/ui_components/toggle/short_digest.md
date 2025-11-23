## Toggle

Two-state button component that toggles between on and off.

### Installation

```bash
npx shadcn-svelte@latest add toggle -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>

<Toggle>Toggle</Toggle>
```

### Variants

- **Default with icon:** `<Toggle aria-label="toggle bold"><BoldIcon class="size-4" /></Toggle>`
- **Outline:** `<Toggle variant="outline" aria-label="Toggle italic"><ItalicIcon class="size-4" /></Toggle>`
- **With text:** `<Toggle aria-label="Toggle italic"><ItalicIcon class="mr-2 size-4" />Italic</Toggle>`
- **Sizes:** `size="sm"` or `size="lg"`
- **Disabled:** `<Toggle disabled aria-label="Toggle underline"><UnderlineIcon class="size-4" /></Toggle>`