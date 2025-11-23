## Aspect Ratio

Component that constrains content to a specific aspect ratio.

### Usage

Import and wrap content with the `AspectRatio` component, specifying the desired ratio:

```svelte
<script lang="ts">
  import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
</script>

<div class="w-[450px]">
  <AspectRatio ratio={16 / 9} class="bg-muted">
    <img src="..." alt="..." class="rounded-md object-cover" />
  </AspectRatio>
</div>
```

The `ratio` prop accepts a numeric value (e.g., `16 / 9` for widescreen). Child content will be scaled to maintain the specified aspect ratio. Apply additional styling via the `class` prop.

### Installation

```bash
npx shadcn-svelte@latest add aspect-ratio -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.