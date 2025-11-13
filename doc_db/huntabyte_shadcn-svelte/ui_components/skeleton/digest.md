## Skeleton Component

A placeholder component for displaying loading states while content is being fetched.

### Import
```svelte
import { Skeleton } from "$lib/components/ui/skeleton/index.js";
```

### Installation
```bash
npx shadcn-svelte@latest add skeleton
```

### Usage
Create skeleton placeholders with custom dimensions and styling:
```svelte
<div class="flex items-center space-x-4">
  <Skeleton class="size-12 rounded-full" />
  <div class="space-y-2">
    <Skeleton class="h-4 w-[250px]" />
    <Skeleton class="h-4 w-[200px]" />
  </div>
</div>
```

The component accepts a `class` prop for styling with Tailwind CSS utilities to define size, shape, and spacing.