## Separator Component

A UI component for visually or semantically separating content.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add separator
```

### Usage

Import and use the Separator component:

```svelte
<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<div class="space-y-1">
  <h4 class="text-sm font-medium leading-none">Bits UI Primitives</h4>
  <p class="text-muted-foreground text-sm">An open-source UI component library.</p>
</div>
<Separator class="my-4" />
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <Separator orientation="vertical" />
  <div>Docs</div>
  <Separator orientation="vertical" />
  <div>Source</div>
</div>
```

Supports horizontal (default) and vertical orientations via the `orientation` prop.