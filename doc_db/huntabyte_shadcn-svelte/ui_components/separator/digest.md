## Separator

A component that visually or semantically separates content.

### Installation

```bash
npx shadcn-svelte@latest add separator -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import and use the Separator component:

```svelte
<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<Separator />
```

### Examples

**Horizontal separator with text content:**
```svelte
<div class="space-y-1">
  <h4 class="text-sm font-medium leading-none">Bits UI Primitives</h4>
  <p class="text-muted-foreground text-sm">An open-source UI component library.</p>
</div>
<Separator class="my-4" />
```

**Vertical separators between inline items:**
```svelte
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <Separator orientation="vertical" />
  <div>Docs</div>
  <Separator orientation="vertical" />
  <div>Source</div>
</div>
```

The component supports an `orientation` prop that accepts `"vertical"` for vertical separators (default is horizontal). Custom styling can be applied via the `class` prop.