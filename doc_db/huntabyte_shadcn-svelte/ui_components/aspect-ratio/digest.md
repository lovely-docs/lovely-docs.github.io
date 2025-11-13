## AspectRatio Component

A component that constrains content to a specific aspect ratio.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add aspect-ratio
```

### Usage

Import the component:
```svelte
import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
```

Wrap content with a desired ratio:
```svelte
<div class="w-[450px]">
  <AspectRatio ratio={16 / 9} class="bg-muted">
    <img src="..." alt="..." class="rounded-md object-cover" />
  </AspectRatio>
</div>
```

The `ratio` prop accepts a numeric value (e.g., `16 / 9` for widescreen). Content inside maintains the specified aspect ratio regardless of container size.