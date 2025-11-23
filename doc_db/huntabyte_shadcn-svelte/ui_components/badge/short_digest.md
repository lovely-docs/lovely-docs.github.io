## Badge Component

Displays styled badge elements with multiple variants (default, secondary, destructive, outline).

### Installation

```bash
npx shadcn-svelte@latest add badge -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js";
</script>

<Badge variant="outline">Badge</Badge>
```

### Features

- Multiple built-in variants for different styles
- Customizable with additional CSS classes
- `badgeVariants` helper to style links as badges
- Supports icons and custom content

```svelte
<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Badge</a>
```