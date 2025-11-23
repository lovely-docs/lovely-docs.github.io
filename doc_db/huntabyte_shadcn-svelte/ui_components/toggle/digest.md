## Toggle

A two-state button component that toggles between on and off states.

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

**Outline variant:**
```svelte
<Toggle variant="outline" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>
```

**With text and icon:**
```svelte
<Toggle aria-label="Toggle italic">
  <ItalicIcon class="mr-2 size-4" />
  Italic
</Toggle>
```

**Size variants (small and large):**
```svelte
<Toggle size="sm" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<Toggle size="lg" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>
```

**Disabled state:**
```svelte
<Toggle aria-label="Toggle underline" disabled>
  <UnderlineIcon class="size-4" />
</Toggle>
```

### Props

- `variant`: "default" or "outline" - controls button styling
- `size`: "sm", "md" (default), or "lg" - controls button size
- `disabled`: boolean - disables the toggle button
- `aria-label`: string - accessibility label for the button