## Toggle

A two-state button component that can be toggled on or off.

### Installation

```bash
npx shadcn-svelte@latest add toggle -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>

<Toggle>Toggle</Toggle>
```

### Examples

**Default with icon:**
```svelte
<script lang="ts">
  import BoldIcon from "@lucide/svelte/icons/bold";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>

<Toggle aria-label="toggle bold">
  <BoldIcon class="size-4" />
</Toggle>
```

**Variants and sizes:**
```svelte
<!-- Outline variant -->
<Toggle variant="outline" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<!-- With text -->
<Toggle aria-label="Toggle italic">
  <ItalicIcon class="mr-2 size-4" />
  Italic
</Toggle>

<!-- Size small -->
<Toggle size="sm" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<!-- Size large -->
<Toggle size="lg" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<!-- Disabled -->
<Toggle aria-label="Toggle underline" disabled>
  <UnderlineIcon class="size-4" />
</Toggle>
```

### Props

- `variant`: "default" | "outline" (default: "default")
- `size`: "sm" | "default" | "lg" (default: "default")
- `disabled`: boolean (default: false)
- `aria-label`: string (recommended for accessibility)