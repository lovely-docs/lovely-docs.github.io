## Aspect Ratio

Maintains a specified aspect ratio for wrapped content.

```svelte
import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";

<AspectRatio ratio={16 / 9} class="bg-muted">
  <img src="..." alt="..." class="rounded-md object-cover" />
</AspectRatio>
```

Install: `npx shadcn-svelte@latest add aspect-ratio -y -o`