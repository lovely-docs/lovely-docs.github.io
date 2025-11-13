## Toggle Component

A two-state button component that toggles between on and off states.

### Installation

```bash
npm install shadcn-svelte@latest add toggle
```

### Basic Usage

```svelte
<script lang="ts">
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>
<Toggle>Toggle</Toggle>
```

### Variants and Sizes

- **Default variant**: Standard toggle button
- **Outline variant**: `variant="outline"` for outlined style
- **Sizes**: `size="sm"` for small, `size="lg"` for large

### Examples

Icon-only toggle:
```svelte
<script lang="ts">
  import BoldIcon from "@lucide/svelte/icons/bold";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>
<Toggle aria-label="toggle bold">
  <BoldIcon class="size-4" />
</Toggle>
```

Toggle with text:
```svelte
<Toggle aria-label="Toggle italic">
  <ItalicIcon class="mr-2 size-4" />
  Italic
</Toggle>
```

Disabled state:
```svelte
<Toggle aria-label="Toggle underline" disabled>
  <UnderlineIcon class="size-4" />
</Toggle>
```

### Props

- `variant`: "default" or "outline"
- `size`: "sm", "md" (default), or "lg"
- `disabled`: boolean to disable the toggle
- `aria-label`: accessibility label (recommended)