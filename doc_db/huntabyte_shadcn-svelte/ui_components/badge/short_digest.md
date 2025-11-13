## Badge Component

Displays styled badge elements with multiple variants (default, secondary, destructive, outline).

### Installation
```bash
pnpm dlx shadcn-svelte@latest add badge
```

### Usage
```svelte
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js";
</script>

<Badge variant="outline">Badge</Badge>
```

### Link Badge
```svelte
<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Badge</a>
```