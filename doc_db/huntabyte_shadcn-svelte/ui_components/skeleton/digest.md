## Skeleton

A placeholder component for displaying loading states while content is being fetched.

### Installation

```bash
npx shadcn-svelte@latest add skeleton -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Usage

Import the Skeleton component:

```svelte
<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
</script>
```

Apply to elements with custom dimensions and styling:

```svelte
<div class="flex items-center space-x-4">
  <Skeleton class="size-12 rounded-full" />
  <div class="space-y-2">
    <Skeleton class="h-4 w-[250px]" />
    <Skeleton class="h-4 w-[200px]" />
  </div>
</div>
```

Use Skeleton to create placeholder layouts matching your content structure. Style with Tailwind classes for sizing (`h-`, `w-`, `size-`) and shape (`rounded-full`, etc.).