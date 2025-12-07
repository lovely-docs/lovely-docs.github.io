## Badge

Displays a badge component with variants: default, secondary, destructive, outline.

Install: `npx shadcn-svelte@latest add badge -y -o`

Usage:
```svelte
<script lang="ts">
  import { Badge, badgeVariants } from "$lib/components/ui/badge/index.js";
</script>

<Badge variant="outline">Badge</Badge>
<Badge variant="secondary" class="bg-blue-500"><Icon />Verified</Badge>
<Badge class="rounded-full">8</Badge>

<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Link Badge</a>
```

Variants: default, secondary, destructive, outline.