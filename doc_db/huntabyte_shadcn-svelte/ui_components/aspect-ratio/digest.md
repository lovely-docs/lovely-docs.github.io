## Aspect Ratio

Displays content within a desired ratio.

### Installation

```bash
npx shadcn-svelte@latest add aspect-ratio -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

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

The `AspectRatio` component wraps content and maintains a specified aspect ratio. Pass the desired ratio as a number (e.g., `16 / 9` for widescreen). Content inside scales to fill the container while preserving the ratio.